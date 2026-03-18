import { getAllCards } from "@/lib/data";
import { isUSACard, isEuropeCard, isVisaCard, isMastercardCard, isSelfCustodyCard, hasCashback as hasCashbackFilter } from "@/lib/filters";
import { getCardRatingData } from "@/lib/ratings";
import { generateCardMetaDescription } from "@/lib/meta";
import StarRating from "@/components/StarRating";
import Breadcrumb from "@/components/Breadcrumb";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import dynamic from "next/dynamic";
import type { Card } from "@/lib/data";

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

export const revalidate = 3600;

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
  return {
    title,
    description,
    robots: { index: true, follow: true },
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
  };
}

// ─── Utility ──────────────────────────────────────────────────────────────────

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Extract plain-text bullet items from an HTML string (<li> or <br>/<p> fallback). */
function parseHtmlItems(html: string): string[] {
  if (!html) return [];
  const liMatches = Array.from(html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi));
  if (liMatches.length) {
    return liMatches.map(m => stripHtml(m[1])).filter(t => t.length > 3);
  }
  return html.split(/<br\s*\/?>|<\/p>\s*<p>|\n/)
    .map(s => stripHtml(s).trim())
    .filter(t => t.length > 3);
}

function isFree(val: string) { return /^(free|\$0|€0|0|0\.00|zero|none)$/i.test(val.trim()); }
function hasMeaningfulCashback(card: Card) {
  const cb = card.cashback.toLowerCase().trim();
  return cb && cb !== 'n/a' && cb !== '0%' && cb !== '0' && cb !== 'none' && cb !== 'no' && !cb.startsWith('no ');
}

// ─── Pros / Cons helpers ──────────────────────────────────────────────────────

function buildProsItems(card: Card, cardIssuer: string): string[] {
  const parsed = parseHtmlItems(card.pros);
  if (parsed.length >= 3) return parsed.slice(0, 6);

  const items: string[] = [...parsed];
  if (hasMeaningfulCashback(card) && !parsed.some(p => p.toLowerCase().includes('cashback')))
    items.push(`Earn ${card.cashback} cashback on eligible purchases`);
  if (isFree(card.issuanceFee) && !parsed.some(p => p.toLowerCase().includes('issuance')))
    items.push('No card issuance fee');
  if (isFree(card.annualFee) && !parsed.some(p => p.toLowerCase().includes('annual')))
    items.push('No annual maintenance fee');
  if (card.network.toLowerCase().includes('visa'))
    items.push('Accepted at 80 million+ Visa merchants worldwide');
  else if (card.network.toLowerCase().includes('mastercard'))
    items.push('Accepted at millions of Mastercard merchants worldwide');
  if (card.custody.toLowerCase().includes('self'))
    items.push('Self-custody — control your private keys until the point of purchase');
  const reg = (card.regions + ' ' + card.countries).toLowerCase();
  if (reg.includes('worldwide') || reg.includes('global'))
    items.push('Available in most countries globally');
  else if (reg.includes('eea') || reg.includes('europe'))
    items.push('Wide coverage across the European Economic Area');
  if (card.cardType.toLowerCase().includes('virtual'))
    items.push('Virtual card available instantly — no shipping required');

  return Array.from(new Set(items)).slice(0, 6);
}

function buildConsItems(card: Card, cardIssuer: string): string[] {
  const parsed = parseHtmlItems(card.cons);
  if (parsed.length >= 3) return parsed.slice(0, 6);

  const items: string[] = [...parsed];
  if (!hasMeaningfulCashback(card) && !parsed.some(p => p.toLowerCase().includes('cashback')))
    items.push('No cashback or rewards programme');
  if (!isFree(card.issuanceFee) && !/^(n\/a|dna)/i.test(card.issuanceFee))
    items.push(`Card issuance fee: ${card.issuanceFee}`);
  if (!isFree(card.annualFee) && !/^(n\/a|dna)/i.test(card.annualFee))
    items.push(`Annual fee: ${card.annualFee}`);
  if (!card.custody.toLowerCase().includes('self') && !parsed.some(p => p.toLowerCase().includes('custodial')))
    items.push('Custodial product — funds held by the issuer');
  const reg = (card.regions + ' ' + card.countries).toLowerCase();
  if (!reg.includes('worldwide') && !reg.includes('global') && !parsed.some(p => p.toLowerCase().includes('region')))
    items.push('Limited to certain regions — not globally available');
  if (!parsed.some(p => p.toLowerCase().includes('kyc')))
    items.push('KYC identity verification required to activate');

  return Array.from(new Set(items)).slice(0, 6);
}

