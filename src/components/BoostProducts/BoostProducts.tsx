"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  Clock,
  Trash2, 
  DollarSign,
  Eye,
  Heart ,
  ShoppingCart,
  Star,
  Zap,
  Crown,
  RotateCcw,
  Rocket,
  BarChart3,
  Users,
  CheckCircle,
  Award,
  ShieldHalf ,
  BadgeCheck ,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useBoostContext } from "@/app/BoostContext"
import useGetProductsByIds from "@/hooks/useGetProductsByIds"
import { Id } from "../../../convex/_generated/dataModel"
import useBoost from "@/hooks/useBoost"
import { useNotification } from "@/app/NotificationContext"
import { BoostWithInteraction } from "@/lib/utils"
import { formatDate } from "@/lib/helpers"



interface BoostOption {
  id: "basic" | "premium" | "platinum"
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  features: string[]
  pricing: {
    quarterly: number
    weekly: number
    monthly: number
  }
  estimatedReach: {
    min: number
    max: number
  }
  color: string
}
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


const boostOptions: BoostOption[] = [
  {
    id: "basic",
    name: "Basic",
    description: "Increase visibility in search results",
    icon: TrendingUp,
    features: ["Higher search ranking", "Category page placement", "Basic analytics"],
    pricing: { weekly: 5000, monthly: 15000, quarterly: 65000 },
    estimatedReach: { min: 500, max: 1000 },
    color: "bg-blue-500",
  },
  {
    id: "premium",
    name: "Premium",
    description: "Featured placement and enhanced visibility",
    icon: Star,
    features: ["Featured product placement", "Homepage visibility", "Advanced analytics", "Priority customer support"],
    pricing: { weekly: 10000, monthly: 35000, quarterly: 150000 },
    estimatedReach: { min: 2000, max: 5000 },
    color: "bg-purple-500",
  },
  {
    id: "platinum",
    name: "Platinum ",
    description: "Maximum exposure with premium features",
    icon: Crown,
    features: [
      "Top banner placement",
      "Social media promotion",
      "Influencer outreach",
      "Dedicated account manager",
      "Custom marketing materials",
    ],
    pricing: { weekly: 25000, monthly: 75000, quarterly: 350000 },
    estimatedReach: { min: 10000, max: 25000 },
    color: "bg-gold",
  },
]

