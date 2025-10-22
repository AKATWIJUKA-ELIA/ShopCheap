"use client";

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Upload, Camera, Store,CheckCircle, AlertCircle, X, ImageIcon } from "lucide-react"
import Image from "next/image"
import { useState } from "react";
import { Button } from "../ui/button";
import { MapPin } from 'lucide-react';
import LocationPicker from "@/components/LocationPicker/LocationPicker";
import useRetrieveLocation from "@/hooks/useRetrieveLocation";
import useHandleSellerApplications from "@/hooks/useHandleSellerApplications";
import { Id } from "../../../convex/_generated/dataModel";
import { useNotification } from "@/app/NotificationContext";
import useValidateStoreName from "@/hooks/useValidateStoreName"
import {UploadImage} from "@/lib/convex";


interface Shop{
        shop_name: string;
        slogan: string;
        description: string;
        profile_image: string | null;
        cover_image: string | null;
        location?: { lat: number; lng: number } | undefined;

}


export default function SellerOnboarding({ user }: { user: { id: string; role: string } }) {

  const [storeName, setStoreName] = useState("");
  const [StoreNameIsTaken, setStoreNameIsTaken] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { CreateApplication } = useHandleSellerApplications();
  const {setNotification} = useNotification()
  const {CheckStoreName} = useValidateStoreName();
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [profilePreview, setProfilePreview] = useState<string | null>(null)
   const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
    const [formData, setFormData] = useState<Shop>({
    shop_name: "",
    slogan: "",
    description: "",
    profile_image: "",
    cover_image: "",
    location: undefined,
  })

  const updateFormData = (field: keyof Shop, value: string|File|null) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleFileUpload = async (field:"profile_image" | "cover_image", file: File | null) => {
    if (file&&file !== null) {
              // Validate file type
      if (!file.type.startsWith("image/")) {
        setNotification({
        status:"info",
        message:"Please select a valid image file"
       })
        return
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setNotification({
        status:"info",
        message:"File size should be less than 5MB"
       })
        return
      }
      if(field==="profile_image"){
        setProfileImageFile(file)
        // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfilePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      }
      if (field==="cover_image"){
        setCoverImageFile(file)
        // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setCoverPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      }

      
    }
  }

  const removeFile = (field: "profile_image" | "cover_image") => {
    updateFormData(field, null)
    if (field === "profile_image") {
      setProfilePreview(null)
        setProfileImageFile(null)
    } else {
      setCoverPreview(null)
        setCoverImageFile(null)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Required fields validation
    if (!storeName.trim()) newErrors.storeName = "Shop name is required"
    if (!formData.slogan.trim()) newErrors.slogan = "Shop slogan is required"
    if (!formData.description.trim()) newErrors.description = "Shop description is required"
        if (!selectedLocation) newErrors.location = "Shop location is required"
        if (StoreNameIsTaken) newErrors.storeName = "Shop name is already taken"
        


    // Description length validation
    if (formData.description && formData.description.length < 50) {
      newErrors.description = "Shop description must be at least 50 characters long"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculateProgress = (): number => {
    const fields = [
      storeName,
      formData.slogan,
      formData.description,
      profileImageFile,
      coverImageFile,
        selectedLocation ? JSON.stringify(selectedLocation) : "",
    ]

    const filledFields = fields.filter((field) => field && field !== "").length
    return Math.round((filledFields / fields.length) * 100)
  }


  const progress = calculateProgress()
 
//   console.log("selectedLocation: ",selectedLocation)
  const retrievedLocation = useRetrieveLocation(
    selectedLocation?.lat ?? 0,
    selectedLocation?.lng ?? 0
  ); // Replace with actual lat,lng
//   console.log("retrievedLocation: ",retrievedLocation)
  
 const clearForm= ()=>{
         setFormData({
        shop_name: "",
        slogan: "",
        description: "",
        profile_image: null,
        cover_image: null,
      })
        setStoreName("");
        setSelectedLocation(null);
        setProfilePreview(null)
      setCoverPreview(null)
      setCoverImageFile(null)
        setProfileImageFile(null)
 }

  const ValidateUsername = async (name:string)=>{
        const response = await CheckStoreName(name)
          if (!response.success) {
                                setStoreNameIsTaken(true)
                                return
                        }
                        setStoreNameIsTaken(false)
 }
   const handleStoreNameChange =async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase().replace(/\s+/g, "-");
        setStoreName(value)
        if(value.length>4){
                await ValidateUsername(value)
        }
        
};
  const handelLocationSelect = (loc: { lat: number; lng: number }) => {
    setSelectedLocation(loc);
//     setShowLocationPicker(false);
  }   

  const handleSubmit = async (e: React.FormEvent) => {
    setIsSubmitting(true)
        e.preventDefault();
        // Upload images if new files are selected

        let profileImageId = formData.profile_image ?? "";
        let coverImageId = formData.cover_image ?? "";
        if (profileImageFile && coverImageFile && profileImageFile !== null && coverImageFile !== null) {
        
        const profileResult: { success: boolean; storageId?: string } = await UploadImage(profileImageFile);
        if (profileResult.success && profileResult.storageId) {
                profileImageId = profileResult.storageId
                // updateFormData("profile_image", profileResult.storageId)
        }

        const coverResult = await UploadImage(coverImageFile);
        if (coverResult.success && coverResult.storageId) {
                coverImageId = coverResult.storageId
                // updateFormData("cover_image", coverResult.storageId)
        }
        }

    if (!validateForm()) {
      setNotification({
        status:"error",
        message:"Please fix the errors in the form before submitting."
       })
       setIsSubmitting(false)
      return
    }

    
    try {
      const res = await CreateApplication({
        user_id: user.id as Id<"customers">,
        storeName,
        description: formData.description,
        profile_image: profileImageId,
        cover_image: coverImageId,
        slogan: formData.slogan,
        location: selectedLocation ? selectedLocation : { lat: 0, lng: 0 }
      });

      if (!res?.success) {
       setNotification({
        status:"info",
        message:res?.message||"error creating application"
       })
       return
      }
          setNotification({
        status:"success",
        message:" Application submitted successfully! We will review your application and get back to you Asap"
       })

      // Reset form
        clearForm();
    } catch {
      setNotification({
        status:"error",
        message:"error creating application"
       })
    } finally {
      setTimeout(()=>{
      clearForm();
        setIsSubmitting(false)
        setErrors({})
      },5000)
    }
  };
  

if (user.role === "seller") {
    return <p className="p-4 bg-green-100 text-green-800 rounded">✅ You are already a seller!</p>;
  }

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
            <Card className="mb-6 bg-green-50 border-green-200 dark:bg-dark ">
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
              <Card className="bg-green-50 border border-green-600 dark:bg-dark" >
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
                      value={storeName}
                      onChange={handleStoreNameChange}
                      placeholder="Enter your shop name"
                      className={storeName ? "border-red-500" : ""}
                    />
                    {storeName.length>0 && storeName.length<4 && <h1 className="text-red-600 text-xs "><span className="text-black dark:text-white" >{storeName}</span> is too short </h1>}
                      {StoreNameIsTaken && <h1 className="text-red-600 text-xs "><span className="text-black dark:text-white" >{storeName}</span> is taken </h1>}
                        {!StoreNameIsTaken && storeName.length>4 &&  <h1 className="text-green-600 text-sm "><span className="text-black dark:text-white" >{storeName}</span> is available </h1>}
    
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
            <label className="block text-sm font-medium dark:text- ">Choose Location</label>
            <Button variant={"outline"} type="button" className="mt-2"
            onClick={() => setShowLocationPicker(true)}
            > <MapPin/> Select on Map</Button> {selectedLocation&& 
            <div>{`Seleted Location: ${retrievedLocation.retrievedLocation.map((loc)=>
            {return `${loc.address.label}, ${loc.resultType}`})}`}</div>}
          </div>
    
                  <div>
                    <Label htmlFor="description">Shop Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => updateFormData("description", e.target.value)}
                      placeholder="Describe your shop, products, and what makes you unique (minimum 50 characters)"
                      rows={4}
                      className={errors.description ? "border-red-500" : ""}
                    />
                    {formData.description.length<50 && <h1 className="text-red-600 text-xs" >Description should be at least 50 characters</h1>}
                    <div className="flex justify-between items-center mt-1">
                      {errors.description ? (
                        <p className="text-red-500 text-sm flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.description}
                        </p>
                      ) : (
                        <p className="text-gray-500 text-sm">{formData.description.length}/50 characters minimum</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
    
              {/* Shop Images */}
              <Card className="bg-green-50 border border-green-600 dark:bg-dark">
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
                            onClick={() => removeFile("profile_image")}
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
                              htmlFor="profile_image"
                              className="mt-2 block text-sm font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
                            >
                              Upload Photo
                            </label>
                            <input
                              id="profile_image"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={(e) => handleFileUpload("profile_image",e.target.files?.[0] || null)}
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
                            onClick={() => removeFile("cover_image")}
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
                              htmlFor="cover_image"
                              className="mt-2 block text-sm font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
                            >
                              Upload Cover Photo
                            </label>
                            <input
                              id="cover_image"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={(e) => handleFileUpload("cover_image",e.target.files?.[0] || null)}
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
                  disabled={isSubmitting || progress < 80|| storeName.length < 5 || StoreNameIsTaken }
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

                {showLocationPicker && <LocationPicker isvisible={showLocationPicker} onClose={() => setShowLocationPicker(false)} onLocationSelect={handelLocationSelect} />}
        </div>
  );
}       
