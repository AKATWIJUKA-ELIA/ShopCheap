"use client"

import React, { use } from "react"
import SellerOnboarding from "@/components/SellerOboarding/SellerOnboarding"
import {
  Store,
//   CreditCard,
} from "lucide-react"
import { useAppSelector } from "@/hooks"


export default function SellerRegistration() {

 const User = useAppSelector(state=> state.user.user)
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [errors, setErrors] = useState<Record<string, string>>({})


//   const validateStep = (step: number): boolean => {
//     const newErrors: Record<string, string> = {}

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }



//   const handleSubmit = async () => {
//     if (!validateStep(5)) return

//     setIsSubmitting(true)
//     try {
//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 2000))
//       alert(
//         "Registration submitted successfully! We will review your application and get back to you within 2-3 business days.",
//       )
//     } catch (error) {
//       alert(`An error occurred.${error} Please try again.`)
//     } finally {
//       setIsSubmitting(false)
//     }
//   }



  return (
    <div className="min-h-screen mt-16 bg-gradient-to-br from-blue-50 to-indigo-100 dark:bg-gray-500 py-8 px-4">
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
        {User && (
          <SellerOnboarding user={{ id: User.User_id, role: User.role }} />
        )}



      </div>
    </div >
  )
}
