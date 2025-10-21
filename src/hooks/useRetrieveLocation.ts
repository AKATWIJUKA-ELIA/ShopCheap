import { useEffect, useState } from "react";
import axios from "axios";
import {HERE_RETRIEVE_LOCATION,} from "../urls"
import { HereSuggestions,LocationResult } from "@/lib/types";
const token = process.env.NEXT_PUBLIC_HERE_TOKEN

// Create axios instance with timeout
const apiClient = axios.create({
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

const useRetrieveLocation = (lat:number,lng:number) => {
  const [retrievedLocation, setRetrievedLocation] = useState<HereSuggestions[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const retrieveLocation = async () => {
      if (!lat || !lng) return;
      
      setLoading(true);
      setError(null);
      
      try {
         const url = `${HERE_RETRIEVE_LOCATION}?at=${lat},${lng}&lang=en-US&apiKey=${token}`
                const response = await apiClient.get(url)
                const data:LocationResult = await response.data;
                setRetrievedLocation(data.items || []);
      } catch (error) {
        console.error("Location retrieval error:", error);
        setError("Failed to retrieve location");
        setRetrievedLocation([]);
      } finally {
        setLoading(false);
      }
    };
    retrieveLocation();
  }, [lat,lng]);

  return {
        error,
        retrievedLocation,
        loading
};
};
export default useRetrieveLocation;