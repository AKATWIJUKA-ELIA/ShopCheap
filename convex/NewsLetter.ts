import {mutation,query} from "./_generated/server"
import { ConvexError } from "convex/values";
import {v} from "convex/values"

export const AddEmail = mutation({
        args: { email: v.string() },
        handler: async (ctx, args) => {
          // Check if the email already exists
          const existing = await ctx.db
      .query("NewsLetter")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
      
        if (existing) {
            throw new ConvexError("This email is already subscribed.");
          }
      
          // If not found, insert the email
          await ctx.db.insert("NewsLetter", {
            email: args.email,
          });
        },
      });

      export const getSubscribers = query({
        args:{},
        handler: async(ctx)=>{
                const subscribeList = await ctx.db.query("NewsLetter").collect()
                return subscribeList
        }
      })
      export const CreateNewsLetter = mutation({
        args:{
                subject: v.string(),
                content: v.string(),
                recipients: v.array(v.string()),
               status: v.union(
                v.literal("pending"),
                v.literal("sent"),
                v.literal("scheduled"),
                v.literal("failed"),
                v.literal("bounced"),
        ),
                scheduledTime: v.number(),
                DateSent: v.optional(v.number()),
        },
        handler: async (ctx, args) => {
                const { subject, content, recipients, status, scheduledTime, DateSent } = args;
                const newsletter = await ctx.db.insert("NewsLetterStorage", {
                        subject,
                        content,
                        receipients: recipients,
                        status,
                        scheduledTime,
                        DateSent
                });
                return newsletter;
        }
      });
      
      export const getNewsLetters = query({
        args:{},
        handler:async(ctx)=>{
          const newsletters = await ctx.db.query("NewsLetterStorage").collect();
          return newsletters
        }
        });

        export const updateNewsLetter = mutation({
        args: {
          _id: v.id("NewsLetterStorage"),
          subject: v.optional(v.string()),
          content: v.optional(v.string()),
          receipients: v.optional(v.array(v.string())),
          status: v.optional(
            v.union(
              v.literal("pending"),
              v.literal("sent"),
              v.literal("scheduled"),
              v.literal("failed"),
              v.literal("bounced")
            )
          ),
          scheduledTime: v.optional(v.number()),
          DateSent: v.optional(v.number()),
          _creationTime: v.optional(v.number()),
        },
        handler:async (ctx, args) => {
                const { _id, subject, content, receipients, status, scheduledTime, DateSent } = args;
                await ctx.db.patch(_id, {
                        subject,
                        content,
                        receipients:receipients,
                        status,
                        scheduledTime,
                        DateSent
                });
        }
        })

        export const DeleteSubscriber = mutation({
                args:{email: v.string()},
                handler: async (ctx, args) => {
                        const { email } = args;
                        const exisiting = await ctx.db.query("NewsLetter")
                        .withIndex("by_email", (q) => q.eq("email", email))
                        .unique();
                        if (!exisiting) {
                                return { success: false, message: "Subscriber not found" };
                        }
                        await ctx.db.delete(exisiting._id);
                        return { success: true, message: "Subscriber deleted successfully" };
                }
        })