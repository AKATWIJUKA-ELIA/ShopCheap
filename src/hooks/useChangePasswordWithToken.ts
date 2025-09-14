import { api } from "../../convex/_generated/api"; 
import { useAction,useMutation } from "convex/react";
import { useSendMail } from "./useSendMail";
import { Id } from "../../convex/_generated/dataModel";

const useChangePasswordWithToken = () => {
        const {sendEmail} = useSendMail();
        const check = useAction(api.users.GetCustomerByTokenAction);
        const UpdateCustomer = useMutation(api.users.UpdateCustomer)
        const CheckUser = async (token:string,Newpassword:string) =>{
                try{
                const res = await check({token});
                 if(!res.success){
                        return { success: false, message: res.message , status: 400 };
                }
       
                const user = res?.user
                const isTokenValid = user?.reset_token_expires  && user.reset_token_expires > Math.floor(Date.now() / 1000) 
                if(!isTokenValid){
                        return { success: false, message: "Token has Expired ",  status:402}
                }
                
              
                const UserToUpdate = {
                        ...user,
                        _id: user?._id as Id<"customers"> , 
                        email: user?.email||"", 
                        username: user?.username||"", 
                        passwordHash: Newpassword||"", 
                        role:user?.role||"",
                        isVerified:user?.isVerified||false,
                        reset_token: "",
                        reset_token_expires:Date.now(),
                        updatedAt:Date.now(),
                        lastLogin:Date.now(),
                }
                await UpdateCustomer({ User: UserToUpdate })

                const html = `
                <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Password Reset</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>
    .button {
      display: inline-block;
      padding: 14px 28px;
      font-size: 16px;
      color: #fff;
      background-color: #007bff;
      border-radius: 5px;
      text-decoration: none;
      margin: 20px 0;
    }
    .button:hover {
      background-color: #0056b3;
    }
    .container {
      max-width: 480px;
      margin: auto;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      padding: 32px;
      font-family: Arial, sans-serif;
      color: black;
    }
    .footer {
      font-size: 12px;
      color: #999;
      margin-top: 32px;
      text-align: center;
    }
  </style>
</head>
<body style="background:#f4f4f4;">

  <div class="container">
<a href="https://shopcheapug.com/" > 
<div 
  style="
    background-image: url('https://cheery-cod-687.convex.cloud/api/storage/143325e4-3c05-4b88-82ba-cbbfa7fcd594');
    background-size: contain;  
    background-repeat: no-repeat;
    background-position: center; 
    width: 200px;
    height: 100px;
  "
>
  
</div></a>
    <h2><strong>Password Change</strong></h2>
    <h1 class="" style="color:black" >Hello, <span style="color:blue"> ${user?.username} </span></h1>
    <h3>Your password has been changed successfully. You can now log in with your new credentials.</h3>
    <h4>Click the button below to Login to you Account.</h4>
    <a 
      class=" button   " style="background-color:black; cursor:pointer; color:gold; border:1px solid black;"
      href="https://shopcheapug.com/sign-in"
      target="_blank"
    >Sign in</a>

    <h4> If you Did'nt  Request this Action, Please ignore this email </h4>
    <div class="footer">
      &copy; 2025 ShopCheap. All rights reserved.
    </div>
  </div>
</body>
</html>
                
                `

                const resp = await sendEmail(user?.email||"","Password Changed",html,"management")
                if(!resp.success){
                return { success: false, message:`${resp.message}` ,  status: 200 };
                }
                return { success: true, message:`${resp.message}\nYour password has been changed successfully.` ,  status: 200 };
                }catch(error){
                        return { success: false, message: error as string , status: 500 };
                        
                }
        }
        return { CheckUser };
 }
 export default useChangePasswordWithToken;