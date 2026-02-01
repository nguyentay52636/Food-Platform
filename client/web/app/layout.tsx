import { Inter } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/shared/Header/Header";
import Footer from "@/components/shared/Footer/Footer";

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
          <Header />
          {children}
        </ThemeProvider>
        <Footer />

      </body>
    </html>
  );
}
