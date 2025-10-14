"use client"
import { useAction  } from "convex/react";
import { api } from "../../convex/_generated/api";
import useSaveUser from "./useSaveUser";
import {jwtDecode} from 'jwt-decode'
import { CredentialResponse } from "@react-oauth/google";
import { UpdateUser } from "@/lib/convex";
import { Id } from "../../convex/_generated/dataModel";
import useCreateUser from "./useCreateUser";

interface UsertoSave {
        User_id: string|"";
        Username: string|"";
         email:string|"";
        role:string|"",
        profilePicture:string|"",
        isVerified:boolean,
}
interface user {
        username: string,
        email: string,
        passwordHash: string,
        phoneNumber: string,
        profilePicture:string,
        isVerified: boolean,
        role: string,
        reset_token: "",
        reset_token_expires:0,
        updatedAt: 0,
        lastLogin: 0,
}


interface DecodedToken {
  iss?: string;
  aud?: string;
  sub?: string;
  email?: string;
  email_verified?: boolean;
  nbf?: number;
  name?: string;
  picture?: string;
  given_name?: string;
  iat?: number;
  exp?: number;
  jti?: string;
} 
      
const useAuthByGoogle = () => {
 const saveUser = useSaveUser();
     const getCustomerByEmail = useAction(api.users.GetCustomerByEmail);
     const {CreateUser} = useCreateUser();
    const AuthenticateByGoogle = async (response: CredentialResponse) => {
        
      try {
        if (!response.credential) {
          throw new Error("Google credential is missing");
        }
        const decoded = jwtDecode<DecodedToken>(response.credential);
        const email = decoded.email || "";

              
              const res = await getCustomerByEmail({ email,usedGoogle:true });
        //       const data = res?.json();
        // setData(res);
        if(res.user?.isVerified===false){
                        return { success: false, message: "User is not verified" };
                }
        if(!res?.success){
                if(res?.status===404){
                        return { success: false, message: res.message};
                }
                // setError(data?.);
                if (res?.status === 401) {
                        const user:user = {
                                username:decoded.name||"",
                                email:decoded.email||"",
                                profilePicture:decoded.picture||"",
                                passwordHash:"",
                                phoneNumber:"",
                                isVerified:true,
                                role:"user",
                                reset_token:"",
                                reset_token_expires:0,
                                updatedAt:0,
                                lastLogin:0,
                        } 
                        const res = await CreateUser(user,true);
                        if(!res.success){
                    return { success: false, message: res.message ,  status: 400 };
                        }
                        await getCustomerByEmail({ email }).then(async(res)=>{
                                if(!res.success){
                                        return { success: false, message: res.message ,  status: 400 };
                                }
                        try {
                        const response = await fetch('/api/createsession', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                        userId: res.user?._id,
                                        role: res.user?.role,
                                        isVerified: res.user?.isVerified,
                                }),
                        });
                         if (!response.ok) {
                                throw new Error('Failed to create session');
                        }
                        const usertosave:UsertoSave = { 
                                User_id: res.user?._id||"",
                                Username:res.user?.username||"",
                                 email:res.user?.email||"",
                                role:res.user?.role||"",
                                profilePicture:res.user?.profilePicture||"",
                                isVerified:res.user?.isVerified||false, 
                        }
                        saveUser(usertosave)
                        if (res?.user?._id) {
                                UpdateUser({
                                        ...user,
                                        _id: res.user._id as Id<"customers">,
                                        lastLogin: Date.now(),
                                        _creationTime: res.user._creationTime,
                                        reset_token_expires: res.user.reset_token_expires ?? 0,
                                        updatedAt: Date.now(), 
                                });
                        }
                        
                       
                        
                        return { success: true, status: 201, message: 'Success' };
                } catch (error) {
                        console.error('Error during session creation:', error);
                        return { success: false, status: 500, message: `Internal Server Error ${error}` };
                }});
                        return { success: true, message:res.message+"and verified, you'll be redirected to the sign-in page!",  status: 200 };

                }

        return { success: false, message:"Login failed" };
        }
        const user = res.user
        
                        try {
                        const response = await fetch('/api/createsession', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                        userId: user?._id,
                                        role: user?.role,
                                        isVerified: user?.isVerified,
                                }),
                        });
                         if (!response.ok) {
                                throw new Error('Failed to create session');
                        }
                        const usertosave:UsertoSave = { 
                                User_id: user?._id||"",
                                Username:user?.username||"",
                                 email:user?.email||"",
                                role:user?.role||"",
                                profilePicture:user?.profilePicture||"",
                                isVerified:user?.isVerified||false, 
                        }
                        saveUser(usertosave)
                        if (user?._id) {
                                UpdateUser({
                                        ...user,
                                        _id: user._id as Id<"customers">,
                                        lastLogin: Date.now(),
                                        _creationTime: user._creationTime,
                                        reset_token_expires: user.reset_token_expires ?? 0,
                                        updatedAt: Date.now(), 
                                });
                        }
                        
                       
                        
                        return { success: true, status: 201, message: 'Success' };
                } catch (error) {
                        console.error('Error during session creation:', error);
                        return { success: false, status: 500, message: `Internal Server Error ${error}` };
                }
      } catch (err) {
        console.error(err);
        return { success: false, message: "Internal Server Error" };
      } 
    };


  return {AuthenticateByGoogle };
};

export default useAuthByGoogle;