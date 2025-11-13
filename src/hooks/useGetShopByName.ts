import { useQuery } from "convex-helpers/react/cache";
import { api } from "../../convex/_generated/api";

const useGetShopByName = (shopName: string) => {
    const shop = useQuery(api.shops.GetShopByName, shopName ? { shop_name: shopName } : "skip"); // Prevent calling hook with an empty ID

    return {
        data: shop, 
        loading: shop === undefined, // Convex returns `undefined` while loading
        error: null, // Convex doesn't provide an explicit error, so handle it elsewhere if needed
    };
};

export default useGetShopByName;