export default function ProductBoost() {
        const { boost,setBoost } = useBoostContext()
        const { data: products, } = useGetProductsByIds((boost?.flatMap(id => id)) || []);
        const [selectedBoost, setSelectedBoost] = useState<BoostOption>(boostOptions[0])
        const [duration, setDuration] = useState("weekly")
        const [autoRenew, setAutoRenew] = useState(false)
        const { boostProduct,BoostedProducts } = useBoost()
        const [activeBoosts, setActiveBoosts] = useState<BoostWithInteraction[]>()
        const { setNotification } = useNotification()
        console.log("boost",BoostedProducts)
  const calculateTotalCost = () => {
    const baseCost = selectedBoost.pricing[duration as keyof typeof selectedBoost.pricing]
    return baseCost
  }
useEffect(() => {
                setActiveBoosts(BoostedProducts ?? [])
},[BoostedProducts])

  const getEstimatedReach = () => {
    const multiplier = duration === "weekly" ? 1 : duration === "monthly" ? 5 : 20
    return {
      min: selectedBoost.estimatedReach.min * multiplier,
      max: selectedBoost.estimatedReach.max * multiplier,
    }
  }
  const handleRemove = (productId:Id<"products">) => {
       setBoost((prev) => prev.filter((id) => id !== productId))
  }
        const ReBoost = async (productId: Id<"products">) => {
                setBoost((prev => [...prev, productId]))
                
                setNotification({ status: "success", message: "Product added to boost list" })
        }
  const handleBoostProduct = () => {
        if (boost.length === 0) {
                return
        }
        boost.forEach((product_id) => {
          boostProduct({
            product_id: product_id as Id<"products">,
            boost_type: selectedBoost.id,
            duration:duration,
            status: "active",
                amount: calculateTotalCost(),
          }).then((response) => {
            if (!response.success) {
              setNotification({ status: "error", message: response.message })
            } else {
              setNotification({ status: "success", message: response.message })
            }
          })
        })
        setBoost([]) // Clear selected products after boosting
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 mt-20 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-2">Boost <span className="text-gold" >Your</span> Products</h1>
          <p className="text-gray-600">Increase visibility and sales with our promotion tools</p>
        </div>

        <Tabs defaultValue="boost" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="boost">Create Boost</TabsTrigger>
            <TabsTrigger value="active">Active Boosts</TabsTrigger>
            <TabsTrigger value="expired">Expired</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Create Boost Tab */}
          <TabsContent value="boost" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Product Selection */}
              <div className="lg:col-span-2 space-y-6 ">
                <Card className="dark:bg-gray-900" >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5" />
                      <Link href="/admin/approved" className=" border text-gold rounded-md p-2 hover:bg-gray-300 transition-all " >
                      Select Products <span className="dark:text-white text-dark" >you would like to Boost Here</span>
                      </Link>
                    </CardTitle>
                    <CardDescription>Your Selected products will appear Here</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      { products && products.length>0? (products.map((product) => (
                        <Card
                          key={product?._id}
                          className={`cursor-pointer transition-all hover:ring-2 ring-gold hover:bg-amber-50 hover:shadow-md`}
                        >
                          <CardContent className="p-4">
                            <div className="flex gap-5  ">
                              <Image
                                src={product?.product_image[0] || "/placeholder.svg"}
                                alt={product?.product_name ||"Product Image"}
                                width={80}
                                height={80}
                                className="rounded-lg object-cover"
                              />
                              <div className="flex  justify-between w-full">
                               <div className="flex flex-col " >
                                 <h3 className="font-semibold text-gray-900 mb-1">{product?.product_name}</h3>
                                <p className="text-lg font-bold text-green-600 mb-2">UGX: {product?.product_price}</p>
                               </div>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <div className="flex items-center gap-1 hover:text-red-600 transition-colors" 
                                  onClick={() => handleRemove(product?._id as Id<"products">)}>
                                        {/* <span className="text-sm ">Remove</span> */}
                                    <Trash2  className="w-8 h-8" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))) : (
                        <Card className="dark:bg-gray-800">
                          <CardContent className="p-12 text-center">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Selected</h3>
                            <p className="text-gray-600">Please select products to boost from your approved products list.</p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Boost Options */}
                <Card className="dark:bg-gray-900" >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Rocket className="w-5 h-5" />
                      Choose Boost Type
                    </CardTitle>
                    <CardDescription>Select the level of promotion for your product</CardDescription>
                    <CardDescription className="text-lg font-semibold text-red-500 " >Note: The Boost type will apply for all the Selected products</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {boostOptions.map((option) => {
                        const Icon = option.icon
                        return (
                          <Card
                            key={option.id}
                            className={`cursor-pointer dark:bg-gray-800 transition-all ${
                              selectedBoost.id === option.id ? "ring-2 ring-purple-500 bg-purple-50" : "hover:shadow-md"
                            }`}
                            onClick={() => setSelectedBoost(option)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-lg ${option.color} text-white`}>
                                  <Icon className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-semibold">{option.name}</h3>
                                    <div className="text-right">
                                      <div className="text-sm text-gray-600">Starting at</div>
                                      <div className="text-lg font-bold text-green-600">
                                        UGX {option.pricing.weekly}/week
                                      </div>
                                    </div>
                                  </div>
                                  <p className="text-gray-600 mb-3">{option.description}</p>
                                  <div className="grid md:grid-cols-2 gap-2">
                                    {option.features.map((feature, index) => (
                                      <div key={index} className="flex items-center gap-2 text-sm">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        {feature}
                                      </div>
                                    ))}
                                  </div>
                                  <div className="mt-3 text-sm text-gray-600">
                                    Estimated reach: {option.estimatedReach.min.toLocaleString()} -{" "}
                                    {option.estimatedReach.max.toLocaleString()} people
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Duration and Budget */}
                <Card className="dark:bg-gray-900" >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Duration & Budget
                    </CardTitle>
                    <CardDescription>Set how long and how much you want to spend</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label className="text-base font-semibold mb-3 block">Campaign Duration</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: "weekly", label: "weekly", price: selectedBoost.pricing.weekly },
                          { value: "monthly", label: "monthly", price: selectedBoost.pricing.monthly },
                          { value: "quarterly", label: "quarterly", price: selectedBoost.pricing.quarterly },
                        ].map((option) => (
                          <Card
                            key={option.value}
                            className={`cursor-pointer transition-all ${
                              duration === option.value ? "ring-2 ring-blue-500 bg-blue-50" : "hover:shadow-md"
                            }`}
                            onClick={() => setDuration(option.value)}
                          >
                            <CardContent className="p-4 text-center">
                              <div className="font-semibold dark:text-dark">{option.label}</div>
                              <div className="text-lg font-bold text-green-600">ugx:{option.price}</div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-renew" className="text-base font-semibold">
                        Auto-renew campaign
                      </Label>
                      <Button variant="outline" className={`${autoRenew ? "bg-red-500 hover:bg-red-600 ":"bg-green-400 hover:bg-green-600 " }`}  onClick={() => setAutoRenew(!autoRenew)}>
                                {autoRenew ? "Disable Auto-renew" : "Enable Auto-renew"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Target Audience */}
                {/* <Card className="dark:bg-gray-900" >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Target Audience
                    </CardTitle>
                    <CardDescription>Define who should see your boosted product</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="age-range">Age Range</Label>
                        <Select
                          value={targetAudience.ageRange}
                          onValueChange={(value) => setTargetAudience((prev) => ({ ...prev, ageRange: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="18-25">18-25 years</SelectItem>
                            <SelectItem value="25-35">25-35 years</SelectItem>
                            <SelectItem value="35-45">35-45 years</SelectItem>
                            <SelectItem value="45-55">45-55 years</SelectItem>
                            <SelectItem value="55+">55+ years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="gender">Gender</Label>
                        <Select
                          value={targetAudience.gender}
                          onValueChange={(value) => setTargetAudience((prev) => ({ ...prev, gender: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Select
                        value={targetAudience.location}
                        onValueChange={(value) => setTargetAudience((prev) => ({ ...prev, location: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nationwide">Nationwide</SelectItem>
                          <SelectItem value="local">Local Area</SelectItem>
                          <SelectItem value="regional">Regional</SelectItem>
                          <SelectItem value="international">International</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="interests">Interests (Optional)</Label>
                      <Textarea
                        id="interests"
                        placeholder="e.g., technology, fitness, fashion..."
                        value={targetAudience.interests}
                        onChange={(e) => setTargetAudience((prev) => ({ ...prev, interests: e.target.value }))}
                      />
                    </div>
                  </CardContent>
                </Card> */}
              </div>

              {/* Summary and Checkout */}
              <div className="space-y-6">
                <Card className="sticky top-4 dark:bg-gray-900">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Boost Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 ">
                    {products && products.length>0? (
                        products.map((prod) => (
                                <div key={prod?._id}>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex gap-3">
                                <div className="flex gap-3">
                                        <Image
                                src={prod?.product_image[0] || "/placeholder.svg"}
                                alt={prod?.product_name ||"Product Image"}
                                width={80}
                                height={80}
                                className="rounded-lg object-cover"
                              />
                                </div>
                            <div className="flex flex-col space-y-1">
                                <div className=" text-md font-semibold">{prod?.product_name}</div>
                            <div className="text-xs text-gray-600">ugx: {prod?.product_price}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                        ))
                      
                    ):(
                            <div className="text-gray-500 text-sm">No products selected for boosting</div>
                    )}

                    <Separator  />

                    <div>
                      <Label className="text-sm font-semibold text-gray-600">Boost Type</Label>
                      <div className="mt-1">
                        <div className="font-medium">{selectedBoost.name}</div>
                        <div className="text-sm text-gray-600">{selectedBoost.description}</div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-semibold text-gray-600">Duration</Label>
                      <div className="mt-1 font-medium capitalize">{duration.replace("ly", "")}</div>
                    </div>

                    <div>
                      <Label className="text-sm font-semibold text-gray-600">Estimated Reach</Label>
                      <div className="mt-1 font-medium">
                        {getEstimatedReach().min.toLocaleString()} - {getEstimatedReach().max.toLocaleString()} people
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Boost Cost</span>
                        <span className="font-semibold">${calculateTotalCost()}</span>
                      </div>
                      
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-green-600">UGX: {(calculateTotalCost() * 1.1).toFixed(2)}</span>
                      </div>
                    </div>

                    <Button disabled={ !selectedBoost } className="w-full" size="lg" onClick={handleBoostProduct} >
                      <Zap className="w-4 h-4 mr-2" />
                      Start Boost Campaign
                    </Button>

                    <div className="text-xs text-gray-500 text-center">
                      {autoRenew ? "Campaign will auto-renew" : "One-time campaign"}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

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
                                        <span>BookMarks </span>
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
                                  <div className="flex flex-col items-center gap-1 text-xs text-gray-600 hover:cursor-pointer"
                                  onClick={()=>ReBoost(product._id as Id<"products">)    }
                                  >
                                         <RotateCcw   className="w-6 h-6" color="purple" />
                                        <span>Re-Boost</span> 
                                        </div>
                                </div>

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
                                    {product.product_views}
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

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="dark:bg-gray-600" >
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="text-2xl font-bold">24.5K</div>
                      <div className="text-sm text-gray-600 dark:text-gray-200">Total Impressions</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="dark:bg-gray-600" >
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-500" />
                    <div>
                      <div className="text-2xl font-bold">1.2K</div>
                      <div className="text-sm text-gray-600 dark:text-gray-200 ">Clicks</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="dark:bg-gray-600"  >
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-purple-500" />
                    <div>
                      <div className="text-2xl font-bold">89</div>
                      <div className="text-sm text-gray-600  dark:text-gray-200">Conversions</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="dark:bg-gray-600"  >
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                    <div>
                      <div className="text-2xl font-bold">7.4%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-200">Conversion Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>Track your boost campaign performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <BarChart3 className="w-12 h-12 mb-2" />
                  <div className="text-center">
                    <p>Analytics chart would be displayed here</p>
                    <p className="text-sm">Showing impressions, clicks, and conversions over time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
