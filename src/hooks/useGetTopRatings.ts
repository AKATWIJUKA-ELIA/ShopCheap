import { useQuery } from "convex-helpers/react/cache";
import { api } from "../../convex/_generated/api";
import { Product } from "@/lib/types";
import { useEffect, useState } from "react";

const useGetTopRatings = () => {
        const [products, setProducts] = useState<[]>([]);
        const [dataStatus, setDataStatus] = useState<'loading' | 'error' | 'success'>('loading');
    const FetchedProducts = useQuery(api.products.getTopRatedProducts,{});

        useEffect(()=>{
                 const CachedProducts = async () => {
                  const res = await fetch('/api/checkcache',{
                                method: 'POST',
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                        key:"TopRatedProducts"
                                })
                  })

                  const data =  await res.json();
                //   console.log("data from cache:", data);
                  if(data.value.data == null||!data.value.success){
                        setDataStatus("error");
                        return;
                  }
                    setDataStatus("success");
                   setProducts(data.value.data);
                  return data.value;
          };
          CachedProducts();
        },[]);
      
        useEffect(()=>{
                if (!FetchedProducts) return;
                setProducts(FetchedProducts);
                if (dataStatus === 'loading' || dataStatus === 'success') return;
                
                  const CacheProducts = async () => {
                  const res = await fetch('/api/redis',{
                                method: 'POST',
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                        products:FetchedProducts,
                                        key:"TopRatedProducts"
                                })
                  })

                  const data =  await res.json();
                  return data.value;
          };

                CacheProducts();
        },[dataStatus&& FetchedProducts]);

    return {
        TopRatings: products as Product[] | null, 
        loading: products === undefined, // Convex returns `undefined` while loading
        error: null, // Convex doesn't provide an explicit error, so handle it elsewhere if needed
    };
};

export default useGetTopRatings;