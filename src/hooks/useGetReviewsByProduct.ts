import { useQuery } from "convex-helpers/react/cache";
import { api } from "../../convex/_generated/api";

const useGetReviewsByProduct = (product_id: string) => {
    const Reviews = useQuery(api.reviews.getReviewsByProduct, product_id ? { product_id } : "skip"); // Prevent calling hook with an empty ID
//     console.log("Product id", product_id);
//     console.log("useGetReviewsByProduct", Reviews);
    return {
        data: Reviews, 
        loading: Reviews === undefined, // Convex returns `undefined` while loading
        Error: null, // Convex doesn't provide an explicit error, so handle it elsewhere if needed
    };
};

export default useGetReviewsByProduct;