import { NextResponse } from "next/server";
import { api } from "../../convex/_generated/api"; 
import { useMutation } from "convex/react";
import { Id } from "../../convex/_generated/dataModel";

interface Application {
user_id:Id<"customers">;
storeName: string;
description: string;
location: { lat: number; lng: number };
}
const useHandleSellerApplications = () => {
        const create = useMutation(api.users.HandleSellerApplication);

        const CreateApplication = async (Application:Application) =>{
                try{
                const response = await create({
                        user_id:Application.user_id,
                        store_name:Application.storeName,
                        description:Application.description,
                        location:Application.location});
                 if(!response?.success){
                        return NextResponse.json({ success: false, message: response?.message }, { status: 400 });
                }
                return NextResponse.json({ success: true, message:response.message }, { status: 200 });
                }catch{
                        return NextResponse.json( { success: false, message: "Sorry,  Failed to apply,  please try again later" });
                        
                }
        }
        return { CreateApplication };
 }
 export default useHandleSellerApplications;