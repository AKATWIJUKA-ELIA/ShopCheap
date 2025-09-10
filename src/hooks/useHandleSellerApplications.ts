import { NextResponse } from "next/server";
import { api } from "../../convex/_generated/api"; 
import { useMutation } from "convex/react";
import { Id } from "../../convex/_generated/dataModel";
import { useSendMail } from "./useSendMail";
import { useAppSelector } from "@/hooks";

interface Application {
user_id:Id<"customers">;
storeName: string;
description: string;
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
                        location:Application.location});
                 if(!response?.success){
                        return { success: false, message: response?.message ,  status: 400 }
                }
                await sendEmail(user?.email||'', 'Application Received', `<p>Dear ${user?.Username||''},</p>
                <p>Thank you for applying to become a seller on our platform. We have received your application for the store named "${Application.storeName}". Our team will review your application and get back to you shortly.</p>
                <p>Best regards,<br/>Shop Cheap Team</p>`, 'Support').then(data=>console.log("success:",data)).catch(err=>console.log("error:",err));

                await sendEmail(admin, 'Seller Application Received', `User ${user?.Username||''} has applied to become a seller.`, 'Support').then(data=>console.log("success:")).catch(err=>console.log("error:",err));
                return { success: true, message:response.message , status: 200 };
                }catch{
                        return  { success: false, message: "Sorry,  Failed to apply,  please try again later",status:500 };
                        
                }
        }
        return { CreateApplication };
 }
 export default useHandleSellerApplications;