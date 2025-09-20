"use client";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

type Result =
  | { success: true }
  | { success: false; error: string };

const useValidateStoreName = () => {
  const CheckShopName = useMutation(api.LiveValidation.ValidateShopName);
  const [NameError, setNameError] = useState(false);

  const CheckStoreName = async (shopName: string):Promise<Result>=> {
    try {
       const res = await CheckShopName({shop_name:shopName})
        if(!res.succes){
                setNameError(true);
        return { success: false, error: res.error as string };
        }

      setNameError(false); // Clear any previous error
      return { success: true };
    } catch  {
        return {
          success: false,
          error: "An unexpected error occurred while adding the email.",
        };
      }
    
  };

  return {
    CheckStoreName,
    NameError,
  };
};

export default useValidateStoreName;

