import { useQuery } from "convex-helpers/react/cache";
import { api } from "../../convex/_generated/api";

const useGetAllOrders = () => {
    const orders = useQuery(api.orders.getAllOrders); 

    return {
        data: orders, 
        loading: orders === undefined, // Convex returns `undefined` while loading
        error: null, // Convex doesn't provide an explicit error, so handle it elsewhere if needed
    };
};

export default useGetAllOrders;