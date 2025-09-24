import {  v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateShop = mutation({
        args:{
                shop_name: v.string(),
                description: v.string(),
                owner_id: v.string(),
                slogan: v.string(),
                cover_image: v.string(),
                is_verified: v.boolean(),
                location: v.optional(v.object({
                lat: v.number(),
                lng: v.number(),
        })),
                profile_image: v.string(),
                isOpen: v.boolean(),
        },handler:async(ctx,args)=>{
                try{
                        const existing = await ctx.db
                        .query("shops")
                        .withIndex("by_shop_name", (q) => q.eq("shop_name", args.shop_name))
                        .unique();
                        if(existing){
                                return {success:false,message:"This shop_name Already Exisits",status:400};
                        }
                const shop = await ctx.db.insert("shops",{
                        ...args
                }) 
                // await ctx.runMutation(internal.sendEmail.sendEmail,{})
                return {success:true,message:"Success your Shop was successfully created ",status:200,shop:shop};
        }catch{
                       return {success:false,message:"Error creating shop",status:500,shop:null};
                }
                
        }
        })

        
 export const GetShopByName = query({
                args:{shop_name:v.string()},
                handler:async(ctx,args)=>{
                        const shop = await ctx.db.query("shops")
                        .withIndex("by_shop_name", (q) => q.eq("shop_name", args.shop_name))
                        .unique();
                        if (!shop) {
                               return { success:false ,status: 404,message: "User not Found",user:null };
                        }
                        return { success:true, status: 200, message: "User found", shop: {
                                ...shop,
                                profile_image: shop.profile_image ? await ctx.storage.getUrl(shop.profile_image) : "",
                                cover_image:  shop.cover_image ? await ctx.storage.getUrl(shop.cover_image) : "",
                        } };
                }
                
        })