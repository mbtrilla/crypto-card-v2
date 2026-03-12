import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { SITE_URL } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Sweepbase | Find Your Perfect Crypto Card",
  description: "Compare the world's best crypto debit and credit cards with Sweepbase. Maximize rewards and spend digital assets anywhere.",
  keywords: [
    "crypto debit card",
    "crypto card comparison",
    "best crypto card 2026",
    "bitcoin debit card",
    "crypto cashback card",
    "Visa crypto card",
    "Mastercard crypto card",
    "crypto spending card",
  ],
  alternates: {
    canonical: "https://sweepbase.com",
  },
  openGraph: {
    title: "Sweepbase | Find Your Perfect Crypto Card",
    description: "Compare the world's best crypto debit and credit cards with Sweepbase. Maximize rewards and spend digital assets anywhere.",
    url: "https://sweepbase.com",
    siteName: "Sweepbase",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/logo.png`,
        width: 800,
        height: 600,
        alt: "Sweepbase — Find Your Perfect Crypto Card",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [`${SITE_URL}/logo.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body>
        <div className="background-globes">
          <div className="globe globe-1"></div>
          <div className="globe globe-2"></div>
        </div>

        <header className="navbar">
          <div className="container nav-content">
            <Link href="/" className="logo">
              <img src="/logo.png" alt="Sweepbase Logo" className="brand-logo" />
            </Link>
            <nav className="nav-links">
              <Link href="/#discover" className="active">Discover</Link>
              <Link href="/#about">About</Link>
            </nav>
          </div>
        </header>

        {children}

        <footer className="footer">
          <div className="container footer-content">
            <div className="footer-logo">
              <img src="/logo.png" alt="Sweepbase Logo" className="brand-logo footer-logo-img" />
            </div>
            <p className="footer-text">Empowering your digital wealth. Data provided for informational purposes.</p>
            <p className="footer-copyright">&copy; 2026 Sweepbase. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
