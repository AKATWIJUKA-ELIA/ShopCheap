import { useQuery } from "convex-helpers/react/cache";
import { api } from "../../convex/_generated/api";
import { useAppSelector } from "@/hooks";
import { Id } from "../../convex/_generated/dataModel";
const useGetSellersOrders = () => {
        const User = useAppSelector((state) => state.user.user);
    const Orders = useQuery(api.orders.getSellerOrders,{userId:User?.User_id as Id<"customers">});
    
    return {
        data: Orders,
        loading: Orders === undefined,
        error: null,
    };
};

export default useGetSellersOrders;