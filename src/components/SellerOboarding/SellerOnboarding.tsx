"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { MapPin } from 'lucide-react';
import Link from "next/link";
import LocationPicker from "@/components/LocationPicker/LocationPicker";
import useRetrieveLocation from "@/hooks/useRetrieveLocation";
import useHandleSellerApplications from "@/hooks/useHandleSellerApplications";
import { Id } from "../../../convex/_generated/dataModel";



export default function SellerOnboarding({ user }: { user: { id: string; role: string } }) {
  const [open, setOpen] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { CreateApplication } = useHandleSellerApplications();
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
      const data = await res.json();
      if (data?.success) {
        setSuccess(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      clearForm();
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
      ) : success ? (
        <p className="text-green-600 font-medium">🎉 Application submitted! Await admin approval.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <h2 className="text-xl font-semibold dark:text- ">Seller Application</h2>
          <div>
            <label className="block text-sm font-medium dark:text- ">Store Name</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
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

          <h1>By submitting your application, you agree to our <Link className="text-blue-800" href="/" >terms and conditions.</Link> </h1>
        </form>
      )}

      {showLocationPicker && <LocationPicker isvisible={showLocationPicker} onClose={() => setShowLocationPicker(false)} onLocationSelect={handelLocationSelect} />}
    </div>
  );
}       
