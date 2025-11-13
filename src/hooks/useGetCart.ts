import { useQuery } from "convex-helpers/react/cache";
import { api } from "../../convex/_generated/api";

const useGetCart = (id: string) => {
    const CartDta = useQuery(api.cart.getCart, id ? { userId:id } : "skip"); // Prevent calling hook with an empty ID
//     console.log("Customer data:", id);
    return {
        cart: CartDta, 
        loading: CartDta === undefined, // Convex returns `undefined` while loading
        error: null, // Convex doesn't provide an explicit error, so handle it elsewhere if needed
    };
};

export default useGetCart;