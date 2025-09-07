import React, { useEffect, useState } from 'react';
// import Link from "next/link";
import { ArrowUpRight } from 'lucide-react';
import { Oval } from 'react-loader-spinner';
import useGetSuggestions from '@/hooks/useGetSuggestions';
// import localStorage from 'redux-persist/es/storage';

interface MapSearchModel {
  onClose: () => void;
  Focused:boolean
  searchTerm: string;
}


const MapSearchModel: React.FC<MapSearchModel> = ({ onClose,searchTerm,Focused  }) => {
        const [newSuggestions, setnewSuggestions] =useState<any[]>([]);
        const sessionToken = typeof window !== "undefined" ? window.localStorage.getItem("sessionToken") || "" : "";
        const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
        useEffect(() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition((position) => {
                    setUserLocation({
                            latitude: position.coords.latitude,
                                longitude: position.coords.longitude
                        });
                        });
                }
        }, []);
        const suggestions = useGetSuggestions(searchTerm, sessionToken, userLocation?.latitude, userLocation?.longitude);

         useEffect(() => {
                        setnewSuggestions(suggestions);
                        console.log(suggestions)
                        }, [searchTerm, suggestions]);
        if (!Focused) return null;

       
  return (
        <div className="  fade-in fixed left-[20%] z-40 inset-0 backdrop-blur-lg shadow-lg shadow-gray-400 flex rounded-3xl w-[40%] h-[50%] mt-[38%] md:mt-[12%]   overflow-auto overflow-x-hidden bg-slate-100 dark:bg-dark dark:shadow-gray-800 "  >                  
                     
        <div className=" mx-auto px-5  fade-in w-full gap-4"  > 
                        <div className='flex'>
                                <h1 className='font-bold'>
                                        Related Searches
                                </h1>
                        </div>
                <div className='flex flex-col w-full '>
                {newSuggestions && newSuggestions.length>0 ? (
                        newSuggestions.map((suggestion) => (
                                <div className="flex cursor-pointer w-full rounded-lg mr-2 p-2  slider slide--fast hover:bg-gray-200 dark:hover:bg-gray-700" onClick={onClose}
                        >
                                <h1 className=" flex  animated main">
                                <span id="main" className="animated current">
                                {suggestion.place_formatted }
                                </span>
                                </h1>
                                <ArrowUpRight className='flex  mt-2 text-2xl md:ml-[80%]'/>
                        </div>
                        ))
                        ) : (
                                <div className="flex gap-4 h-full">
                                        <Oval
                                        visible={true}
                                        height="40"
                                        width="40"
                                        color="#0000FF"
                                        secondaryColor="#FFD700"
                                        ariaLabel="oval-loading"
                                />
                                Loading . . .
                                </div>

                        )}
                </div>


                </div>
       </div>
      
  );
};

export default MapSearchModel;