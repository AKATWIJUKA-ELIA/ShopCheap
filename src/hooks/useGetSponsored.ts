import { useQuery } from "convex-helpers/react/cache";
import { api } from "../../convex/_generated/api";
import { Product } from "@/lib/types";

const useGetSponsored = () => {
    const products = useQuery(api.products.getSponsoredProducts,{}); 

    return {
        sponsored: products as Product[] | null, 
        loading: products === undefined, // Convex returns `undefined` while loading
        error: null, // Convex doesn't provide an explicit error, so handle it elsewhere if needed
    };
};

export default useGetSponsored;