"use client"

import React from "react"
import SellerOnboarding from "@/components/SellerOboarding/SellerOnboarding"
import { useAppSelector } from "@/hooks"


export default function SellerRegistration() {

 const User = useAppSelector(state=> state.user.user)
 
  return (
    <div className="min-h-screen  dark:bg-gray-800 py-8 ">
     <div className="flex rounded-lg border border-gold mx-auto mt-4 bg-slate-100 dark:bg-gray-700 p-3 items-center  justify-center " >
         {User && (
          <SellerOnboarding user={{ id: User.User_id, role: User.role }} />
        )}
       </div>
    </div >
  )
}
