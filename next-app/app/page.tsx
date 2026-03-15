import { getAllCards } from "@/lib/data";
import CardsGridClient from "@/components/CardsGridClient";
import { Metadata } from "next";

export const revalidate = 3600; // ISR: Update every hour

export const metadata: Metadata = {
  title: "Best Crypto Debit & Credit Cards 2026 — Compare 114 Cards | Sweepbase",
  description:
    "Compare 114 crypto debit & credit cards by fees, cashback, supported networks and country availability. Find the best Bitcoin, USDT and DeFi card for your region. Updated 2026.",
  alternates: {
    canonical: "https://sweepbase.com",
  },
  openGraph: {
    title: "Best Crypto Debit & Credit Cards 2026 — Compare 114 Cards | Sweepbase",
    url: "https://sweepbase.com",
    type: "website",
    images: [
      {
        url: "https://sweepbase.com/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Crypto Debit & Credit Cards 2026 — Compare 114 Cards | Sweepbase",
    description:
      "Compare 114 crypto debit & credit cards by fees, cashback, supported networks and country availability. Find the best Bitcoin, USDT and DeFi card for your region. Updated 2026.",
    images: ["https://sweepbase.com/og-image.png"],
  },
};

export default async function Home() {
  const allCards = await getAllCards();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": allCards.map((card, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `https://sweepbase.com/cards/${card.slug}`,
      "name": card.name
    }))
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="hero-section">
        <div className="container hero-content">
          <h1 className="sr-only">Best Crypto Debit &amp; Credit Cards — Compare &amp; Find Your Perfect Card</h1>
          <p className="hero-title" aria-hidden="true">Unlock Your Crypto <span className="text-gradient">Spending Power</span></p>
          <p className="hero-subtitle">
            Compare the world&apos;s best crypto debit and credit cards. Find the top Bitcoin, Ethereum and USDT cards by cashback rate, fees, network (Visa/Mastercard) and country availability.
          </p>
        </div>
      </section>

      <CardsGridClient initialCards={allCards} />

      <section id="about" className="about-section">
        <div className="container">
          <div className="about-panel">
            <h2 className="about-heading">About <span className="text-gradient">Sweepbase</span></h2>
            <p className="about-lead">
              Sweepbase is an independent aggregator that helps you find, compare, and evaluate
              crypto debit and credit cards from around the world. We surface fees, cashback rates,
              supported networks, and regional availability in one place — so you can make confident
              decisions without bouncing between dozens of card issuer websites.
            </p>
            <div className="about-features">
              <div className="about-feature-card">
                <div className="about-feature-icon">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </div>
                <h3>Discover</h3>
                <p>Browse a curated database of crypto cards updated regularly. Filter by network, custody type, region, and more.</p>
              </div>
              <div className="about-feature-card">
                <div className="about-feature-icon">
                  <i className="fa-solid fa-scale-balanced"></i>
                </div>
                <h3>Compare</h3>
                <p>Select up to 4 cards side-by-side to compare fees, limits, cashback rewards, and accepted top-up methods.</p>
              </div>
              <div className="about-feature-card">
                <div className="about-feature-icon">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <h3>Trusted Data</h3>
                <p>All card details are sourced directly from issuers and kept current. No hidden affiliate bias in our listings.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
