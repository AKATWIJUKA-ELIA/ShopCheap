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

         export const GetShopBySellerId = query({
                args:{seller_Id:v.id("customers")},
                handler:async(ctx,args)=>{
                        const shop = await ctx.db.query("shops")
                        .withIndex("by_owner_id", (q) => q.eq("owner_id", args.seller_Id))
                        .unique();
                        if (!shop) {
                               return { success:false ,status: 404,message: "Shop not Found",user:null };
                        }
                        return { success:true, status: 200, message: "Shop found", shop: {
                                ...shop
                        } };
                }
                
        })
 export const GetShopByName = query({
                args:{shop_name:v.string()},
                handler:async(ctx,args)=>{
                        const shop = await ctx.db.query("shops")
                        .withIndex("by_shop_name", (q) => q.eq("shop_name", args.shop_name))
                        .unique();
                        if (!shop) {
                               return { success:false ,status: 404,message: "User not Found",shop:null };
                        }
                        console.log("shop: ",shop);
                        return { success:true, status: 200, message: "User found", shop: {
                                ...shop,
                        } };
                }
                
        })
export const UpdateShop = mutation({
        args:{
                shop: v.object({
                        _id: v.id("shops"),
                        shop_name: v.optional(v.string()),
                        description: v.optional(v.string()),
                        slogan: v.optional(v.string()),
                        profile_image: v.optional(v.string()),
                        cover_image: v.optional(v.string()),

                })
                },
                        handler:async(ctx,args)=>{
                                try{
                                const shop = await ctx.db.get(args.shop._id);
                                if(!shop){
                                        return {success:false,message:"Shop not found",status:404};
                                }
                                console.log("id: ",args.shop.profile_image);
                                const profile_image = args.shop.profile_image?.startsWith("https")? args.shop.profile_image: await ctx.storage.getUrl(args.shop.profile_image||"")
                                console.log(profile_image);

                                const cover_image = args.shop.cover_image?.startsWith("https")? args.shop.cover_image
                                : await ctx.storage.getUrl(args.shop.cover_image||"");

                                await ctx.db.patch(args.shop._id,{
                                        shop_name: args.shop.shop_name,
                                        description: args.shop.description,
                                        slogan: args.shop.slogan,
                                        profile_image:profile_image||"",
                                        cover_image:cover_image||"",
                                })
                                return {success:true,message:"Shop updated successfully",status:200};
                                }catch{
                                        return {success:false,message:"Error updating shop",status:500};
                                }
                        }})