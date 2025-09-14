import { Id } from "../../convex/_generated/dataModel";

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
    _creationTime: number;
};
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
export const formatDate = (dateString: number) => {
        if (dateString ===0) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

export const generateStatusChangeEmailHTML = async (
  Order: OrderItem,
  product?: Product,
  Customer?: User
)=> {
  const companyName = 'ShopCheap'
    const companyLogo="https://cheery-cod-687.convex.cloud/api/storage/143325e4-3c05-4b88-82ba-cbbfa7fcd594"
    const supportEmail = 'eliaakjtrnq@gmail.com'
   const  supportPhone = '+256 787769021'
    const websiteUrl = 'https://shopcheapug.com'
  // Status configuration
  const statusConfig = {
    pending: {
      color: '#f59e0b',
      bgColor: '#fef3c7',
      icon: '⏳',
      title: 'Order Received',
      message: 'We\'ve received your order and are processing it.',
    },
    confirmed: {
      color: '#10b981',
      bgColor: '#d1fae5',
      icon: '✅',
      title: 'Order Confirmed',
      message: 'Your order has been confirmed and is being prepared.',
    },
    'out-for-delivery': {
      color: '#3b82f6',
      bgColor: '#dbeafe',
      icon: '🚚',
      title: 'Out for Delivery',
      message: 'Your order is on its way to you!',
    },
    delivered: {
      color: '#059669',
      bgColor: '#a7f3d0',
      icon: '📦',
      title: 'Delivered',
      message: 'Your order has been successfully delivered.',
    },
    cancelled: {
      color: '#dc2626',
      bgColor: '#fecaca',
      icon: '❌',
      title: 'Order Cancelled',
      message: 'Your order has been cancelled. If you have any questions, please contact us.',
    }
  };
//  const product = useQuery( api.products.getProduct, { id: Order.product_id } ) ;
//  const Customer =useQuery( api.users.GetCustomerById, { id: Order.user_id } ) ;

  const currentStatus = statusConfig[Order.order_status];
  const totalAmount = Order.cost ? parseFloat(Order.cost.toString()) : 0;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Status Update - ${companyName}</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; line-height: 1.6;">
    
    <!-- Email Container -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8f9fa;">
        <tr>
            <td align="center" style="padding: 20px 0;">
                
                <!-- Main Email Content -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 40px; text-align: center;">
                            ${companyLogo ? `<img src="${companyLogo}" alt="${companyName}" style="height: 40px; margin-bottom: 15px;">` : ''}
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                                ${companyName}
                            </h1>
                            <p style="margin: 8px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">
                                Order Status Update
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Status Banner -->
                    <tr>
                        <td style="background-color: ${currentStatus.bgColor}; padding: 20px 40px; text-align: center; border-bottom: 3px solid ${currentStatus.color};">
                            <div style="background-color: rgba(255,255,255,0.8); border-radius: 50px; padding: 15px 30px; display: inline-block; backdrop-filter: blur(10px);">
                                <span style="color: ${currentStatus.color}; font-size: 20px; font-weight: bold;">
                                    ${currentStatus.icon} ${currentStatus.title}
                                </span>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Greeting -->
                    <tr>
                        <td style="padding: 30px 40px 20px 40px;">
                            <h2 style="margin: 0 0 15px 0; color: #2c3e50; font-size: 24px; font-weight: 600;">
                                Hi ${Customer?.username}! 👋
                            </h2>
                            <p style="margin: 0; color: #6c757d; font-size: 16px; line-height: 1.6;">
                                ${currentStatus.message}
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Order Details Card -->
                    <tr>
                        <td style="padding: 0 40px 30px 40px;">
                            <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 12px; padding: 25px; border-left: 4px solid ${currentStatus.color};">
                                
                                <!-- Order Info Row -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                    <tr>
                                        <td style="padding-bottom: 15px;">
                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                <tr>
                                                    <td style="width: 50%;">
                                                        <p style="margin: 0; color: #6c757d; font-size: 14px; font-weight: 500;">ORDER Id</p>
                                                        <p style="margin: 5px 0 0 0; color: #2c3e50; font-size: 16px; font-weight: bold;">#${Order._id}</p>
                                                    </td>
                                                    <td style="width: 50%; text-align: right;">
                                                        <p style="margin: 0; color: #6c757d; font-size: 14px; font-weight: 500;">Date Ordered</p>
                                                        <p style="margin: 5px 0 0 0; color: #2c3e50; font-size: 16px; font-weight: bold;">${formatDate(Order._creationTime)}</p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                
                                </table>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Progress Bar -->
                    ${Order.order_status !== 'cancelled' ? `
                    <tr>
                        <td style="padding: 0 40px 30px 40px;">
                            <h3 style="margin: 0 0 20px 0; color: #2c3e50; font-size: 20px; font-weight: 600;">
                                Order Progress
                            </h3>
                            
                            <div style="display: flex; justify-content: space-between; font-size: 12px; color: #6c757d;">
                                <span style="color: ${Order.order_status === 'pending' || Order.order_status === 'confirmed' || Order.order_status === 'out-for-delivery' || Order.order_status === 'delivered' ? currentStatus.color : '#6c757d'};">Pending</span>
                                <span style="color: ${Order.order_status === 'confirmed' || Order.order_status === 'out-for-delivery' || Order.order_status === 'delivered' ? currentStatus.color : '#6c757d'};">Confirmed</span>
                                <span style="color: ${Order.order_status === 'out-for-delivery' || Order.order_status === 'delivered' ? currentStatus.color : '#6c757d'};">Out for Delivery</span>
                                <span style="color: ${Order.order_status === 'delivered' ? currentStatus.color : '#6c757d'};">Delivered</span>
                            </div>
                        </td>
                    </tr>
                    ` : ''}
                    
                    <!-- Order Items -->
                    <tr>
                        <td style="padding: 0 40px 30px 40px;">
                            <h3 style="margin: 0 0 20px 0; color: #2c3e50; font-size: 20px; font-weight: 600;">
                                Order Items
                            </h3>
                            
                            
                            <!-- Product Item -->
                            <div style="background-color: #ffffff; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin-bottom: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                    <tr>
                                        <td style="width: 60px; vertical-align: top;">
                                            ${product?.product_image ? 
                                                `<img src="${product.product_image[0]||""}" alt="${product.product_name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">` :
                                                `<div style="width: 50px; height: 50px; background: linear-gradient(135deg, ${currentStatus.color} 0%, #667eea 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                                                    <span style="color: #ffffff; font-size: 20px;">📦</span>
                                                </div>`
                                            }
                                        </td>
                                        <td style="padding-left: 15px; vertical-align: top;">
                                            <p style="margin: 0 0 5px 0; color: #2c3e50; font-size: 16px; font-weight: 600;">${product?.product_name}</p>
                                            ${product?.product_cartegory ? `<p style="margin: 0; color: #6c757d; font-size: 14px;">${product?.product_cartegory}</p>` : ''}
                                        </td>
                                        <td style="text-align: right; vertical-align: top;">
                                            <p style="margin: 0; color: #6c757d; font-size: 14px;">Qty: ${Order.quantity}</p>
                                            <p style="margin: 5px 0 0 0; color: #2c3e50; font-size: 16px; font-weight: bold;">Ugx: ${totalAmount}</p>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            
                            
                            <!-- Order Total -->
                            <div style="background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); border-radius: 8px; padding: 20px; color: #ffffff;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                    <tr>
                                        <td>
                                            <p style="margin: 0; font-size: 16px; opacity: 0.8;">Total Amount:</p>
                                        </td>
                                        <td style="text-align: right;">
                                            <p style="margin: 0; font-size: 24px; font-weight: bold;">Ugx: ${totalAmount.toFixed(2)}</p>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Contact Information -->
                    <tr>
                        <td style="padding: 0 40px 30px 40px;">
                            <div style="background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%); border-radius: 12px; padding: 25px; text-align: center;">
                                <h3 style="margin: 0 0 15px 0; color: #2c3e50; font-size: 18px; font-weight: 600;">
                                    Need Help? We're Here for You!
                                </h3>
                                <p style="margin: 0 0 20px 0; color: #6c757d; font-size: 14px;">
                                    Questions about your order? Our friendly team is ready to assist you.
                                </p>
                                
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                    <tr>
                                        <td style="width: 50%; text-align: center; padding-right: 10px;">
                                            <a href="tel:${supportPhone}" style="display: inline-block; background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 25px; font-weight: 600; font-size: 14px;">
                                                📞 ${supportPhone}
                                            </a>
                                        </td>
                                        <td style="width: 50%; text-align: center; padding-left: 10px;">
                                            <a href="mailto:${supportEmail}" style="display: inline-block; background: linear-gradient(135deg, #007bff 0%, #6610f2 100%); color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 25px; font-weight: 600; font-size: 14px;">
                                                ✉️ Email Support
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); padding: 30px 40px; text-align: center;">
                            <p style="margin: 0 0 15px 0; color: #ffffff; font-size: 16px; font-weight: 600;">
                                Thank you for choosing ${companyName}! 🙏
                            </p>
                            <p style="margin: 0 0 20px 0; color: rgba(255,255,255,0.8); font-size: 14px;">
                                We appreciate your business and trust in our service.
                            </p>
                            
                            <p style="margin: 20px 0 0 0; color: rgba(255,255,255,0.6); font-size: 12px;">
                                ${companyName} | You're receiving this because you placed an order with us.<br>
                                <a href="${websiteUrl}" style="color: rgba(255,255,255,0.8); text-decoration: underline;">Visit Website</a>
                            </p>
                        </td>
                    </tr>
                    
                </table>
                
            </td>
        </tr>
    </table>
    
</body>
</html>
  `;
};