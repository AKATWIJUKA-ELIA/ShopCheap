"use client"
import React, { use } from "react";
import useGetShopByName from "@/hooks/useGetShopByName";
import Shop from "@/components/Shop/page";
import { useEffect, useState } from "react";
interface PageProps {
  params: Promise<{ shopname: string }>
}
import { ShopData } from "@/lib/types";

const SellerShop = ({ params }: PageProps) => {
  const { shopname } = use(params);
  const { data: shop } = useGetShopByName(shopname);
  console.log("shop data in page.tsx: ", shop?.shop);
        const [shopData, setShopData] = useState<ShopData|null>(null);

  useEffect(() => {
        if(shop?.shop) {
               setShopData(shop.shop); 
        }
  },[shop]);


  return (
    <div className="flex flex-col">
      {shopData && <Shop shop={shopData} />}
    </div>
  );
};

export default SellerShop;
