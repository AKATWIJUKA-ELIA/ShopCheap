import type { Metadata } from "next";
import "./globals.css";
import { ModeToggle } from "@/components/Dark-light/page";
import FeedBackButton from "@/components/FeedBackButton/page";
import Header from "@/components/Header/page";
import ConditionalFooter from "@/components/ConditionalFooter/page"
import MessagePop from "@/components/MessagePop/page";
import ClientProviders from "./Providers";
import { GoogleOAuthProvider } from "@react-oauth/google";
// import { ErrorBoundary } from "@/components/ErrorBoundary";


export const metadata: Metadata = {
  title: "ShopCheap",
  description: "ShopCheap Anytime Anywhere",
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
        {/* <ErrorBoundary> */}
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
        {/* </ErrorBoundary> */}
      </body>
      <script src="https://accounts.google.com/gsi/client" async defer></script>
    </html>
  );
}
