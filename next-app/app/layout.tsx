import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
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
        {/* Preconnect so DNS+TLS for Font Awesome is resolved before the stylesheet request */}
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        {/* Preload hint so the browser discovers Font Awesome early in the waterfall */}
        <link
          rel="preload"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          as="style"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" crossOrigin="anonymous" />
      </head>
      <body>
        <div className="background-globes">
          <div className="globe globe-1"></div>
          <div className="globe globe-2"></div>
        </div>

        <SiteNav />

        {children}

        <SiteFooter />
      </body>
    </html>
  );
}