// ─── Crypto token badges ──────────────────────────────────────────────────────

const CRYPTO_INFO: Record<string, { symbol: string; name: string; color: string }> = {
  btc: { symbol: 'BTC', name: 'Bitcoin', color: '#F7931A' },
  bitcoin: { symbol: 'BTC', name: 'Bitcoin', color: '#F7931A' },
  eth: { symbol: 'ETH', name: 'Ethereum', color: '#627EEA' },
  ethereum: { symbol: 'ETH', name: 'Ethereum', color: '#627EEA' },
  usdt: { symbol: 'USDT', name: 'Tether', color: '#26A17B' },
  tether: { symbol: 'USDT', name: 'Tether', color: '#26A17B' },
  usdc: { symbol: 'USDC', name: 'USD Coin', color: '#2775CA' },
  'usd coin': { symbol: 'USDC', name: 'USD Coin', color: '#2775CA' },
  bnb: { symbol: 'BNB', name: 'BNB', color: '#F0B90B' },
  sol: { symbol: 'SOL', name: 'Solana', color: '#9945FF' },
  solana: { symbol: 'SOL', name: 'Solana', color: '#9945FF' },
  xrp: { symbol: 'XRP', name: 'XRP', color: '#346AA9' },
  ripple: { symbol: 'XRP', name: 'XRP', color: '#346AA9' },
  ltc: { symbol: 'LTC', name: 'Litecoin', color: '#BFBBBB' },
  litecoin: { symbol: 'LTC', name: 'Litecoin', color: '#BFBBBB' },
  ada: { symbol: 'ADA', name: 'Cardano', color: '#3CC8C8' },
  cardano: { symbol: 'ADA', name: 'Cardano', color: '#3CC8C8' },
  dot: { symbol: 'DOT', name: 'Polkadot', color: '#E6007A' },
  polkadot: { symbol: 'DOT', name: 'Polkadot', color: '#E6007A' },
  matic: { symbol: 'MATIC', name: 'Polygon', color: '#8247E5' },
  polygon: { symbol: 'MATIC', name: 'Polygon', color: '#8247E5' },
  avax: { symbol: 'AVAX', name: 'Avalanche', color: '#E84142' },
  avalanche: { symbol: 'AVAX', name: 'Avalanche', color: '#E84142' },
  link: { symbol: 'LINK', name: 'Chainlink', color: '#2A5ADA' },
  chainlink: { symbol: 'LINK', name: 'Chainlink', color: '#2A5ADA' },
  dai: { symbol: 'DAI', name: 'DAI', color: '#F5AC37' },
  doge: { symbol: 'DOGE', name: 'Dogecoin', color: '#C3A634' },
  dogecoin: { symbol: 'DOGE', name: 'Dogecoin', color: '#C3A634' },
  trx: { symbol: 'TRX', name: 'TRON', color: '#EB0029' },
  tron: { symbol: 'TRX', name: 'TRON', color: '#EB0029' },
  shib: { symbol: 'SHIB', name: 'Shiba Inu', color: '#FFA409' },
  'shiba inu': { symbol: 'SHIB', name: 'Shiba Inu', color: '#FFA409' },
  xlm: { symbol: 'XLM', name: 'Stellar', color: '#7D00FF' },
  stellar: { symbol: 'XLM', name: 'Stellar', color: '#7D00FF' },
};

function getCryptoTokens(topUpMethods: string) {
  if (!topUpMethods || /^(n\/a|dna|-)$/i.test(topUpMethods.trim())) return [];
  const seen = new Set<string>();
  const tokens: Array<{ symbol: string; name: string; color: string }> = [];
  const parts = topUpMethods.split(/[,;\/\n&+]+/).map(s => s.trim().toLowerCase());
  for (const part of parts) {
    for (const [key, info] of Object.entries(CRYPTO_INFO)) {
      if (part.includes(key) && !seen.has(info.symbol)) {
        seen.add(info.symbol);
        tokens.push(info);
        break;
      }
    }
  }
  return tokens.slice(0, 12);
}

