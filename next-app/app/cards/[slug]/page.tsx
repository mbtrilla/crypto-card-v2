import { getAllCards, getSlug } from "@/lib/data";
import { isUSACard, isEuropeCard, isVisaCard, isMastercardCard, isSelfCustodyCard, hasCashback } from "@/lib/filters";
import { getCardRatingData } from "@/lib/ratings";
import StarRating from "@/components/StarRating";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import type { Card } from "@/lib/data";

export const revalidate = 3600; // ISR: regenerate every hour

export async function generateStaticParams() {
  const cards = await getAllCards();
  return cards.map((card) => ({
    slug: card.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const cards = await getAllCards();
  const card = cards.find((c) => c.slug === params.slug);

  if (!card) return {};

  const ogImageUrl = card.logo.startsWith('http')
    ? card.logo
    : `https://sweepbase.com${card.logo}`;

  return {
    title: `${card.name} Review 2026 — Fees, Cashback & Availability | Sweepbase`,
    description: `${card.name} crypto card review: ${card.description.substring(0, 160)}...`,
    robots: { index: true, follow: true },
    alternates: {
      canonical: `https://sweepbase.com/cards/${card.slug}`,
    },
    openGraph: {
      title: `${card.name} Review 2026`,
      description: card.description,
      type: 'website',
      url: `https://sweepbase.com/cards/${card.slug}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
        },
      ],
    }
  };
}

// --- Content helpers ---

function getBestForParagraphs(card: Card, cardIssuer: string): string[] {
  const isSelfCustody = card.custody.toLowerCase().includes('self');
  const hasCashback = card.cashback && card.cashback !== 'N/A' && card.cashback !== '0%';
  const hasRegions = card.regions && card.regions !== 'N/A';

  const audience = isSelfCustody
    ? `DeFi enthusiasts and privacy-conscious users who want to maintain control of their private keys right up to the point of purchase`
    : `everyday crypto holders looking for a simple, convenient way to spend digital assets without managing wallets manually`;

  const cashbackLine = hasCashback
    ? `With ${card.cashback} cashback on eligible purchases, the ${card.name} rewards active spenders who use the card as their daily driver.`
    : `It is a solid option for anyone looking to bridge their crypto holdings with day-to-day payments at millions of merchants worldwide.`;

  const regionLine = hasRegions
    ? `The card is currently available in ${card.regions} — ideal for residents and frequent travellers in those areas.`
    : `It serves users across multiple regions globally, making it broadly accessible.`;

  return [
    `The ${card.name} is best suited for ${audience}.`,
    cashbackLine,
    regionLine,
  ];
}

function getHowToGetParagraphs(card: Card, cardIssuer: string): string[] {
  const isVirtual = card.cardType.toLowerCase().includes('virtual');
  const isPhysical = card.cardType.toLowerCase().includes('physical');
  const topUp = card.topUpMethods !== 'N/A' ? card.topUpMethods : 'supported cryptocurrencies';

  const step1 = `To get the ${card.name}, visit the official ${cardIssuer} website or download their mobile app and create an account.`;
  const step2 = `Complete the KYC identity verification process by submitting a government-issued ID and a selfie — approval typically takes 1–3 business days depending on your region.`;
  const step3 = `Once approved, fund your card balance using ${topUp} via the platform's top-up interface.`;
  const step4 = isVirtual && !isPhysical
    ? `Your virtual ${card.name} will be available instantly in the app, ready to use for online purchases and contactless payments via Apple Pay or Google Pay.`
    : `Your physical card will be shipped to your registered address and can be activated directly through the app once it arrives.`;

  return [step1, step2, step3, step4];
}

/** Returns up to 3 category page links most relevant to this card. */
function getRelatedCategories(card: Card): Array<{ href: string; label: string; icon: string }> {
  const categories: Array<{ href: string; label: string; icon: string }> = [];

  if (isVisaCard(card))
    categories.push({ href: '/visa-crypto-cards',          label: 'Visa Crypto Cards',        icon: 'fa-credit-card' });
  if (isMastercardCard(card))
    categories.push({ href: '/mastercard-crypto-cards',    label: 'Mastercard Crypto Cards',  icon: 'fa-circle-dot' });
  if (isSelfCustodyCard(card))
    categories.push({ href: '/self-custody-crypto-cards',  label: 'Self-Custody Cards',       icon: 'fa-key' });
  if (hasCashback(card))
    categories.push({ href: '/crypto-cards-with-cashback', label: 'Cards With Cashback',      icon: 'fa-percent' });
  if (isUSACard(card))
    categories.push({ href: '/best-crypto-cards-usa',      label: 'Best Cards in the USA',    icon: 'fa-flag-usa' });
  if (isEuropeCard(card))
    categories.push({ href: '/best-crypto-cards-europe',   label: 'Best Cards in Europe',     icon: 'fa-earth-europe' });

  return categories.slice(0, 3);
}

export default async function CardDetailPage({ params }: { params: { slug: string } }) {
  const cards = await getAllCards();
  const card = cards.find((c) => c.slug === params.slug);

  if (!card) notFound();

  const others = cards.filter(c => c.slug !== card.slug);
  const similar = others.sort(() => 0.5 - Math.random()).slice(0, 3);

  // Derive the card issuer/brand by stripping generic card-type suffixes from the name.
  // e.g. "Binance Card" → "Binance", "1inch Debit Card" → "1inch", "Crypto.com Visa Card" → "Crypto.com"
  const cardIssuer = card.name
    .replace(/\s+(debit\s+|credit\s+|prepaid\s+)?(visa\s+|mastercard\s+)?card\s*$/i, '')
    .replace(/\s+(visa|mastercard)\s*$/i, '')
    .replace(/\s+(debit|credit|prepaid)\s*$/i, '')
    .trim() || card.name;

  const bestForParagraphs = getBestForParagraphs(card, cardIssuer);
  const howToGetParagraphs = getHowToGetParagraphs(card, cardIssuer);

  const { ratingValue, reviewCount } = getCardRatingData(card);

  const productJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": card.name,
    "description": card.description,
    "brand": { "@type": "Brand", "name": cardIssuer },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": ratingValue.toFixed(1),
      "reviewCount": String(reviewCount),
      "bestRating": "5",
      "worstRating": "1"
    },
    "publisher": { "@type": "Organization", "name": "Sweepbase", "url": "https://sweepbase.com" },
    "offers": {
      "@type": "Offer",
      "url": `https://sweepbase.com/cards/${card.slug}`,
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    }
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://sweepbase.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Cards",
        "item": "https://sweepbase.com/cards"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": card.name,
        "item": `https://sweepbase.com/cards/${card.slug}`
      }
    ]
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What is the ${card.name}?`,
        "acceptedAnswer": { "@type": "Answer", "text": card.description }
      },
      {
        "@type": "Question",
        "name": `What are the fees for ${card.name}?`,
        "acceptedAnswer": { "@type": "Answer", "text": `The issuance fee is ${card.issuanceFee}, and the annual fee is ${card.annualFee}.` }
      }
    ]
  };

  return (
    <article className="card-detail-static">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="container">
        <div className="back-link-container">
          <a href="/" className="back-link">
            <i className="fa-solid fa-arrow-left"></i> Back to all cards
          </a>
        </div>

        <nav className="breadcrumb-nav">
          <a href="/">Home</a>
          <span className="breadcrumb-separator">/</span>
          <a href="/cards">Cards</a>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{card.name}</span>
        </nav>

        <div className="card-detail-hero">
          <div className="card-hero-image">
            <Image src={card.logo} alt={card.name} className="detail-main-img" width={400} height={250} priority />
          </div>
          <div className="card-hero-content">
            <h1 className="detail-title">{card.name} Review 2026</h1>
            <StarRating rating={ratingValue} reviewCount={reviewCount} uid={card.slug} />
            <div className="detail-meta-grid">
              <div className="detail-meta-item">
                <span className="meta-label">Custody</span>
                <span className="meta-value badge badge-custody">{card.custody}</span>
              </div>
              <div className="detail-meta-item">
                <span className="meta-label">Network</span>
                <span className="meta-value badge badge-network">{card.network}</span>
              </div>
              <div className="detail-meta-item">
                <span className="meta-label">Cashback</span>
                <span className="meta-value highlight-text">{card.cashback}</span>
              </div>
              <div className="detail-meta-item">
                <span className="meta-label">Regions</span>
                <span className="meta-value">{card.regions}</span>
              </div>
            </div>
            <a href="#" className="btn-get-card btn-gradient">
              Get This Card <i className="fa-solid fa-external-link"></i>
            </a>
          </div>
        </div>

        <div className="static-card-wrapper">

          {/* ── Section 1: Card Overview ── */}
          <div className="detail-section-intro">
            <h2>Card Overview</h2>
            <p className="static-desc">{card.description}</p>
          </div>

          {/* ── Fees & Features grid ── */}
          <div className="static-grid">
            <div className="static-table-container">
              <h3><i className="fa-solid fa-money-bill-transfer"></i> Fees & Limits</h3>
              <div className="table-responsive">
                <table className="static-table styled-table">
                  <tbody>
                    <tr><td>Issuance Fee</td><td>{card.issuanceFee}</td></tr>
                    <tr><td>Annual Fee</td><td>{card.annualFee}</td></tr>
                    <tr><td>FX Fee</td><td>{card.fxFee}</td></tr>
                    <tr><td>ATM Limit</td><td>{card.atmLimit}</td></tr>
                    <tr><td>Spending Limit</td><td>{card.spendLimit}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="static-features">
              <h3><i className="fa-solid fa-star"></i> Core Features</h3>
              <ul className="feature-list">
                <li><strong>Card Type:</strong> {card.cardType}</li>
                <li><strong>Top up with:</strong> {card.topUpMethods}</li>
                <li><strong>Available Countries:</strong> {card.countries || card.regions}</li>
              </ul>
            </div>
          </div>

          {/* ── Section 2: Who Is This Card Best For? ── */}
          <div className="detail-section-intro">
            <h2>Who Is the {card.name} Best For?</h2>
            {bestForParagraphs.map((para, i) => (
              <p key={i} className="static-desc">{para}</p>
            ))}
          </div>

          {/* ── Section 3: Key Strengths & Considerations ── */}
          <div className="detail-section-intro">
            <h2>Key Strengths &amp; Considerations</h2>
          </div>
          <div className="static-pros-cons redesign">
            <div className="static-pro detail-block-pros">
              <h3><i className="fa-solid fa-circle-check"></i> Key Strengths</h3>
              <div dangerouslySetInnerHTML={{ __html: card.pros }} />
            </div>
            <div className="static-con detail-block-cons">
              <h3><i className="fa-solid fa-triangle-exclamation"></i> Considerations</h3>
              <div dangerouslySetInnerHTML={{ __html: card.cons }} />
            </div>
          </div>

          {/* ── Section 4: How to Get the Card ── */}
          <div className="detail-section-intro">
            <h2>How to Get the {card.name}</h2>
            {howToGetParagraphs.map((para, i) => (
              <p key={i} className="static-desc">{para}</p>
            ))}
          </div>

          {/* ── Similar Cards ── */}
          <div className="static-similar redesign">
            <h3>Similar Cards You Might Like</h3>
            <div className="similar-cards-grid">
              {similar.map(s => (
                <a
                  key={s.slug}
                  href={`/cards/${s.slug}`}
                  className="similar-card-tile"
                  aria-label={`Compare ${s.name}`}
                >
                  <div className="similar-tile-img">
                    <Image src={s.logo} alt={s.name} width={80} height={50} />
                  </div>
                  <div className="similar-tile-info">
                    <span className="similar-tile-name">Compare {s.name} →</span>
                    <span className="similar-tile-network">{s.network}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* ── Browse by Category ── */}
          {(() => {
            const relatedCats = getRelatedCategories(card);
            return relatedCats.length > 0 ? (
              <div className="card-browse-cats">
                <p className="card-browse-cats-title">Browse by Category</p>
                <div className="card-browse-cats-grid">
                  {relatedCats.map(({ href, label, icon }) => (
                    <a key={href} href={href} className="card-browse-cat-link">
                      <i className={`fa-solid ${icon}`}></i>
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            ) : null;
          })()}

        </div>
      </div>
    </article>
  );
}
