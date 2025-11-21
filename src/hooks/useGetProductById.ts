import { useQuery } from "convex-helpers/react/cache";
import { api } from "../../convex/_generated/api";
import { useEffect,useState } from "react";

const useGetProductById = (id: string) => {
        const [fetchedProduct, setfetchedProduct] = useState(undefined);
    const product = useQuery(api.products.getProduct, id ? { id } : "skip"); // Prevent calling hook with an empty ID
    useEffect(() => {
        const fetchProduct = async () => {
               const response = await fetch('/api/singlecache', {
                        method: 'POST',
                        headers: {
                                'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ product: 'product', id }),
               });
                 const data = await response.json();
                 setfetchedProduct(data.value);
                        return data.value;
        }
        if (product === undefined && id) {
            fetchProduct();
        }
    }, [id]);
    return {
        data: product??fetchedProduct,
        loading: product === undefined, // Convex returns `undefined` while loading
        error: null, // Convex doesn't provide an explicit error, so handle it elsewhere if needed
    };
};

export default useGetProductById;