import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "@/lib/icons"; // FA tree-shaken icon library (replaces CDN)
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-outfit",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
};

export const metadata: Metadata = {
  title: "Sweepbase | Find Your Perfect Crypto Card",
  description: "Compare the world's best crypto debit and credit cards with Sweepbase. Maximize rewards and spend digital assets anywhere.",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    locale: "en_US",
    siteName: "Sweepbase",
  },
  twitter: {
    site: "@sweepbase",
    creator: "@sweepbase",
  },
  alternates: {
    languages: { "en": "https://sweepbase.com" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <head />
      <body>
        <a href="#main-content" className="skip-nav">Skip to main content</a>

        <div className="background-globes">
          <div className="globe globe-1"></div>
          <div className="globe globe-2"></div>
        </div>

        <SiteNav />

        <div id="main-content">{children}</div>

        <SiteFooter />
      </body>
    </html>
  );
}
