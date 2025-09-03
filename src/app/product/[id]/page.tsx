"use client"
import React, { use, useEffect } from 'react'
import ProductCard from '@/components/ProductCard/page';
import { Oval } from 'react-loader-spinner'
import useGetProductById from '@/hooks/useGetProductById';
import useGetProductsByOwnerApproved from '@/hooks/useGetProductsByOwnerApproved';
import useGetRelatedProducts from '@/hooks/useGetRelated';
import HeroCard from '@/components/HeroCards/page';
import { CardContent } from "@/components/ui/card"
import ProductReviews from '@/components/ProductReviews/page';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import useRecordInteraction from '@/hooks/useRecordInteraction';
import ProductsNotFound from '@/components/NoProductsFound/page';

interface PageProps {
        params: Promise<{ id: string }>
      }

const Product = ({params}:PageProps) => {
        const { record } = useRecordInteraction();
        const { id } = use(params); 
        const { data: product } = useGetProductById(id); 
        const { data: relatedProducts } = useGetRelatedProducts(product?.product_cartegory??"");
        const { data: SameSellerProducts } = useGetProductsByOwnerApproved(product?.product_owner_id??"");
        const carousel = Autoplay({ delay: 10000})
        
        // Record the interaction when the product is loaded
        useEffect(()=>{
                if (product) {
                        record(product._id, "view");
                }
        }, [product?._id])

  if (!product) {
    return  <ProductsNotFound />
  }

  return (
<div className='mt-32'>
        <ProductCard product={product} />
        <ProductReviews product={product} />
        <div className='md:ml-10 '>
                <div className='ml-10 font-bold text-2xl'>
                        <h2>Related Products</h2>
                </div>
                <div className='grid grid-cols-1 '>
                        <Carousel opts={{align: "start",loop: true,}} plugins={[carousel]} className="  w-full">
                                <CarouselContent className=''>
                                        {relatedProducts? (relatedProducts.map((product, index) => (
                                        <CarouselItem key={index} className='basis-[300px] md:basis-[250px] shrink-0'>
                                                <CardContent className="relative  bg-transparent flex items-center justify-center  h-96 overflow-hidden rounded-lg">
                                                {/* Image */}
                                                <HeroCard key={product._id} product={product} />
                                                </CardContent>
                                        </CarouselItem>
                                        ))):(
                                                <Oval
                                                visible={true}
                                                        height="40"
                                                        width="40"
                                                        color="#0000FF"
                                                        secondaryColor="#ddd"
                                                        ariaLabel="oval-loading"
                                                        wrapperClass=""
                                                />
                                        )}
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                        </Carousel>
                </div>
        </div>
        
        <div>
        <div className='ml-10 font-bold text-2xl'>
                        <h2> More From the same Seller</h2>
                </div>
        <div className='grid grid-cols-1 '>
                        <Carousel opts={{align: "start",loop: true,}} plugins={[carousel]} className="  w-full">
                                <CarouselContent className=''>
                                        {SameSellerProducts? (SameSellerProducts.map((product, index) => (
                                        <CarouselItem key={index} className='basis-[300px] md:basis-[250px] shrink-0'>
                                                <CardContent className="relative  bg-transparent flex items-center justify-center  h-96 overflow-hidden rounded-lg">
                                                <HeroCard key={product._id} product={product} />
                                                </CardContent>
                                        </CarouselItem>
                                        ))):(
                                                <Oval
                                                visible={true}
                                                        height="40"
                                                        width="40"
                                                        color="#0000FF"
                                                        secondaryColor="#ddd"
                                                        ariaLabel="oval-loading"
                                                        wrapperClass=""
                                                />
                                        )}
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                        </Carousel>
                </div>                      
        </div>
</div>
  )
}

export default Product