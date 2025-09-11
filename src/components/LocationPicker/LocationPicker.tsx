import mapboxgl
//  { Marker }
 from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef, useState } from 'react';

import React from 'react'
import { BiCurrentLocation,BiX } from 'react-icons/bi';
import { Input } from '../ui/input';
import MapSearchModel from '../MapSearchModel/MapSearchModel';

interface LocationPickerProps {
  isvisible: boolean;
  onClose: () => void;
  onLocationSelect : (loc: { lat: number; lng: number }) => void;
}
const LocationPicker: React.FC<LocationPickerProps> = ({ isvisible, onClose,onLocationSelect  }) => {

      const mapContainerRef = useRef<HTMLDivElement | null>(null);
        const mapRef = useRef<mapboxgl.Map | null>(null);
        const markerRef = useRef<mapboxgl.Marker | null>(null);
          const [searchTerm, setSearchTerm] = useState('');
          const [focused, setFocused] = useState(false);
          const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
        //   console.log("location from redux:",location)
  const forceBlur = () => {
                document.getElementById("inputsearch")?.blur();
              };
          const HandleClose =()=>{
                setSearchTerm("")
                setFocused(false)
                forceBlur()
        }
        //         const HandleReset =()=>{
        //         if (mapRef.current) {
        //                 mapRef.current.flyTo({
        //                         center: [18.5,5], 
        //                         zoom: 3.0,
        //                         essential: true 
        //                     });
        //               }
        // }

        useEffect(() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition((position) => {
                    setUserLocation({
                            lat: position.coords.latitude,
                                lng: position.coords.longitude
                        });
                        });
                }
        }, []);

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAP_API_TOKEN || '';    

    if (mapContainerRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [32.6438,0.5703], // starting position [lng, lat]
        zoom: 12, // starting zoom 
        projection: { name: "mercator" },
        
      });

          //event listener for clicks
  mapRef.current.on("click", (e) => {
    const { lng, lat } = e.lngLat;
        onLocationSelect({ lat, lng });
//     console.log("Clicked coordinates:", lng, lat);

    // Optional: drop a marker at the clicked location
    if (!markerRef.current){
           markerRef.current = new mapboxgl.Marker({ color: "blue" })
      .setLngLat([lng, lat])
      .addTo(mapRef.current!);
    }else{
          markerRef.current.setLngLat([lng, lat]);
    }

  }
);

    }

  }, []);

          const handleUserClick=(data:{lat:number,lng:number})=>{
                if (mapRef.current) {
                        mapRef.current.flyTo({
                                center: [data.lng,data.lat], 
                                zoom: 14.0,
                                essential: true,
                                
                            });
                            if (!markerRef.current) {
    // Create marker if it doesn't exist
    markerRef.current = new mapboxgl.Marker({ color: "red" })
      .setLngLat([data.lng, data.lat])
      .addTo(mapRef.current);
  } else {
    // Just update its position
    markerRef.current.setLngLat([data.lng, data.lat]);
  }
                      }
        }
  if (!isvisible) return null;
  return (
        <>
        <div  className="  fade-in  fixed z-40 inset-0 backdrop-blur-lg shadow-lg flex rounded-xl mx-auto w-[95%] md:w-[85%] h-[50%]   mt-[42%] md:mt-[17%] lg:mt-[12%] lg:h-[70%] lg:w-[50%]   overflow-auto overflow-x-hidden bg-white dark:bg-dark " id="wrapper" >
                  
                  <div className=' flex absolute z-50 left-[10%]  w-[50%] p-auto mt-5 mx-auto '>
                                <Input value={searchTerm}
                                id='inputsearch'
                                onChange={(e) => setSearchTerm(e.target.value)}
                                 onFocus={()=>{setFocused(true)}}
                                 type="text"
                                  className=' flex p-5 h-10 rounded-full border   border-gray-500 w-[100%] bg-white dark:bg-black dark:text-white ' 
                                  placeholder='Search location'  />
                                  { searchTerm.length>1 && (<BiX onClick={HandleClose} className="absolute hover:cursor-pointer border top-[16%] right-[10%]  bg-gray-100 text-dark text-3xl   rounded-lg"/>)}
                        </div>
                        
                        <button className='  z-50  border border-gray-200 shadow shadow-black/30 flex absolute bg-white top-5 right-10 w-30 h-30 rounded-full p-1  '
                                                       onClick={onClose}>
                                                       <span className="text-black text-xl"><BiX className='text-3xl'/></span>
                        </button>
                        <button className='  z-50  border border-gray-200 shadow shadow-black/30 flex absolute bg-white top-5 right-10 w-30 h-30 rounded-full p-1  '
                                                       onClick={onClose} title='Reset'>
                                                       <span className="text-black text-xl"><BiX className='text-3xl'/></span>
                        </button>

                        <button className='  z-50  border border-gray-200 shadow shadow-black/30 flex absolute bg-white bottom-16 right-10 w-30 h-30 rounded-full p-1  '
                                                       onClick={() => userLocation && handleUserClick(userLocation)} title='Go to My Location'>
                                                       <span className="text-black text-xl"><BiCurrentLocation className='text-3xl'/></span>
                        </button>
                <div className=''  ref={mapContainerRef} style={{ width: '100%', height: '100%',padding:"10px" }}> </div>
        </div>
        {  searchTerm.length>1 ? (<MapSearchModel Focused={focused}searchTerm={searchTerm} onClose={HandleClose} handleLocationClick={(newLocation)=>handleUserClick(newLocation)} />):("")}
        </>
    
  )
}

export default LocationPicker