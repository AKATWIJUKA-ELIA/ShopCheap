import Link from 'next/link'
import Image from 'next/image'
// import { MdAddShoppingCart } from "react-icons/md";
import ProductSkeleton from '../ProductsSkeleton/page'
// import useAddToCart  from '../../hooks/useAddToCart';
import { useEffect, useState } from 'react';
import { Id } from '../../../convex/_generated/dataModel';
import { Heart, Share2, ShoppingCart } from 'lucide-react';
import { Button } from '../ui/button';
import { Card,  } from '../ui/card';
import useAddToCart from '../../hooks/useAddToCart';
import {handleShare} from '@/lib/helpers';
import { Review } from '@/lib/types';
import useBookmark from '@/hooks/useBookmark';
import { useNotification } from '@/app/NotificationContext';
import { Badge } from '../ui/badge';
interface Product {
        approved: boolean;
         product_cartegory: string;
         product_condition: "new" | "used" | "refurbished";
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
       interface HeroCardImageProps {
        product: ProductWithReviews | null;
      }

const HeroCardImage = ({ product }: HeroCardImageProps) => {
        

         const HandleAddToCart = useAddToCart();
         const [productData, setProductData] = useState<ProductWithReviews | null>(product)
                const { createBookmark } = useBookmark()
                const { setNotification } = useNotification();
        // const truncateString = (text: string, maxLength: number): string => {
        //         return text.length > maxLength ? text.slice(0, maxLength) + ".." : text;
        //       };
              useEffect(() => {
                if (product) {
                        setProductData(product)
                }
              }, [product])

                // Calculate average rating
//   const averageRating = (reviews: Review[]) => {
//     return reviews && reviews.length > 0
//       ? reviews.reduce((acc, review) => acc + (review?.rating ?? 0), 0) / reviews.length
//       : 0
//   }

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
                <Card className=" w-full  group hover:shadow-lg transition-all  duration-300 overflow-hidden dark:bg-gray-700 dark:border-black ">
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
                            <Badge  className={`${product?.product_condition==="used"? "bg-red-600":product?.product_condition==="new"?"bg-gold":"bg-blue-400"} text-xs`}>
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
                      </div>
                    </Card>
        ) : (
                <ProductSkeleton/>
        )}
      </div>
  )
}

export default HeroCardImage