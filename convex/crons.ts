import { internalMutation, internalQuery, internalAction, mutation } from "./_generated/server";
import { v } from "convex/values";
import { cronJobs } from "convex/server";
import { internal, api } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import {generateProductEmailHTML} from "../src/EmailTemplates/ProductRecommendations";
import {AccountDeletion} from "../src/EmailTemplates/AccountDeletion";
import {CreateNewsLetter} from "../src/EmailTemplates/NewsLetter"

export const DeleteUnVerifiedUsers = internalMutation({
  args: {},
  handler: async (ctx) => {
        const customers = await ctx.db
        .query("customers")
        .withIndex("by_isVerified", (q) => q.eq("isVerified", false))
        .collect();
        if (customers.length === 0) return { success: false, message: "No unverified users found", status: 404 };
        const Today = Date.now();
        for (const customer of customers) {
                if(customer._creationTime + 7 * 24 * 60 * 60 * 1000 < Today) {
                        await ctx.runMutation(api.sendEmail.sendEmail, {
        receiverEmail: customer.email,
        subject: "Account Deletion Notice",
        html: AccountDeletion(customer.email, customer.username),
        department:"ShopCheap",
      });
                        await ctx.db.delete(customer._id);
                }
        }
        return { success: true, message: "Deleted unverified users", status: 200 };
  }
})

export const UpdateProduct = mutation({
        args:{_id:v.id("products")},
        handler:async(ctx,args)=>{
                const Initproduct = await ctx.db.get(args._id);
              const product=   await ctx.db.patch(args._id,{
                        product_sponsorship:{
                                status:"expired",
                                duration:Initproduct?.product_sponsorship?.duration,
                                type:Initproduct?.product_sponsorship?.type,
                        }
                })
                  return product;
        },
        
})
export const findExpiringSubscriptions = internalQuery({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const soon = now + 3 * 24 * 60 * 60 * 1000; // 3 days from now
    return await ctx.db
      .query("boosts")
      .withIndex("by_duration_and_notified", (q) =>
        q
      .gte("duration", now)
      .lte("duration", soon)
      )
      .collect()
      .then(results => results.filter(boost => boost.notified === false));
  },
});
export const findExpiredSubscriptions = internalQuery({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    return await ctx.db
      .query("boosts")
      .withIndex("by_duration_and_notified", (q) =>
        q
      .lte("duration", now)
      )
      .collect().then(results => results.filter(boost => boost.status === "active" && boost.notified === true));
  },
});
// Mutation: Mark subscription as notified
export const markNotified = internalMutation({
  args: { subscriptionId: v.id("boosts") },
  handler: async (ctx, { subscriptionId }) => {
    await ctx.db.patch(subscriptionId, { notified: true });
  },
});
// Mutation: Mark subscription as Expired
export const markExpired = internalMutation({
  args: { subscriptionId: v.id("boosts") },
  handler: async (ctx, { subscriptionId }) => {
    await ctx.db.patch(subscriptionId, { status: "expired" });
  },
});


// Action: Send notification emails for expiring subscriptions
export const notifyExpiringSubscriptions = internalAction({
  args: {},
  handler: async (ctx) => {
    const expiring = await ctx.runQuery(internal.crons.findExpiringSubscriptions, {});
    for (const sub of expiring) {
      // Get user email
      const user = await ctx.runQuery(api.users.GetCustomerById, { id: sub.user_id as Id<"customers"> });
      if (!user?.email) continue;
      // Send email
      await ctx.runMutation(api.sendEmail.sendEmail, {
        receiverEmail: user.email,
        subject: "Your subscription is expiring soon",
        html: `Hi, your subscription will expire on ${new Date(sub.duration)}. Please renew soon!`,
        department:"ShopCheap",
      });
      // Mark as notified
      await ctx.runMutation(internal.crons.markNotified, { subscriptionId: sub._id });
    }
  },
});

// Action: Send notification emails for Expired subscriptions
export const notifyExpiredSubscriptions = internalAction({
  args: {},
  handler: async (ctx) => {
    const expired = await ctx.runQuery(internal.crons.findExpiredSubscriptions, {});
    for (const sub of expired) {
        //get the Product and update its sponsorship status
        if (!sub.product_id || !sub.user_id) break;
      const product = await ctx.runQuery(api.products.getProduct, { id: sub.product_id as Id<"products"> });
      await ctx.runMutation(api.crons.UpdateProduct,{_id:product?._id as Id<"products">})
      // Get user email
      const user = await ctx.runQuery(api.users.GetCustomerById, { id: sub.user_id as Id<"customers"> });
      if (!user?.email) continue;
      // Send email
      await ctx.runMutation(api.sendEmail.sendEmail, {
        receiverEmail: user.email,
        subject: "Your subscription has expired",
        html: `Hi, your subscription has Expired today ${new Date(Date.now()).toLocaleString()}. Please renew to get your benefits back!`,
        department:"ShopCheap",
      });
        // Mark as expired
      await ctx.runMutation(internal.crons.markExpired, { subscriptionId: sub._id });
    }
  },
});

export const SendRecommendedProducts = internalAction({
  args: {},
  handler: async (ctx) => {
        const customers = await ctx.runQuery(api.users.GetAllCustomers, {});
        for (const customer of customers) {
            const ViewedProducts = await ctx.runQuery(api.products.recommendProducts, { user_id: customer._id as Id<"customers">,type: "view" });
            const CartedProducts = await ctx.runQuery(api.products.recommendProducts, { user_id: customer._id as Id<"customers">,type: "cart" });
            const products = [...ViewedProducts, ...CartedProducts].slice(0, 7);
            // Send email
            await ctx.runMutation(api.sendEmail.sendEmail, {
                receiverEmail: customer.email,
                subject: "Recommended Products Just For You",
                html: generateProductEmailHTML(products),
                department:"ShopCheap",
            });
        }
  }
})

export const SendNewsLetter = internalAction({
        args:{},
        handler:async(ctx)=>{
                const newsletters = await ctx.runQuery(api.NewsLetter.getNewsLetters)
                const newsletterToSend = newsletters.filter((letter)=>letter.scheduledTime<=Date.now() && letter.status==="pending" )
                
                for( const newsletter of newsletterToSend){
                        const receivers = newsletter.receipients
                        for (const receiver of receivers) {
                                await ctx.runMutation(api.sendEmail.sendEmail, {
                                        receiverEmail: receiver,
                                        subject: newsletter.subject,
                                        html: CreateNewsLetter(newsletter.content),
                                        department:"ShopCheap",
                                });
                        }
                        await ctx.runMutation(api.NewsLetter.updateNewsLetter, {
                                ...newsletter,
                                _id: newsletter._id,
                                status: "sent",
                                DateSent: Date.now(),
                        });
                }
                
        }

})

// Register cron jobs
const crons = cronJobs();
crons.interval(
  "Notify expiring subscriptions",
  { hours: 1 },
  internal.crons.notifyExpiringSubscriptions,
  {}
);
crons.interval(
  "Notify expired subscriptions",
  { hours: 1 },
  internal.crons.notifyExpiredSubscriptions,
  {}
);
crons.interval(
  "Send recommended products",
  { hours: 24 },
  internal.crons.SendRecommendedProducts,
  {}
);
crons.interval(
  "Delete UnVerified Users",
  { hours: 24 },
  internal.crons.DeleteUnVerifiedUsers,
  {}
);
crons.interval(
  "Send NewsLetter",
  { minutes: 1 },
  internal.crons.SendNewsLetter,
  {}
);
export default crons;