import { api } from "../../convex/_generated/api"; 
import { useMutation, useQuery } from "convex/react";
import { useAppSelector } from "@/hooks";
import { Boost,BoostWithInteraction, } from "@/lib/types";
import useGetProductsByIds from "./useGetProductsByIds";
import { useEffect, useState } from "react";


const useBoost = () => {


        const [BoostedProducts, setBoostedProducts] = useState<BoostWithInteraction[]|null>([])
        const [AllBoostedProducts, setAllBoostedProducts] = useState<BoostWithInteraction[]|null>([])
        const User = useAppSelector((state) => state.user.user);
        const boost = useMutation(api.products.BoostProducts);
        const ids = useQuery(api.products.getBoostedProductsIdsByUser, { user_id: User?.User_id || "" });
        const interactions = useQuery(api.products.getInteractionsbyProductIds,  { product_ids: ids ?? [] } )

        // Fetching all boosted products for admin or sudo users
        const allids = useQuery(api.products.getBoostedProductsIds,);
        const allinteractions = useQuery(api.products.getInteractionsbyProductIds,  { product_ids: allids ?? [] } )

        useEffect(() => {
//   console.log("Merged Interactions:", interactions);
}, [interactions,ids,]);

        const { data: products } = useGetProductsByIds(ids ? ids.flat() : []);
        
        const boostedProductsWithInteractions = products?.map((product) => {
                const interaction = interactions?.find((i) => i.product_id === product?._id);
                return { ...product, interaction } as BoostWithInteraction;
        });

        useEffect(() => {
        if (products) { 
        setBoostedProducts(boostedProductsWithInteractions||[]);
        }
        }, [interactions,products]);


                //  Getting all boosted products 

        const { data: newProducts } = useGetProductsByIds(allids ? allids.flat() : []);

        const NewboostedProductsWithInteractions = newProducts?.map((product) => {
                const interaction = interactions?.find((i) => i.product_id === product?._id);
                return { ...product, interaction } as BoostWithInteraction;
        });

        useEffect(() => {
        if (products) {
        setAllBoostedProducts(NewboostedProductsWithInteractions||[]);
        }
        }, [allinteractions,]);

//   console.log("Fetched Boosts:", boostedProductsWithInteractions);
        const boostProduct = async (boostItem:Boost) =>{

                try{
                        if(!User || User.User_id.length === 0){
                                return { success: false, message: "User not authenticated", status: 401 };
                }

                const response = await boost({...boostItem, user_id: User?.User_id || ""});
                 if(!response?.success){
                        return { success: false, message: response.message,status: 400 };
                }
                return { success: true, message:response.message,status: 200 }; 
                }catch{
                        return { success: false, message: "Sorry,  Can not boost at this time please try again later" };
                        
                }
        }
        return { boostProduct,BoostedProducts,AllBoostedProducts };
}
export default useBoost;