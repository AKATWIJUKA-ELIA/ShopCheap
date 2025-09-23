"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Upload, Camera, Store, User, FileText, CheckCircle, AlertCircle, X, ImageIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface SellerFormData {
  shopName: string
  slogan: string
  shopDescription: string
  profilePicture: File | null
  coverPhoto: File | null
  // Additional fields for completeness
  ownerName: string
  email: string
  phone: string
  businessType: string
  businessAddress: string
  city: string
  state: string
  zipCode: string
  country: string
}

export default function SellerRegistrationForm() {
  const { toast } = useToast()
  const [formData, setFormData] = useState<SellerFormData>({
    shopName: "",
    slogan: "",
    shopDescription: "",
    profilePicture: null,
    coverPhoto: null,
    ownerName: "",
    email: "",
    phone: "",
    businessType: "",
    businessAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [profilePreview, setProfilePreview] = useState<string | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const updateFormData = (field: keyof SellerFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleFileUpload = (field: "profilePicture" | "coverPhoto", file: File | null) => {
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        })
        return
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        })
        return
      }

      updateFormData(field, file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        if (field === "profilePicture") {
          setProfilePreview(e.target?.result as string)
        } else {
          setCoverPreview(e.target?.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const removeFile = (field: "profilePicture" | "coverPhoto") => {
    updateFormData(field, null)
    if (field === "profilePicture") {
      setProfilePreview(null)
    } else {
      setCoverPreview(null)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Required fields validation
    if (!formData.shopName.trim()) newErrors.shopName = "Shop name is required"
    if (!formData.slogan.trim()) newErrors.slogan = "Shop slogan is required"
    if (!formData.shopDescription.trim()) newErrors.shopDescription = "Shop description is required"
    if (!formData.ownerName.trim()) newErrors.ownerName = "Owner name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.businessAddress.trim()) newErrors.businessAddress = "Business address is required"
    if (!formData.city.trim()) newErrors.city = "City is required"
    if (!formData.country.trim()) newErrors.country = "Country is required"

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Phone validation
    if (formData.phone && !/^\+?[\d\s\-$$$$]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number"
    }

    // Shop name length validation
    if (formData.shopName && formData.shopName.length < 3) {
      newErrors.shopName = "Shop name must be at least 3 characters long"
    }

    // Description length validation
    if (formData.shopDescription && formData.shopDescription.length < 50) {
      newErrors.shopDescription = "Shop description must be at least 50 characters long"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculateProgress = (): number => {
    const fields = [
      formData.shopName,
      formData.slogan,
      formData.shopDescription,
      formData.profilePicture,
      formData.coverPhoto,
    ]

    const filledFields = fields.filter((field) => field && field !== "").length
    return Math.round((filledFields / fields.length) * 100)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Please fix the errors",
        description: "Some required fields are missing or invalid",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Registration submitted!",
        description:
          "Your seller application has been submitted for review. We'll contact you within 2-3 business days.",
      })

      // Reset form
      setFormData({
        shopName: "",
        slogan: "",
        shopDescription: "",
        profilePicture: null,
        coverPhoto: null,
        ownerName: "",
        email: "",
        phone: "",
        businessType: "",
        businessAddress: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      })
      setProfilePreview(null)
      setCoverPreview(null)
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = calculateProgress()

  return (
    <div className="min-h-screen rounded-lg shadow-md mt-10  bg-gold/5 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-100 dark:bg-blue-900 rounded-full">
              <Image src="/images/logo2.png" alt="Logo" width={50} height={50} className=" w-20 h-20 rounded-full text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2"><span className="text-gold">Enhance</span> your online presence <span className="text-gold">with shopCheap</span> </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Join thousands of successful sellers on our platform. Complete the registration process to start selling your products to millions of customers worldwide.
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-6 bg-green-50 border-green-200 ">
          <CardContent className="pt-6 ">
            <div className="flex items-center justify-between mb-2 ">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Registration Progress</span>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{progress}%</span>
            </div>
            <Progress   value={progress} className="w-full [&>div]:bg-gradient-to-r [&>div]:from-green-400 [&>div]:to-green-500 [&>div]:shadow-sm  " />
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Shop Information */}
          <Card className="bg-green-50 border border-green-600" >
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Store className=" text-gold w-5 h-5" />
                <span>Shop Information</span>
              </CardTitle>
              <CardDescription>Tell us about your shop and what makes it special</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="shopName">Shop Name *</Label>
                <Input
                  id="shopName"
                  value={formData.shopName}
                  onChange={(e) => updateFormData("shopName", e.target.value)}
                  placeholder="Enter your shop name"
                  className={errors.shopName ? "border-red-500" : ""}
                />
                {errors.shopName && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.shopName}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="slogan">Shop Slogan *</Label>
                <Input
                  id="slogan"
                  value={formData.slogan}
                  onChange={(e) => updateFormData("slogan", e.target.value)}
                  placeholder="A catchy slogan for your shop"
                  className={errors.slogan ? "border-red-500" : ""}
                />
                {errors.slogan && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.slogan}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="shopDescription">Shop Description *</Label>
                <Textarea
                  id="shopDescription"
                  value={formData.shopDescription}
                  onChange={(e) => updateFormData("shopDescription", e.target.value)}
                  placeholder="Describe your shop, products, and what makes you unique (minimum 50 characters)"
                  rows={4}
                  className={errors.shopDescription ? "border-red-500" : ""}
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.shopDescription ? (
                    <p className="text-red-500 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.shopDescription}
                    </p>
                  ) : (
                    <p className="text-gray-500 text-sm">{formData.shopDescription.length}/50 characters minimum</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shop Images */}
          <Card className="bg-green-50 border border-green-600">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ImageIcon className="w-5 h-5" />
                <span>Shop Images</span>
              </CardTitle>
              <CardDescription>Upload your profile picture and cover photo to make your shop stand out</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div>
                <Label>Profile Picture</Label>
                <div className="mt-2">
                  {profilePreview ? (
                    <div className="relative inline-block">
                      <img
                        src={profilePreview || "/placeholder.svg"}
                        alt="Profile preview"
                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile("profilePicture")}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-full hover:border-blue-500 transition-colors">
                      <div className="text-center">
                        <Camera className="mx-auto h-8 w-8 text-gray-400" />
                        <label
                          htmlFor="profilePicture"
                          className="mt-2 block text-sm font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
                        >
                          Upload Photo
                        </label>
                        <input
                          id="profilePicture"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={(e) => handleFileUpload("profilePicture", e.target.files?.[0] || null)}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-2">Recommended: Square image, at least 200x200px</p>
              </div>

              {/* Cover Photo */}
              <div>
                <Label>Cover Photo</Label>
                <div className="mt-2">
                  {coverPreview ? (
                    <div className="relative">
                      <img
                        src={coverPreview || "/placeholder.svg"}
                        alt="Cover preview"
                        className="w-full h-48 object-cover rounded-lg border shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile("coverPhoto")}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 transition-colors">
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <label
                          htmlFor="coverPhoto"
                          className="mt-2 block text-sm font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
                        >
                          Upload Cover Photo
                        </label>
                        <input
                          id="coverPhoto"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={(e) => handleFileUpload("coverPhoto", e.target.files?.[0] || null)}
                        />
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-2">Recommended: 1200x400px for best results</p>
              </div>
            </CardContent>
          </Card>


          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button
              type="submit"
              disabled={isSubmitting || progress < 80}
              className="w-full md:w-auto px-8 py-3 text-lg bg-green-500 hover:bg-green-600 "
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Submitting Application...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Submit Seller Application
                </>
              )}
            </Button>
          </div>

          {progress < 80 && (
            <p className="text-center text-sm text-gray-500">
              Please complete at least 80% of the form to submit your application
            </p>
          )}
        </form>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            By submitting this form, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Seller Agreement
            </a>
          </p>
          <p className="mt-2">
            Need help? Contact our seller support team at{" "}
            <a href="mailto:sellers@example.com" className="text-blue-600 hover:underline">
              sellers@example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
