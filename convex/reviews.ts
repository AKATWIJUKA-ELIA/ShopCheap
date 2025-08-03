import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// CREATE review
export const createReview = mutation({
  args: {
    product_id: v.string(),
    reviewer_id: v.string(),
    title: v.string(),
    rating: v.number(),
    review: v.string(),
    verified: v.optional(v.boolean()), 
    helpful: v.optional(v.number()), 
    notHelpful: v.optional(v.number()), 
  },
  handler: async (ctx, args) => {
        try {
                const existing = await ctx.db.query("reviews")
                .withIndex("by_reviewer_id_and_product_id", q =>
                        q.eq("reviewer_id", args.reviewer_id)
                        .eq("product_id", args.product_id))
                .first();
                if(!existing){
                        await ctx.db.insert("reviews", {
                                ...args,
                        });
                        return { success: true, message: "Review created successfully" };
                }
                return { success: false, message: "Only one review per product is allowed" };
    
  } catch (error) {
    return { success: false, message: "Failed to create review" };
  }
}
});

// READ reviews (by product_id)
export const getReviewsByProduct = query({
  args: {
    product_id: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reviews")
      .withIndex("by_product_id", q => q.eq("product_id", args.product_id))
      .order("desc")
      .collect();
  },
});

// READ single review (by id)
export const getReview = query({
  args: {
    id: v.id("reviews"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// UPDATE review
export const updateReview = mutation({
  args: {
    id: v.id("reviews"),
    title: v.optional(v.string()),
    rating: v.optional(v.number()),
    review: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
    return true;
  },
});

// DELETE review
export const deleteReview = mutation({
  args: {
    id: v.id("reviews"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return true;
  },
});