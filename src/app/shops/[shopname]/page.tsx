import React  from "react";
import IndividualShop from "./Shop";
import { Metadata } from 'next';
// import useGetShopByName from "@/hooks/useGetShopByName";
import {getShopByName} from "@/lib/convex"
import { ShopProvider } from "./shopContext";
import { ShopData } from "@/lib/types";

interface PageProps {
  params: Promise<{ shopname: string }>
}

 export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
const { shopname } = await(params);
  const shop = await getShopByName(shopname);
                        return {
                                title: shop?.shop?.shop_name,
                                description: shop?.shop?.description || "Shop on ShopCheapUG!",
                                openGraph: {
                                title: shop?.shop?.shop_name,
                                description: shop?.shop?.description || "Shop on ShopCheapUG!",
                                images: [shop?.shop?.cover_image || '/default-og-image.jpg'],
                                url: `https://shopcheapug.com/shops/${shop?.shop?.shop_name}`,
                                type: "website"
                                }
                                }
                        };

const SellerShop = async ({ params }: PageProps) => {
  const { shopname } = await(params);
//   const { data: shop } = useGetShopByName(shopname);
  const shopData = await getShopByName(shopname);

  return (
         <ShopProvider shop={shopData.shop as ShopData}>
      <IndividualShop />
    </ShopProvider>
//     <div className="flex flex-col">
//       {shopname && <IndividualShop shopName={shopname} />}
//     </div>
  );
};

export default SellerShop;
