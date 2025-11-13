import { useQuery } from "convex-helpers/react/cache";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

const useGetShopBySellerId = (seller_Id: Id<"customers">) => {
    const shop = useQuery(api.shops.GetShopBySellerId, seller_Id ? { seller_Id: seller_Id } : "skip"); // Prevent calling hook with an empty ID

    return {
        data: shop, 
        loading: shop === undefined, // Convex returns `undefined` while loading
        error: null, // Convex doesn't provide an explicit error, so handle it elsewhere if needed
    };
};

export default useGetShopBySellerId;