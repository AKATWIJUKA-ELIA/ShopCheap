import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

const useQualifyUser = () => {
    const Customer = useMutation(api.users.QualifyUser); 

    const qualify = (id:  Id<"customers">) =>{
        return Customer({user_id:id});
        }
    return {
        qualifyUser: qualify,
    };
};

export default useQualifyUser;