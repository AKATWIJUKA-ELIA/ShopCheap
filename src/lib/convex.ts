"use server";
import {ConvexClient} from "convex/browser";
import { api } from "../../convex/_generated/api";
import { User } from "./types";
import { Id } from "../../convex/_generated/dataModel";
import { OrderItem } from "./types";

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error("CONVEX_URL is not defined");
}
const convex = new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL);

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

export async function getReviewsByProduct(product_id: string) {
    if (!product_id) return { data: null, loading: false, error: "No product ID provided" };
    try {
        const reviews = await convex.query(api.reviews.getReviewsByProduct, { product_id });
        return {
            data: reviews,
            loading: false,
            error: null,
        };
    } catch (err) {
        return {
            data: null,
            loading: false,
            error: err,
        };
    }
}

export const UploadImage = async (file: File): Promise<{ success: boolean; storageId?: string; error?: string }> => {
        const generateUploadUrl = convex.mutation(api.products.generateUploadUrl,{});
                const TIMEOUT_MS = 10000; // 10 seconds
                const withTimeout = <T,>(promise: Promise<T>, ms: number): Promise<T> => {
                        return Promise.race([
                          promise,
                          new Promise<T>((_, reject) =>
                            setTimeout(() => reject(new Error("Request timed out")), ms)
                          ),
                        ]);
                      };

                  try {
                        const storageId = await withTimeout((async () => {
                         // Step 1: Get a short-lived upload URL
                        const postUrl = await generateUploadUrl;
                        const result = await fetch(postUrl, {
                                    method: "POST",
                                    headers: { "Content-Type": file.type },
                                    body: file,
                                  });
                            
                                  if (!result.ok) throw new Error("Failed to upload image");
                                 const responseData = await result.json();
                                        console.log("responseData",responseData)
                                 return responseData.storageId
                                
              })(), TIMEOUT_MS);
                        return { success: true, storageId: storageId };
                  } catch {
                        return { success: false, error: "Failed to upload image" };
                  }
      }