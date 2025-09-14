export const AccountDeletion = (email: string, username: string) => {
        const currentYear = new Date().getFullYear()
        return `
        <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Deletion </title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 30px 20px; text-align: center;">
              <h1 style="font-size: 24px; color: #333333; margin: 0;">Account Deletion </h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 20px 30px; font-size: 16px; line-height: 24px; color: #555555;">
              <p style="margin: 0 0 16px;">Dear ${username},</p>
              <p style="margin: 0 0 16px;">Your account, associated with the email ${email}, has been permanently removed from our system Since you didnt verify it within Seven (7) days from creation, .
              </p>
              <p style="margin: 0 0 16px;">
               Please Create a new account to continue enjoying our services! <a href="https://shopcheapug.com/sign-up">Create Account</a> and verify it atleast within 7 days to avoid account deletion in the future.
              </p>
              
              <p style="margin: 0;">Thank you for using <a href="https://shopcheapug.com/" style="color: #007bff; text-decoration: none;">ShopCheap.</p>
            </td>
          </tr>
         
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; background-color: #f8f8f8; text-align: center; font-size: 14px; color: #777777; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
              <p style="margin: 0 0 10px;">This is an automated message. Please do not reply directly to this email.</p>
              <p style="margin: 0;">&copy; ${currentYear} ShopCheap. All rights reserved.</p>
              <!--<p style="margin: 10px 0 0;">
                <a href="https://{{appDomain}}/privacy" style="color: #007bff; text-decoration: none; margin: 0 8px;">Privacy Policy</a> |
                <a href="https://{{appDomain}}/terms" style="color: #007bff; text-decoration: none; margin: 0 8px;">Terms of Service</a>
              </p>  -->
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