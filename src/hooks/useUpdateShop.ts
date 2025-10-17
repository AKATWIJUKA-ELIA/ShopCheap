import { api } from "../../convex/_generated/api"; 
import { useMutation } from "convex/react";
import { Id } from "../../convex/_generated/dataModel";
interface shopData {
         _id: Id<"shops">;
         slogan?: string;
    profile_image?: string ;
    cover_image?: string;
    description?: string;
    shop_name?: string;
}
const useUpdateShop = () => {

        const update = useMutation(api.shops.UpdateShop);
        const updateShop = async(shopData:shopData)=>{
                
                const res = await update({shop:{
                        _id: shopData._id,
                        slogan: shopData.slogan,
                        profile_image: shopData.profile_image,
                        cover_image: shopData.cover_image,
                        description: shopData.description,
                        shop_name: shopData.shop_name,
                }})
                        if(!res.success){
                                return {success:false,message:res.message||"Failed to update shop",status:res.status};
                        }
                        return {success:true,message:res.message||"Shop updated successfully",status:res.status};
                
        }
        return {updateShop};
}
export default useUpdateShop;