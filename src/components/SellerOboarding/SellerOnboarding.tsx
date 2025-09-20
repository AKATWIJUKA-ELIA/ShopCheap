"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { MapPin } from 'lucide-react';
import LocationPicker from "@/components/LocationPicker/LocationPicker";
import useRetrieveLocation from "@/hooks/useRetrieveLocation";
import useHandleSellerApplications from "@/hooks/useHandleSellerApplications";
import { Id } from "../../../convex/_generated/dataModel";
import { useNotification } from "@/app/NotificationContext";
import useValidateStoreName from "@/hooks/useValidateStoreName"



export default function SellerOnboarding({ user }: { user: { id: string; role: string } }) {
  const [open, setOpen] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
        const [StoreNameIsTaken, setStoreNameIsTaken] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { CreateApplication } = useHandleSellerApplications();
  const {setNotification} = useNotification()
        const {CheckStoreName} = useValidateStoreName();
 
//   console.log("selectedLocation: ",selectedLocation)
  const retrievedLocation = useRetrieveLocation(
    selectedLocation?.lat ?? 0,
    selectedLocation?.lng ?? 0
  ); // Replace with actual lat,lng
//   console.log("retrievedLocation: ",retrievedLocation)
  
 const clearForm= ()=>{
        setStoreName("");
        setDescription("");
        setSelectedLocation(null);
 }

  const ValidateUsername = async (name:string)=>{
        const response = await CheckStoreName(name)
          if (!response.success) {
                                setStoreNameIsTaken(true)
                                return
                        }
                        setStoreNameIsTaken(false)
                        // setusername(name)
 }
   const handleStoreNameChange =async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase().replace(/\s+/g, "-");
        setStoreName(value)
        if(value.length>3){
              await ValidateUsername(value)
        } else{
                setStoreNameIsTaken(false)
        }
       
        
};
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await CreateApplication({
        user_id: user.id as Id<"customers">,
        storeName,
        description,
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
        message:res.message||" Application submitted successfully! We will review your application and get back to you within 2-3 business days"
       })
    } catch {
      setNotification({
        status:"error",
        message:"error creating application"
       })
    } finally {
        setLoading(false);
      setTimeout(()=>{
      clearForm();
      },5000)
    }
  };
  const handelLocationSelect = (loc: { lat: number; lng: number }) => {
    setSelectedLocation(loc);
//     setShowLocationPicker(false);
  }     

  if (user.role === "seller") {
    return <p className="p-4 bg-green-100 text-green-800 rounded">✅ You are already a seller!</p>;
  }

  return (
    <div className="flex p-6 border rounded-lg shadow bg-white dark:bg-dark w-full ">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Become a Seller
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <h2 className="text-xl font-semibold dark:text- ">Seller Application</h2>
          <div>
            <label className="block text-sm font-medium dark:text- ">Store Name</label>
            <input
              type="text"
              value={storeName}
              onChange={ handleStoreNameChange}
              className="w-full p-2 border rounded"
              required
            />
            {StoreNameIsTaken && <h1 className="text-red-600 text-xs "><span className="text-black dark:text-white" >{storeName}</span> is taken </h1>}
           {!StoreNameIsTaken && storeName.length>4 &&  <h1 className="text-green-600 text-sm "><span className="text-black dark:text-white" >{storeName}</span> is available </h1>}
          </div>
          <div>
            <label className="block text-sm font-medium dark:text- ">Description</label>
            <textarea
            placeholder="Briefly describe your store and the products you plan to sell."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium dark:text- ">Choose Location</label>
            <Button variant={"outline"} type="button" className="mt-2"
            onClick={() => setShowLocationPicker(true)}
            > <MapPin/> Select on Map</Button> {selectedLocation&& 
            <div>{`Seleted Location: ${retrievedLocation.retrievedLocation.map((loc)=>
            {return `${loc.address.label}, ${loc.resultType}`})}`}</div>}
          </div>

          <Button
            type="submit"
            disabled={loading || !storeName || !description || !selectedLocation}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </Button>

          {/* <h1>By submitting your application, you agree to our <Link className="text-blue-800" href="/" >terms and conditions.</Link> </h1> */}
        </form>
      )}

      {showLocationPicker && <LocationPicker isvisible={showLocationPicker} onClose={() => setShowLocationPicker(false)} onLocationSelect={handelLocationSelect} />}
    </div>
  );
}       
