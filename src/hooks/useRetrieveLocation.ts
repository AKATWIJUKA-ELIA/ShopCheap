import { useEffect, useState } from "react";
import axios from "axios";
import {HERE_RETRIEVE_LOCATION,} from "../urls"
import { HereSuggestions,LocationResult } from "@/lib/types";
const token = process.env.NEXT_PUBLIC_HERE_TOKEN
const useRetrieveLocation = (lat:number,lng:number) => {
  const [retrievedLocation, setRetrievedLocation] = useState<HereSuggestions[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const retrieveLocation = async () => {
      try {
         const url = `${HERE_RETRIEVE_LOCATION}?at=${lat},${lng}&lang=en-US&apiKey=${token}`
                const response = await axios.get(url)
                const data:LocationResult = await response.data;
                // console.log("data:",data.items)
                setRetrievedLocation(data.items || []);
      } catch {
        setError("Failed to retrieve location");
        setRetrievedLocation([]);
      }
    };
    retrieveLocation();
  }, [lat,lng]);

  return {
        error,
        retrievedLocation
};
};
export default useRetrieveLocation;