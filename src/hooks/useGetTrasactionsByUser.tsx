import { useQuery } from "convex-helpers/react/cache";
import { api } from "../../convex/_generated/api";
import { useAppSelector } from "@/hooks";
import { Id } from "../../convex/_generated/dataModel";


const useGetTrasactionsByUser = () => {
        const User = useAppSelector((state) => state.user.user);
    const transactions = useQuery(api.transactions.getTrasactionsByUser,{user_id:User?.User_id as Id<"customers">}); 

    return {
        data: transactions, 
        loading: transactions === undefined, // Convex returns `undefined` while loading
        error: null, // Convex doesn't provide an explicit error, so handle it elsewhere if needed
    };
};

export default useGetTrasactionsByUser