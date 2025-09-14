import { User } from "@/lib/types"
const currentYear = new Date().getFullYear()
export const WelcomeEmail = (user:User,token:string)=>{
        return `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to ShopCheap!</title>
    <style>
        /* Basic Reset & Body Styles */
        body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', sans-serif; /* Using Inter as per instructions */
            background-color: #f4f4f4;
            color: #333333;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        table {
            border-spacing: 0;
            border-collapse: collapse;
        }
        td {
            padding: 0;
        }
        img {
            border: 0;
            -ms-interpolation-mode: bicubic;
        }
        a {
            text-decoration: none;
            color: #007bff; /* Standard link color */
        }

        /* Container & Content Area */
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px; /* Rounded corners */
            overflow: hidden; /* Ensures rounded corners are visible */
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow */
        }
        .content-area {
            padding: 20px 30px;
        }

        /* Header */
        .header {
            background-color: #FFD700; /* A friendly green for ShopCheap */
            padding: 20px 30px;
            text-align: center;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }
        .header h1 {
            color: #ffffff;
            font-size: 28px;
            margin: 0;
            padding: 0;
        }

        /* Button Styling */
        .button {
            display: inline-block;
            background-color: #FFD700; /* A nice blue for the button */
            color: #ffffff;
            padding: 12px 25px;
            border-radius: 6px; /* Rounded button corners */
            font-weight: bold;
            font-size: 16px;
            text-align: center;
            white-space: nowrap;
        }
        .button:hover {
            background-color: #FFD700; /* Darker blue on hover */
        }

        /* Image Placeholder Styling */
        .hero-image {
            width: 100%;
            max-width: 540px; /* Max width to fit content area */
            height: auto;
            border-radius: 8px; /* Rounded corners for the image */
            margin-bottom: 25px; /* Space below the image */
            display: block; /* Ensures it behaves like a block element for margin auto */
            margin-left: auto;
            margin-right: auto;
        }

        /* Footer */
        .footer {
            background-color: #f0f0f0;
            padding: 20px 30px;
            text-align: center;
            font-size: 12px;
            color: #777777;
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
        }
        .footer a {
            color: #777777;
            text-decoration: underline;
        }

        /* Responsive Adjustments */
        @media only screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
                border-radius: 0;
                box-shadow: none;
            }
            .content-area, .header, .footer {
                padding: 15px 20px !important;
            }
            .header h1 {
                font-size: 24px !important;
            }
            .button {
                padding: 10px 20px !important;
                font-size: 14px !important;
            }
            .hero-image {
                border-radius: 4px; /* Slightly less rounded on small screens */
            }
        }
    </style>
</head>
<body>
    <center>
        <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#f4f4f4">
            <tr>
                <td align="center" style="padding: 20px 0;">
                    <table class="email-container" width="100%" border="0" cellpadding="0" cellspacing="0">
                        <!-- Header -->
                        <tr>
                            <td class="header">
                                <h1>Welcome to ShopCheap!</h1>
                            </td>
                        </tr>
                        <!-- Content -->
                        <tr>
                            <td class="content-area">
                                <!-- Image Placeholder Added Here -->
                                <img src="https://placehold.co/600x200/FFD700/ffffff?text=Welcome+to+ShopCheap!" alt="Welcome to ShopCheap" class="hero-image">

                                <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                                    Hi ${user.username},
                                </p>
                                <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                                    Thank you for joining the ShopCheap family! We're thrilled to have you on board.
                                    Get ready to discover amazing deals on a wide range of products, all designed to make your shopping experience easy and affordable.
                                    Note: Please <a href="https://shopcheapug.com/api/verifyaccount?k9m3p7q2r8t4v1w6x5y9z2a8b4c6d1e7f3g9h2j5k8m4n6p1q7r3t9u2v5w8x4y6z3a9b2c7d1e4f8g6h2j9k5m3=${token}">verify your email address here</a> to start receiving updates and special offers!
                                </p>
                                <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                                    At ShopCheap, we're committed to bringing you quality items at prices you'll love. Whether you're looking for electronics, fashion, home goods, or more, we've got something for everyone.
                                </p>
                                <p style="font-size: 16px; line-height: 1.6; text-align: center; margin-bottom: 30px;">
                                    <a href="https://shopcheapug.com/" class="button">Start Shopping Now!</a>
                                </p>
                                <p style="font-size: 16px; line-height: 1.6; margin-bottom: 5px;">
                                    Here are a few things you can do to get started:
                                </p>
                                <ul style="font-size: 16px; line-height: 1.6; margin-top: 0; padding-left: 20px;">
                                    <li style="margin-bottom: 5px;">Explore our latest arrivals and trending products.</li>
                                    <li style="margin-bottom: 5px;">Browse by category to find exactly what you need.</li>
                                    <li style="margin-bottom: 5px;">Create a wishlist of your favorite items.</li>
                                </ul>
                                <p style="font-size: 16px; line-height: 1.6; margin-top: 20px;">
                                    Happy shopping!
                                </p>
                                <p style="font-size: 16px; line-height: 1.6; margin-top: 20px;">
                                    Best regards,<br>
                                    ShopCheap
                                </p>
                            </td>
                        </tr>
                        <!-- Footer -->
                        <tr>
                            <td class="footer">
                                <p>&copy; ${currentYear} ShopCheap. All rights reserved.</p>
                                <p>
                                    <a href="[Link to your Privacy Policy]" target="_blank">Privacy Policy</a> |
                                    <a href="[Link to your Terms of Service]" target="_blank">Terms of Service</a>
                                </p>
                                <p>You received this email because you subscribed to ShopCheap.</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </center>
</body>
</html>

        `
}