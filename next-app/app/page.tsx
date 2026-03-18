import { getAllCards, toCardListItem } from "@/lib/data";
import { generateHomeMetaDescription } from "@/lib/meta";
import { generateHomeItemListSchema } from "@/lib/schemas";
import CardSkeleton from "@/components/CardSkeleton";
import dynamic from "next/dynamic";
import { Metadata } from "next";

// CardsGridClient owns all filter/search/compare state — defer its JS so the
// hero HTML and static card-index reach the browser before the filter chunk.
const CardsGridClient = dynamic(() => import("@/components/CardsGridClient"), {
  loading: () => (
    <section className="results-section" aria-busy="true">
      <div className="container">
        <div className="results-header">
          <h2 className="results-title">Available Cards</h2>
        </div>
        <div className="cards-grid">
          {Array.from({ length: 12 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    </section>
  ),
});

export const revalidate = 3600; // ISR: Update every hour

export async function generateMetadata(): Promise<Metadata> {
  const cards = await getAllCards();
  const count = cards.length;
  const title = `Best Crypto Debit & Credit Cards 2026 — Compare ${count} Cards | Sweepbase`;
  const description = generateHomeMetaDescription(count);
  return {
    title,
    description,
    alternates: {
      canonical: "https://sweepbase.com",
    },
    openGraph: {
      title,
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
      title,
      description,
      images: ["https://sweepbase.com/og-image.png"],
    },
    robots: { index: true, follow: true },
  };
}

export default async function Home() {
  const allCards = await getAllCards();

  // Top-12 ItemList with FinancialProduct + AggregateRating for rich results
  const itemListJsonLd = generateHomeItemListSchema(allCards);

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Sweepbase",
    "url": "https://sweepbase.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://sweepbase.com/?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Sweepbase",
    "url": "https://sweepbase.com",
    "logo": "https://sweepbase.com/logo.png",
    "description": "Independent aggregator for comparing crypto debit and credit cards worldwide.",
    "foundingDate": "2024",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "contact@sweepbase.com",
      "contactType": "editorial"
    },
    "sameAs": [
      "https://twitter.com/sweepbase",
      "https://www.linkedin.com/company/sweepbase",
      "https://t.me/sweepbase"
    ]
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <section className="hero-section">
        <div className="container hero-content">
          <h1 className="hero-title">Unlock Your Crypto <span className="text-gradient">Spending Power</span></h1>
          <p className="hero-subtitle">
            Compare the world&apos;s best crypto debit and credit cards. Find the top Bitcoin, Ethereum and USDT cards by cashback rate, fees, network (Visa/Mastercard) and country availability.
          </p>
        </div>
      </section>

      <CardsGridClient initialCards={allCards.map(toCardListItem)} />

      {/* ── Browse by Category ── */}
      <section className="browse-categories-section">
        <div className="container">
          <h2 className="browse-categories-heading">
            Browse by <span className="text-gradient">Category</span>
          </h2>
          <p className="browse-categories-subheading">
            Find the right card for your region, network, or reward preference.
          </p>
          <div className="browse-categories-grid">
            <a href="/best-crypto-cards-usa" className="browse-category-tile">
              <div className="browse-category-icon">
                <i className="fa-solid fa-flag-usa" aria-hidden="true"></i>
              </div>
              <div className="browse-category-info">
                <span className="browse-category-name">Best Cards in the USA</span>
                <span className="browse-category-desc">Cards available to US residents</span>
              </div>
            </a>
            <a href="/best-crypto-cards-europe" className="browse-category-tile">
              <div className="browse-category-icon">
                <i className="fa-solid fa-earth-europe" aria-hidden="true"></i>
              </div>
              <div className="browse-category-info">
                <span className="browse-category-name">Best Cards in Europe</span>
                <span className="browse-category-desc">EEA &amp; EU-available cards</span>
              </div>
            </a>
            <a href="/visa-crypto-cards" className="browse-category-tile">
              <div className="browse-category-icon">
                <i className="fa-solid fa-credit-card" aria-hidden="true"></i>
              </div>
              <div className="browse-category-info">
                <span className="browse-category-name">Visa Crypto Cards</span>
                <span className="browse-category-desc">All Visa network cards compared</span>
              </div>
            </a>
            <a href="/mastercard-crypto-cards" className="browse-category-tile">
              <div className="browse-category-icon">
                <i className="fa-solid fa-circle-dot" aria-hidden="true"></i>
              </div>
              <div className="browse-category-info">
                <span className="browse-category-name">Mastercard Crypto Cards</span>
                <span className="browse-category-desc">All Mastercard network cards compared</span>
              </div>
            </a>
            <a href="/self-custody-crypto-cards" className="browse-category-tile">
              <div className="browse-category-icon">
                <i className="fa-solid fa-key" aria-hidden="true"></i>
              </div>
              <div className="browse-category-info">
                <span className="browse-category-name">Self-Custody Cards</span>
                <span className="browse-category-desc">Keep control of your private keys</span>
              </div>
            </a>
            <a href="/crypto-cards-with-cashback" className="browse-category-tile">
              <div className="browse-category-icon">
                <i className="fa-solid fa-percent" aria-hidden="true"></i>
              </div>
              <div className="browse-category-info">
                <span className="browse-category-name">Cards With Cashback</span>
                <span className="browse-category-desc">Earn BTC, tokens, or stablecoins</span>
              </div>
            </a>
            <a href="/best-crypto-cards-uk" className="browse-category-tile">
              <div className="browse-category-icon">
                <i className="fa-solid fa-sterling-sign" aria-hidden="true"></i>
              </div>
              <div className="browse-category-info">
                <span className="browse-category-name">Best Cards in the UK</span>
                <span className="browse-category-desc">FCA-regulated cards for UK residents</span>
              </div>
            </a>
            <a href="/best-crypto-cards-canada" className="browse-category-tile">
              <div className="browse-category-icon">
                <i className="fa-solid fa-leaf" aria-hidden="true"></i>
              </div>
              <div className="browse-category-info">
                <span className="browse-category-name">Best Cards in Canada</span>
                <span className="browse-category-desc">Cards for Canadian residents</span>
              </div>
            </a>
            <a href="/best-crypto-cards-latin-america" className="browse-category-tile">
              <div className="browse-category-icon">
                <i className="fa-solid fa-earth-americas" aria-hidden="true"></i>
              </div>
              <div className="browse-category-info">
                <span className="browse-category-name">Cards in Latin America</span>
                <span className="browse-category-desc">MX, BR, AR, CO &amp; more</span>
              </div>
            </a>
          </div>
        </div>
      </section>

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
                  <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
                </div>
                <h3>Discover</h3>
                <p>Browse a curated database of crypto cards updated regularly. Filter by network, custody type, region, and more.</p>
              </div>
              <div className="about-feature-card">
                <div className="about-feature-icon">
                  <i className="fa-solid fa-scale-balanced" aria-hidden="true"></i>
                </div>
                <h3>Compare</h3>
                <p>Select up to 4 cards side-by-side to compare fees, limits, cashback rewards, and accepted top-up methods.</p>
              </div>
              <div className="about-feature-card">
                <div className="about-feature-icon">
                  <i className="fa-solid fa-shield-halved" aria-hidden="true"></i>
                </div>
                <h3>Trusted Data</h3>
                <p>All card details are sourced directly from issuers and kept current. No hidden affiliate bias in our listings.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*
        Server-rendered index of all card pages.
        Visible in the HTML delivered to Googlebot so all 114 /cards/[slug]
        pages receive internal links and can be crawled without JS execution.
        The sitemap.xml also lists every URL, but direct <a> links provide
        additional link-equity flow from the homepage.
      */}
      <nav className="card-index-section" aria-label="Card index">
        <div className="container">
          <h2 className="card-index-heading">Browse All Crypto Cards</h2>
          <ul className="card-index-list">
            {[...allCards]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(card => (
                <li key={card.slug}>
                  <a href={`/cards/${card.slug}`} className="card-index-link">
                    {card.name}
                  </a>
                </li>
              ))}
          </ul>
        </div>
      </nav>
    </main>
  );
}
