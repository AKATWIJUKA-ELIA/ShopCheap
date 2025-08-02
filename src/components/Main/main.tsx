'use client'
import React, { useState, useEffect } from 'react'
import HeroCard from '../HeroCards/page'
import { useData } from '@/app/DataContext'
import ProductSkeleton from '../ProductsSkeleton/page';
import { Id } from '../../../convex/_generated/dataModel';
import useGetSponsored from '@/hooks/useGetSponsored';

interface Product {
  approved: boolean;
  product_cartegory: string;
  product_condition: string;
  product_description: string;
  product_image: string[];
  product_name: string;
  product_owner_id: string;
  product_price: string;
  _creationTime: number;
  _id: Id<"products">;
}


const Main =  () => {
        const {data} = useData()
          const { sponsored: sponsored } = useGetSponsored();
  const [products, setProducts] = useState<Product[]>([])
          const [Sponsored, setSponsored] = useState<Product[]>([]);

          useEffect(() => {
                            if (sponsored && sponsored.length > 0) {
                              setSponsored(sponsored.filter((item): item is Product => item !== null && item.product_sponsorship?.type==="basic" && item.product_sponsorship?.status==="active"));
                            }
                          }, [sponsored]);

useEffect(() => {
                            if (data.Products.product && data.Products.product.length>0 ) {
                                setProducts(data.Products.product);
                            }
                        }, [data.Products.product]);

  return (
 <div className='flex flex-col' >
        <div className='mx-auto' >
                <h1 className='text-3xl' >
                Explore More  Products
                </h1>
        </div>
             <div className='grid grid-cols-2 md:grid-cols-5 p-2 gap-2 dark:bg-black '>
      {Sponsored&&Sponsored.length>0?( Sponsored.map((product) => (
        <HeroCard key={product._id} product={product} />
      ))):(
        <div>
                
        </div>
      )}
    </div>
           <div className='grid grid-cols-2 md:grid-cols-5 p-2 gap-2 dark:bg-black '>
      {products&&products.length>0?( products.map((product) => (
        <HeroCard key={product._id} product={product} />
      ))):(
        Array.from({ length: 15 }).map((_, idx) => (
    <div key={idx}>
        <ProductSkeleton/>
    </div>
  ))
      )}
    </div>
 </div>
  )
}

export default Main
