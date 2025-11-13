import type { Metadata } from "next";
import "./globals.css";
import { ModeToggle } from "@/components/Dark-light/page";
import FeedBackButton from "@/components/FeedBackButton/page";
import Header from "@/components/Header/page";
import ConditionalFooter from "@/components/ConditionalFooter/page"
import MessagePop from "@/components/MessagePop/page";
import ClientProviders from "./Providers";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ErrorBoundary } from "@/components/ErrorBoundary";


export const metadata: Metadata = {
    title: {
    template: "%s | Shop Cheap",
    default: "Shop Cheap Anytime, Any where",
  },
   creator: "Elia Light",
  openGraph:{
        description: "ShopCheap Anytime Anywhere, Sell online in Uganda on Shop Cheap and watch your business grow. Get access to over a variety of customers on the platform. Register now for free and start selling.",
           type: "website",
    locale: "en_US",
    url: "https://shopcheapug.com/",
    title: "Shop Cheap - Anytime Anywhere",
    siteName: "Shop Cheap",
    images: [
      {
        url: "/images/logo2.png",
        width: 200,
        height: 200,
        alt: "Shop Cheap Ug",
      },
    ],  
},
  
   keywords: [
        "shopcheap",
        "shop cheap",
        "online market",
        "phones",
        "accessories",
        "used",
        "cars",
          "electronics",
  "fashion",
  "clothing",
  "beauty products",
  "home decor",
  "sports gear",
  "shoes",
  "accessories",
  "mobile phones",
  "laptops",
  "kitchen appliances",
  "furniture",

   ]
};
const CLIENT_ID = process.env.CLIENT_ID ?? "";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className=" " >
        <ErrorBoundary>
          <GoogleOAuthProvider clientId={CLIENT_ID}>
          <ClientProviders>
                  <Header  />
                  <MessagePop />
                  {children}
                  <FeedBackButton/>
                  <ModeToggle />
                  <ConditionalFooter/>
          </ClientProviders>
          </GoogleOAuthProvider>
        </ErrorBoundary>
      </body>
      <script src="https://accounts.google.com/gsi/client" async defer></script>
    </html>
  );
}
