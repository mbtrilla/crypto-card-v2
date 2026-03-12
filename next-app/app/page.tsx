import { getAllCards } from "@/lib/data";
import CardsGridClient from "@/components/CardsGridClient";

export const revalidate = 3600; // ISR: Update every hour

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
    </main>
  );
}
