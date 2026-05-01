import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import NextAuthSessionProvider from "@/components/ui/SessionProvider";
import { CartProvider } from "@/contexts/CartContext";
import CartDrawer from "@/components/ui/CartDrawer";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Lexi Candles — Artisanal Fragrance Handcrafted for Serenity",
  description: "Lexi Candles — Premium handcrafted soy candles, artisanal fragrance for serenity.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body>
        <NextAuthSessionProvider>
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
