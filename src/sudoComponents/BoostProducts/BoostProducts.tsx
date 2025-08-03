"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Clock,
  Eye,
  Heart ,
  ShoppingCart,
  Award,
  ShieldHalf,
  BadgeCheck ,
} from "lucide-react"
import Image from "next/image"
import useBoost from "@/hooks/useBoost"
import { BoostWithInteraction } from "@/lib/utils"
import { formatDate } from "@/lib/helpers"




const checkBadge = (sponsorship: string) => {
  switch (sponsorship) {
        case "basic":
      return <ShieldHalf  className="w-4 h-4 text-blue-500" />
    case "premium":
      return <Award className="w-4 h-4 text-gold" />
    case "platinum":
      return <BadgeCheck className="w-4 h-4 text-purple-500" />
    default:
      return null
  }
}
const conditionalborder = (sponsorship: string) => {
  switch (sponsorship) {
    case "basic":
      return "border-blue-500 text-blue-500"
    case "premium":
      return "border-gold text-gold"
    case "platinum":
      return "border-purple-500 text-purple-500"
    default:
      return "border-gray-300"
  }
}

export default function ProductBoost() {
        const { AllBoostedProducts } = useBoost()
        const [activeBoosts, setActiveBoosts] = useState<BoostWithInteraction[]>(AllBoostedProducts||[])

useEffect(() => {
                setActiveBoosts(AllBoostedProducts ?? [])
},[AllBoostedProducts])


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 mt-20 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-2">Boosted <span className="text-gold" >Products</span> </h1>
          <p className="text-gray-600">Increase visibility and sales with our promotion tools</p>
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">Active Boosts</TabsTrigger>
            <TabsTrigger value="expired">Expired</TabsTrigger>
            {/* <TabsTrigger value="analytics">Analytics</TabsTrigger> */}
          </TabsList>

        

          {/* Active Boosts Tab */}
          <TabsContent value="active" className="space-y-6">
            <Card className="dark:bg-gray-900" >
              <CardHeader>
                <CardTitle>Active Boost Campaigns</CardTitle>
                <CardDescription>Monitor and manage your current product boosts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                   {activeBoosts && activeBoosts.length > 0 ? (
                     activeBoosts.filter((boost) => (boost.product_sponsorship?.duration ?? 0) > Date.now()).map((product) => (
                      <Card key={product?._id} className="hover:shadow-md dark:bg-gray-800">
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row items-center justify-between">
                            <div className="flex items-center gap-4">
                              <Image
                                src={product?.product_image[0] || "/placeholder.svg"}
                                alt={product?.product_name || "Product Image"}
                                width={60}
                                height={60}
                                className="rounded-lg object-cover"
                              />
                              <div className="flex flex-col space-y-2"> 
                                <h3 className="font-semibold">{product?.product_name}</h3>
                                <div className={`flex items-center w-auto   border ${conditionalborder(product?.product_sponsorship?.type||"")} rounded-lg p-1 text-sm font-semibold `}>
                                        <span className="flex items-center gap-1">
                                        {checkBadge(product?.product_sponsorship?.type || "")}
                                        {product?.product_sponsorship?.type || "Basic"}
                                        </span>
                                </div>
                                <span className="flex items-center gap-1 " ><Clock className="w-4 h-4 " color="red"  /> Ends: <span className="md:font-semibold text-sm  text-green-600" >{product.product_sponsorship?.duration? formatDate(product.product_sponsorship.duration):"NaN"}</span></span>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="grid grid-cols-3 gap-6  text-center">
                                <div>
                                  <div className="text-lg font-bold">
                                    {product.product_likes?.toLocaleString()??0}
                                  </div>
                                  {/* Likes refers to the bookmark count  we use bookmark as like */}
                                  <div className="flex items-center gap-1 text-xs text-gray-600">
                                        <span>Likes </span>
                                        <Heart  className="w-4 h-4" fill="red" color="red"  />  
                                        </div> 
                                </div>
                                {/* <div>
                                  <div className="text-lg font-bold">
                                    {product.interaction?.type.cart.count ??0}
                                  </div>
                                  <div className="flex items-center gap-1 text-xs text-gray-600">
                                        <span>Cart</span> 
                                        <ShoppingCart   className="w-4 h-4" color="purple" />
                                        </div>
                                </div> */}
                                <div>
                                  <div className="text-lg font-bold">
                                        {/* Sales we order count ie the number of times the product was ordered / appears in the orders table */}
                                    {product.product_views?.toLocaleString() ?? 0}
                                  </div>
                                  <div className="flex items-center gap-1 text-xs text-gray-600">
                                        <span>views</span>
                                        <Eye className="w-4 h-4 text-blue-500" />
                                        </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))):(
                        <div className="p-4 text-center text-gray-600">
                          No active boost campaigns found.
                        </div>
                    )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

              {/* Expired Boosts Tab */}
          <TabsContent value="expired" className="space-y-6">
            <Card className="dark:bg-gray-900" >
              <CardHeader>
                <CardTitle>Your Previous Boost Campaigns</CardTitle>
                <CardDescription>Monitor and manage your previous product boosts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeBoosts && activeBoosts.length > 0 ? (
                     activeBoosts.filter((boost) => (boost.product_sponsorship?.duration ?? 0) <= Date.now()).map((product) => (
                      <Card key={product._id} className="hover:shadow-md dark:bg-gray-800 border border-red-500">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <Image
                                src={product.product_image[0] || "/placeholder.svg"}
                                alt={product.product_name || "Product Image"}
                                width={60}
                                height={60}
                                className="rounded-lg object-cover"
                              />
                              <div className="flex flex-col space-y-2"> 
                                <h3 className="font-semibold">{product?.product_name}</h3>
                                <div className={`flex items-center w-auto   border ${conditionalborder(product?.product_sponsorship?.type||"")} rounded-lg p-1 text-sm font-semibold `}>
                                        <span className="flex items-center gap-1">
                                        {checkBadge(product?.product_sponsorship?.type || "")}
                                        {product?.product_sponsorship?.type || "Basic"}
                                        </span>
                                </div>
                                <span className="flex items-center gap-1 " ><Clock className="w-4 h-4 " color="red"  /> Ended: <span className="font-semibold text-red-600" >{product.product_sponsorship?.duration? formatDate(product.product_sponsorship.duration):"NaN"}</span></span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="grid grid-cols-4 gap-6  text-center">


                                <div>
                                  <div className="text-lg font-bold">
                                    {product.product_likes?.toLocaleString()??0}
                                  </div>
                                  {/* Likes refers to the bookmark count  we use bookmark as like */}
                                  <div className="flex items-center gap-1 text-xs text-gray-600">
                                        <span>Likes </span>
                                        <Heart  className="w-4 h-4" fill="red" color="red"  />  
                                        </div> 
                                </div>
                                <div>
                                  <div className="text-lg font-bold">
                                    {product.interaction?.type.cart.count ??0}
                                  </div>
                                  <div className="flex items-center gap-1 text-xs text-gray-600">
                                        <span>Cart</span> 
                                        <ShoppingCart   className="w-4 h-4" color="purple" />
                                        </div>
                                </div>
                                <div>
                                  <div className="text-lg font-bold">
                                        {/* Sales we order count ie the number of times the product was ordered / appears in the orders table */}
                                    {product.interaction?.type.view.count??0}
                                  </div>
                                  <div className="flex items-center gap-1 text-xs text-gray-600">
                                        <span>views</span>
                                        <Eye className="w-4 h-4 text-blue-500" />
                                        </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))):(
                        <div className="p-4 text-center text-gray-600">
                          No Previous campaigns found.
                        </div>
                    )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  )
}
