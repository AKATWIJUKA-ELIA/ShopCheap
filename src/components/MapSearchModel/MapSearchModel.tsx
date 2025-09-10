import React, { useEffect, useState } from 'react';
// import Link from "next/link";
import { ArrowUpRight } from 'lucide-react';
import { Oval } from 'react-loader-spinner';
import useGetSuggestions from '@/hooks/useGetSuggestions';
// import useRetrieveLocation from '@/hooks/useRetrieveLocation';
// import localStorage from 'redux-persist/es/storage';
import { useAppDispatch } from '@/hooks';
import { SaveLocation } from "@/store/location";
import { HereSuggestions } from '@/lib/types';


interface MapSearchModel {
  onClose: () => void;
  Focused:boolean
  searchTerm: string;
  handleLocationClick?:(position:{
        lat:number
        lng:number
  })=>void
}


const MapSearchModel: React.FC<MapSearchModel> = ({ onClose,searchTerm,Focused,handleLocationClick  }) => {
        const [newSuggestions, setnewSuggestions] =useState<HereSuggestions[]>([]);
        // const sessionToken = typeof window !== "undefined" ? window.localStorage.getItem("sessionToken") || "" : "";
        // const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
        // const [coordinates, setcoordinates] = useState<{lat:number,lng:number}>({lat:0,lng:0});
        const Dispatch = useAppDispatch();
        // useEffect(() => {
        //         if (navigator.geolocation) {
        //           navigator.geolocation.getCurrentPosition((position) => {
        //             setUserLocation({
        //                     latitude: position.coords.latitude,
        //                         longitude: position.coords.longitude
        //                 });
        //                 });
        //         }
        // }, []);
        const suggestions = useGetSuggestions(searchTerm);
        // const retrievedLocation = useRetrieveLocation(searchTerm, sessionToken);

         useEffect(() => {
                        setnewSuggestions(suggestions);
                        // console.log("suggestions: ",suggestions)
                        }, [searchTerm, suggestions]);

                        const HandleClick= (position:{lat:number,lng:number})=>{
                                Dispatch(SaveLocation({lat:position.lat,lng:position.lng}));
                                handleLocationClick && handleLocationClick(position);
                                // console.log("coordinates :",position)
                                onClose();
                        }
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
                                <div key={suggestion.id} className="relative flex cursor-pointer w-full rounded-lg mr-2 p-2  slider slide--fast hover:bg-gray-200 dark:hover:bg-gray-700" 
                                onClick={()=>HandleClick(suggestion.position)}
                        >
                                <h1 className=" flex  animated main ">
                                <span id="main" className="animated current">
                                {suggestion.title }
                                </span>
                                </h1>
                                <ArrowUpRight className='flex absolute right-6 top-0 mt-2 text-2xl '/>
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