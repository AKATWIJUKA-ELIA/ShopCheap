import Link from 'next/link'
import Image from 'next/image'
import { MdAddShoppingCart } from "react-icons/md";
import ProductSkeleton from '../ProductsSkeleton/page'
import useAddToCart  from '../../hooks/useAddToCart';
import { useEffect, useState } from 'react';
// import useBookmark from '@/hooks/useBookmark';
// import { Bookmark  } from 'lucide-react';
// import { useNotification } from '@/app/NotificationContext';
import useGetRecommendations from '@/hooks/useGetRecommendations';
import { Id } from '../../../convex/_generated/dataModel';
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
       interface RecommendedProps {
        type: string;
      }

const Recommended = ({ type }: RecommendedProps) => {
        
        const { recommeded: products } = useGetRecommendations(type);
        // const { setNotification } = useNotification();
        // const { createBookmark } = useBookmark()
         const addToCart = useAddToCart()
         const [productData, setProductData] = useState<Product[] | null>([])
        const truncateString = (text: string, maxLength: number): string => {
                return text.length > maxLength ? text.slice(0, maxLength) + " . . ." : text;
              };
              useEffect(() => {
                if (products && products.length > 0) {
                        setProductData(products)
                }
              }, [products])
        // const handleBookmark = async (product_id:string) => {
        //         if (!product_id) return;
        //         const response = await createBookmark(product_id);
        //         if (response.success) {
        //                 setNotification({
        //                         message: "Bookmark created successfully!",
        //                         status: "success",
        //                 });
        //         } else {
        //                 setNotification({
        //                         message: response.message || "Failed to create bookmark",
        //                         status: "error",
        //                 });
        //         }
        // }
  return (
        <div className=' '  >
        {productData  ? productData.map((productData) => (
          <div
            key={productData._id}
            className="bg-transparent flex gap-2 mb-2 rounded-md shadow-m overflow-hidden shadow-xl hover:bg-yellow-100 border  transition-transform duration-500   dark:hover:bg-gray-900 dark:border-black"
          >

                
            {/* Product Image */}
            <Link href={`/product/${productData._id}`} className=" my-auto w-40">
              <div className="relative ml-2 w-full h-24 my-auto flex items-center justify-center bg-transparent transition-transform duration-200 hover:scale-105">
                <Image
                  src={
                     Array.isArray(productData.product_image)
                      ? (productData.product_image.length > 0 ? productData.product_image[0] : "")
                      : productData.product_image
                  }
                  alt={productData.product_name}
                  width={900}
                  height={500}
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
      
            {/* Product Details */}
            <div className="p-4 flex flex-col gap-2">
              {/* Product Name */}
              <h2 className="flex text-lg font-semibold text-gray-900 dark:text-white">
                <Link href={`/product/${productData._id}`} className="hover:underline">
                  {productData.product_name}
                </Link>
              </h2>
      
              
      
              {/* Product Description */}
              <p className="text-gray-600 text-sm dark:text-gray-300">
                {truncateString(productData.product_description, 30)}
              </p>
      
              {/* Footer (Price & Date) */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center text-sm text-gray-500 mt-2 dark:text-gray-400">
                <span className="font-semibold text-sm text-dark dark:text-gray-100">
                  Shs: {productData.product_price ? Number(productData.product_price).toFixed(2) : "loading.."}
                </span>

              </div>
              {/* Add to Cart Icon */}
              <MdAddShoppingCart
                className="ml-auto text-gold -mt-8 text-2xl hover:cursor-pointer font-bold dark:text-yellow-400"
                onClick={() => addToCart(productData)}
              />
            </div>

          </div>
        )) : (
                <ProductSkeleton/>
        )}
      </div>
  )
}

export default Recommended