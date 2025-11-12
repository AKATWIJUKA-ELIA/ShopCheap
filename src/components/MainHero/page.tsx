import React, { useEffect, useMemo, useState } from 'react';
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
import Recommended from "../Recommended/page"
import { useData } from '@/app/DataContext';
// import HeroCardImage from '../HeroCards/HeroImagaOnly';
import MobileHero from './MobileHero';
import { useWindowResize } from '@/hooks/useWindowResize';

// type Producst = {
//   id: string;
//   name: string;
//   price: number;
//   oldPrice?: number;
//   image?: string; // optional; we’ll show a gradient placeholder if missing
//   badge?: string;
// };

// const FEATURED: Producst[] = [
//   { id: "1", name: "Silver Chain", price: 50000, oldPrice: 150000, badge: "🔥 67% off" },
//   { id: "2", name: "Classic Watch", price: 120000, oldPrice: 180000, badge: "⭐ Best Seller" },
//   { id: "3", name: "Leather Strap", price: 35000, oldPrice: 50000 },
//   { id: "4", name: "Pendant Set", price: 90000, oldPrice: 120000, badge: "New" },
// ];

// function useCountdown(target: Date) {
//   const [now, setNow] = useState(() => new Date());
//   useEffect(() => {
//     const t = setInterval(() => setNow(new Date()), 1000);
//     return () => clearInterval(t);
//   }, []);
//   const diff = Math.max(0, target.getTime() - now.getTime());
//   const s = Math.floor(diff / 1000);
//   const d = Math.floor(s / 86400);
//   const h = Math.floor((s % 86400) / 3600);
//   const m = Math.floor((s % 3600) / 60);
//   const sec = s % 60;
//   return { d, h, m, s: sec, done: diff === 0 };
// }
interface Product {
  approved: boolean;
  product_cartegory: string;
  product_condition: "new" | "used" | "refurbished";
  product_description: string;
  product_image: string[];
  product_name: string;
  product_owner_id: string;
  product_price: string;
  _creationTime: number;
  _id: Id<"products">;
}


