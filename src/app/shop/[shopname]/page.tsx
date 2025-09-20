"use client"
import React,{use} from 'react'
import useGetShopByName from '@/hooks/useGetShopByName'
import useGetProductsByOwnerApproved from '@/hooks/useGetProductsByOwnerApproved';
import HeroCard from '@/components/HeroCards/page';
interface PageProps {
        params: Promise<{ shopname: string }>
      }
const SellerShop =  ({params}:PageProps)=> {
        const { shopname } = use(params);
        const { data: shop } = useGetShopByName(shopname);
         const { data: SameSellerProducts } = useGetProductsByOwnerApproved(shop?.shop?.owner_id??"");
    return (
    <div className='flex flex-col mt-[15%]' >
        <div className='flex' >
                <h1 className='text-3xl font-bold text-center' >
                        {shop?.shop?.shop_name??"Shop"}'s Products
                </h1>
        </div>

      <div className='grid grid-cols-2 md:grid-cols-5 p-2 gap-2 dark:bg-black '>
      {SameSellerProducts && SameSellerProducts.length > 0 ? (
        SameSellerProducts.map((product) => (
          <HeroCard key={product._id} product={product} />
        ))
      ) : (
        <div className='text-center mt-10' >
          <h1 className='text-2xl font-bold' >
            No Products Found
          </h1>
        </div>
      )}
        </div>
</div>
    );
  }
export default SellerShop