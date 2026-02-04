import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HomeChef — Home-Cooked Meals from Local Cooks",
  description:
    "Discover amazing home-cooked meals from talented local cooks in your neighborhood. From Georgian khinkali to Japanese ramen — real food, made with love.",
  openGraph: {
    title: "HomeChef — Home-Cooked Meals from Local Cooks",
    description:
      "Discover amazing home-cooked meals from talented local cooks in your neighborhood.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Navigation />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
