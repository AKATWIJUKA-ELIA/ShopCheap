import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,

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
import HeroCard from '../HeroCards/page';
type Producst = {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  image?: string; // optional; we’ll show a gradient placeholder if missing
  badge?: string;
};

// const FEATURED: Producst[] = [
//   { id: "1", name: "Silver Chain", price: 50000, oldPrice: 150000, badge: "🔥 67% off" },
//   { id: "2", name: "Classic Watch", price: 120000, oldPrice: 180000, badge: "⭐ Best Seller" },
//   { id: "3", name: "Leather Strap", price: 35000, oldPrice: 50000 },
//   { id: "4", name: "Pendant Set", price: 90000, oldPrice: 120000, badge: "New" },
// ];

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, target.getTime() - now.getTime());
  const s = Math.floor(diff / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return { d, h, m, s: sec, done: diff === 0 };
}
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
  const { d, h, m, s, done } = useCountdown(saleEnd);
  const carousel1 = Autoplay({ delay: 6000 });
  const [products, setproducts] = useState<Product[]>([]);
  const HandleAddToCart = useAddToCart();
  const { sponsored: sponsored } = useGetSponsored();

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
    setproducts(sponsored.filter((item): item is Product => item !== null && item.product_sponsorship?.type==="platinum" && item.product_sponsorship?.status==="active"));
  }
}, [sponsored]);
        
  return (
        <div className= ' bg-pin k-200 flex  mt-36 h-[300px]  md:h-[550px]'  >

       <div className=' w-full p-2 h-full gap-2 bg-white  flex items-center justify-center  '>
        <Carousel opts={{ align: "start", loop: true }} plugins={[carousel1]} className="grid grid-cols-1 w-[65%] h-full ">
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
                                
                                <div className="absolute top-32 left-1 md:left-16 text-2xl md:text-7xl flex items-center justify-center text-gold  font-semibold">
                                <Link href={`/category/${product.product_cartegory}`} className='flex flex-col gap-2' >
                                        <span className='font-bold'>{product.product_cartegory}</span>
                                        <div className='flex flex-col md:flex-row ' >
                                                <span className="text-3xl text-white md:text-5xl font-bold">Ugx: {(parseFloat(product.product_price) || 0).toLocaleString()}</span>
                        <span className="text-3xl font-semi-bold text-red-300 line-through italic">Ugx: { (parseFloat(product.product_price)*3).toLocaleString()}</span>
                                        </div>
                                </Link>
                                </div>
                                 <div className="absolute md:opacity-70 group-hover:opacity-100 
                                 transition-all duration-300  mt-4 -bottom-32
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
         <div className="h-full w-[35%] bg-gradient-to-br from-gold to-black text-white  p-4 md:p-6 flex flex-col">
      {/* Header + timer */}
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">
          Featured Products
        </h2>

        <div className="shrink-0">
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
        </div>
      </div>

      {/* Scrollable featured list */}
      <div className="mt-4 md:mt-6 space-y-3 overflow-y-auto pr-1">
        {/* Horizontal carousel on small screens; grid on md+ */}
        <div className="flex md:grid md:grid-cols-1 xl:grid-cols-2 gap-3 overflow-x-auto snap-x snap-mandatory pb-1">
          {products.map((p) => (
            <HeroCard key={p._id} product={p} />
          ))}
        </div>
      </div>

      {/* Footer link */}
      <div className="mt-auto pt-3 md:pt-4 text-right">
        <a
          href="/collections/featured"
          className="inline-block text-sm md:text-base underline decoration-white/60 underline-offset-4 hover:opacity-90"
        >
          See all deals →
        </a>
      </div>
    </div>
       </div>
 
        </div>
  )
}

export default MainHero