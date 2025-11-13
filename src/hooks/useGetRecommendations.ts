import { useQuery } from "convex-helpers/react/cache";
import { api } from "../../convex/_generated/api";
import { useAppSelector } from "@/hooks";

const useGetRecommendations = (type:string) => {
        const user_id = useAppSelector((state) => state.user.user?.User_id || "");
    const recommendations = useQuery(api.products.recommendProducts,  { user_id:user_id,type:type } ); // Prevent calling hook with an empty ID

    return {
        recommeded: recommendations, 
        loading: recommendations === undefined, // Convex returns `undefined` while loading
        Error: null, // Convex doesn't provide an explicit error, so handle it elsewhere if needed
    };
};

export default useGetRecommendations;