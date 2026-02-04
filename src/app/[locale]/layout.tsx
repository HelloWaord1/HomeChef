import { Inter } from "next/font/google";
import "../globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SessionProvider } from "@/components/session-provider";
import { Toaster } from "sonner";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${inter.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <SessionProvider>
            <Navigation />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <Toaster position="bottom-right" richColors />
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
