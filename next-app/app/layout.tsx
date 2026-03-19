import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import Script from "next/script";
import "@/lib/icons"; // FA tree-shaken icon library (replaces CDN)
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import "./globals.css";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
  metadataBase: new URL("https://sweepbase.com"),
  title: "Sweepbase | Find Your Perfect Crypto Card",
  description: "Compare the world's best crypto debit and credit cards with Sweepbase. Maximize rewards and spend digital assets anywhere.",
  authors: [{ name: "Sweepbase", url: "https://sweepbase.com" }],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
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
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_ID || "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        {/* Preconnect for analytics — resolve DNS+TLS early */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      </head>
      <body>
        {/* GA4 — loads only when NEXT_PUBLIC_GA_ID env var is set */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  page_title: document.title,
                  send_page_view: true
                });
              `}
            </Script>
          </>
        )}

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
