import { getAllCards } from "@/lib/data";
import { isVisaCard, isMastercardCard, isSelfCustodyCard, hasCashback as hasCashbackFilter, isUSACard, isEuropeCard, isUKCard } from "@/lib/filters";
import { isThinCard } from "@/lib/thin-cards";
import { getCardRatingData } from "@/lib/ratings";
import { generateCardMetaDescription } from "@/lib/meta";
import { stripHtml, buildProsItems, buildConsItems, getCryptoTokens, getIsRightForYou, getHowToGetSteps, getRegionalInfo, getExtendedFaqs, getBestForParagraphs, getRelatedCategories } from "./helpers";
import StarRating from "@/components/StarRating";
import Breadcrumb from "@/components/Breadcrumb";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import dynamic from "next/dynamic";

// ── Deferred client components ─────────────────────────────────────────────────
// FAQAccordion: server-rendered for SEO / FAQPage schema parity, but its
// interactive JS is split into a separate chunk that only loads on card pages.
const FAQAccordion = dynamic(() => import("@/components/FAQAccordion"), {
  loading: () => (
    <div className="faq-accordion" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="skeleton-block"
          style={{ height: '52px', marginBottom: '0.5rem', borderRadius: '0.5rem' }} />
      ))}
    </div>
  ),
});

// ShareButtons: clipboard + tweet intent — no SSR value, safe to render client-only.
const ShareButtons = dynamic(() => import("@/components/ShareButtons"), {
  ssr: false,
  loading: () => null,
});

export const revalidate = 86400; // 24h — card data changes infrequently

