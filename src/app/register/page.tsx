"use client"

import React from "react"
import SellerOnboarding from "@/components/SellerOboarding/SellerOnboarding"
import {
  Store,
//   CreditCard,
} from "lucide-react"
import { useAppSelector } from "@/hooks"


export default function SellerRegistration() {

 const User = useAppSelector(state=> state.user.user)
 
  return (
    <div className="min-h-screen mt-16  dark:bg-gray-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Store className="w-12 h-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Become a Seller</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of successful sellers on our platform. Complete the registration process to start selling
            your products to millions of customers worldwide.
          </p>
        </div>
       <div className="flex mx-auto bg-slate-100 p-3 items-center  justify-center " >
         {User && (
          <SellerOnboarding user={{ id: User.User_id, role: User.role }} />
        )}
       </div>



      </div>
    </div >
  )
}
