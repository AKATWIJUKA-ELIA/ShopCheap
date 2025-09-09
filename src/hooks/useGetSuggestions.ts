import { useEffect, useState } from "react";
import axios from "axios";
import {HERE_SUGGESTIONS} from "../urls"
const token = process.env.NEXT_PUBLIC_HERE_TOKEN
const useGetSuggestions = (searchTerm: string,sessionToken:string,latitude?: number, longitude?: number) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm) {

         let url = `${HERE_SUGGESTIONS}?q=${searchTerm.toLowerCase()}&apiKey=${token}`
                // if (latitude || longitude) {
                //         url += `&proximity=${longitude},${latitude}`;
                //     }
                const response = await axios.get(url)
                const data = await response.data;
                setSuggestions(data.items || []);
      } else {
        setSuggestions([]);
      }
    };
    fetchSuggestions();
  }, [searchTerm]);

  return suggestions;
};
export default useGetSuggestions;