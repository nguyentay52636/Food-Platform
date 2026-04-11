import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { TranslationProvider } from "@/app/context/TranslationContext";
import { ReduxProvider } from "@/redux/provider";
import ClientLayout from "./ClientLayout";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  applicationName: "Food Platform",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Food Platform",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem>
          <TranslationProvider>
            <ReduxProvider>
              <ClientLayout>
                {children}
              </ClientLayout>
            </ReduxProvider>
          </TranslationProvider>
          <Toaster position="top-right" richColors />
        </ThemeProvider>

      </body>
    </html>
  );
}
