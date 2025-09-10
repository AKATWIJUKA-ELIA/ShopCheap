import {mutation, query} from "./_generated/server"
import { action } from "./_generated/server";
import {v} from "convex/values"
import { ConvexError } from "convex/values";
import { api } from "../convex/_generated/api";
import bcrypt from "bcryptjs";
type Response = {
  success: boolean;
  message: string;
  status: number;
  user:{
        _id: string,
         username: string,
            email: string,
            passwordHash: string,
            phoneNumber?: string,
            profilePicture?: string,
            isVerified: boolean,
            role: string,
            reset_token?: string,
            reset_token_expires?:number,
            updatedAt?: number,
            lastLogin?: number,
            _creationTime: number,
  }|null
};
export const CreateUser = mutation({
        args:{
                username: v.string(),
                email: v.string(),
                passwordHash: v.string(),
                phoneNumber: v.optional(v.string()),
                profilePicture: v.optional(v.string()),
                isVerified: v.boolean(),
                role: v.string(),
                reset_token: v.optional(v.string()),
                reset_token_expires:v.number(),
                updatedAt: v.number(),
                lastLogin: v.optional(v.number()),
        },handler:async(ctx,args)=>{
                try{
                        const existing = await ctx.db
                        .query("customers")
                        .withIndex("by_email", (q) => q.eq("email", args.email))
                        .unique();
                        if(existing){
                                return {success:false,message:"This Email Already Exisits",status:400};
                        }
                const user = await ctx.db.insert("customers",{
                        ...args
                }) 
                // await ctx.runMutation(internal.sendEmail.sendEmail,{})
                return {success:true,message:"Success",status:200,user:user};
        }catch{
                        throw new ConvexError({error:"Error creating user",message:"Error creating user",status:500})
                }
                
        }
        })
        export const GetCustomer = query({
                args:{email:v.string()},
                handler:async(ctx,args)=>{
                        const customer = await ctx.db.query("customers")
                        .withIndex("by_email", (q) => q.eq("email", args.email))
                        .unique();
                        if (!customer) {
                               return { success:false ,status: 404,message: "User not Found",user:null };
                        }
                        return { success:true, status: 200, message: "User found", user: customer };
                }
                
        })

                export const GetCustomerByToken = query({
                args:{token:v.string()},
                handler:async(ctx,args)=>{
                        
                        const customer = await ctx.db.query("customers")
                        .withIndex("by_reset_token_and_by_reset_token_expires", (q) => q
                        .eq("reset_token", args.token)
                        .gt("reset_token_expires", Date.now()))
                        .unique();
                        console.log("Customer by token:", customer);
                        if (!customer) {
                               return { success:false ,status: 404,message: "User not Found",user:null };
                        }
                        return { success:true, status: 200, message: "User found", user: customer };
                }
                
        })

export const GetCustomerByEmail = action({
        args: { email: v.string() },
        handler: async (ctx, args): Promise<Response> => {
    // Call the registered query using ctx.runQuery
    const customer = await ctx.runQuery(api.users.GetCustomer, { email: args.email });

    if (!customer.user) {
      return { success: false, status: 404, message: "User not Found", user: null };
    }

    return { success: true, status: 200, message: "Success !", user: customer.user };
  },
});

export const GetCustomerByTokenAction = action({
        args: { token: v.string() },
        handler: async (ctx, args): Promise<Response> => {
    // Call the registered query using ctx.runQuery
    const customer = await ctx.runQuery(api.users.GetCustomerByToken, { token: args.token });

    if (!customer.user) {
      return { success: false, status: 404, message: "Token is Invalid", user: null };
    }

    return { success: true, status: 200, message: "Success !", user: customer.user };
  },
});
        
        export const GetCustomerById = query({
        args:{id: v.id("customers")},
              handler: async (ctx, args) => {
                     const Customer = await ctx.db.query("customers").filter((q)=> q.eq(q.field("_id"), args.id)).first() 
                    return Customer
                    },
                    })

