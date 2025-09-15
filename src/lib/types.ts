import { Id } from "../../convex/_generated/dataModel"
export interface Product {
        _id: Id<"products">,
        approved: boolean,
        product_cartegory: string,
        product_condition: string,
        product_description: string,
        product_image: string[]
        product_name: string,
        product_owner_id: string,
        product_price: string,
        product_embeddings?: number[],
        product_image_embeddings?: number[],
        product_likes?: number,
        product_views?: number,
        product_sponsorship?: {
                type?: "basic" | "premium" | "platinum",
                duration?: number,
                status?: "active" | "expired"
        }
        _creationTime: number
}
export interface User {
        _id: Id<"customers">,
        username: string,
        email: string,
        passwordHash: string,
        phoneNumber?: string,
        profilePicture?: string,
        isVerified: boolean | false,
        role: string|"",
        reset_token?:string
        reset_token_expires:number,
        updatedAt: number,
        lastLogin?: number,
        _creationTime:number,
}


export interface Bookmark {
        _id?: Id<"bookmarks">,
        product_id?: string,
        user_id?: string,
        _creationTime?: number,
        product?: {
                approved: boolean;
                product_cartegory: string;
                product_condition: string;
                product_description: string;
                product_image: string[];
                product_name: string;
                product_owner_id: string;
                product_price: string;
                _creationTime: number;
                _id: string;
  }|null;
}
export interface Boost {
        product_id: Id<"products">,
        boost_type: "premium" | "basic" | "platinum",
        duration: string,
        status: "active" | "expired" | undefined
        amount: number,
}
export interface Interaction{
          user_id: string
          product_id: string
          count:number
          type:  {
                  view:{
                          count:number
                  },
                  cart:{
                          count:number
                  }
            },
}
export interface BoostWithInteraction extends Product {
        interaction?: Interaction
}

export type Order = {
  _id: Id<"orders">,
  user_id: Id<"customers">,
  order_status: "pending" | "confirmed" | "out-for-delivery" | "delivered" | "cancelled"
  _creationTime: number
  updated_at?: string
  sellerId?: Id<"customers"> 
  product_id: string
  specialInstructions?: string
  quantity: number
  cost?: number
user?: User | null;
  product?: Product|null | undefined
}

export type OrderItem = {
    order_status: "pending" | "confirmed" | "out-for-delivery" | "delivered" | "cancelled";
    _id: Id<"orders">;
    specialInstructions?: string;
    cost?: number;
    sellerId?: Id<"customers">;
    product_id: Id<"products">;
    quantity: number;
    user_id: Id<"customers">;
    updatedAt?: number;
};
export type Transaction = {
        _id: Id<"transactions">;
  user_id:  Id<"customers">;
  order_id?: Id<"orders">;
  amount: number;
  currency?: string;
  status: "pending" | "completed" | "failed" | "cancelled" | "refunded";
  payment_method: "card" | "mobile-money" | "bank-transfer" | "cash" | "other";
  reference?: string;
  type: "purchase" | "refund" | "becoming-a-seller" | "other";
        _creationTime: number;
};
export interface HereSuggestions {
  title: string;
  id: string;
  resultType: string;
  localityType: string;
  address: {
    label: string;
    countryCode: string;
    countryName: string;
    stateCode: string;
    state: string;
    countyCode: string;
    county: string;
    city: string;
    postalCode: string;
  };
  position: {
    lat: number;
    lng: number;
  };
  mapView: {
    west: number;
    south: number;
    east: number;
    north: number;
  };
  scoring: {
    queryScore: number;
    fieldScore: {
      city: number;
    };
  };
}

export interface LocationResult {
  items: HereSuggestions[];
}
export interface Application {
  user_id: string;
  store_name: string;
  description: string;
  location?: {
    lat: number;
    lng: number;
  };
  status: "pending" | "approved" | "rejected";
  _creationTime:number
}