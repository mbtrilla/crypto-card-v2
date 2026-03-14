import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sweepbase | Find Your Perfect Crypto Card",
  description: "Compare the world's best crypto debit and credit cards with Sweepbase. Maximize rewards and spend digital assets anywhere.",
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
              <Image src="/logo.png" alt="Sweepbase Logo" className="brand-logo" width={160} height={40} priority />
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
              <Image src="/logo.png" alt="Sweepbase Logo" className="brand-logo footer-logo-img" width={160} height={40} />
            </div>
            <p className="footer-text">Empowering your digital wealth. Data provided for informational purposes.</p>
            <p className="footer-copyright">&copy; 2026 Sweepbase. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
