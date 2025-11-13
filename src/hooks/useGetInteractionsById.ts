import { useQuery } from "convex-helpers/react/cache";
import { api } from "../../convex/_generated/api";

const useGetInteractionsByIds = (ids: string[]) => {
    const interactions = useQuery(api.products.getInteractionsbyProductIds, ids ? { product_ids: ids } : "skip"); // Prevent calling hook with an empty ID

    return {
        data: interactions, 
        loading: interactions === undefined, // Convex returns `undefined` while loading
        error: null, // Convex doesn't provide an explicit error, so handle it elsewhere if needed
    };
};

export default useGetInteractionsByIds;