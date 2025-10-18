import Link from 'next/link'
import Image from 'next/image'
// import { MdAddShoppingCart } from "react-icons/md";
import ProductSkeleton from '../ProductsSkeleton/page'
// import useAddToCart  from '../../hooks/useAddToCart';
import { useEffect, useState } from 'react';
import { Id } from '../../../convex/_generated/dataModel';
import { Heart, Share2, Star, ShoppingCart } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import useAddToCart from '../../hooks/useAddToCart';
import {handleShare} from '@/lib/helpers';
import { Review } from '@/lib/types';
import useBookmark from '@/hooks/useBookmark';
import { useNotification } from '@/app/NotificationContext';
import { Badge } from '../ui/badge';
interface Product {
        approved: boolean;
         product_cartegory: string;
         product_condition: string;
         product_description: string;
         product_image: string[];
         product_name: string;
         product_owner_id: string;
         product_price: string;
         product_likes?: number;
         _creationTime: number;
         _id: Id<"products">;
       }
       interface ProductWithReviews extends Product {
        reviews?: Review[];
       }
       interface HeroCardProps {
        product: ProductWithReviews | null;
      }

const HeroCard = ({ product }: HeroCardProps) => {
        

         const HandleAddToCart = useAddToCart();
         const [productData, setProductData] = useState<ProductWithReviews | null>(product)
                const { createBookmark } = useBookmark()
                const { setNotification } = useNotification();
        const truncateString = (text: string, maxLength: number): string => {
                return text.length > maxLength ? text.slice(0, maxLength) + ".." : text;
              };
              useEffect(() => {
                if (product) {
                        setProductData(product)
                }
              }, [product])

                // Calculate average rating
  const averageRating = (reviews: Review[]) => {
    return reviews && reviews.length > 0
      ? reviews.reduce((acc, review) => acc + (review?.rating ?? 0), 0) / reviews.length
      : 0
  }

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
                                status: "info",
                        });
                }
        }

  return (
        <div  >
        {productData  ? (
                <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden dark:bg-gray-700 dark:border-black ">
                      <div className="relative">
                        <Link href={`/product/${productData._id}`}>
                        <Image
                        width={400}
                        height={300}
                          src={productData.product_image[0] || "/placeholder.svg"}
                          alt={productData.product_name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        </Link>
                        
                
                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          { (
                            <Badge  className={`${product?.product_condition==="Used" || product?.product_condition==="used"? "bg-red-600":product?.product_condition==="new"|| product?.product_condition==="Brand New"?"bg-gold":"bg-blue-400"} text-xs`}>
                              {product?.product_condition}
                            </Badge>
                          )}
                        </div>
                
                        {/* Action buttons */}
                        <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity ">
                          <Button size="sm" variant="secondary" className="h-8 w-8 p-1"
                          onClick={() => handleBookmark(productData._id)}
                          >
                           <Heart className="h-4 w-4" />{productData.product_likes} 
                          </Button>
                          
                          <Button size="sm" variant="secondary" className="h-8 w-8 p-0"
                          onClick={() => handleShare(`https://shopcheapug.com/product/${productData._id}`,`${productData.product_name}`)}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                
                <Button className="absolute h-12 w-12  top-[70%] right-2  bg-gold border border-black rounded-full transition duration-200"  size="sm"
                                onClick={() => HandleAddToCart(productData)}
                           >
                            <ShoppingCart className="h-8 w-8 " />
                          </Button>
                        {/* {!product.inStock && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Badge variant="secondary" className="text-sm">
                              Out of Stock
                            </Badge>
                          </div>
                        )} */}
                      </div>
                
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {productData.product_name}
                          </h3>
                           <p className="text-gray-600 text-sm dark:text-gray-300">
                 {truncateString(productData.product_description, 30)}
               </p>
                
                          <div className="flex items-center gap-1">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${i < Math.floor(averageRating(productData.reviews?productData.reviews:[])) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-600">({averageRating(productData.reviews?productData.reviews:[])})</span>
                          </div>
                
                          <div className="flex items-center text-red-600">
                            Ugx:<span className="font-bold text-red-600 text-lg">{(parseFloat(productData.product_price) || 0).toLocaleString()}</span>
                            {/* {product.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                            )} */}
                          </div>
                
                         
                        </div>
                      </CardContent>
                    </Card>
        //   <div
        //     key={productData._id}
        //     className=" flex flex-col  rounded-3xl  overflow-hidden shadow-xl  border
        //        hover:scale-[103%]    transition-transform duration-500   dark:hover:bg-gray-900 dark:border-black "
        //   >

           
        //     {/* Product Image */}
        //     <Link href={`/product/${productData._id}`} className="w-full flex rounded-lg">
        //       <div className="relative rounded-lg w-full h-48 flex items-center justify-center bg-transparent transition-transform duration-200 p-1">
        //         <Image
        //           src={
        //              Array.isArray(productData.product_image)
        //               ? (productData.product_image.length > 0 ? productData.product_image[0] : "")
        //               : productData.product_image
        //           }
        //           alt={productData.product_name}
        //           width={900}
        //           height={500}
        //           className="w-full h-full object-cover p- rounded-3xl  hover:scale-105 transition-transform duration-500"
        //         />
        //       </div>
        //     </Link>
      
        //     {/* Product Details */}
        //     <div className="px-4  flex flex-col gap-2">
        //       {/* Product Description */}
        //       <p className="text-gray-600 text-sm dark:text-gray-300">
        //         {truncateString(productData.product_description, 20)}
        //       </p>
      
        //       {/* Footer (Price & Date) */}
        //       <div className="flex flex-col md:flex-row md:justify-between md:items-center text-sm text-gray-500  dark:text-gray-400">
        //         <span className="font-semibold md:text-lg text-dark dark:text-gray-100">
        //           Shs: {productData.product_price ? Number(productData.product_price).toFixed(2) : "loading.."}
        //         </span>
        //         {/* <time dateTime={new Date(productData._creationTime).toISOString()}>
        //           {new Date(productData._creationTime).toLocaleDateString()}
        //         </time> */}
        //       </div>
        //     </div>

        //   </div>
        ) : (
                <ProductSkeleton/>
        )}
      </div>
  )
}

export default HeroCard