export const GetAllCustomers = query({
              handler: async (ctx, ) => {
                     const Customers = await ctx.db.query("customers").collect() 
                    return Customers
                    },
                    })
        export const AuthenticateUser = action({
                args:{email:v.string(), password:v.string()},
                handler:async(ctx,args): Promise<Response>=>{
                        const user = await ctx.runQuery(api.users.GetCustomer, {
                                email: args.email,
                        });
                        if (!user.success || !user.user) {
                               return { success:false ,status: 404,message: "User not Found",user:user.user };
                        }
                        if (!user.user?.isVerified) {
                               return { success:false ,status: 404,message: `This User is not verified pliz verify your Account via the email that was sent to ${user.user?.email} or contact Support`,user:user.user };
                        }
                        
                        const isMatch = await bcrypt.compare(args.password, user.user?.passwordHash ?? "");
                        if (!isMatch) {
                          return { success:false ,status: 401,message: "Invalid Password",user:user.user };
                }
                   return { success:true ,status: 201,message: "Success",user:user.user };
}
})

      export const UpdateCustomer = mutation({
         args:{User:v.object({
                _id: v.id("customers"),
                username: v.string(),
                email: v.string(),
                passwordHash: v.string(),
                phoneNumber: v.optional(v.string()),
                profilePicture: v.optional(v.string()),
                isVerified: v.boolean(),
                role: v.string(),
                reset_token: v.optional(v.string()),
                reset_token_expires:v.number(),
                updatedAt: v.number(),
                lastLogin: v.optional(v.number()),
                _creationTime:v.optional(v.number()),
         })},handler:async(ctx,args)=>{
              if(args.User){
              const NewUser = await ctx.db.patch(args.User._id, {
                ...args.User,
                updatedAt: Date.now(),
              });
              return {succes:true, status: 20, message: "Success", user: NewUser};
              }
              
              
        }})

        export const QualifyUser = mutation({
                args:{user_id: v.id("customers")},
                handler: async (ctx, args) => {
                        const user = await ctx.db.get(args.user_id);
                        if (!user) {
                                return { success: false, status: 404, message: "User not found", };
                        }
                        if (user.role === "seller") {
                                return { success: false, status: 400, message: "You are already a seller" };
                        }
                        const TimeSpentOnSite = Date.now() - (user._creationTime || Date.now());
                        const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
                        
                        if(TimeSpentOnSite < thirtyDaysInMs) {
                                const daysRegistered = Math.floor(TimeSpentOnSite / (24 * 60 * 60 * 1000));
                                return { success: false, status: 400, message: `you have spent only ${daysRegistered} days, please spend at least 30 days on the site to Qualify` };

                        }

                        const ordersMade = await ctx.db.query("orders")
                                .withIndex("by_user_id", (q) => q.eq("user_id", args.user_id))
                                .collect();
                        if (ordersMade.length < 3) {
                                const ordersCount = ordersMade.length;
                                return { success: false, status: 400, message: `you have made only ${ordersCount} orders, please make at least 3 orders to Qualify` };
                        }
                        const userWithRole = await ctx.db.patch(args.user_id, {
                                role: "seller",
                                isVerified: true,
                        });
                        return { success: true, status: 200, message: "Congratulations you now qualify as a seller", user: userWithRole };
                }
        })

        export const HandleSellerApplication = mutation({
                args:{user_id: v.id("customers"),
                        store_name:v.string(),
                        description:v.string(),
                        location:v.object({
                                lat:v.number(),
                                lng:v.number(),
                })},
                handler: async (ctx, args) => {
                        const user = await ctx.db.get(args.user_id);
                        if (!user) {
                                return { success: false, status: 404, message: "User not found", };
                        }
                        if (user.role === "seller") {
                                return { success: false, status: 400, message: "You are already a seller" };
                        }
                        await ctx.db.insert("seller_applications", {
                                user_id: args.user_id,
                                store_name: args.store_name,
                                description: args.description,
                                location: args.location,
                                status: "pending",
                        });
                }
        })

        export const GetSellerApplications = query({
                handler: async (ctx) => {
                        const applications = await ctx.db.query("seller_applications").collect();
                        return applications;
                }
        })