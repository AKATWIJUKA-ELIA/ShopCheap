import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import Image from 'next/image';
import {useData} from '../../app/DataContext'
import { Oval } from 'react-loader-spinner';


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
         _id: string;
       }
const FisrtHero =  () => {
        const { data} = useData();
        const carousel = Autoplay({ delay: 10000})
                const [products, setproducts] = useState<Product[]>([]);
                        
                        useEffect(() => {
                            if (data.Products.product.length>0) {
                                setproducts(data.Products.product.slice(0, 12));
                            }
                        }, [data.Products.product]);

  return (
        <div className=' flex flex-col   gap-10  mb-10 shadow-lg rounded-lg bg-purple-400/10 '
        >
                <div className='flex flex-col justify-between items-center mx-auto bg-transparent  w-full '>
                <h1 className='flex font-bold text-4xl '>Shop By Category</h1>
                <h1 className='flex  font-light text-center text-gray-500 text-2xl'>Explore our carefully curated collections of premium products across all categories</h1>
                </div>
        <div className='bg-transparent backdrop-blur-md '>
        {
                products && products.length>0 ?(
                <div className='grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:p-6' >
                        {products.map((product) => (
        <div key={product._id}  className="p-1 hover:scale-105  md:h-auto  transition-transform hover:rotate-3 border-2 hover:border-green-400 duration-500 ease-in-out rounded-lg " >
                <Card   className="  md:h-auto ">
                <Link href={`/category/${product.product_cartegory}`} className='w-full' >
                <CardContent className="relative mx-auto  bg-transparent flex items-center justify-center p-6 h-28  w-full md:h-64 overflow-hidden rounded-lg ">
                {/* Image */}
                <Image
                src={product.product_image[0] ?? "/placeholder.png"}
                //       height={100}
                //       width={450}
                alt={product.product_name}
                fill
                className='object-cover w-full h-full '
                />

                {/* Text Overlay */}
                <div className="group absolute top-0 left-0 w-full h-full flex flex-col text-center items-center justify-center bg-black/50 hover:bg-black/40 transition duration-150 text-white md:text-xl font-semibold p-4">
                <h1 className='flex text-gray-200' >{product.product_cartegory}</h1>

                <div className=" hidden md:flex mt-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <span className="inline-flex items-center text-white font-semibold">
                      Explore Collection
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>

                

       
                </CardContent>
                </Link>
                </Card>
        </div>
        
        ))}
                </div>
                ):(
                        <Carousel opts={{align: "start",loop: true,}} plugins={[carousel]} className="  w-full">
                <CarouselContent className=''>
        {Array.from({ length: 7 }).map((_, idx) => (
        <CarouselItem key={idx} className=" basis-[300px] shrink-0">
                <div className="p-1">
                <Card className="h-auto bg-transparent w-full">
                <CardContent className="relative  bg-gray-500 animate-pulse  flex rounded-lg items-center justify-center  h-36 overflow-hidden w-full">
                        <div className="flex  opacity-95 w-[100%] h-[100%] items-center justify-center">
                                <div className="flex"><h1 className='text-2xl text-dark  '>Sh</h1></div>
                                <div className="flex">
                                        <Oval
                                                visible={true}
                                                height="30"
                                                width="30"
                                                color="#0000FF"
                                                secondaryColor="#FFD700"
                                                ariaLabel="oval-loading"
                                                />
                                </div>
                                                <div className="flex text-2xl text-dark  ">p<span className="text-gold">Cheap</span>.  .  .</div>
                                        </div>
                </CardContent>
                </Card>
                </div>
                </CarouselItem>
        ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
        </Carousel>
                )
        }


        </div>
        </div>
  )
}

export default FisrtHero