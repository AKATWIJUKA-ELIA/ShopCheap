import { useQuery } from "convex-helpers/react/cache";
import { api } from "../../convex/_generated/api";

const useGetAllCustomers = () => {
    const customers = useQuery(api.users.GetAllCustomers); 

    return {
        data: customers, 
        loading: customers === undefined, // Convex returns `undefined` while loading
        error: null, // Convex doesn't provide an explicit error, so handle it elsewhere if needed
    };
};

export default useGetAllCustomers;