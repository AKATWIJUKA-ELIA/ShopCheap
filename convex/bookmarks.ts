import {action, internalQuery, mutation, query} from "./_generated/server"
import {v} from "convex/values"
import { UpdateProduct } from "./products";
import { Id } from "./_generated/dataModel";


export const createBookmark = mutation({
        args:{
              Bookmark: v.object({
                product_id: v.string(),
                user_id: v.string(),
                  }),
        },
        handler: async (ctx, args) => {
                try{
                        const exisitingProduct = await ctx.db.query("products").filter((q) =>
                        q.eq(q.field("_id"), args.Bookmark.product_id))
                        .first();

                        const existing = await ctx.db
                        .query("bookmarks")
                        .withIndex("by_user_id_and_product_id", (q) => q.eq("user_id", args.Bookmark.user_id).eq("product_id", args.Bookmark.product_id))
                        .unique();
                  if(!existing){
                        await ctx.db.insert("bookmarks", {
                    ...args.Bookmark,
              });
              await ctx.db.patch(exisitingProduct?._id as Id<"products"> , {
                product_likes: (exisitingProduct?.product_likes || 0) + 1,
              });
                        return { success: true, message: "success" };
                }
              
              return { success: false, message: "Item already bookmarked!" };
        }catch{
                return { success: false, message: "Error creating Bookmark" };
        }
        },
  })

export const ListBookmarks = query({
                args: { user_id: v.string() },
                handler: async (ctx, args) => {
                  const bookmarks = await ctx.db.query("bookmarks")
                    .withIndex("by_user_id", (q) => q.eq("user_id", args.user_id))
                    .collect();
                  return bookmarks;
                },
              });

    export const DeleteBookmark = mutation({
                args: { id: v.string() },
                handler: async (ctx, args) => {
                  const bookmark = await ctx.db.query("bookmarks")
                    .withIndex("by_product_id", (q) => q.eq("product_id", args.id))
                    .first();
                  if (!bookmark) {
                    return {message:"Bookmark  not found", success: false } 
                  }
                  await ctx.db.delete(bookmark._id);
                  return {message:"success", success: true };
                },
              });