import mapboxgl
//  { Marker }
 from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef, useState } from 'react';

import React from 'react'
import { BiX } from 'react-icons/bi';

interface LocationPickerProps {
  isvisible: boolean;
  onClose: () => void;
  onLocationSelect : (loc: { lat: number; lng: number }) => void
}
const LocationPicker: React.FC<LocationPickerProps> = ({ isvisible, onClose,onLocationSelect  }) => {

      const mapContainerRef = useRef<HTMLDivElement | null>(null);
        const mapRef = useRef<mapboxgl.Map | null>(null);
          const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(null);
          

  const handleClick = (event:  { lngLat: { lat: number; lng: number } }) => {
    const lat = event.lngLat.lat;
    const lng = event.lngLat.lng;
    setMarker({ lat, lng });
    onLocationSelect({ lat, lng });
  };

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZWxpYWxpZ2h0IiwiYSI6ImNtNzIyNWg5NTA1YmcyaXIwZHRjYWc4c3oifQ.xp5_tI2e6Zr5B1NbJv4HHQ';

    if (mapContainerRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [32.6438,0.5703], // starting position [lng, lat]
        zoom: 9, // starting zoom
        
      });
    }
if (mapRef.current) {
  mapRef.current.addInteraction('my-polygon-click-interaction', {
    type: 'click',
    handler: (e) => {
        handleClick(e)
    }
  });
}
if (mapRef.current && marker) {
  // Remove any existing marker before adding a new one
  const existingMarkers = document.getElementsByClassName('custom-location-marker');
  while (existingMarkers.length > 0) {
    existingMarkers[0].parentNode?.removeChild(existingMarkers[0]);
  }
  new mapboxgl.Marker({ color: 'red' })
    .setLngLat([marker.lng, marker.lat])
    .addTo(mapRef.current)
    .getElement().classList.add('custom-location-marker');
}
  }, []);
  if (!isvisible) return null;
  return (
        <div  className="  fade-in  fixed z-40 inset-0 backdrop-blur-lg shadow-lg flex rounded-xl mx-auto  w-[70%]  h-[70%]  mt-[42%] md:mt-[7%]   overflow-auto overflow-x-hidden bg-white dark:bg-dark " id="wrapper" >
                  <button className='  z-50  border border-gray-200 shadow shadow-black/30 flex absolute bg-white top-10 right-10 w-30 h-30 rounded-full p-1  '
                                                       onClick={onClose}>
                                                       <span className="text-black text-xl"><BiX className='text-3xl'/></span>
                                                 </button>
                <div className=''  ref={mapContainerRef} style={{ width: '100%', height: '100%',padding:"10px" }}>Select Your Location </div>
        </div>
    
  )
}

export default LocationPicker