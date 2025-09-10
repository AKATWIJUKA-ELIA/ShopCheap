import { useEffect, useState } from "react";
import axios from "axios";
import {MAP_BOX_SEARCH} from "../urls"
import { HereSuggestions, LocationResult } from "@/lib/types";
const token = process.env.NEXT_PUBLIC_MAP_API_TOKEN
const useRetrieveLocation = (placeId: string,sessionToken:string) => {
  const [retrievedLocation, setRetrievedLocation] = useState<HereSuggestions[]>([]);

  useEffect(() => {
    const retrieveLocation = async () => {
      if (placeId) {
         const url = `${MAP_BOX_SEARCH}/${placeId}?session_token=${sessionToken}&access_token=${token}`
                const response = await axios.get(url)
                const data = await response.data;
                setRetrievedLocation(data.suggestions || []);
      } else {
        setRetrievedLocation([]);
      }
    };
    retrieveLocation();
  }, [placeId]);

  return retrievedLocation;
};
export default useRetrieveLocation;