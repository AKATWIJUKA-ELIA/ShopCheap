import { useQuery } from "convex-helpers/react/cache";
import { api } from "../../convex/_generated/api";

const useGetAllTasactions = () => {
    const transactions = useQuery(api.transactions.getAllTrasactions); 

    return {
        data: transactions, 
        loading: transactions === undefined, // Convex returns `undefined` while loading
        error: null, // Convex doesn't provide an explicit error, so handle it elsewhere if needed
    };
};

export default useGetAllTasactions