// ─── "Is this right for you?" ─────────────────────────────────────────────────

function getIsRightForYou(card: Card, cardIssuer: string) {
  const isSelfCust = card.custody.toLowerCase().includes('self');
  const hasCb = hasMeaningfulCashback(card);
  const isUS = isUSACard(card);
  const isEU = isEuropeCard(card);

  const bestFor: string[] = [];
  if (hasCb) bestFor.push(`Frequent spenders who want to earn ${card.cashback} cashback`);
  if (isSelfCust) bestFor.push('DeFi users who prefer to keep self-custody of their assets');
  else bestFor.push('Users who want a simple, app-managed crypto card experience');
  if (isUS) bestFor.push('US residents looking for a crypto-native spending card');
  else if (isEU) bestFor.push('European users within EEA countries');
  if (isFree(card.issuanceFee) && isFree(card.annualFee))
    bestFor.push('Cost-conscious users — zero issuance and annual fees');

  const avoidIf: string[] = [];
  if (!hasCb) avoidIf.push('You primarily want a card that earns cashback rewards');
  if (!isSelfCust) avoidIf.push('You require full non-custodial control of your funds at all times');
  if (isUS && !isEU) avoidIf.push("You're based in Europe — this card targets US users");
  else if (isEU && !isUS) avoidIf.push("You're a US resident — this card does not support US users");
  avoidIf.push('You need traditional bank integration (IBAN, SEPA, direct debits)');
  avoidIf.push('You want a card backed by government deposit insurance (FDIC / FSCS)');

  return { bestFor: bestFor.slice(0, 4), avoidIf: avoidIf.slice(0, 4) };
}

// ─── How-to steps ─────────────────────────────────────────────────────────────

function getHowToGetSteps(card: Card, cardIssuer: string) {
  const isVirtual = card.cardType.toLowerCase().includes('virtual');
  const topUp = card.topUpMethods && !/^(n\/a|dna)$/i.test(card.topUpMethods)
    ? card.topUpMethods
    : 'supported cryptocurrencies';

  return [
    {
      num: 1, icon: 'fa-user-plus',
      title: `Create a ${cardIssuer} account`,
      desc: `Visit the official ${cardIssuer} website or download their mobile app. Register with your email address, set a strong password, and accept the terms of service. Sign-up is free.`,
      time: '~5 minutes',
    },
    {
      num: 2, icon: 'fa-id-card',
      title: 'Complete KYC verification',
      desc: `Submit a government-issued photo ID (passport or national ID card) along with a live selfie for identity verification. ${cardIssuer} processes applications in line with AML and KYC regulations.`,
      time: '1–3 business days',
    },
    {
      num: 3, icon: 'fa-wallet',
      title: 'Fund your card',
      desc: `Once verified, top up your card balance using ${topUp} via the platform's funding interface. Your crypto is automatically converted to the local fiat currency at the prevailing rate when you spend.`,
      time: 'Usually instant',
    },
    {
      num: 4,
      icon: isVirtual ? 'fa-mobile-screen' : 'fa-truck-fast',
      title: isVirtual ? 'Start spending immediately' : 'Receive and activate your card',
      desc: isVirtual
        ? `Your virtual ${card.name} is available immediately in the ${cardIssuer} app. Use it for online purchases, or add it to Apple Pay or Google Pay for in-store contactless payments.`
        : `Your physical ${card.name} will be shipped to your registered address and typically arrives within 5–10 business days. Activate it directly through the ${cardIssuer} app.`,
      time: isVirtual ? 'Instant' : '5–10 business days',
    },
  ];
}

// ─── Regional info ─────────────────────────────────────────────────────────────

