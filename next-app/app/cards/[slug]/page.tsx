import { getAllCards, getSlug } from "@/lib/data";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";

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
    title: `${card.name} Review 2026 — Fees, Cashback & Availability`,
    description: `${card.name} crypto card review: ${card.description.substring(0, 160)}...`,
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

  const productJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": card.name,
    "description": card.description,
    "brand": { "@type": "Brand", "name": cardIssuer },
    // TODO: Add aggregateRating once a ratings system is implemented, e.g.:
    // "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.5", "reviewCount": "120" }
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
          <a href="/">Cards</a>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{card.name}</span>
        </nav>

        <div className="card-detail-hero">
          <div className="card-hero-image">
            <Image src={card.logo} alt={card.name} className="detail-main-img" width={400} height={250} priority />
          </div>
          <div className="card-hero-content">
            <h1 className="detail-title">{card.name} Review 2026</h1>
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
          <div className="detail-section-intro">
            <h2>Card Overview</h2>
            <p className="static-desc">{card.description}</p>
          </div>
          
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
          
          <div className="static-pros-cons redesign">
            <div className="static-pro detail-block-pros">
              <h4><i className="fa-solid fa-circle-check"></i> Key Strengths</h4>
              <div dangerouslySetInnerHTML={{ __html: card.pros }} />
            </div>
            <div className="static-con detail-block-cons">
              <h4><i className="fa-solid fa-triangle-exclamation"></i> Considerations</h4>
              <div dangerouslySetInnerHTML={{ __html: card.cons }} />
            </div>
          </div>

          <div className="static-similar redesign">
            <h3>Similar Cards You Might Like</h3>
            <div className="similar-cards-grid">
              {similar.map(s => (
                <a key={s.slug} href={`/cards/${s.slug}`} className="similar-card-tile">
                  <div className="similar-tile-img">
                    <Image src={s.logo} alt={s.name} width={80} height={50} />
                  </div>
                  <div className="similar-tile-info">
                    <span className="similar-tile-name">{s.name}</span>
                    <span className="similar-tile-network">{s.network}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
