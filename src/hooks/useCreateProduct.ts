import { NextResponse } from "next/server";
import { api } from "../../convex/_generated/api"; 
import { useMutation } from "convex/react";
interface Product {
approved: boolean,
product_cartegory: string,
product_condition: "new" | "used" | "refurbished",
product_description: string,
product_image: string[],
product_name: string,
product_owner_id: string,
product_price: string,
product_discount?: number,
product_embeddings:number[],
}
const useCreateProduct = () => {
        const create = useMutation(api.products.createProduct);

        const CreateProduct = async (Product:Product) =>{
                try{
                const response = await create({
                        products:{...Product,
                                product_discount: Number(Product.product_discount),
                        }});
                 if(!response?.success){
                        return NextResponse.json({ success: false, message: response.message }, { status: 400 });
                }
                return NextResponse.json({ success: true, message:response.message }, { status: 200 });
                }catch{
                        return NextResponse.json( { success: false, message: "Sorry,  Can not upload at this time please try again later" });
                        
                }
        }
        return { CreateProduct };
 }
 export default useCreateProduct;