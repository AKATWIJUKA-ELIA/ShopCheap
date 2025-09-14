"use client"
import type React from "react"
import useGetProductById from "@/hooks/useGetProductById"
import useApproveRevoke from "@/hooks/useApproveRevoke"
import { useSendMail } from "@/hooks/useSendMail"
import { useEffect, useState } from "react"
import useGetUserById from "@/hooks/useGetUserById"
import { Id } from "../../../convex/_generated/dataModel"

interface ApproveRevokeModalProps {
        ischange: boolean
  onClose: () => void
  productId: string
  Action:boolean
}

const ApproveRevokeModal: React.FC<ApproveRevokeModalProps> = ({ ischange, onClose, productId,Action }) => {
  const {data:Product} = useGetProductById(productId)
  const {sendEmail}  = useSendMail()
  const Edit = useApproveRevoke()
  const[action, setaction] = useState("")
  const[message,setmessage] = useState("")
const userId = Product?.product_owner_id || ""
// console.log("UserId  :",userId )
const { user } = useGetUserById(userId as Id<"customers">)
// console.log("User :",user )
// console.log("email Address",user?.emailAddresses[0].emailAddress)
const UserEmail = user?.email

useEffect(()=>{
        const HandleAction = () => {
                setaction(Action ? "Revoke" : "Approve");
        }
        HandleAction()
},[Action])
  const HandleEdit=async (id:string|undefined)=>{
        try{
        await Edit(id)
        onClose()
        //       Send notification emails
        }catch (error) {
                console.error(error)
                alert(error)
                return
        }
  }


  const HandleChange = async (e: React.FormEvent<HTMLFormElement | HTMLInputElement >,) => {
                    e.preventDefault();
                    setmessage(e.currentTarget.value)
                //     console.log("message",message)
                }
  const HandleSubmit=(e: React.FormEvent<HTMLFormElement>,id:string|undefined)=>{
        e.preventDefault()
        HandleEdit(id)
        const html = ` <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
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
    <h2><strong>Product ${action}d</strong></h2>
    
    <h3>Your Product Has Been ${action}d \n</h3>
        <h1> Reason: ${message}</h1>
<h4>Best regards,\n</h4>
<h4>ShopCheap\n : https://shopcheapug.com/</h4>

    <div class="footer">
      &copy; 2025 ShopCheap. All rights reserved.
    </div>
  </div>
</body>
</html>`
        if(!UserEmail) return
        sendEmail(`${UserEmail}`,`Product ${action}d`,html,"sales")
        setmessage("")
  }

  if (!ischange) return null

  return (
    <div className="fade-in fixed z-40 inset-0 backdrop-blur-sm shadow-lg shadow-black rounded-lg flex  w-[100%] h-[100%]   overflow-auto overflow-x-hidden">
      <div className="  md:w-[60%] h-64 shadow-md shadow-black items-center justify-center my-auto mx-auto bg-gray-200 dark:bg-gray-600 rounded-lg">
        <h1 className="text-2xl font-bold text-center text-black"><span className="text-dark text-xl ">Are you sure you want to</span> {action}  -<span className="text-gold" >&apos;{Product?.product_name}&apos;</span></h1>
        <div className="flex space-x-3 justify-center mt-10  py-10">
                <form onSubmit={(e)=>{HandleSubmit(e, Product?._id)}} className=" flex gap-2">
                <button
                type="submit"
                className=" w-48 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                {action} 
                </button>
                <input
                        type="text"
                        value={message}
                        placeholder="Enter Reason"
                        onChange={HandleChange}
                        required
                        className="flex"
                        />
                </form>
            
            <button
              type="button"
              className="w-48 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-400 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
      </div>
    </div>
  )
}

export default ApproveRevokeModal