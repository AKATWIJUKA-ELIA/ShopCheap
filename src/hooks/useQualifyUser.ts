import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { SellerApprovedTemplate,SellerRejectedTemplate } from "@/EmailTemplates/QualifySellerTemplates";
import { useAppSelector } from "@/hooks";
const useQualifyUser = () => {
    const Customer = useMutation(api.users.QualifyUser); 
    const userName = useAppSelector((state) => state.user.user?.Username);

    const qualify = (id:  Id<"customers">,status:boolean,reason?:string) =>{
        return Customer({user_id:id,html:status?SellerApprovedTemplate(userName||""):SellerRejectedTemplate(userName||"",reason ||"")});
        }
    return {
        qualifyUser: qualify,
    };
};

export default useQualifyUser;