function getRegionalInfo(card: Card, cardName: string) {
  const reg = (card.regions + ' ' + card.countries).toLowerCase();

  if (reg.includes('worldwide') || reg.includes('global')) {
    return {
      headline: 'Available Worldwide',
      detail: `The ${cardName} is available to users in the majority of countries worldwide. Minor exceptions may apply due to local financial regulations. Always confirm current availability on the ${cardName.split(' ')[0]} website before applying.`,
      highlights: ['United States', 'United Kingdom', 'Germany', 'France', 'Australia', 'Canada', 'Singapore', 'Japan', 'Brazil', 'South Korea'],
    };
  }
  if (reg.includes('eea') || (reg.includes('europe') && !reg.includes('north america'))) {
    return {
      headline: 'Available Across the EEA',
      detail: `The ${cardName} is available throughout the European Economic Area — covering all 27 EU member states plus Iceland, Liechtenstein, and Norway. UK residents should verify post-Brexit availability directly with the issuer.`,
      highlights: ['Germany', 'France', 'Spain', 'Italy', 'Netherlands', 'Sweden', 'Belgium', 'Poland', 'Austria', 'Portugal'],
    };
  }
  if (reg.includes('usa') || reg.includes('united states') || reg.includes('us only') || reg.includes('us residents')) {
    return {
      headline: 'Available in the United States',
      detail: `The ${cardName} is primarily available to US residents. Availability may vary by state due to state-level money transmission licensing requirements. Check the issuer's website for details specific to your state.`,
      highlights: ['California', 'New York', 'Texas', 'Florida', 'Illinois', 'Washington', 'Colorado', 'New Jersey', 'Massachusetts', 'Nevada'],
    };
  }
  const regionDisplay = card.regions && !/^(n\/a|dna)$/i.test(card.regions) ? card.regions : 'selected regions';
  return {
    headline: `Available in ${regionDisplay}`,
    detail: `The ${cardName} is currently available in ${regionDisplay}. Regional restrictions may apply — visit the official issuer website to confirm availability in your country before applying.`,
    highlights: [],
  };
}

// ─── Extended FAQ (7 items) ────────────────────────────────────────────────────

function getExtendedFaqs(card: Card, cardIssuer: string) {
  const isSelfCust = card.custody.toLowerCase().includes('self');
  const hasCb = hasMeaningfulCashback(card);
  const hasTopUp = card.topUpMethods && !/^(n\/a|dna)$/i.test(card.topUpMethods);
  const hasRegion = card.regions && !/^(n\/a|dna)$/i.test(card.regions);
  const hasAtm = card.atmLimit && !/^(n\/a|dna)$/i.test(card.atmLimit);
  const hasSpend = card.spendLimit && !/^(n\/a|dna)$/i.test(card.spendLimit);

  return [
    {
      q: `What is the ${card.name}?`,
      a: card.description || `The ${card.name} is a cryptocurrency ${card.cardType.toLowerCase()} issued by ${cardIssuer}, available on the ${card.network} network.`,
    },
    {
      q: `What are the fees for the ${card.name}?`,
      a: `The ${card.name} has an issuance fee of ${card.issuanceFee} and an annual fee of ${card.annualFee}. The FX fee for foreign-currency transactions is ${card.fxFee}. ATM withdrawal limit: ${card.atmLimit}. Daily spending limit: ${card.spendLimit}. Fee data was verified in March 2026 — always confirm the current schedule on the ${cardIssuer} website.`,
    },
    {
      q: `Is the ${card.name} safe and regulated?`,
      a: `${cardIssuer} is required to comply with KYC and AML regulations in the jurisdictions where it operates. ${isSelfCust ? `Because the ${card.name} is a self-custody product, your crypto assets remain under your control until the moment of purchase, significantly reducing counterparty risk.` : `As a custodial product, ${cardIssuer} holds your funds on your behalf. Review their regulatory licences and any applicable deposit-protection schemes on the ${cardIssuer} website.`} Cryptocurrency is not covered by traditional deposit insurance (e.g. FDIC in the US or FSCS in the UK) in most jurisdictions.`,
    },
    {
      q: `What cryptocurrencies does the ${card.name} support?`,
      a: hasTopUp
        ? `The ${card.name} supports the following assets for top-up and spending: ${card.topUpMethods}. When you make a purchase, the selected crypto is automatically converted to the local fiat currency at the prevailing rate. Supported assets may change — consult the ${cardIssuer} app for the current list.`
        : `The ${card.name} supports multiple cryptocurrencies for top-up. Visit the official ${cardIssuer} website or app for the current list of supported digital assets.`,
    },
    {
      q: `How does the ${card.name} cashback work?`,
      a: hasCb
        ? `The ${card.name} offers ${card.cashback} cashback on eligible card purchases. Rewards are typically distributed in ${cardIssuer}'s native token or a supported stablecoin. Specific terms, earning caps, qualifying spend categories, and any minimum balance or tier requirements are set by ${cardIssuer} — check the app or rewards page for full details.`
        : `The ${card.name} does not currently offer a cashback rewards programme. If earning rewards is important to you, explore our <a href="/crypto-cards-with-cashback">Crypto Cards with Cashback</a> comparison page.`,
    },
    {
      q: `Is the ${card.name} available in my country?`,
      a: hasRegion
        ? `The ${card.name} is available in: ${card.regions}${card.countries ? ` — including ${card.countries}` : ''}. Availability can change as ${cardIssuer} expands its licensing. If your country is not listed, check the ${cardIssuer} website directly for the latest information.`
        : `Geographic availability varies. Visit the official ${cardIssuer} website to confirm whether the card is currently offered in your country.`,
    },
    {
      q: `What are the ${card.name}'s ATM withdrawal and spending limits?`,
      a: `The ${card.name} has an ATM withdrawal limit of ${hasAtm ? card.atmLimit : 'which depends on your account tier and verification level'}. The daily spending limit is ${hasSpend ? card.spendLimit : 'determined by your account level'}. Higher limits may be available for verified or premium account holders. Contact ${cardIssuer} support to request an increase.`,
    },
  ];
}

