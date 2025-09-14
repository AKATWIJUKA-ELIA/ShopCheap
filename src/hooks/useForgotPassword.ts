import { api } from "../../convex/_generated/api"; 
import { useAction,useMutation } from "convex/react";
import { useSendMail } from "./useSendMail";
import { randomBytes } from 'crypto';
import { Id } from "../../convex/_generated/dataModel";

const useForgotPassword = () => {
        const {sendEmail} = useSendMail();
        const check = useAction(api.users.GetCustomerByEmail);
        const UpdateCustomer = useMutation(api.users.UpdateCustomer)
        const generateSecureToken = (length = 32): string=> {
                return randomBytes(length).toString('hex');
}
        const CheckUser = async (email:string) =>{
                try{
                const res = await check({email});
                 if(!res.success){
                        return { success: false, message: res.message ,  status: 400 };
                }
                const token = generateSecureToken();
                const user = res?.user
              
                const UserToUpdate = {
                        ...user,
                        _id: user?._id as Id<"customers"> , 
                        email: user?.email||"", 
                        username: user?.username||"", 
                        passwordHash: user?.passwordHash||"", 
                        role:user?.role||"",
                        isVerified:user?.isVerified||false,
                        reset_token: token,
                        reset_token_expires:Date.now() + 10*60 * 1000,
                        updatedAt:Date.now(),
                        lastLogin:Date.now(),
                }
                await UpdateCustomer({ User: UserToUpdate })


                const html = `<!DOCTYPE html>
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
    <h2><strong>Password Reset Request</strong></h2>
    <h1 class="" style="color:black" >Hello, <span style="color:blue"> ${user?.username} </span></h1>
    <h3>We received a request to reset your password for your ShopCheap account.</h3>
    <h4>Click the button below to set a new password. If you did not request this, you can safely ignore this email.</h4>
    <a 
      class=" button   " style="background-color:black; cursor:pointer; color:gold; border:1px solid black;"
      href="https://shopcheapug.com/passwordChange?3c59c3c631572e859cbZZV05c6d4D637ad496d67b04ea8b0553ae4e1454933d27caf=${token}"
      target="_blank"
    >Reset Password</a>
    <p>If the button above does not work, copy and paste the following link into your browser:</p>
    <p>
      <a href="https://shopcheapug.com/passwordChange?3c59c3c631572e859cbZZV05c6d4D637ad496d67b04ea8b0553ae4e1454933d27caf=${token}" target="_blank">
        https://shopcheapug.com/passwordChange?3c59c3c631572e859cbZZV05c6d4D637ad496d67b04ea8b0553ae4e1454933d27caf=${token}
      </a>
    </p>
    <h4> If you Did'nt  Request this Action, Please ignore this email </h4>
    <div class="footer">
      &copy; 2025 ShopCheap. All rights reserved.
    </div>
  </div>
</body>
</html>`
                const resp = await sendEmail(user?.email||"","Password Reset",html,"management")

                if(!resp.success){
                return { success: false, message:`${resp.message}` ,  status: 200 };
                }
                return { success: true, message:`${resp.message}\nA password reset link has been sent to your email` ,  status: 200 };
                }catch(error){
                        return  { success: false, message: error as string , status: 500 };
                        
                }
        }
        return { CheckUser };
 }
 export default useForgotPassword;