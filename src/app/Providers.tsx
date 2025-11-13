"use client";

import ReduxProvider from "./ReduxProvider";
import {ConvexQueryCacheProvider} from "convex-helpers/react/cache"
import { ConvexClientProvider } from "@/app/ConvexClientProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { FileProvider } from "@/app/FileContext";
import { DataProvider } from "@/app/DataContext";
import { NotificationProvider } from "@/app/NotificationContext";
import { BoostProvider } from "@/app/BoostContext";



export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ConvexClientProvider>
        <ConvexQueryCacheProvider>
          <NotificationProvider>
            <BoostProvider>
              <ReduxProvider>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                  <DataProvider>
                    <FileProvider>
                      {children}
                    </FileProvider>
                  </DataProvider>
                </ThemeProvider>
              </ReduxProvider>
            </BoostProvider>
          </NotificationProvider>
        </ConvexQueryCacheProvider>
    </ConvexClientProvider>
  );
}
