import { useQuery } from "convex-helpers/react/cache";
import { api } from "../../convex/_generated/api";

const useGetProductsByIds = (ids: string[]) => {
  const products = useQuery(api.products.getProductsByIds,ids.length > 0 ? { ids } : "skip"
  );
  return {
    data: products ?? [],
    loading: products === undefined, // Convex returns `undefined` while loading
  };
};

export default useGetProductsByIds;