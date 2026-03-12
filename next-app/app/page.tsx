import { getAllCards } from "@/lib/data";
import CardsGridClient from "@/components/CardsGridClient";
import Link from "next/link";

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

      {/*
        SEO: Server Component рендерит полный список всех карточек прямо в HTML.
        Поисковые боты видят все ссылки без выполнения JavaScript.
        CardsGridClient выше показывает только первые 12 (с пагинацией),
        эта секция закрывает «слепую зону» для краулеров.
      */}
      <section className="seo-card-index" aria-label="All crypto cards directory">
        <div className="container">
          <h2 className="seo-index-title">Browse All Crypto Cards</h2>
          <ul className="seo-card-list">
            {allCards.map((card) => (
              <li key={card.slug}>
                <Link href={`/cards/${card.slug}`} className="seo-card-link">
                  <span className="seo-card-name">{card.name}</span>
                  <span className="seo-card-meta">
                    {card.network} · {card.custody} · Cashback: {card.mainPageCashback || card.cashback}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
