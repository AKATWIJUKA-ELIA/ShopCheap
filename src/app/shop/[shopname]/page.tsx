"use client"
import React, { use } from "react";
import useGetShopByName from "@/hooks/useGetShopByName";
import Shop from "@/components/Shop/page";

interface PageProps {
  params: Promise<{ shopname: string }>
}

const SellerShop = ({ params }: PageProps) => {
  const { shopname } = use(params);
  console.log("Shopname from params:", shopname);
  const { data: shop } = useGetShopByName(shopname);


  return (
    <div className="flex flex-col">
      {shop?.shop && <Shop shop={shop.shop} />}
    </div>
  );
};

export default SellerShop;
