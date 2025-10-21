import { useEffect, useState } from "react";
import axios from "axios";
import {HERE_SUGGESTIONS} from "../urls"
import { HereSuggestions,LocationResult } from "@/lib/types";
const token = process.env.NEXT_PUBLIC_HERE_TOKEN

// Create axios instance with timeout
const apiClient = axios.create({
  timeout: 8000, // 8 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

const useGetSuggestions = (searchTerm: string) => {
  const [suggestions, setSuggestions] = useState<HereSuggestions[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
        if (!searchTerm || searchTerm.length < 2) {
          setSuggestions([]);
          return;
        }
        
        setLoading(true);
        setError(null);
        
        try{
         const url = `${HERE_SUGGESTIONS}?q=${searchTerm.toLowerCase()}&apiKey=${token}`
                const response = await apiClient.get(url)
                const data:LocationResult = await response.data;
                setSuggestions(data.items || []);
}catch(error){
        console.error("Suggestions error:", error);
        setError("Failed to fetch suggestions");
          setSuggestions([]);
} finally {
        setLoading(false);
      }
    };
    fetchSuggestions();
  }, [searchTerm]);

  return {suggestions, error, loading};
};
export default useGetSuggestions;