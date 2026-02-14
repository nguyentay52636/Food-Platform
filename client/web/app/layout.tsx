import { Inter } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/ThemeProvider";
import { TranslationProvider } from "@/app/context/TranslationContext";
import Header from "@/components/shared/Header/Header";
import Footer from "@/components/shared/Footer/Footer";
import { HeaderAuth } from "@/components/shared/Header/HeaderAuth/HeaderAuth";
import ClientLayout from "./ClientLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning={true}>
      <body
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem>
          <TranslationProvider>
            <ClientLayout>
              {children}
            </ClientLayout>
          </TranslationProvider>
        </ThemeProvider>

      </body>
    </html>
  );
}
