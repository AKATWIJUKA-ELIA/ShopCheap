import { useQuery } from "convex-helpers/react/cache";
import { api } from "../../convex/_generated/api";
const useGetSellerApplications = () => {
    const Applications = useQuery(api.users.GetSellerApplications);
    
    return {
        data: Applications,
        loading: Applications === undefined,
        error: null,
    };
};

export default useGetSellerApplications;