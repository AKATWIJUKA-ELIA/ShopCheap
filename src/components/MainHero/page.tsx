import React, { useEffect, useState } from 'react';
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
import Link from 'next/link';
import useGetSponsored from '@/hooks/useGetSponsored';
import { Oval } from 'react-loader-spinner';
import { Id } from '../../../convex/_generated/dataModel';
import { Button } from '../ui/button';
import { MdAddShoppingCart } from "react-icons/md";
import { Eye } from 'lucide-react';
import useAddToCart from "@/hooks/useAddToCart"

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


const MainHero = () => {
  const carousel1 = Autoplay({ delay: 9000 });
  const carousel = Autoplay({ delay: 10000 });
  const [products, setproducts] = useState<Product[]>([]);
  const HandleAddToCart = useAddToCart();
  const { sponsored: sponsored } = useGetSponsored();

  const images = [
                {
                name:"Heror",
                src:"https://cheery-cod-687.convex.cloud/api/storage/115cc2cd-79c0-4b3c-bb84-86df5f76e138",
                overlay:"Very Hot  Sales Here 🔥🔥🔥 "
                },
                {
                        name:"Hero1",
                        src:"https://cheery-cod-687.convex.cloud/api/storage/55199998-af85-4493-af98-d8c3aff3d8dd",
                        overlay:"Grab Crazy Discounts While Offers Last😁🤗"
                },
                
        ]
                        
useEffect(() => {
  if (sponsored && sponsored.length > 0) {
    setproducts(sponsored.filter((item): item is Product => item !== null && item.product_sponsorship?.type==="platinum" && item.product_sponsorship?.status==="active"));
  }
}, [sponsored]);
        
  return (
        <div className= ' bg-pin k-200 flex  mt-36 h-[300px]  md:h-[550px]'  >

        <Carousel opts={{ align: "start", loop: true }} plugins={[carousel1]} className="grid grid-cols-1 w-full h-full ">
    <CarouselContent className='h-full w-full '>
      {products && products.length > 0 ? (
        products.map((product, index) => (
          <CarouselItem key={index} className="h-full w-full ">
            <div className="h-full w-full bg-purple-500/10 "
            style={{ backgroundImage: `url("${product.product_image[0] ?? ""}")`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backdropFilter: 'blur(10px)'
                }}
            >
              <Card className="h-full w-full bg-transparent shadow-2xl ">
                <CardContent className=" relative flex items-center justify-center  h-full bg-black  bg-opacity-60  overflow-hidden  w-full"               >
                  {/* <Image
                    src={product.product_image[0] ?? ""}
                    alt={product.product_name}
                    fill
                    className='object-cover w-full h-full'
                  /> */}
                 <div className="flex left-0 md:left-16   absolute top-10 bottom-0  w-[65%] h-[50%]">
                    
                    <div className="absolute top-32 left-1 md:left-16 text-2xl md:text-7xl flex items-center justify-center text-gold  font-semibold">
                      <Link href={`/category/${product.product_cartegory}`} className='flex flex-col gap-2' >
                        <span className='font-bold'>{product.product_cartegory}</span>
                         <div className='flex flex-col md:flex-row ' >
                                <span className="text-3xl text-white md:text-5xl font-bold">Ugx: {(parseFloat(product.product_price) || 0).toLocaleString()}</span>
          <span className="text-3xl font-semi-bold text-red-300 line-through italic">Ugx: { (parseFloat(product.product_price)*3).toLocaleString()}</span>
                         </div>
                      </Link>
                    </div>
                  </div>
                  <div className=" group mid:hidden md:flex h-[60%]  w-[50%] md:w-[30%] md:h-full absolute top-10  md:top-0 md:bottom-0 right-2  md:right-24 shadow-lg border-8 rotate-6 md:opacity-50 hover:opacity-100 hover:-rotate-2 transition duration-1000 border-white bg-blue-400">
                    <Image
                      src={product.product_image[0] ?? ""}
                      alt={product.product_name}
                      fill
                      className='object-cover w-80  md:h-80 border-8 border-white hover:scale-105 transition-transform duration-1000 ease-in-out'
                    />
                    <div className=" hidden absolute flex-col inset-0 opacity-40  group-hover:opacity-100 transition-all duration-400 translate-y-2 group-hover:translate-y-0   bg-black/40 md:flex items-center justify-center text-white text-2xl font-semibold">
                      {/* Shs: {product.product_price} /= */}
                      <span className="text-4xl md:text-5xl font-bold">Ugx: {(parseFloat(product.product_price) || 0).toLocaleString()}</span>
          <span className="text-3xl font-semi-bold text-gray-500 line-through italic">Ugx: { parseFloat(product.product_price)*3}</span>
                    </div>
                    <div className="absolute md:opacity-40 group-hover:opacity-100 transition-all duration-300  translate-y-2 group-hover:translate-y-0 bottom-2 md:bottom-24 md:left-28 gap-12  flex items-center justify-center text-white text-2xl font-semibold">
                      <Button className="bg-blue-600 hover:bg-blue-800 rounded-full md:p-6 text-white">
                        <Link href={`/product/${product._id}`} className='flex gap-2' > <Eye/> View Product</Link>
                      </Button>

                      <Button className="bg-gold hidden md:flex hover:bg-yellow-600 rounded-full p-6 text-white"
                      onClick={() => HandleAddToCart({_id:product._id as Id<"products">})}
                      >
                        <div  className='flex gap-2' > <MdAddShoppingCart/> Add to Cart</div>
                      </Button>

                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))
      ) : (
        images.map((image, index) => (
          <CarouselItem key={index} className="h-full w-full">
            <div className="h-full w-full">
              <Card className="h-full w-full">
                <CardContent className="relative flex items-center justify-center h-full overflow-hidden w-full">
                  <Image
                    src={image.src}
                    alt={image.name}
                    fill
                    className='object-cover w-full h-full'
                  />

                        <div className="absolute left-14 inset-0 bg-black/40 flex items-center justify-center text-white text-2xl md:text-7xl font-semibold">
                        {image.overlay} 
                        </div>
                  <div className="hidden group md:flex absolute top-0 bottom-0 shadow-lg border-8 rotate-6 opacity-50 hover:opacity-100 hover:-rotate-2 transition duration-1000 border-white right-24 bg-blue-400 w-[30%] h-full">
                    
                    <Image
                      src={image.src}
                      alt={image.name}
                      height={100}
                      width={450}
                      className='object-cover w-full h-full'
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))
      )}
    </CarouselContent>
  </Carousel>

        {products && products.length > 0 ? (
                <Carousel opts={{align: "start",loop: true}} plugins={[carousel]} className=" hidden  absolute w-[60%] md:w-[65%] md:left-5   mt-80  md:flex items-center justify-center bg-black/40 text-white text-xl font-semibold md:p-2">
        <CarouselContent className=''>
  {products.map((product, index) => (
    <CarouselItem key={index} className=" basis-[200px] md:basis-[300px] shrink-0">
      <div className="p-1">
        <Card className="h-auto bg-transparent w-full">
          <CardContent className="relative  bg-transparent flex rounded-lg items-center justify-center p-6 h-36 overflow-hidden w-full">
            {/* Image */}
            <Link href={`/category/${product.product_cartegory}`} >
              <Image
                src={product.product_image[0] ?? ""}
                //       height={100}
                //       width={450}
                alt={product.product_name}
                fill
                className='object-cover w-full h-full rounded-lg '
              />

              {/* Text Overlay */}
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/40 text-white text-xl font-semibold p-4">
                {product.product_name}
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </CarouselItem>
  ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        </Carousel>
        ):(
                <Carousel opts={{align: "start",loop: true}} plugins={[carousel]} className=" hidden absolute w-[60%] md:w-[65%] md:left-16   mt-80  md:flex items-center justify-center bg-black/40 text-white text-xl font-semibold md:p-2">
        <CarouselContent className=''>
  {Array.from({ length: 7 }).map((_, idx) => (
    <CarouselItem key={idx} className=" basis-[200px] md:basis-[300px] shrink-0">
      <div className="p-1">
        <Card className="h-auto bg-transparent w-full">
          <CardContent className="relative  bg-blue-500 animate-pulse  flex rounded-lg items-center justify-center  h-36 overflow-hidden w-full">
              <div className="flex  opacity-95 w-[100%] h-[100%] items-center justify-center">
                        <div className="flex"><h1 className='text-sm md:text-2xl text-dark  '>Sh</h1></div>
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
                                        <div className="flex text-sm md:text-2xl text-dark  ">p<span className="text-gold">Cheap</span>.  .  .</div>
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
        )}
 
        </div>
  )
}

export default MainHero