import { Id } from "../../convex/_generated/dataModel";

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
interface EmailOptions {
  title?: string;
  subtitle?: string;
  headerColor?: string;
  accentColor?: string;
  companyName?: string;
  companyLogo?: string;
  footerText?: string;
  unsubscribeUrl?: string;
  websiteUrl?: string;
}

export function generateProductEmailHTML(
  products: Product[], 
  options: EmailOptions = {}
): string {
  const {
    title = "Recommended Products Just for You",
    subtitle = "Discover our latest collection of amazing products",
    headerColor = "#4f46e5",
    accentColor = "#f59e0b",
    companyName = "ShopCheap",
    companyLogo = "https://cheery-cod-687.convex.cloud/api/storage/143325e4-3c05-4b88-82ba-cbbfa7fcd594",
    footerText = "Thank you for being a valued customer!",
    websiteUrl = "https://shopcheapug.com"
  } = options;

  const generateStars = (rating: number = 5) => {
    return Array.from({ length: 5 }, (_, i) => 
      i < Math.floor(rating) ? "⭐" : "☆"
    ).join("");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'Ugx'
    }).format(price);
  };

  const productsHTML = products.map(product => `
    <tr>
      <td style="padding: 20px 0; border-bottom: 1px solid #e5e7eb;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <!-- Product Image -->
            <td style="width: 150px; vertical-align: top; padding-right: 20px;">
              <div style="width: 130px; height: 130px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                <img src="${product.product_image[0]||""}" alt="${product.product_name}" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
              </div>
            </td>
            
            <!-- Product Details -->
            <td style="vertical-align: top;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td>
                    <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 18px; font-weight: 600; line-height: 1.3;">
                      ${product.product_name}
                    </h3>
                    
                    ${product.product_cartegory ? `
                    <div style="margin-bottom: 8px;">
                      <span style="background-color: ${accentColor}20; color: ${accentColor}; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 500;">
                        ${product.product_cartegory}
                      </span>
                    </div>
                    ` : ''}
                    
                    ${product.product_description ? `
                    <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                      ${product.product_description}
                    </p>
                    ` : ''}
                    
                    ${product.product_views ? `
                    <div style="margin-bottom: 12px;">
                      <span style="color: #fbbf24; font-size: 16px; margin-right: 8px;">
                        ${generateStars(product.product_views)}
                      </span>
                      <span style="color: #6b7280; font-size: 14px;">
                        (${product.product_views}/5)
                      </span>
                    </div>
                    ` : ''}
                    
                    <!-- Price and Stock -->
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
                      <div>
                        <span style="color: ${headerColor}; font-size: 20px; font-weight: 700;">
                          ${formatPrice(Number(product.product_price))}
                        </span>
                      </div>
                      
                      
                    </div>
                    
                    <!-- CTA Button -->
                    <a href="${websiteUrl}/product/${product._id}" style="display: inline-block; background: linear-gradient(135deg, ${headerColor} 0%, ${accentColor} 100%); color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; transition: all 0.3s ease;">
                      Shop Now
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - ${companyName}</title>
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
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb; line-height: 1.6;">
    
    <!-- Email Container -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f9fafb;">
        <tr>
            <td align="center" style="padding: 20px 0;">
                
                <!-- Main Email Content -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); overflow: hidden;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, ${headerColor} 0%, ${accentColor} 100%); padding: 40px 30px; text-align: center;">
                            ${companyLogo ? `
                            <img src="${companyLogo}" alt="${companyName}" style="max-height: 50px; margin-bottom: 20px;" />
                            ` : ''}
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                                ${title}
                            </h1>
                            <p style="margin: 12px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">
                                ${subtitle}
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Products Section -->
                    <tr>
                        <td style="padding: 30px;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                ${productsHTML}
                            </table>
                        </td>
                    </tr>
                    
                    <!-- CTA Section -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px; text-align: center;">
                            <div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); border-radius: 12px; padding: 30px;">
                                <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 22px; font-weight: 600;">
                                    Ready to Shop?
                                </h3>
                                <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 16px;">
                                    Discover more amazing products in our store
                                </p>
                                <a href="${websiteUrl}" style="display: inline-block; background: linear-gradient(135deg, ${headerColor} 0%, ${accentColor} 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                                    Visit Our Store
                                </a>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #1f2937; padding: 30px; text-align: center;">
                            <p style="margin: 0 0 15px 0; color: #ffffff; font-size: 16px; font-weight: 600;">
                                ${footerText}
                            </p>
                            <p style="margin: 0 0 20px 0; color: #9ca3af; font-size: 14px;">
                                Follow us for more updates and exclusive offers
                            </p>
                            
                            <!-- Social Links -->
                            <div style="margin-bottom: 20px;">
                                <a href="#" style="display: inline-block; margin: 0 10px; width: 40px; height: 40px; background-color: rgba(255,255,255,0.1); border-radius: 50%; text-align: center; line-height: 40px; text-decoration: none;">
                                    <span style="color: #ffffff; font-size: 16px;">📘</span>
                                </a>
                                <a href="#" style="display: inline-block; margin: 0 10px; width: 40px; height: 40px; background-color: rgba(255,255,255,0.1); border-radius: 50%; text-align: center; line-height: 40px; text-decoration: none;">
                                    <span style="color: #ffffff; font-size: 16px;">📷</span>
                                </a>
                                <a href="#" style="display: inline-block; margin: 0 10px; width: 40px; height: 40px; background-color: rgba(255,255,255,0.1); border-radius: 50%; text-align: center; line-height: 40px; text-decoration: none;">
                                    <span style="color: #ffffff; font-size: 16px;">🐦</span>
                                </a>
                            </div>
                            
                            <p style="margin: 0; color: #6b7280; font-size: 12px;">
                                © ${new Date().getFullYear()} ${companyName}. All rights reserved.<br>
                                <a href="#" style="color: #9ca3af; text-decoration: underline;">Privacy Policy</a>
                            </p>
                        </td>
                    </tr>
                    
                </table>
                
            </td>
        </tr>
    </table>
    
</body>
</html>
  `.trim();
}

// Example usage function
export function sendProductEmail(products: Product[], customerEmail: string, options?: EmailOptions) {
  const htmlContent = generateProductEmailHTML(products, options);
  
  // Here you would integrate with your email service (SendGrid, Mailgun, etc.)
  console.log('Generated HTML for email:', htmlContent);
  
  return htmlContent;
}
