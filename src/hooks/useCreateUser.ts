import { api } from "../../convex/_generated/api"; 
import { useMutation } from "convex/react";
import { useSendMail } from './useSendMail';
import { WelcomeEmail } from '@/EmailTemplates/WelcomeTemplates';
import { User } from "@/lib/types";
import { randomBytes } from 'crypto';
interface user {
        username: string,
        email: string,
        passwordHash: string,
        phoneNumber: string,
        profilePicture:string,
        isVerified: boolean,
        role: string,
        reset_token: string,
        reset_token_expires:number,
        updatedAt: number,
        lastLogin: number,
}
const useCreateUser = () => {
        const create = useMutation(api.users.CreateUser);
                const {sendEmail} = useSendMail()
                const Admin = process.env.NEXT_PUBLIC_ADMIN
                 const generateSecureToken = (length = 32): string=> {
                return randomBytes(length).toString('hex');
}
        const CreateUser = async (User:user) =>{
                try{
                const token = generateSecureToken();
                const res = await create({...User,
                        reset_token:token,
                        reset_token_expires:Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
                        updatedAt:Date.now(),
                }
                );
                 if(!res.success){
                        return { success: false, message: res.message , status: 400 };
                }
                sendEmail(`${User.email}`,"Welcome to ShopCheap", WelcomeEmail(User as User,token),"marketing");
                sendEmail(`${Admin}`,"New User Created", `<html><body><h1>New User Created</h1><p>Username: ${User.username}</p><p>Email: ${User.email}</p></body></html>`,"marketing");
                return { success: true, message:res.message ,  status: 200 };
                }catch(error){
                        return  { success: false, message: error as string , status: 500 };
                        
                }
        }
        return { CreateUser };
 }
 export default useCreateUser;