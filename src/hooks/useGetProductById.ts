import { useQuery } from "convex-helpers/react/cache";
import { api } from "../../convex/_generated/api";

const useGetProductById = (id: string) => {
    const product = useQuery(api.products.getProduct, id ? { id } : "skip"); // Prevent calling hook with an empty ID

    return {
        data: product, 
        loading: product === undefined, // Convex returns `undefined` while loading
        error: null, // Convex doesn't provide an explicit error, so handle it elsewhere if needed
    };
};

export default useGetProductById;