const MainHero = () => {
          const saleEnd = useMemo(() => {
    const t = new Date();
    t.setHours(23, 59, 59, 999);
    return t;
  }, []);
  const { width } = useWindowResize();
//   const { d, h, m, s, done } = useCountdown(saleEnd);
  const carousel = Autoplay({ delay: 4000 });
  const carousel1 = Autoplay({ delay: 6000 });
  const [products, setproducts] = useState<Product[]>([]);
  const HandleAddToCart = useAddToCart();
  const { sponsored: sponsored } = useGetSponsored();
  const { data} = useData();

//   const images = [
//                 {
//                 name:"Heror",
//                 src:"https://cheery-cod-687.convex.cloud/api/storage/115cc2cd-79c0-4b3c-bb84-86df5f76e138",
//                 overlay:"Very Hot  Sales Here 🔥🔥🔥 "
//                 },
//                 {
//                         name:"Hero1",
//                         src:"https://cheery-cod-687.convex.cloud/api/storage/55199998-af85-4493-af98-d8c3aff3d8dd",
//                         overlay:"Grab Crazy Discounts While Offers Last😁🤗"
//                 },
                
//         ]
                        
useEffect(() => {
  if (sponsored && sponsored.length > 0) {
    setproducts(sponsored.filter((item): item is Product => item !== null && item.product_sponsorship?.type==="platinum" 
//     && item.product_sponsorship?.status==="active"
));
  }
}, [sponsored]);
 if (width < 768) {
    return <MobileHero />;
  }
        
  return (
        <div className= ' bg-pin k-500 flex  mt-36 h-[300px]  md:h-[550px]'  >

       <div className=' w-full p-2 h-full gap-2   flex  '>
       <div className=" md:hidden w-[15%]  lg:flex flex-col items-start px-2 bg-gray-300 rounded-md ">
  <h1 className="text-2xl md:text-sm lg:text-3xl font-extrabold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">
    Categories
  </h1>

   {data.Categories? (data.Categories.categories.slice(0,10).map(({_id, cartegory}) =>
                                                <div key={_id} className=" w-full cursor-pointer mr-2  p-2 slider slide--fast 
                                                hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-300 ">
                                                
                                                <Link href={`/category/${encodeURIComponent(cartegory)}`}  >
                                                <h1   className='animated md:text-sm lg:text-md '  > <span id='main' className='animated current   '>{cartegory}</span></h1> 
                                                </Link>
                                                </div>
                                        )):(<div className="vertical-line ml-2  fade-in "  > Loading . . .  </div>)}
</div>
        <div className=' flex flex-col w-[65%] h-full ' >
        <Carousel opts={{ align: "start", loop: true }} plugins={[carousel1]} className="grid grid-cols-1  w-[100%] h-[60%] ">
                <CarouselContent className='h-full w-full '>
                {products && products.length > 0 &&
                        products.map((product, index) => (
                        <CarouselItem key={index} className="h-full w-full ">
                        <div className="h-full w-full bg-purple-500/10 "
                        style={{ backgroundImage: `url("${product.product_image[0] ?? ""}")`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backdropFilter: 'blur(10px)'
                                }}
                        >
                        <Card className="h-full w-full bg-transparent shadow-2xl border-none ">
                                <CardContent className=" relative flex items-center justify-center   h-full bg-black  bg-opacity-40  overflow-hidden  w-full"               >
                                
                                <div className="flex left-0 md:left-16   absolute top-10 bottom-0  w-[65%] h-[50%]">
                                
                                <div className="absolute top-20 left-1 md:left-16 text-2xl md:text-4xl flex items-center justify-center text-gold  font-semibold">
                                <Link href={`/category/${product.product_cartegory}`} className='flex flex-col gap-2' >
                                        <span className='font-bold'>{product.product_cartegory}</span>
                                        <div className='flex flex-col md:flex-row ' >
                                                <span className="text-3xl text-white md:text-5xl font-bold">Ugx: {(parseFloat(product.product_price) || 0).toLocaleString()}</span>
                        {/* <span className="text-3xl font-semi-bold text-red-300 line-through italic">Ugx: { (parseFloat(product.product_price)*3).toLocaleString()}</span> */}
                                        </div>
                                </Link>
                                </div>
                                 <div className="absolute md:opacity-70 group-hover:opacity-100 
                                 transition-all duration-300  mt-4 -bottom-20
                                  md:left-28 gap-12  flex items-center justify-center text-white text-2xl font-semibold">
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
                                <div className=" group mid:hidden md:flex h-[40%]  w-[50%] md:w-[30%] md:h-[70%] absolute top-10  md:top-10 md:bottom-0 right-2  md:right-24 shadow-lg border-8 rotate-6 md:opacity-50 hover:opacity-100 hover:-rotate-2 transition duration-1000 border-white bg-blue-400">
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
                               
                                </div>
                                </CardContent>
                        </Card>
                        </div>
                        </CarouselItem>
                        ))
                }
                </CarouselContent>
        </Carousel>
        <div className=' grid grid-cols-1 gap-3 p-2 w-[100%] h-[40%]  bg-blue-600' >
                 {products && products.length > 0 ? (
                <Carousel opts={{align: "start",loop: true}} plugins={[carousel]} className=" hidden    md:flex items-center justify-center bg-black/20 text-white text-xl font-semibold md:p-2">
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
                {/* {products.slice(0,3).map((product) => (
                        <div  key={product._id} className=' flex items-center justify-center w-full h-full'>
                <HeroCardImage product={product} />
                </div>
                ))} */}
        </div>
        </div>

         <div className=" h-full md:w-[30%] lg:w-[20%] bg-green-600 text-white  p-4 md:p-6 flex flex-col">
      {/* Header + timer */}
      <div className="flex flex-col items-start justify-between gap-3">
        <h2 className="text-xl md:text-xl font-extrabold tracking-tight">
          You may also like
        </h2>

        {/* <div className="shrink-0">
          <div className="text-[10px] md:text-xs uppercase opacity-90">Flash Sale ends in</div>
          <div className="flex items-center gap-1 md:gap-2 font-mono">
            {[
              { v: d, label: "D" },
              { v: h, label: "H" },
              { v: m, label: "M" },
              { v: s, label: "S" },
            ].map((t) => (
              <div
                key={t.label}
                className="bg-white/15 backdrop-blur px-1.5 md:px-2 py-0.5 md:py-1 rounded md:rounded-md text-xs md:text-sm font-semibold"
              >
                {String(t.v).padStart(2, "0")}
                <span className="ml-1 text-[9px] md:text-[10px] opacity-80">{t.label}</span>
              </div>
            ))}
          </div>
          {done && <div className="text-[10px] md:text-xs mt-1">Sale ended</div>}
        </div> */}
      </div>

      {/* Scrollable featured list */}
      <div className="mt-4 md:mt-6 space-y-3 overflow-y-auto ">
        {/* Horizontal carousel on small screens; grid on md+ */}
        <div className="flex md:grid md:grid-cols-1 xl:grid-cols-1 gap-3 overflow-x-auto snap-x snap-mandatory pb-1">
          <Recommended type='view'/>
        </div>
      </div>

      {/* Footer link */}
      {/* <div className="mt-auto pt-3 md:pt-4 text-right">
        <a
          href="/collections/featured"
          className="inline-block text-sm md:text-base underline decoration-white/60 underline-offset-4 hover:opacity-90"
        >
          See all deals →
        </a>
      </div> */}
    </div>
       </div>
 
        </div>
  )
}

export default MainHero