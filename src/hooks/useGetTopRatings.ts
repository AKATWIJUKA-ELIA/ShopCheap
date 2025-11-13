import { useQuery } from "convex-helpers/react/cache";
import { api } from "../../convex/_generated/api";
import { Product } from "@/lib/types";
import { useEffect, useState } from "react";

const useGetTopRatings = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [dataStatus, setDataStatus] = useState<'loading' | 'error' | 'success'>('loading');
  const FetchedProducts = useQuery(api.products.getTopRatedProducts, {});


  useEffect(() => {
    const fetchCached = async () => {
      const res = await fetch('/api/checkcache', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "TopRatedProducts" }),
      });

      const data = await res.json();
      if (!data.value?.success || !data.value?.data) {
        setDataStatus('error');
        return;
      }

      setProducts(data.value.data);
      setDataStatus('success');
    };

    fetchCached();
  }, []);


  useEffect(() => {
    if (!FetchedProducts) return;

    setProducts(FetchedProducts);
    setDataStatus('success');

    const cacheProducts = async () => {
      const res = await fetch('/api/redis', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "TopRatedProducts",
          products: FetchedProducts,
        }),
      });

      await res.json();
    };

    cacheProducts();
  }, [FetchedProducts, dataStatus]); 

  return {
    TopRatings: products,
    loading: !FetchedProducts,
  };
};

export default useGetTopRatings;
