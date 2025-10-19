"use client"
import React, { createContext, useContext, useEffect, useState } from "react";
import useGetApprovedProducts from '@/hooks/useGetApprovedProducts';
import useGetCategories from '@/hooks/useGetCategories';
import { Id } from "../../convex/_generated/dataModel";

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
interface Products {
  product: Product[] | [];
}
 interface Category {
        _id: Id<"cartegories">;
        _creationTime: number;
        cartegory: string;
}
interface Categories {
        categories: Category[] | [];
}

const DataContext = createContext<{
  data: { Products: Products; Categories: Categories };
  setData: React.Dispatch<React.SetStateAction<{ Products: Products; Categories: Categories }>>;
}>({
  data: { Products: { product: [] }, Categories: { categories: [] } },
  setData: () => {},
});

export const DataProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
        const { data: categories } = useGetCategories();
        const { data: products } = useGetApprovedProducts();
  
  const [data, setData] = useState<{ Products: Products; Categories: Categories }>({
    Products: { product: [] },
    Categories: { categories: [] }
  });

  useEffect(() => {
    if (products && categories) {
      setData({
        Products: { product: products },
        Categories: { categories: categories }
      });
//       console.log("Products fetched:", products);
    }
  }, [products, categories]);

  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  );
};

export function useData() {
  return useContext(DataContext);
}