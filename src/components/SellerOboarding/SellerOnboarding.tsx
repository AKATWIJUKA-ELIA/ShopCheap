"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { MapPin } from 'lucide-react';
import Link from "next/link";
import LocationPicker from "@/components/LocationPicker/LocationPicker";



export default function SellerOnboarding({ user }: { user: { id: string; role: string } }) {
  const [open, setOpen] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/sellers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, storeName, description }),
      });

      if (!res.ok) throw new Error("Failed to submit application");
      setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
            > <MapPin/> Select on Map</Button> {selectedLocation&& <div>{`Selected Location: ${selectedLocation.lng}, ${selectedLocation.lat}`}</div>}
          </div>

          <Button
            type="submit"
            disabled={loading || !storeName || !description || !location}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </Button>

          <h1>By submitting your application, you agree to our terms and conditions. <Link className="text-blue-800" href="/" >Click here to read them.</Link></h1>
        </form>
      )}

      {showLocationPicker && <LocationPicker isvisible={showLocationPicker} onClose={() => setShowLocationPicker(false)} onLocationSelect={setSelectedLocation} />}
    </div>
  );
}       
