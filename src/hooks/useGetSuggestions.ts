import { useEffect, useState } from "react";
import axios from "axios";
import {HERE_SUGGESTIONS} from "../urls"
import { HereSuggestions,LocationResult } from "@/lib/types";
const token = process.env.NEXT_PUBLIC_HERE_TOKEN
const useGetSuggestions = (searchTerm: string) => {
  const [suggestions, setSuggestions] = useState<HereSuggestions[]>([]);
   const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
        try{
      if (searchTerm) {

         const url = `${HERE_SUGGESTIONS}?q=${searchTerm.toLowerCase()}&apiKey=${token}`
                // if (latitude || longitude) {
                //         url += `&proximity=${longitude},${latitude}`;
                //     }
                const response = await axios.get(url)
                const data:LocationResult = await response.data;
                setSuggestions(data.items || []);
      } else {
        setSuggestions([]);
      }
}catch{
        setError("Failed to fetch suggestions");
          setSuggestions([]);
}
    };
    fetchSuggestions();
  }, [searchTerm]);

  return {suggestions,error};
};
export default useGetSuggestions;