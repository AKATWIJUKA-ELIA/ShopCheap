import { mutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";

export const Validateusername = mutation({
        args:{username:v.string()},
        handler: async(ctx, args)=>{
                const existing = await ctx.db
                .query("customers")
                .withIndex("by_username", (q) => q.eq("username", args.username))
                .unique();

                if (existing) {
                        throw new ConvexError("This Username is already taken.");
                        }
                }
        
})

export const ValidateShopName = mutation({
        args:{shop_name:v.string()},
        handler: async(ctx, args)=>{
                const existing = await ctx.db
                .query("shops")
                .withIndex("by_shop_name", (q) => q.eq("shop_name", args.shop_name))
                .unique();

                if (existing) {
                        return{succes:false,error:"This shop_name is already taken."};
                        }
                return {succes:true};
                }
        
})

