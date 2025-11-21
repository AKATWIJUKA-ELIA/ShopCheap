import {action, internalQuery, mutation, query} from "./_generated/server"
import {v} from "convex/values"
import { api, internal } from "../convex/_generated/api";
import { Doc, Id } from "./_generated/dataModel";

export const generateUploadUrl = mutation(async (ctx)=>{
      return await ctx.storage.generateUploadUrl()
})
function getFutureDate(duration: string): string {
  const now = new Date();

  if (duration === "weekly") {
    now.setDate(now.getDate() + 7);
    return now.toISOString();
  }
  if (duration === "monthly") {
    now.setMonth(now.getMonth() + 1);
    return now.toISOString();
  }
  if (duration === "quarterly") {
    now.setMonth(now.getMonth() + 3);
    return now.toISOString();
  }
  // Default: 7 days
  now.setDate(now.getDate() + 7);
  return now.toISOString();
}


export const createProduct = mutation({
        args:{
              products: v.object({
                approved: v.boolean(),
                product_cartegory: v.string(),
                product_condition: v.union(
                        v.literal("new"),
                        v.literal("used"),
                        v.literal("refurbished")
                ),
                product_description: v.string(),
                product_image: v.array(v.string()),
                product_name: v.string(),
                product_owner_id: v.string(),
                product_price: v.string(),
                product_discount: v.optional(v.number()),
                product_embeddings:v.optional(v.array(v.number())),
                product_image_embeddings:v.optional(v.array(v.number())),

                  }),
        },
        handler: async (ctx, args) => {
                try{
              await ctx.db.insert("products", {
                    ...args.products,
              });
              return { success: true, message: "Product created successfully" };
        }catch{
                return { success: false, message: "Error creating product" };   
        }
        },
  })

  export const getProducts: ReturnType<typeof query> = query({
           
        handler: async (ctx) => {

      const products = await ctx.db.query("products")
      .filter((q)=> q.eq(q.field("approved"), true))
      .collect();

        const productIds = new Set(products.map(p => p._id));
        const allReviews = await ctx.db.query("reviews").collect();

        const reviews = allReviews.filter((review) => productIds.has(review.product_id as Id<"products">));
        
        const finalProducts = await Promise.all(products.map(async (product) => {
                // const reviews = await ctx.runQuery(api.reviews.getReviewsByProduct, { product_id:product._id });
                const images = product.product_image ?? []
                const resolvedImages =images.length === 0 ? [] : await Promise.all(
                        images.slice(0, 3).map((image) => ctx.storage.getUrl(image)),)
                        return {
                                ...product,
                                product_image:resolvedImages.filter((url): url is string => url !== null),
                                reviews: reviews};
                        }));

//       console.log(finalProducts)
      return finalProducts;
      
    },
    
  })

  export const getProduct = query({
        args:{id: v.string(),},
              handler: async (ctx, args) => {
                     const single = await ctx.db.query("products").filter((q)=> q.eq(q.field("_id"), args.id)).first(); 
                //      console.log("Single Job",single)
                    if (single) {
                        single.product_image = (
                        await Promise.all(
                        single.product_image.map(async (image: string) => {
                        return await ctx.storage.getUrl(image);
                        })
                        )
                        ).filter((url): url is string => url !== null);
                    }
                    return single
                    },
                    })
        

export const getProductsByIds = query({
args: { ids: v.array(v.string()) }, // Accept an array of product IDs
handler: async (ctx, { ids }) => {
        return await Promise.all(
          ids.map(async (id) => {
            const normalizedId = ctx.db.normalizeId("products", id);
            if (!normalizedId) {
              throw new Error(`Invalid ID: ${id}`);
            }
            const product= await ctx.db.get(normalizedId);
            if(product){
                product.product_image = (await Promise.all(
                        product.product_image.map(async (image: string) => {
                                return await ctx.storage.getUrl(image);
                        }
                ))).filter((url): url is string => url !== null);
          }
          return product;
        })
        ); // Fetch all products at once
},

});