// ─── Existing helpers ──────────────────────────────────────────────────────────

function getBestForParagraphs(card: Card, cardIssuer: string): string[] {
  const isSelfCustody = card.custody.toLowerCase().includes('self');
  const hasCb = hasMeaningfulCashback(card);
  const hasRegions = card.regions && !/^(n\/a|dna)$/i.test(card.regions);

  const audience = isSelfCustody
    ? 'DeFi enthusiasts and privacy-conscious users who want to maintain control of their private keys right up to the point of purchase'
    : 'everyday crypto holders looking for a simple, convenient way to spend digital assets without managing wallets manually';

  const cashbackLine = hasCb
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

function getRelatedCategories(card: Card): Array<{ href: string; label: string; icon: string }> {
  const categories: Array<{ href: string; label: string; icon: string }> = [];
  if (isVisaCard(card))        categories.push({ href: '/visa-crypto-cards',          label: 'Visa Crypto Cards',       icon: 'fa-credit-card' });
  if (isMastercardCard(card))  categories.push({ href: '/mastercard-crypto-cards',    label: 'Mastercard Crypto Cards', icon: 'fa-circle-dot' });
  if (isSelfCustodyCard(card)) categories.push({ href: '/self-custody-crypto-cards',  label: 'Self-Custody Cards',      icon: 'fa-key' });
  if (hasCashbackFilter(card)) categories.push({ href: '/crypto-cards-with-cashback', label: 'Cards With Cashback',     icon: 'fa-percent' });
  if (isUSACard(card))         categories.push({ href: '/best-crypto-cards-usa',      label: 'Best Cards in the USA',   icon: 'fa-flag-usa' });
  if (isEuropeCard(card))      categories.push({ href: '/best-crypto-cards-europe',   label: 'Best Cards in Europe',    icon: 'fa-earth-europe' });
  return categories.slice(0, 3);
}

// ─── Page component ────────────────────────────────────────────────────────────

export default async function CardDetailPage({ params }: { params: { slug: string } }) {
  const cards = await getAllCards();
  const card = cards.find((c) => c.slug === params.slug);
  if (!card) notFound();

  const others = cards.filter(c => c.slug !== card.slug);
  const similar = others.sort(() => 0.5 - Math.random()).slice(0, 3);

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
    "dateModified": "2026-03-16",
    "offers": {
      "@type": "Offer",
      "url": `https://sweepbase.com/cards/${card.slug}`,
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
    },
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
              <i className="fa-regular fa-clock"></i> Last reviewed: {card.lastReviewed} by the{' '}
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
              href="/cards"
              className="btn-get-card btn-gradient"
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
                <a key={s.slug} href={`/cards/${s.slug}`} className="similar-card-tile" aria-label={`Compare ${s.name}`}>
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
