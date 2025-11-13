import { useQuery } from "convex-helpers/react/cache";
import { api } from "../../convex/_generated/api";

const useGetCategories = () => {
    const categories = useQuery(api.cartegories.getCartegories,); // Prevent calling hook with an empty ID

    return {
        data: categories, 
        loading: categories === undefined, // Convex returns `undefined` while loading
        error: null, // Convex doesn't provide an explicit error, so handle it elsewhere if needed
    };
};

export default useGetCategories;