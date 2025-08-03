import { query } from "./_generated/server";

export const getCartegories = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("cartegories").collect();
  },
});