export async function generateStaticParams() {
  const cards = await getAllCards();
  return cards.map((card) => ({ slug: card.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const cards = await getAllCards();
  const card = cards.find((c) => c.slug === params.slug);
  if (!card) return {};
  const title = `${card.name} Review 2026 — Fees, Cashback & Availability | Sweepbase`;
  const description = generateCardMetaDescription(card);
  const thin = isThinCard(card);
  return {
    title,
    description,
    robots: thin ? { index: false, follow: true } : { index: true, follow: true },
    alternates: { canonical: `https://sweepbase.com/cards/${card.slug}` },
    openGraph: {
      title: `${card.name} Review 2026`,
      description: card.description,
      type: 'website',
      url: `https://sweepbase.com/cards/${card.slug}`,
      // openGraph.images is intentionally omitted here so that the
      // co-located opengraph-image.tsx (dynamic branded OG image) is used.
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: '@sweepbase',
      creator: '@sweepbase',
      // twitter:image is also auto-generated from opengraph-image.tsx
    },
    other: {
      'article:modified_time': '2026-03-18T00:00:00Z',
    },
  };
}

// ─── Page component ────────────────────────────────────────────────────────────

export default async function CardDetailPage({ params }: { params: { slug: string } }) {
  const cards = await getAllCards();
  const card = cards.find((c) => c.slug === params.slug);
  if (!card) notFound();

  const others = cards.filter(c => c.slug !== card.slug);
  // Prefer cards with same network/custody, then fill randomly up to 6
  const sameNetwork = others.filter(c => c.network === card.network);
  const sameCustody = others.filter(c => c.custody === card.custody && c.network !== card.network);
  const pool = [...sameNetwork, ...sameCustody, ...others];
  const seen = new Set<string>();
  const similar = pool.filter(c => { if (seen.has(c.slug)) return false; seen.add(c.slug); return true; }).slice(0, 6);

  const cardIssuer = card.name
    .replace(/\s+(debit\s+|credit\s+|prepaid\s+)?(visa\s+|mastercard\s+)?card\s*$/i, '')
    .replace(/\s+(visa|mastercard)\s*$/i, '')
    .replace(/\s+(debit|credit|prepaid)\s*$/i, '')
    .trim() || card.name;

  // ── Computed data ──
  const { ratingValue, reviewCount } = getCardRatingData(card);
  const prosItems      = buildProsItems(card, cardIssuer);
  const consItems      = buildConsItems(card, cardIssuer);
  const cryptoTokens   = getCryptoTokens(card.topUpMethods);
  const isRightForYou  = getIsRightForYou(card, cardIssuer);
  const howToSteps     = getHowToGetSteps(card, cardIssuer);
  const regionalInfo   = getRegionalInfo(card, card.name);
  const faqItems       = getExtendedFaqs(card, cardIssuer);
  const bestForParas   = getBestForParagraphs(card, cardIssuer);
  const relatedCats    = getRelatedCategories(card);

  // ── JSON-LD ──
  // Determine Visa/Mastercard brand for schema
  const networkLower = card.network.toLowerCase();
  const networkBrand = networkLower.includes('visa') ? 'Visa'
    : networkLower.includes('mastercard') ? 'Mastercard'
    : card.network || cardIssuer;

  // Build fees specification text
  const feesSpec = [
    card.issuanceFee !== 'N/A' ? `Issuance: ${card.issuanceFee}` : null,
    card.annualFee !== 'N/A' ? `Annual: ${card.annualFee}` : null,
    card.fxFee !== 'N/A' ? `FX: ${card.fxFee}` : null,
  ].filter(Boolean).join('; ') || 'See card details';

  const productJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org/",
    "@type": "FinancialProduct",
    "name": card.name,
    "description": card.description,
    "brand": { "@type": "Brand", "name": networkBrand },
    "provider": { "@type": "Organization", "name": cardIssuer },
    "feesAndCommissionsSpecification": feesSpec,
    "category": "Crypto Debit Card",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": ratingValue.toFixed(1),
      "reviewCount": String(reviewCount),
      "bestRating": "5",
      "worstRating": "1",
    },
    "review": {
      "@type": "Review",
      "author": {
        "@type": "Organization",
        "name": "Sweepbase Editorial Team",
        "url": "https://sweepbase.com/about",
      },
      "publisher": { "@type": "Organization", "name": "Sweepbase", "url": "https://sweepbase.com" },
      "datePublished": "2026-03-16",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": ratingValue.toFixed(1),
        "bestRating": "5",
        "worstRating": "1",
      },
    },
    "publisher": { "@type": "Organization", "name": "Sweepbase", "url": "https://sweepbase.com" },
    "dateModified": "2026-03-18",
    "offers": {
      "@type": "Offer",
      "url": card.affiliateUrl || `https://sweepbase.com/cards/${card.slug}`,
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
    },
    "areaServed": card.regions || undefined,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home",  "item": "https://sweepbase.com" },
      { "@type": "ListItem", "position": 2, "name": "Cards", "item": "https://sweepbase.com/cards" },
      { "@type": "ListItem", "position": 3, "name": card.name, "item": `https://sweepbase.com/cards/${card.slug}` },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(({ q, a }) => ({
      "@type": "Question",
      "name": q,
      "acceptedAnswer": { "@type": "Answer", "text": stripHtml(a) },
    })),
  };

  return (
    <article className="card-detail-static">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="container">
        <div className="back-link-container">
          <a href="/" className="back-link"><i className="fa-solid fa-arrow-left"></i> Back to all cards</a>
        </div>

        {isThinCard(card) && (
          <div className="thin-card-banner" role="alert">
            <i className="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
            Limited information available. This card&apos;s details have not been fully verified.
            Data may be incomplete or outdated.
          </div>
        )}

        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'Cards', href: '/cards' },
          { label: card.name },
        ]} />

        {/* ── Hero ── */}
        <div className="card-detail-hero">
          <div className="card-hero-image">
            <Image src={card.logo} alt={card.name} className="detail-main-img" width={400} height={250} priority />
          </div>
          <div className="card-hero-content">
            <h1 className="detail-title">{card.name} Review 2026</h1>
            <StarRating rating={ratingValue} reviewCount={reviewCount} uid={card.slug} />
            <ShareButtons
              cardName={card.name}
              cardUrl={`https://sweepbase.com/cards/${card.slug}`}
            />
            <p className="detail-last-updated">
              <i className="fa-regular fa-clock"></i> Last updated: <time dateTime="2026-03-18">{card.lastReviewed || 'March 2026'}</time> by the{' '}
              <a href="/about" className="detail-reviewed-by">Sweepbase Editorial Team</a>
            </p>
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
            <a
              href={card.affiliateUrl || '/cards'}
              className="btn-get-card btn-gradient"
              {...(card.affiliateUrl ? {
                target: '_blank',
                rel: 'nofollow sponsored noopener noreferrer',
              } : {})}
            >
              Get {card.name} <i className="fa-solid fa-external-link" aria-hidden="true"></i>
            </a>
          </div>
        </div>

        <div className="static-card-wrapper">

          {/* ── 1. Card Overview ── */}
          <div className="detail-section-intro">
            <h2>Card Overview</h2>
            <p className="static-desc">{card.description}</p>
            {/* Contextual internal links based on card properties */}
            <p className="static-desc static-desc--links">
              {isVisaCard(card) && <>This is a <a href="/visa-crypto-cards">Visa crypto card</a>. </>}
              {isMastercardCard(card) && <>This is a <a href="/mastercard-crypto-cards">Mastercard crypto card</a>. </>}
              {isSelfCustodyCard(card) && <>It uses a <a href="/self-custody-crypto-cards">self-custody</a> model. </>}
              {hasCashbackFilter(card) && <>It offers <a href="/crypto-cards-with-cashback">cashback rewards</a>. </>}
              {isUSACard(card) && <>Available to <a href="/best-crypto-cards-usa">US residents</a>. </>}
              {isEuropeCard(card) && <>Available in <a href="/best-crypto-cards-europe">Europe</a>. </>}
              {isUKCard(card) && <>Available in the <a href="/best-crypto-cards-uk">UK</a>. </>}
            </p>
          </div>

          {/* ── Fees & Features grid ── */}
          <div className="static-grid">
            <div className="static-table-container">
              <h3><i className="fa-solid fa-money-bill-transfer"></i> Fees &amp; Limits</h3>
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

          {/* ── 2. Supported Cryptocurrencies ── */}
          {(cryptoTokens.length > 0 || (card.topUpMethods && !/^(n\/a|dna)$/i.test(card.topUpMethods))) && (
            <div className="detail-section-intro cd-crypto-section">
              <h2><i className="fa-solid fa-coins"></i> Supported Cryptocurrencies</h2>
              <p className="static-desc">
                The {card.name} allows you to top up and spend using{' '}
                {cryptoTokens.length > 0
                  ? `${cryptoTokens.length} supported digital asset${cryptoTokens.length > 1 ? 's' : ''}`
                  : 'various cryptocurrencies'}
                . Your crypto is automatically converted to local fiat at the point of sale.
              </p>
              {cryptoTokens.length > 0 ? (
                <div className="cd-crypto-grid">
                  {cryptoTokens.map(({ symbol, name, color }) => (
                    <span
                      key={symbol}
                      className="cd-crypto-badge"
                      style={{ borderColor: color + '55', color }}
                      title={name}
                    >
                      <span className="cd-crypto-symbol">{symbol}</span>
                      <span className="cd-crypto-name">{name}</span>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="static-desc cd-topup-raw">
                  <strong>Supported assets:</strong> {card.topUpMethods}
                </p>
              )}
            </div>
          )}

          {/* ── 3. Who Is This Card Best For? ── */}
          <div className="detail-section-intro">
            <h2>Who Is the {card.name} Best For?</h2>
            {bestForParas.map((para, i) => (
              <p key={i} className="static-desc">{para}</p>
            ))}
          </div>

          {/* ── 4. Is [Name] Right For You? ── */}
          <div className="detail-section-intro cd-rfy-section">
            <h2>Is the {card.name} Right for You?</h2>
            <div className="cd-rfy-grid">
              <div className="cd-rfy-col cd-rfy-best">
                <h3 className="cd-rfy-heading">
                  <i className="fa-solid fa-circle-check" style={{ color: 'var(--success)' }}></i>
                  Best for
                </h3>
                <ul className="cd-rfy-list">
                  {isRightForYou.bestFor.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="cd-rfy-col cd-rfy-avoid">
                <h3 className="cd-rfy-heading">
                  <i className="fa-solid fa-circle-xmark" style={{ color: 'var(--danger)' }}></i>
                  Avoid if
                </h3>
                <ul className="cd-rfy-list">
                  {isRightForYou.avoidIf.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="cd-rfy-compare">
              <i className="fa-solid fa-scale-balanced"></i>
              Compare the {card.name} side-by-side with alternatives using the{' '}
              <a href="/cards">full card listing</a> or explore our{' '}
              <a href={isVisaCard(card) ? '/visa-crypto-cards' : '/mastercard-crypto-cards'}>
                {isVisaCard(card) ? 'Visa' : 'Mastercard'} crypto cards
              </a>{' '}
              category.
            </p>
          </div>

          {/* ── 5. Pros & Cons ── */}
          <div className="detail-section-intro">
            <h2>Key Strengths &amp; Considerations</h2>
          </div>
          <div className="cd-pros-cons-grid">
            <div className="cd-pros-col">
              <h3 className="cd-pcol-heading cd-pros-heading">
                <i className="fa-solid fa-circle-check"></i> Strengths
              </h3>
              <ul className="cd-pc-list">
                {prosItems.map((item, i) => (
                  <li key={i} className="cd-pro-item">
                    <span className="cd-pc-icon cd-pro-icon" aria-hidden="true">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="cd-cons-col">
              <h3 className="cd-pcol-heading cd-cons-heading">
                <i className="fa-solid fa-triangle-exclamation"></i> Considerations
              </h3>
              <ul className="cd-pc-list">
                {consItems.map((item, i) => (
                  <li key={i} className="cd-con-item">
                    <span className="cd-pc-icon cd-con-icon" aria-hidden="true">✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── 6. How to Get ── */}
          <div className="detail-section-intro">
            <h2>How to Get the {card.name}</h2>
            <p className="static-desc">
              Getting started with the {card.name} is straightforward. Follow the four steps below to apply, verify your identity, and start spending your crypto.
            </p>
          </div>
          <div className="cd-how-to-steps">
            {howToSteps.map(({ num, icon, title, desc, time }) => (
              <div key={num} className="cd-how-to-step">
                <div className="cd-step-num" aria-hidden="true">{num}</div>
                <div className="cd-step-body">
                  <div className="cd-step-header">
                    <i className={`fa-solid ${icon} cd-step-icon`}></i>
                    <h3 className="cd-step-title">{title}</h3>
                    <span className="cd-step-time">
                      <i className="fa-regular fa-clock"></i> {time}
                    </span>
                  </div>
                  <p className="cd-step-desc">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Requirements */}
          <div className="cd-requirements">
            <h3 className="cd-req-heading"><i className="fa-solid fa-clipboard-list"></i> Requirements</h3>
            <div className="cd-req-grid">
              {[
                { label: 'Minimum age', value: '18 years (21+ in some US states)' },
                { label: 'KYC level', value: 'Standard KYC — government-issued photo ID' },
                {
                  label: 'Residency',
                  value: card.regions && !/^(n\/a|dna)$/i.test(card.regions) ? card.regions : 'Check issuer website',
                },
                { label: 'Minimum deposit', value: 'Varies by issuer — typically no minimum' },
              ].map(({ label, value }) => (
                <div key={label} className="cd-req-item">
                  <span className="cd-req-label">{label}</span>
                  <span className="cd-req-value">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── 7. Regional Availability ── */}
          <div className="detail-section-intro cd-regional-section">
            <h2>
              <i className="fa-solid fa-earth-americas"></i> Regional Availability
            </h2>
            <p className="cd-region-headline">{regionalInfo.headline}</p>
            <p className="static-desc">{regionalInfo.detail}</p>
            {regionalInfo.highlights.length > 0 && (
              <>
                <p className="cd-highlights-label">
                  {regionalInfo.headline.includes('United States') ? 'Commonly supported states:' :
                   regionalInfo.headline.includes('EEA') ? 'Key supported countries:' :
                   'Available in major markets including:'}
                </p>
                <div className="cd-region-highlights">
                  {regionalInfo.highlights.map(h => (
                    <span key={h} className="cd-region-pill">{h}</span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ── 8. FAQ (7 questions) ── */}
          {/*
            The visible accordion text and the FAQPage JSON-LD schema both derive
            from the same `faqItems` array, guaranteeing content/schema parity.
          */}
          <div className="detail-section-intro cd-faq-section">
            <h2><i className="fa-solid fa-circle-question"></i> Frequently Asked Questions</h2>
            <FAQAccordion items={faqItems} ns={card.slug} />
          </div>

          {/* ── Related Guides ── */}
          <div className="related-guides">
            <h3 className="related-guides__title">Learn More About Crypto Cards</h3>
            <div className="related-guides__list">
              <a href="/guides/how-to-choose-a-crypto-card" className="related-guides__link">
                How to Choose a Crypto Card <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
              </a>
              <a href="/guides/crypto-card-fees-explained" className="related-guides__link">
                Crypto Card Fees Explained <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
              </a>
              {card.custody.toLowerCase().includes('self') && (
                <a href="/guides/self-custody-vs-custodial-crypto-cards" className="related-guides__link">
                  Self-Custody vs Custodial Cards <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                </a>
              )}
              <a href="/guides/best-crypto-cards-for-beginners" className="related-guides__link">
                Best Cards for Beginners <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
              </a>
            </div>
          </div>

          {/* ── Similar Cards ── */}
          <div className="static-similar redesign">
            <h2>Similar Cards You Might Like</h2>
            <div className="similar-cards-grid">
              {similar.map(s => (
                <a key={s.slug} href={`/cards/${s.slug}`} className="similar-card-tile" aria-label={`Compare ${card.name} with ${s.name}`}>
                  <div className="similar-tile-img">
                    <Image src={s.logo} alt={s.name} width={80} height={50} />
                  </div>
                  <div className="similar-tile-info">
                    <span className="similar-tile-name">Compare {card.name} with {s.name} →</span>
                    <span className="similar-tile-network">{s.network} · {s.custody}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* ── Browse by Category ── */}
          {relatedCats.length > 0 && (
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
          )}

        </div>
      </div>
    </article>
  );
}
