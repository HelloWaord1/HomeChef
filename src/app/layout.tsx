import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FreeChef — Home-Cooked Meals from Local Cooks",
  description:
    "Discover amazing home-cooked meals from talented local cooks in your neighborhood. From Georgian khinkali to Japanese ramen — real food, made with love.",
  openGraph: {
    title: "FreeChef — Home-Cooked Meals from Local Cooks",
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
  return children;
}
