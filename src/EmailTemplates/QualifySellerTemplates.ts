export const SellerApprovedTemplate = (name: string) => {
        return `
        <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Seller Application Approved</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table width="600" cellpadding="20" cellspacing="0" style="background-color: #ffffff; border-radius: 8px;">
          <tr>
            <td align="center">
              <h2 style="color: #4CAF50;">🎉 Congratulations!</h2>
              <p style="font-size: 16px; color: #333;">Hi <strong>${name}</strong>,</p>
              <p style="font-size: 16px; color: #333;">
                Your application to become a seller on <strong>ShopCheap</strong> has been approved.
              </p>
              <p style="font-size: 15px; color: #555;">
                You can now:
              </p>
              <ul style="text-align: left; font-size: 15px; color: #555;">
                <li>List your products in our marketplace</li>
                <li>Manage your orders and inventory</li>
                <li>Reach thousands of customers across the platform</li>
              </ul>
              <a href="https://shopcheapug.com" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Set Up Your Store
              </a>
              <p style="margin-top: 30px; font-size: 14px; color: #999;">
                We’re excited to have you onboard 🚀
              </p>
              <p style="font-size: 14px; color: #999;">
                ShopCheap
              </p>
            <!-- Footer -->
                    <tr>
                        <td style="background-color: #1f2937; padding: 30px; text-align: center;">
                            
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
                                © ${new Date().getFullYear()} shopcheap. All rights reserved.<br>
                                <a href="#" style="color: #9ca3af; text-decoration: underline;">Privacy Policy</a>
                            </p>
                        </td>
                    </tr>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        
        `
}
export const SellerRejectedTemplate = (name: string, reason:string) => {
        return `
        <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Seller Application Rejected</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table width="600" cellpadding="20" cellspacing="0" style="background-color: #ffffff; border-radius: 8px;">
          <tr>
            <td align="center">
              <h2 style="color: #E53935;">⚠ Application Update</h2>
              <p style="font-size: 16px; color: #333;">Hi <strong>${name}</strong>,</p>
              <p style="font-size: 16px; color: #333;">
                Thank you for applying to become a seller on <strong>ShopCheap</strong>.
              </p>
              <p style="font-size: 15px; color: #555;">
                Unfortunately, your application has not been approved at this time.
              </p>
              <p style="font-size: 15px; color: #555;">This may be due to:</p>
              <ul style="text-align: left; font-size: 15px; color: #555;">
                <li>${reason}</li>
                <li>Missing or incomplete information</li>
                <li>Not meeting our seller requirements</li>
                <li>Other eligibility criteria</li>
              </ul>
              <p style="margin-top: 20px; font-size: 15px; color: #333;">
                You are welcome to reapply once the requirements are met.  
                If you need assistance, simply reply to this email and our support team will help.
              </p>
              <p style="margin-top: 30px; font-size: 14px; color: #999;">
                Thank you for your interest in joining us.
              </p>
              <p style="font-size: 14px; color: #999;">
                ShopCheap
              </p>
       <tr>
                        <td style="background-color: #1f2937; padding: 30px; text-align: center;">
                            
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
                                © ${new Date().getFullYear()} shopcheap. All rights reserved.<br>
                                <a href="#" style="color: #9ca3af; text-decoration: underline;">Privacy Policy</a>
                            </p>
                        </td>
                    </tr>
            </td>
          </tr>
        </table>
      </td>
    </tr>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}