export const getImageUrl = query({
        args: { fileId: v.id("_storage") }, // Convex stores files in the `_storage` table
        handler: async (ctx, { fileId }) => {
          return await ctx.storage.getUrl(fileId); // Generate the view URL
        },
      });

      export const getProductsByOwner = query({
        args: { id: v.string() },
        handler: async (ctx, args) => {
          const products = await ctx.db
            .query("products")
            .filter((q) => q.eq(q.field("product_owner_id"), args.id))
            .collect();
      
          for (const product of products) {
            product.product_image = (await Promise.all(
              product.product_image.map(async (image: string) => {
                return await ctx.storage.getUrl(image);
              })
            )).filter((url): url is string => url !== null);
          }
      
        //   console.log("primary products:", products);
          return products;
        },
      });

      export const getProductsByOwnerApproved = query({
        args: { id: v.string() },
        handler: async (ctx, args) => {
          const products = await ctx.db
            .query("products")
            .filter((q) => q.and(
                q.eq(q.field("product_owner_id"), args.id),
                q.eq(q.field("approved"),true)
              ))
            .collect();
      
          for (const product of products) {
            product.product_image = (await Promise.all(
              product.product_image.map(async (image: string) => {
                return await ctx.storage.getUrl(image);
              })
            )).filter((url): url is string => url !== null);
          }
      
        //   console.log("primary products:", products);
          return products;
        },
      });

      export const getRelatedProducts = query({
        args: { category: v.string() },
        handler: async (ctx, args) => {
          const products = await ctx.db
            .query("products")
            .withIndex("by_product_category", q => q.eq("product_cartegory", args.category))
            .filter((q) => q.and(
                q.eq(q.field("product_cartegory"), args.category),
                q.eq(q.field("approved"),true)
              ))
            .collect();
      
          for (const product of products) {
            product.product_image = (await Promise.all(
              product.product_image.map(async (image: string) => {
                return await ctx.storage.getUrl(image);
              })
            )).filter((url): url is string => url !== null);
          }
      
        //   console.log("Related products:", products);
          return products;
        },
      });

      export const UpdateProduct = mutation({
        args:{_id: v.id("products"),
                product: v.object({
                _id: v.id("products"),
                 approved: v.boolean(),
                  product_cartegory: v.string(),
                  product_condition: v.union(
                          v.literal("new"),
                          v.literal("used"),
                          v.literal("refurbished")
                  ),
                  product_description: v.string(),
                  product_image: v.array(v.string()),
                  product_name: v.string(),
                  product_price: v.string(),
                    }),
          },
        handler: async (ctx, args) => {
              if(args.product){
              const product = await ctx.db.patch(args._id, args.product);
              return product
              }
              
        }})

        export const DeleteProduct = mutation({
                args: { id: v.id("products") }, // use `v.id("tableName")` for safety
                handler: async (ctx, args) => {
                  const product = await ctx.db.get(args.id);
              
                  if (!product) {
                    throw new Error("Product not found");
                  }
              
                  await ctx.db.delete(args.id);
                  return { success: true };
                },
        });

        
        export const getAllProducts = query({
                handler: async (ctx) => {
              const products = await ctx.db.query("products").collect(); 
        //       console.log(products)
              return Promise.all(
                products.map(async (product) => ({
                  ...product,
                  product_image: product.product_image ? await ctx.storage.getUrl(product.product_image[0]) : null,
                 
                }))
              
              );
              
            },
            
        })

        export const ApproveRevoke = mutation({
                args: { id: v.id("products") },
                handler: async (ctx, args) => {
                  const product = await ctx.db.get(args.id);
              
                  if (!product) {
                    throw new Error("Product not found");
                  }
              
                  const updatedProduct = await ctx.db.patch(args.id, {
                    approved: !product.approved,
                  });
              
                  return updatedProduct;
                },
        });

        export const searchResults = internalQuery({
                args:{
                        results: v.array(
                                v.object({
                                        _id: v.id("products"),
                                        _score: v.number()
                                }),
                        ),
                },
                handler: async (ctx, {results}) =>{
                        const products = await Promise.all(
                                results.map(async ({_id,_score}) =>{
                                        const product = await ctx.db.get(_id);
                                        if(!product) return null;
                                        return {
                                                ...product,
                                                score:_score,
                                        }
                                }
                        ))
                        return products.filter((b)=> b!= null && b.score > 0.256);
                }
        })

        export const ImagesearchResults = internalQuery({
                args:{
                        results: v.array(
                                v.object({
                                        _id: v.id("products"),
                                        _score: v.number()
                                }),
                        ),
                },
                handler: async (ctx, {results}) =>{
                        const products = await Promise.all(
                                results.map(async ({_id,_score}) =>{
                                        const product = await ctx.db.get(_id);
                                        if(!product) return null;
                                        product.product_image = (await Promise.all(
                                                        product.product_image.map(async (image: string) => {
                                                                return await ctx.storage.getUrl(image);
                                                        }
                                                ))).filter((url): url is string => url !== null);
                                        return {
                                                ...product,
                                                score:_score,
                                        }
                                }
                        ))
                        return products.filter((b)=> b!= null && b.score > 0.256);
                }
        })


        export const vectorSearch: ReturnType<typeof action> = action({
                args: { embeding: v.array(v.number()) },
                handler: async (ctx, args) => {
                        const results = await ctx.vectorSearch("products", "by_product_embeddings", {
                                vector: args.embeding,
                                limit: 6
                        });
                        return await ctx.runQuery(
                                internal.products.searchResults, { results }
                        );
                }

        });

        export const ImagevectorSearch: ReturnType<typeof action> = action({
                args: { embeding: v.array(v.number()) },
                handler: async (ctx, args) => {
                        const results = await ctx.vectorSearch("products", "product_image_embeddings", {
                                vector: args.embeding,
                                limit: 6
                        });
                        return await ctx.runQuery(
                                internal.products.ImagesearchResults, { results }
                        );
                }

        });
              
        export const recordInteraction = mutation({
                args: {
                user_id: v.string(),
                product_id: v.string(),
                type: v.string(), // "view" | "cart" | "purchase"
                },
  handler: async (ctx, args) => {
        const exisitingProduct = await ctx.db.query("products").filter((q) =>
                        q.eq(q.field("_id"), args.product_id))
                        .first();
                        if(args.type ==="view"){
                await ctx.db.patch(exisitingProduct?._id as Id<"products"> , {
                        product_views: (exisitingProduct?.product_views || 0) + 1,
                });
                        }

        const existingInteraction = await ctx.db
        .query("interactions")
        .filter((q) =>
                q.and(
                q.eq(q.field("user_id"), args.user_id),
                q.eq(q.field("product_id"), args.product_id)
                )
        )
        .first();

    // Helper to build the type object
    const buildTypeObject = (
      base: { cart: { count: number }; view: { count: number } },
      interactionType: string
    ) => {
      if (interactionType === "cart") {
        return {
          cart: { count: base.cart.count + 1 },
          view: { count: base.view.count },
        };
      }
      if (interactionType === "view") {
        return {
          cart: { count: base.cart.count },
          view: { count: base.view.count + 1 },
        };
      }
      return base;
    };

    // If no interaction exists, create one
    if (!existingInteraction) {
      let typeObj = {
        cart: { count: 0 },
        view: { count: 0 },
      };
      if (args.type === "cart") {
        typeObj.cart.count = 1;
      } else if (args.type === "view") {
        typeObj.view.count = 1;
      }

      await ctx.db.insert("interactions", {
        user_id: args.user_id,
        product_id: args.product_id,
        type: typeObj,
      });
      return {
        success: true,
        message: "Interaction recorded successfully",
      };
    }

        // If interaction exists, update it
    let newTypeObj = buildTypeObject(
      existingInteraction.type,
      args.type
    );
    await ctx.db.patch(
      existingInteraction._id as Id<"interactions">,
      {
        type: newTypeObj,
      }
    );
    return {
      success: true,
      message: "Interaction updated successfully",
    };
  },
});

        export const getInteractionsbyProductIds = query({
        args: {
        product_ids: v.array(v.string()),
        },
        handler: async (ctx, args) => {
        const allInteractions = await Promise.all(
                args.product_ids.map(async (id) => {
                const interactions = await ctx.db
                .query("interactions")
                .withIndex("by_product_id", (q) => q.eq("product_id", id))
                .collect();
                return interactions; 
        })
        );

        // Flatten if needed, since this will be an array of arrays
        return allInteractions.flat();
        },
        });

        export const recommendProducts: ReturnType<typeof query> = query({
                args: { user_id: v.string(), type: v.string() }, // type can be "view", "cart", "purchase"
                handler: async (ctx, args) => {
                        const getConditionalRecommendations = (type: string) => {
                                switch (type) {
                                        case "view":
                                                return ctx.db.query("interactions")
                                                .withIndex("by_user_and_type_view", (q) => q.eq("user_id", args.user_id).gt("type.view.count",0 ))
                                                .take(10);
                                        case "cart":
                                                return ctx.db.query("interactions")
                                                .withIndex("by_user_and_type_cart", (q) => q.eq("user_id", args.user_id).gt("type.cart.count",0 ))
                                                .take(10);
                                        // case "purchase":
                                        //         return ctx.db.query("interactions")
                                        //         .withIndex("by_user_and_type_purchase", (q) => q.eq("user_id", args.user_id).gt("type.purchase.count",0 ));
                                        default:
                                                throw new Error(`Unknown interaction type: ${type}`);
                                }
                        }

                        const recommendations = await getConditionalRecommendations(args.type);

                        if (!recommendations  || recommendations.length === 0) {
                                return await ctx.runQuery(
                                        internal.products.getTopRated ).then(
                                                results => results.slice(0, 3) 
                                        ) // show  top rated  products
                        }
                                            
                        const recommendedProductIds = [...new Set(recommendations.map((v) => v.product_id))];

                        const recommendedProducts = await Promise.all(
                                recommendedProductIds.map((id) => ctx.db.query("products").filter((q) => q.eq(q.field("_id"), id)).first()
                                .then(async (product) => {
                                        if (!product) return null; // Handle case where product is not found
                                        return {
                                                ...product,
                                                product_image: (product.product_image && product.product_image.length > 0) ? 
                                                (await Promise.all(
                                                        product.product_image.map(async (image: string) => {
                                                                return await ctx.storage.getUrl(image);
                                                        })
                                                )).filter((url): url is string => url !== null) : []
                                        };
                                }
                        )
                                
                        ));
                        return recommendedProducts.filter((product) => product !== null); // Filter out any null products
                        }
                        
        })

        export const getTopRated = internalQuery({
                handler: async (ctx): Promise<(Doc<"products"> & { reviews: Doc<"reviews">[]; product_image: string[] })[]> => {
                        const TopRatedIds = [
                                ...new Set((await ctx.db.query("reviews")
                                .collect())
                                .filter((review) => review.rating > 2)
                                .map((review) => review.product_id)
                        )];
                        // console.log("Top rated Ids",TopRatedIds)
                        return await Promise.all(
                                TopRatedIds.map(async (id)
                                :Promise<(Doc<"products"> & { reviews: Doc<"reviews">[]; product_image: string[] }) | null> => ctx.db.query("products").filter((q) => q.eq(q.field("_id"), id)).first()
                                .then(async (product) => {
                                        // console.log("product: ", product)
                                        if (!product) return null; // Handle case where product is not found
                                         const reviews = await ctx.runQuery(api.reviews.getReviewsByProduct, { product_id:product._id });
                                        return {
                                                ...product,
                                                reviews: reviews,
                                                product_image: (product.product_image && product.product_image.length > 0) ? 
                                                (await Promise.all(
                                                        product.product_image.map(async (image: string) => {
                                                                return await ctx.storage.getUrl(image);
                                                        })
                                                )).filter((url): url is string => url !== null) : []
                                        };
                                }

                        )
                        )).then((TopRatedProducts) => TopRatedProducts.filter((product): product is Doc<"products"> & { reviews: Doc<"reviews">[]; product_image: string[] } => product !== null));
                        // return TopRatedProducts
                }
        })

        export const getTopRatedProducts: ReturnType<typeof query> = query({
                handler: async (ctx) => {       
                        const topRatedProducts = await ctx.runQuery(internal.products.getTopRated);
                        return topRatedProducts;
                }
        })

        export const getSponsoredProducts = query({
                handler: async (ctx) => {
                        const fetchSponsored = await ctx.db.query("products")
                        .withIndex("by_sponsorship")
                          .filter((q) =>
                            q.or(
                              q.eq(q.field("product_sponsorship.type"), "premium"),
                              q.eq(q.field("product_sponsorship.type"), "platinum"),
                              q.eq(q.field("product_sponsorship.type"), "basic")
                            )
                          )
                          .collect();
                          const groups:{[key: string]: typeof fetchSponsored} = {platinum: [],premium: [],basic: []};
                          for (const p of fetchSponsored) {
                                const type = p.product_sponsorship?.type;
                                if ((type && groups[type])) groups[type].push(p);
                        }
                        const { platinum, premium, basic } = groups;
                        const sponsored = [...premium, ...basic, ...platinum];
                         // Collect all unique storage IDs
                        const storageIds = new Set<string>();
                        for (const product of sponsored) {
                        if (product.product_image?.length) {
                                product.product_image.forEach((id: string) => storageIds.add(id));
                        }
                        }

                        // Fetch all URLs in parallel (batch operation)
                        const urlMap = new Map<string, string | null>();
                        await Promise.all(
                        Array.from(storageIds).map(async (id) => {
                                const url = await ctx.storage.getUrl(id);
                                urlMap.set(id, url);
                        })
                        );

                        return await Promise.all(
                                sponsored.map(async (product) => {
                                        if (!product) return null; // Handle case where product is not found
                                        return {
                                                ...product,
                                                product_image: product.product_image?.length>0? product.product_image
                                                .map((id: string) => urlMap.get(id))
                                                .filter((url): url is string => url !== null)
                                                : []
                                        };
                                })
                        );
                          
        }})

        export const BoostProducts = mutation({
                args: {
                        product_id: v.id("products"),
                        user_id: v.string(),
                        boost_type:v.union(
                                v.literal("basic"),
                                v.literal("premium"),
                                v.literal("platinum"),),
                        duration: v.string(), 
                        amount: v.optional(v.number()), 
                        status: v.optional(v.union(
                                v.literal("active"),
                                v.literal("expired"),))
                },
                handler: async (ctx, args) => {

                        const product = await ctx.db.get(args.product_id)
                        if (!product) {
                                return { success: false, message: "Product not found" };
                        }
                        
                        const existingBoost = await ctx.db.query("boosts")
                                .filter((q) => q.eq(q.field("product_id"), args.product_id))
                                .first();

                        if (existingBoost && existingBoost.status === "active") {
                                return { success: false, message: "Product is already boosted" };
                        }else if (existingBoost && existingBoost.status === "expired") {
                                await ctx.db.patch(args.product_id, {
                                product_sponsorship: {
                                        type: args.boost_type,
                                        status: args.status ? args.status : "active",
                                        duration: args.duration ? new Date(getFutureDate(args.duration)).getTime() : new Date(getFutureDate("weekly")).getTime(), // Default to 7 days if not provided
                                }
                        });
                        const boostData = {
                        product_id: args.product_id,
                        user_id: args.user_id,
                        boost_type: args.boost_type,
                        duration: args.duration ? new Date(getFutureDate(args.duration)).getTime() : new Date(getFutureDate("weekly")).getTime(),
                        amount: args.amount,
                        status: args.status ?? "active",
                        notified: false,
                        };
                        await ctx.db.patch(existingBoost._id as Id<"boosts">, boostData);
                        // send Email to user
                        await ctx.runMutation(api.sendEmail.sendEmail, {
                                receiverEmail: await ctx.db.get(product.product_owner_id as Id<"customers">).then(user => user?.email||""),
                                subject: "Your Boost has been Re-processed",
                                html: `Hi, your Boost for the product ${product.product_name} has been re-processed successfully. Enjoy the benefits!`,
                                department:"support",
                        })
                        return { success: true, message: "Boost Re-processed successfully" };
                        }else{
                                await ctx.db.patch(args.product_id, {
                                product_sponsorship: {
                                        type: args.boost_type,
                                        status: args.status ? args.status : "active",
                                        duration: args.duration ? new Date(getFutureDate(args.duration)).getTime() : new Date(getFutureDate("weekly")).getTime(), // Default to 7 days if not provided
                                }
                        });
                   
                        // Insert the boost record
                        await ctx.db.insert("boosts", {
                                ...args,
                                status: args.status ? args.status : "active",
                                notified: false, // Set notified to false initially
                                duration: args.duration ? new Date(getFutureDate(args.duration)).getTime() : new Date(getFutureDate("weekly")).getTime(), // Default to 7 days if not provided
                        });
                        
                        return { success: true, message: "Boost processed successfully" };
                        }

                }
        })

export const getBoostedProductsIdsByUser = query({
        args: { user_id: v.string() },
        handler: async (ctx, args) => {
                const boosts = await ctx.db.query("boosts")
                .withIndex("by_user_and_status",(q)=>(q.eq("user_id",args.user_id)))
                .collect();
                const boostedProductsIds = await Promise.all(
                        boosts.map(async (boost) => {
                                return boost.product_id;
                        })
                );
                return boostedProductsIds.filter((id) => id !== null);
        }
});

export const getBoostedProductsIds= query({
        args: {},
        handler: async (ctx, args) => {
                const boosts = await ctx.db.query("boosts")
                .collect();
                const boostedProductsIds = await Promise.all(
                        boosts.map(async (boost) => {
                                return boost.product_id;
                        })
                );
                return boostedProductsIds.filter((id) => id !== null);
        }
});