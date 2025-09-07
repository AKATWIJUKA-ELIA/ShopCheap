import { useEffect, useState } from "react";
import axios from "axios";
import {MAP_BOX_SUGGESTIONS,MAP_BOX_SEARCH} from "../urls"
const token = process.env.NEXT_PUBLIC_MAP_API_TOKEN
const useGetSuggestions = (searchTerm: string,sessionToken:string,latitude?: number, longitude?: number) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm) {
         let url = `${MAP_BOX_SUGGESTIONS}?q=${searchTerm.toLowerCase()}&access_token=${token}&session_token=${sessionToken}`
                if (latitude || longitude) {
                        url += `&proximity=${longitude},${latitude}`;
                    }
                const response = await axios.get(url)
                const data = await response.data;
                setSuggestions(data.suggestions || []);
      } else {
        setSuggestions([]);
      }
    };
    fetchSuggestions();
  }, [searchTerm]);

  return suggestions;
};
export default useGetSuggestions;