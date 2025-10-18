"use client"
import React from "react";
import Shop from "@/components/Shop/page";
import { ShopData } from "@/lib/types";
import { useShop } from "./shopContext";

const IndividualShop = () => {
        const { state } = useShop();

//   console.log("shop data in page.tsx: ", state);
        // const [shopData, setshopData] = useState<ShopData|null>(null);

//   useEffect(() => {
//         if(state) {
//                setshopData(state); 
//         }
//   },[state]);


  return (
    <div className="flex flex-col">
      {state && <Shop shop={state as ShopData } />}
    </div>
  );
};
export default IndividualShop;