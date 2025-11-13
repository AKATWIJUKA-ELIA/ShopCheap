import { useQuery } from "convex-helpers/react/cache";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

const useGetUserById = (id:  Id<"customers">) => {
    const Customer = useQuery(api.users.GetCustomerById, id ? { id } : "skip"); // Prevent calling hook with an empty ID
//     console.log("Customer data:", id);
    return {
        user: Customer, 
        loading: Customer === undefined, // Convex returns `undefined` while loading
        error: null, // Convex doesn't provide an explicit error, so handle it elsewhere if needed
    };
};

export default useGetUserById;