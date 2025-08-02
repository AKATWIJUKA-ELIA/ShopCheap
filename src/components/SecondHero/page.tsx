import React, { useEffect, useState } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import '../../../public/styles/styles.css'
import HeroCard from '../HeroCards/page'
import {useData} from  '../../app/DataContext';
import { Card, CardContent } from '../ui/card'
import { Oval } from 'react-loader-spinner'
import { Id } from '../../../convex/_generated/dataModel'
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
         product_likes?: number | 0;
         product_dislikes?: number | 0;
         product_comments?: { user_id: string; comment: string; _creationTime: number }[];
       }
const SecondHero = () => {
        const carousel = Autoplay({ delay: 5000}) // 3s delay, keep playing after user interaction
        const carousel1 = Autoplay({ delay: 3300})
        const carousel2 = Autoplay({ delay: 4500})
        const carousel3 = Autoplay({ delay: 6000})
        const { data } = useData();
          const { sponsored: sponsored } = useGetSponsored();
                // console.log("data is ",product)
        const [Sponsored, setSponsored] = useState<Product[]>([]);
        const [products, setproducts] = useState<Product[]>([]);
                useEffect(() => {
                        if (data.Products.product && data.Products.product.length > 0) {
                            setproducts(data.Products.product);
                        }
                        //   console.log("data is ",products)
                }, [data.Products.product]);

                useEffect(() => {
                  if (sponsored && sponsored.length > 0) {
                    setSponsored(sponsored.filter((item): item is Product => item !== null && item.product_sponsorship?.type==="premium" && item.product_sponsorship?.status==="active"));
                  }
                }, [sponsored]);

  return (

<div className='flex flex-col dark:bg-black bg-slate-600 ' >

 <div className="hidden md:flex  items-center justify-center   bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100  p-10 px-10 gap-3 dark:bg-gray-900 dark:bg-none   ">

 <div className="flex flex-col justify-center gap-8 hover:scale-105 hover:rotate-3 border border-gray-200 shadow-lg  hover:bg-white transition duration-200 ease-in-out p-20 w-[50%] max-w-6xl  dark:hover:bg-gray-800 dark:border-gray-600 ">

{/* Carousels Wrapper */}
<div className="flex flex-col gap-3 ">
    <div className='flex justify-center -mt-3 '>
        <h1 className='font-bold text-2xl  ' ><span className='text-gold'>Daily</span> Deals</h1>
    </div>
 <div className=' flex  gap-4  justify-center  w-full '>
          {/* Carousel 1 */}

  <div className="flex-1 min-w-0 flex justify-center  ">
    {products && products.length>0 ?(
        <Carousel opts={{ align: "center", loop: true }} plugins={[carousel2]} className="w-full">
      <CarouselContent>
        {products.map((product) => (
          <CarouselItem key={product._id} >
            <div className="p-1">
            <HeroCard key={product._id} product={product} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
    ):(
        <Carousel opts={{ align: "center", loop: true }} plugins={[carousel]} className="w-full">
      <CarouselContent>
        {Array.from({ length: 7 }).map((_, idx) => (
    <CarouselItem key={idx} className=" basis-[200px] md:basis-[300px] shrink-0">
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
    )}
  </div>

        {/* Carousel 4 */}
 <div className="flex-1 min-w-0 flex justify-center  ">
    {products && products.length>0 ?(
        <Carousel opts={{ align: "center", loop: true }} plugins={[carousel]} className="w-full">
      <CarouselContent>
        {products.map((product) => (
          <CarouselItem key={product._id} >
            <div className="p-1">
            <HeroCard key={product._id} product={product} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
    ):(
        <Carousel opts={{ align: "center", loop: true }} plugins={[carousel1]} className="w-full">
      <CarouselContent>
        {Array.from({ length: 7 }).map((_, idx) => (
    <CarouselItem key={idx} className=" basis-[200px] md:basis-[300px] shrink-0">
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
    )}
  </div>
 </div>

</div>
</div>

<div className="flex flex-col justify-center gap-8 hover:scale-105 hover:-rotate-3 border border-gray-100 shadow-lg  hover:bg-white transition duration-200 ease-in-out p-20  w-[50%] max-w-6xl  dark:hover:bg-gray-800 dark:border-gray-600 ">

{/* Carousels Wrapper */}
<div className="flex flex-col gap-3">

<div className='flex justify-center -mt-3 '>
        <h1 className='font-bold text-2xl  ' >Premium <span className='text-gold'>Sellers</span></h1>
    </div>

<div className='flex gap-4  justify-center  w-full'>
          {/* Carousel 1 */}
  <div className="flex-1 min-w-0 flex justify-center  ">
    {(()=>{
        if(Sponsored && Sponsored.length>0) {
                return(
                        <Carousel opts={{ align: "center", loop: true }} plugins={[carousel3]} className="w-full">
      <CarouselContent>
        {Sponsored.map((product) => (
          <CarouselItem key={product._id} >
            <div className="p-1">
            <HeroCard key={product._id} product={product} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
                );
        
    } else if (!Sponsored ||  Sponsored.length<=0){
        return(
                 <Carousel opts={{ align: "center", loop: true }} plugins={[carousel3]} className="w-full">
      <CarouselContent>
        {products.map((product) => (
          <CarouselItem key={product._id} >
            <div className="p-1">
            <HeroCard key={product._id} product={product} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
        );
    } else {
        return(
                <Carousel opts={{ align: "center", loop: true }} plugins={[carousel3]} className="w-full">
      <CarouselContent>
        {Array.from({ length: 7 }).map((_, idx) => (
    <CarouselItem key={idx} className=" basis-[200px] md:basis-[300px] shrink-0">
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
        );
    }
})()
       }
  </div>

        {/* Carousel 4 */}
<div className="flex-1 min-w-0 flex justify-center  ">
    {(()=>{
        if(Sponsored && Sponsored.length>0) {
                return(
                        <Carousel opts={{ align: "center", loop: true }} plugins={[carousel2]} className="w-full">
      <CarouselContent>
        {Sponsored.map((product) => (
          <CarouselItem key={product._id} >
            <div className="p-1">
            <HeroCard key={product._id} product={product} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
                );
        
    } else if (!Sponsored ||  Sponsored.length<=0){
        return(
                 <Carousel opts={{ align: "center", loop: true }} plugins={[carousel2]} className="w-full">
      <CarouselContent>
        {products.map((product) => (
          <CarouselItem key={product._id} >
            <div className="p-1">
            <HeroCard key={product._id} product={product} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
        );
    } else {
        return(
                <Carousel opts={{ align: "center", loop: true }} plugins={[carousel2]} className="w-full">
      <CarouselContent>
        {Array.from({ length: 7 }).map((_, idx) => (
    <CarouselItem key={idx} className=" basis-[200px] md:basis-[300px] shrink-0">
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
        );
    }
})()
       }
  </div>
</div>

</div>
</div>

 </div>

{/* Mobile Section */}
 <div className=" flex md:hidden  items-center justify-center bg-gray-50 bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100 dark:bg-gray-900 dark:bg-none    ">

<div className="flex flex-col justify-center gap-2 border border-gray-200 shadow-lg  hover:bg-gray-200 transition-colors duration-[10000ms] ease-in-out p-2 w-full">

{/* Carousels Wrapper */}
<div className="flex flex-col gap-3 ">
   <div className='flex justify-center -mt-3 '>
       <h1 className='font-bold text-2xl  ' ><span className='text-gold'>Daily</span> Deals</h1>
   </div>
<div className=' flex  gap-4  justify-center  w-full '>
         {/* Carousel 1 */}
 <div className="flex-1 min-w-0 flex justify-center  ">
   <Carousel opts={{ align: "center", loop: true }} plugins={[carousel]} className="w-full ">
     <CarouselContent>
       {products.map((product) => (
         <CarouselItem key={product._id} className='basis-[250px] shrink-0'>
           <div className="p-1">
           <HeroCard key={product._id} product={product} />
           </div>
         </CarouselItem>
       ))}
     </CarouselContent>
     <CarouselPrevious />
     <CarouselNext />
   </Carousel>
 </div>

</div>

</div>
</div>

</div>

</div>

  )
}

export default SecondHero