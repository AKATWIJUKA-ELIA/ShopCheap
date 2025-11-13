'use client'
import React  from 'react'
import HeroCard from '../HeroCards/page'
import ProductSkeleton from '../ProductsSkeleton/page';
import useGetTopRatings from '@/hooks/useGetTopRatings';
// import { Id } from '../../../convex/_generated/dataModel';
// import { Review } from '@/lib/types';
// import { getReviewsByProduct } from '@/lib/convex';

// interface Product {
//   approved: boolean;
//   product_cartegory: string;
//   product_condition: "new" | "used" | "refurbished";
//   product_description: string;
//   product_image: string[];
//   product_name: string;
//   product_owner_id: string;
//   product_price: string;
//   _creationTime: number;
//   _id: Id<"products">;
// }

// interface ProductWithReviews extends Product {
//   reviews: Review[];
// }
const Main =  () => {
        const { TopRatings:products } = useGetTopRatings();
        // console.log("Top Rated Products:", products);   
        // const [productsWithReviews, setProductsWithReviews] = useState<ProductWithReviews[]>([]);
      
//       useEffect(() => {
//           const fetchReviews = async () => {
//               if (!products?.length) return;
              
//               const enhanced = await Promise.all(
//                   products.map(async (product) => {
//                       const reviewData = await getReviewsByProduct(product._id);
//                       return {
//                           ...product,
//                           reviews: reviewData.data || []
//                       };
//                   })
//               );
              
//               setProductsWithReviews(enhanced);
//           };
          
//           fetchReviews();
//       }, [products]);

  return (
    <div className=' dark:bg-black'>
        <h1 className='font-bold text-3xl text-center'>Top Rated Products</h1>
        <div className='grid grid-cols-2 md:grid-cols-5 p-2 gap-2 dark:bg-black '>
       
      {products&&products.length>0?( products.map((product) => (
        <HeroCard key={product._id} product={product} />
      ))):(
        Array.from({ length: 15 }).map((_, idx) => (
    <div key={idx}>
        <ProductSkeleton/>
    </div>
  ))
      )}
    </div>
    </div>
  )
}

export default Main
