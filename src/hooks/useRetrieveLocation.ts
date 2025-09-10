import { useEffect, useState } from "react";
import axios from "axios";
import {MAP_BOX_SEARCH} from "../urls"
const token = process.env.NEXT_PUBLIC_MAP_API_TOKEN
const useRetrieveLocation = (placeId: string,sessionToken:string) => {
  const [retrievedLocation, setRetrievedLocation] = useState<any[]>([]);

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