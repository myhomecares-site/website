import type { Metadata } from "next";
import { Poppins, Quicksand } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { BackToTop } from "@/components/BackToTop";
import { ChatWidget } from "@/components/ChatWidget";
import { StructuredData } from "@/components/StructuredData";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { site } from "@/lib/site";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Home Care Services in Maryland`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  icons: { icon: "/brand/mhc-favicon.png", apple: "/brand/mhc-favicon.png" },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  openGraph: {
    title: `${site.name} | Home Care Services in Maryland`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${poppins.variable} ${quicksand.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white">
        <StructuredData />
        <ScrollProgress />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <BackToTop />
        <ChatWidget />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
