import { api } from "../../convex/_generated/api"; 
import { useMutation } from "convex/react";
import { Id } from "../../convex/_generated/dataModel";
import { useSendMail } from "./useSendMail";
import { useAppSelector } from "@/hooks";

interface Application {
user_id:Id<"customers">;
storeName: string;
description: string;
slogan: string;
profile_image: string;
cover_image: string;
location: { lat: number; lng: number };
}
const useHandleSellerApplications = () => {
        const admin = process.env.NEXT_PUBLIC_ADMIN || '';
        const user = useAppSelector((state) => state.user.user);
        const create = useMutation(api.users.HandleSellerApplication);
        const { sendEmail } = useSendMail();

        const CreateApplication = async (Application:Application) =>{
                try{
                const response = await create({
                        user_id:Application.user_id,
                        store_name:Application.storeName,
                        description:Application.description,
                        slogan:Application.slogan,
                        location:Application.location,
                        profile_image:Application.profile_image,
                        cover_image:Application.cover_image
                });
                        
                 if(!response?.success){
                        return { success: false, message: response?.message ,  status: 400 }
                }
                await sendEmail(user?.email||'', 'Application Received', `<p>Dear ${user?.Username||''},</p>
                <p>Thank you for applying to become a seller on our platform. We have received your application for the store named "${Application.storeName} \n Please Note: You are required to make a payment of  UGX:50,000 TO 0787357137 in the names of Akatwijuka Elia to have your Shop Registered". Our team will review your application and get back to you shortly.</p>
                <p>Best regards,<br/>Shop Cheap Team</p>`, 'Support')

                await sendEmail(admin, 'Seller Application Received', `User ${user?.Username||''} has applied to become a seller.`, 'Support')
                return { success: true, message:response.message , status: 200 };
                }catch{
                        return  { success: false, message: "Sorry,  Failed to apply,  please try again later",status:500 };
                        
                }
        }
        return { CreateApplication };
 }
 export default useHandleSellerApplications;