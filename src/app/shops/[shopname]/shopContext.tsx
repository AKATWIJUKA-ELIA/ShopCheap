"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { ShopData } from "@/lib/types";


interface ShopProviderProps {
  children: ReactNode;
  shop: ShopData;
}

type ShopContextType = {
  state: ShopData;
  setState: React.Dispatch<React.SetStateAction<ShopData>>;
} | null;

export const ShopContext = createContext<ShopContextType>(null);

export function ShopProvider({ children, shop }: ShopProviderProps) {
  const [state, setState] = useState<ShopData>(shop);

  return (
    <ShopContext.Provider value={{ state, setState }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
}