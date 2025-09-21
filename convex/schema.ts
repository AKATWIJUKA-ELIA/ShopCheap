import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  NewsLetter: defineTable({ email: v.string() }).index("by_email", ["email"]),

  cart: defineTable({
    product_id: v.id("products"),
    cart_Owner_id: v.string(),
    quantity: v.number(),
        specialInstructions: v.optional(v.string()),
  }).index("by_cart_Owner_id", ["cart_Owner_id"])
  .index("by_product_and_user", ["product_id", "cart_Owner_id"])
  .index("by_product_id", ["product_id"]),

  cartegories: defineTable({ 
        cartegory: v.string(),
        // SubCategories: v.optional( v.array(v.object({subpic:v.string(),subname:v.string()})),)
   }),

  customers: defineTable({
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
  }).index("by_email", ["email"])
  .index("by_username", ["username"])
  .index("by_isVerified", ["isVerified"])
  .index("by_reset_token_expires", ["reset_token_expires"])
  .index("by_reset_token_and_by_reset_token_expires", ["reset_token", "reset_token_expires"]),

  orders: defineTable({
    order_status: v.union(
        v.literal("pending"),
        v.literal("confirmed"),
        v.literal("out-for-delivery"),
        v.literal("delivered"),
        v.literal("cancelled")
    ),
    product_id: v.id("products"),
    quantity: v.number(),
    user_id: v.id("customers"),
    cost: v.optional(v.number()),
    specialInstructions: v.optional(v.string()),
    sellerId: v.optional(v.id("customers")),
    updatedAt: v.optional(v.number()),
  }).index("by_user_id", ["user_id"])
        .index("by_seller_id", ["sellerId"])
  .index("by_product_id", ["product_id"]),
  
  products: defineTable({
    approved: v.boolean(),
    product_cartegory: v.string(),
    product_condition: v.string(),
    product_description: v.string(),
    product_image: v.array(v.string()),
    product_name: v.string(),
    product_owner_id: v.string(),
    product_price: v.string(),
    product_embeddings:v.optional(v.array(v.number())),
    product_image_embeddings:v.optional(v.array(v.number())),
    product_sponsorship:v.optional(v.object({
        type:v.optional(v.union(
                v.literal("basic"),
                v.literal("premium"),
                v.literal("platinum"),)),
        duration: v.optional(v.number()),
        status: v.optional(v.union(
                v.literal("active"),
                v.literal("expired"),
        )),
    }),),
  product_likes: v.optional(v.number()),
  product_views: v.optional(v.number()),
  _creationTime: v.number()
  }).index("by_product_category", ["product_cartegory"])
  .index("by_product_owner", ["product_owner_id"])
  .index("by_sponsorship", ["product_sponsorship.type"])
  .vectorIndex("by_product_embeddings",{
        vectorField:"product_embeddings",
        dimensions:384
  })
  .vectorIndex("product_image_embeddings",{
        vectorField:"product_image_embeddings",
        dimensions:512
  }),

reviews : defineTable({
    product_id: v.string(),
    reviewer_id: v.string(),
    title: v.string(),
    rating: v.number(),
    review: v.string(),
     verified: v.optional(v.boolean()),
    _creationTime: v.number(),
}).index("by_product_id", ["product_id"])
.index("by_reviewer_id", ["reviewer_id"])
.index("by_reviewer_id_and_product_id", ["reviewer_id", "product_id"]),

bookmarks: defineTable({
    user_id: v.string(),
    product_id: v.string(),
    _creationTime: v.number(),
}).index("by_user_id", ["user_id"])
.index("by_user_id_and_product_id", ["user_id", "product_id"])
.index("by_product_id", ["product_id"]),

interactions:defineTable( {
  user_id: v.string(),
  product_id: v.string(),
  type: v.object({
        view:v.object({
                count:v.number()
        }),
        cart:v.object({
                count:v.number()
        })
  }), // e.g. "view", "cart", "purchase"
}).index("by_user", ["user_id"])
.index("by_product_id", ["product_id"])
.index("by_user_and_type_cart", ["user_id", "type.cart.count"])
.index("by_user_and_type_view", ["user_id", "type.view.count"]),
boosts: defineTable({
    product_id: v.id("products"),
    user_id: v.string(),
    boost_type: v.string(),
    duration: v.number(),
    notified: v.boolean(),
    amount: v.optional(v.number()),
    status: v.union(
        v.literal("active"),
        v.literal("expired")),
}).index("by_product_id", ["product_id"])
.index("by_boost_type", ["boost_type"])
.index("by_user_and_status",["user_id","status"])
.index("by_duration_and_notified", ["duration", "notified"]),
NewsLetterStorage: defineTable({
        subject: v.string(),
        content: v.string(),
        status: v.union(
                v.literal("sent"),
                v.literal("scheduled"),
                v.literal("failed"),
                v.literal("bounced"),
                v.literal("pending")
                
        ),
        scheduledTime: v.number(),
        DateSent: v.optional(v.number()),
        receipients: v.array(v.string()),
}),
transactions: defineTable({
  user_id: v.id("customers"),
  order_id: v.optional(v.id("orders")),
  amount: v.number(),
  currency: v.optional(v.string()),
  status: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("cancelled"),
      v.literal("refunded")
  ),
  payment_method: v.union(
      v.literal("card"),
      v.literal("mobile-money"),
      v.literal("bank-transfer"),
      v.literal("cash"),
      v.literal("other")
  ),
  reference: v.optional(v.string()),
  type:  v.union(
      v.literal("purchase"),
      v.literal("refund"),
      v.literal("becoming-a-seller"),
      v.literal("other")
  ),
}).index("by_user_id", ["user_id"])
  .index("by_order_id", ["order_id"])
  .index("by_status", ["status"])
  .index("by_order_and_user", ["order_id", "user_id"])
  .index("by_payment_method", ["payment_method"]),
  seller_applications: defineTable({
        user_id: v.string(),
        store_name: v.string(),
        description: v.string(),
        location: v.optional(v.object({
                lat: v.number(),
                lng: v.number(),
        })),
        status: v.union(
                v.literal("pending"),
                v.literal("approved"),
                v.literal("rejected")
        )
  }).index("by_user_id", ["user_id"]),
  shops: defineTable({
        owner_id: v.string(),
        shop_name: v.string(),
        description: v.string(),
        location: v.optional(v.object({
                lat: v.number(),
                lng: v.number(),
        })),
        profile_image: v.optional(v.string()),
        cover_image: v.optional(v.string()),
        isOpen: v.boolean(),
  }).index("by_owner_id", ["owner_id"])
        .index("by_shop_name", ["shop_name"])
});
