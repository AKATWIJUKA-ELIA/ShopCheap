import {ConvexClient} from "convex/browser";
import { api } from "../../convex/_generated/api";
import { User } from "./types";
import { Id } from "../../convex/_generated/dataModel";
import { OrderItem } from "./types";


const convex = new ConvexClient("https://cheery-cod-687.convex.cloud");

export async function getUserById(id:  Id<"customers">) {
  if (!id) return { user: null, loading: false, error: "No ID provided" };
  try {
    const user = await convex.query(api.users.GetCustomerById, { id });
    return {
      user,
    };
  } catch (e) {
    return {
      user: null,
      loading: false,
      error: e instanceof Error ? e.message : "Unknown error",
    };
  }
}
export async function UpdateUser(userToUpdate: User | null) {
    if (!userToUpdate) {
        return { success: false, message: "No user provided" };
    }
    try {
        await convex.mutation(api.users.UpdateCustomer, { User: userToUpdate });
        return { success: true, message: "User updated successfully" };
    } catch (e) {
        return { success: false, message: e instanceof Error ? e.message : "Unknown error" };
    }
}

export async function getOrderById (orderId: Id<"orders">) {
    try {
        const order = await convex.query(api.orders.getOrderById, { orderId });
        if (!order) {
            return { success: false, message: "Order not found", status: 404 };
        }
        return { success: true, order: order.order };
    } catch (error) {
        console.error("Error fetching order by ID:", error);
        return { success: false, message: "Internal Server Error", status: 500 };
    }
}

export async function UpdateOrder(order: OrderItem) {
    try {
        const response = await convex.mutation(api.orders.updateOrder, { order:order });
        if (!response?.success) {
            return { success: false, message: response?.message, status: response?.status };
        }
        return { success: true, message: "Order updated successfully", status: 200 };
    } catch (error) {
        console.error("Error updating order:", error);
        return { success: false, message: "Internal Server Error", status: 500 };
    }
}

export async function getProductById (productId: Id<"products">) {
    try {
        const product = await convex.query(api.products.getProduct, { id:productId });
        if (!product) {
            return { success: false, message: "Product not found", status: 404 };
        }
        return { success: true, product: product };
    } catch (error) {
        console.error("Error fetching product by ID:", error);
        return { success: false, message: "Internal Server Error", status: 500 };
    }
}

export const getUserByToken = async (token: string) => {
    try {
        const user = await convex.query(api.users.GetCustomerByToken, { token });
        if (!user.success || !user.user) {
            return { success: false, message: "User not found", status: 404 };
        }
        return { success: true, user: user.user };
    } catch (error) {
        console.error("Error fetching user by token:", error);
        return { success: false, message: "Internal Server Error", status: 500 };
    }
}