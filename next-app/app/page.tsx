import { getAllCards } from "@/lib/data";
import CardsGridClient from "@/components/CardsGridClient";
import { Metadata } from "next";

export const revalidate = 3600; // ISR: Update every hour

export const metadata: Metadata = {
  alternates: {
    canonical: "https://sweepbase.com",
  },
  openGraph: {
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
          <h1 className="hero-title">Unlock Your Crypto <span className="text-gradient">Spending Power</span></h1>
          <p className="hero-subtitle">
            Compare the world's best crypto debit and credit cards with Sweepbase. 
            Find the perfect match for your lifestyle, maximize your rewards, and spend your digital assets anywhere.
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
