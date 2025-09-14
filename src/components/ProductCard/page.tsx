import React, { useState } from "react";
import Image from "next/image";
import { Oval } from 'react-loader-spinner'
import useAddToCart from '../../hooks/useAddToCart';
import { Card, CardContent } from "@/components/ui/card"
import useGetUserById from "@/hooks/useGetUserById"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { Id } from "../../../convex/_generated/dataModel";
import useBookmark from '@/hooks/useBookmark';
import { useNotification } from '@/app/NotificationContext';

interface ProductProps {
  product: {
    _id: Id<"products">;
    product_name: string;
    product_image: string[];
    product_price: string;
    product_description: string;
    product_owner_id:string
  };
}

const ProductCard: React.FC<ProductProps> = ({ product }) => {

        const { setNotification } = useNotification();
        const { createBookmark } = useBookmark()
        const carousel = Autoplay({ delay: 10000})
        const[Copied,setCopied] = useState(false)
        const { user } = useGetUserById(product?.product_owner_id as  Id<"customers">)
        // console.log("User is ",user)
        const UserEmail = user?.email||""
        const UserName = user?.username|| ""
        const PhoneNumber = user?.phoneNumber|| ""
  const HandleAddToCart = useAddToCart();

  const handleCopy = (link:string) => {
        if (typeof window === "undefined"){
                return
        }
                navigator.clipboard.writeText(link);
                setCopied(true);
                setTimeout(() => setCopied(false), 3000);
              
                
      };
              const handleBookmark = async (product_id:string) => {
                if (!product_id) return;
                const response = await createBookmark(product_id);
                if (response.success) {
                        setNotification({
                                message: "Bookmark created successfully!",
                                status: "success",
                        });
                } else {
                        setNotification({
                                message: response.message || "Failed to create bookmark",
                                status: "error",
                        });
                }
        }

      const handleShare = (link: string,name:string) => {
        if (navigator.share) {
          navigator
            .share({
              title: `"Check out  ${name} on ShopCheap!`,
              text: "Hey, take a look at this:",
              url: link,
            })
            .then(() => console.log("Shared successfully"))
            .catch((error) => console.error("Error sharing", error));
        } else {
                handleCopy(link)
                alert("Sharing not supported on this device. Try copying the link instead.");
        }
      };

  return (
    <div className="flex flex-col lg:flex-row gap-2 bg-white mt-5 shadow-md overflow-hidden p-4 dark:bg-dark ">
      
      {/* Product Image */}
      <div className="flex flex-col md:flex-row-reverse   md:w-[40%] gap-1   shadow-md   dark:bg-gray-900">
        
        <div className="  h-64 sm:h-72 md:h-full  md:w-[86%] relative overflow-hidden ">
        <Carousel opts={{align: "start",loop: true,}} plugins={[carousel]} className=" h-full w-full">
        <CarouselContent className=''>
  {product.product_image.map((image, index) => (
    <CarouselItem key={index}>
      <div className="">
        <Card className="h-auto bg-transparent">
          <CardContent className="relative  bg-transparent flex items-center justify-center p-6 h-96 overflow-hidden ">
            {/* Image */}
            <Image
              src={image}
        //       height={100}
        //       width={450}
              alt={product.product_name}
             fill
             className='object-cover w-full h-full'
            />

            {/* Text Overlay */}
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/40 text-white text-xl font-semibold p-4">
              {product.product_name}
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
        </div>

        {/* Small Images */}
        <div className="flex md:flex-col mt-5 md:mt-1  gap-3  overflow-x-auto  ">
          {product ? (
            product.product_image?.map((item: string) => (
              <div key={item} className="min-w-[80px] md:w-20 md:h-[70px] h-[80px] border border-blue-600 rounded-lg overflow-hidden">
                <Image
                  src={item}
                  alt={product.product_name}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
            ))
          ) : (
            <Oval
              visible={true}
              height="40"
              width="40"
              color="#4fa94d"
              ariaLabel="oval-loading"
            />
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-col w-full lg:w-2/5  shadow-md rounded-lg p-4 space-y-4 dark:bg-gray-700">

        <div className="">
          <span className="text-4xl md:text-5xl font-bold">Ugx: {(parseFloat(product.product_price) || 0).toLocaleString()}</span>
          <span className="text-3xl font-semi-bold text-gray-500 line-through italic">Ugx: { parseFloat(product.product_price)*3}</span>
        </div>

        <div>
          <h1 className="text-gray-600 font-bold dark:text-black ">Product Details:</h1>
          <p className="text-sm text-gray-800 dark:text-white ">{product.product_description}</p>
        </div>


        {/* <div className=" flex flex-col md:flex space-x-2">
                <h1 className=" flex text-gray-600 font-bold">
                        Sellers Details : 
                </h1>
                <ul className="flex flex-col" >
                        <li>
                        <h1  > <span className="font-bold" > UserName </span> : {UserName}</h1>
                        </li>
                        <li>
                        <h1 > <span className="font-bold" > Phone Number : </span>  <a href={`tel:${PhoneNumber}`}>{PhoneNumber}</a>  </h1>
                        </li>
                        <li>
                        <h1   > <span className="font-bold" > Email : </span>  <a href={`mailto: ${UserEmail}`}>{UserEmail}</a></h1>
                        </li>
                </ul>
                

        </div> */}
      </div>

      <div className="flex flex-col w-full lg:w-2/5  shadow-md rounded-lg p-4 space-y-4 dark:bg-gray-700">
        <h2 className="text-3xl  font-semibold text-gray-900">
          {product.product_name}
        </h2>
                <div className=" flex flex-col md:flex space-x-2">
                <h1 className=" flex text-gray-600 font-bold">
                        Sellers Details : 
                </h1>
                <ul className="flex flex-col" >
                        <li>
                        <h1  > <span className="font-bold" > UserName </span> : {UserName}</h1>
                        </li>
                        <li>
                        <h1 > <span className="font-bold" > Phone Number : </span>  <a href={`tel:${PhoneNumber}`}>{PhoneNumber}</a>  </h1>
                        </li>
                        <li>
                        <h1   > <span className="font-bold" > Email : </span>  <a href={`mailto: ${UserEmail}`}>{UserEmail}</a></h1>
                        </li>
                </ul>
                

        </div>

        <div className="flex flex-col md:flex-row  space-x-2 space-y-2 md:space-y-0">
                <button
          onClick={() => HandleAddToCart(product)}
          className="bg-gold text-white w-full px-4 py-2 rounded-3xl hover:bg-yellow-500 transition"
        >
          Add to Cart
        </button>
        <button
          onClick={() => handleShare(`https://shopcheapug.com/product/${product._id}`,`${product.product_name}`)}
          className=" text-black border border-black w-full px-4 py-2 rounded-3xl hover:border-blue-600 hover:text-white hover:bg-blue-700 transition"
        >
          {Copied?"Link copied successfully":"Share "}
        </button>
        <button
          onClick={() => {handleBookmark(product._id)}}
          className=" text-black border border-black w-full px-4 py-2 rounded-3xl hover:border-blue-600 hover:text-white hover:bg-blue-700 transition"
        >
          Like
        </button>
        </div>
       

      </div>
      
    </div>
  );
};

export default ProductCard;
