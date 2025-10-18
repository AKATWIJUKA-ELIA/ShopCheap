"use client"
import React, { use } from "react";
import useGetShopByName from "@/hooks/useGetShopByName";
import Shop from "@/components/Shop/page";
import { useEffect, useState } from "react";
interface PageProps {
  params: Promise<{ shopname: string }>
}
import { ShopData } from "@/lib/types";
import { Metadata } from 'next';

const SellerShop = ({ params }: PageProps) => {
  const { shopname } = use(params);
  const { data: shop } = useGetShopByName(shopname);
  console.log("shop data in page.tsx: ", shop?.shop);
        const [shopData, setShopData] = useState<ShopData|null>(null);

  useEffect(() => {
        if(shop?.shop) {
               setShopData(shop.shop); 
                 const generateMetadata = async (): Promise<Metadata> => {
                        return {
                                title: shopData?.shop_name,
                                description: shopData?.description || "Shop on ShopCheapUG!",
                                openGraph: {
                                title: shopData?.shop_name,
                                description: shopData?.description || "Shop on ShopCheapUG!",
                                images: [shopData?.cover_image || '/default-og-image.jpg'],
                                url: `https://shopcheapug.com/shops/${shopData?.shop_name}`,
                                type: "website"
                                }
                                // Optionally: twitter, etc.
                                }
                        };
generateMetadata();
        }
  },[shop]);


  return (
    <div className="flex flex-col">
      {shopData && <Shop shop={shopData} />}
    </div>
  );
};

export default SellerShop;
