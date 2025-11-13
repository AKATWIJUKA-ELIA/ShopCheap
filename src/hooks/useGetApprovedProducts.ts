import { useQuery } from "convex-helpers/react/cache";
import { api } from "../../convex/_generated/api";
import { useEffect, useState } from "react";
import { Product } from "@/lib/types";

const useGetApprovedProducts = () => {
        const [products, setProducts] = useState<Product[]>([]);
        const [dataStatus, setDataStatus] = useState<'loading' | 'error' | 'success'>('loading');
        const FetchedProducts = useQuery(api.products.getProducts,{}); 

        useEffect(()=>{
                 const CachedProducts = async () => {
                  const res = await fetch('/api/checkcache',{
                                method: 'POST',
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                        key:"approved_products"
                                })
                  })

                  const data =  await res.json();
                //   console.log("data from cache:", data.value);
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
                                        key:"approved_products"
                                })
                  })

                  const data =  await res.json();
                  return data.value;
          };

                CacheProducts();
        },[dataStatus&& FetchedProducts]);
        
//  console.log(" Data Status:", dataStatus);

    return {
        data: products, 
        loading: products === undefined, // Convex returns `undefined` while loading
        error: null, // Convex doesn't provide an explicit error, so handle it elsewhere if needed
    };
};

export default useGetApprovedProducts;