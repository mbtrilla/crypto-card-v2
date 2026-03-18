/**
 * Card detail page helper functions.
 * Extracted from page.tsx to keep the page component focused on rendering.
 */

import type { Card } from '@/lib/data';
import { isUSACard, isEuropeCard, isUKCard, isAsiaCard, isVisaCard, isMastercardCard, isSelfCustodyCard, hasCashback as hasCashbackFilter } from '@/lib/filters';

// ─── Utility ──────────────────────────────────────────────────────────────────

export function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

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

export function hasMeaningfulCashback(card: Card) {
  const cb = card.cashback.toLowerCase().trim();
  return cb && cb !== 'n/a' && cb !== '0%' && cb !== '0' && cb !== 'none' && cb !== 'no' && !cb.startsWith('no ');
}

// ─── Pros / Cons ─────────────────────────────────────────────────────────────

export function buildProsItems(card: Card, cardIssuer: string): string[] {
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

export function buildConsItems(card: Card, cardIssuer: string): string[] {
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

// ─── Crypto token badges ─────────────────────────────────────────────────────

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

export function getCryptoTokens(topUpMethods: string) {
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

// ─── "Is this right for you?" ────────────────────────────────────────────────

export function getIsRightForYou(card: Card, cardIssuer: string) {
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

// ─── How-to steps ────────────────────────────────────────────────────────────

export function getHowToGetSteps(card: Card, cardIssuer: string) {
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

// ─── Regional info ───────────────────────────────────────────────────────────

export function getRegionalInfo(card: Card, cardName: string) {
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

// ─── Extended FAQ ────────────────────────────────────────────────────────────

export function getExtendedFaqs(card: Card, cardIssuer: string) {
  const isSelfCust = card.custody.toLowerCase().includes('self');
  const hasCb = hasMeaningfulCashback(card);
  const hasTopUp = card.topUpMethods && !/^(n\/a|dna)$/i.test(card.topUpMethods);
  const hasRegion = card.regions && !/^(n\/a|dna)$/i.test(card.regions);
  const hasAtm = card.atmLimit && !/^(n\/a|dna)$/i.test(card.atmLimit);
  const hasSpend = card.spendLimit && !/^(n\/a|dna)$/i.test(card.spendLimit);

  return [
    { q: `What is the ${card.name}?`, a: card.description || `The ${card.name} is a cryptocurrency ${card.cardType.toLowerCase()} issued by ${cardIssuer}, available on the ${card.network} network.` },
    { q: `What are the fees for the ${card.name}?`, a: `The ${card.name} has an issuance fee of ${card.issuanceFee} and an annual fee of ${card.annualFee}. The FX fee for foreign-currency transactions is ${card.fxFee}. ATM withdrawal limit: ${card.atmLimit}. Daily spending limit: ${card.spendLimit}. Fee data was verified in March 2026 — always confirm the current schedule on the ${cardIssuer} website.` },
    { q: `Is the ${card.name} safe and regulated?`, a: `${cardIssuer} is required to comply with KYC and AML regulations in the jurisdictions where it operates. ${isSelfCust ? `Because the ${card.name} is a self-custody product, your crypto assets remain under your control until the moment of purchase, significantly reducing counterparty risk.` : `As a custodial product, ${cardIssuer} holds your funds on your behalf. Review their regulatory licences and any applicable deposit-protection schemes on the ${cardIssuer} website.`} Cryptocurrency is not covered by traditional deposit insurance (e.g. FDIC in the US or FSCS in the UK) in most jurisdictions.` },
    { q: `What cryptocurrencies does the ${card.name} support?`, a: hasTopUp ? `The ${card.name} supports the following assets for top-up and spending: ${card.topUpMethods}. When you make a purchase, the selected crypto is automatically converted to the local fiat currency at the prevailing rate. Supported assets may change — consult the ${cardIssuer} app for the current list.` : `The ${card.name} supports multiple cryptocurrencies for top-up. Visit the official ${cardIssuer} website or app for the current list of supported digital assets.` },
    { q: `How does the ${card.name} cashback work?`, a: hasCb ? `The ${card.name} offers ${card.cashback} cashback on eligible card purchases. Rewards are typically distributed in ${cardIssuer}'s native token or a supported stablecoin. Specific terms, earning caps, qualifying spend categories, and any minimum balance or tier requirements are set by ${cardIssuer} — check the app or rewards page for full details.` : `The ${card.name} does not currently offer a cashback rewards programme. If earning rewards is important to you, explore our <a href="/crypto-cards-with-cashback">Crypto Cards with Cashback</a> comparison page.` },
    { q: `Is the ${card.name} available in my country?`, a: hasRegion ? `The ${card.name} is available in: ${card.regions}${card.countries ? ` — including ${card.countries}` : ''}. Availability can change as ${cardIssuer} expands its licensing. If your country is not listed, check the ${cardIssuer} website directly for the latest information.` : `Geographic availability varies. Visit the official ${cardIssuer} website to confirm whether the card is currently offered in your country.` },
    { q: `What are the ${card.name}'s ATM withdrawal and spending limits?`, a: `The ${card.name} has an ATM withdrawal limit of ${hasAtm ? card.atmLimit : 'which depends on your account tier and verification level'}. The daily spending limit is ${hasSpend ? card.spendLimit : 'determined by your account level'}. Higher limits may be available for verified or premium account holders. Contact ${cardIssuer} support to request an increase.` },
  ];
}

// ─── Best-for paragraphs ─────────────────────────────────────────────────────

export function getBestForParagraphs(card: Card, cardIssuer: string): string[] {
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

// ─── Related categories ──────────────────────────────────────────────────────

export function getRelatedCategories(card: Card): Array<{ href: string; label: string; icon: string }> {
  const categories: Array<{ href: string; label: string; icon: string }> = [];
  if (isVisaCard(card))        categories.push({ href: '/visa-crypto-cards',          label: 'Visa Crypto Cards',       icon: 'fa-credit-card' });
  if (isMastercardCard(card))  categories.push({ href: '/mastercard-crypto-cards',    label: 'Mastercard Crypto Cards', icon: 'fa-circle-dot' });
  if (isSelfCustodyCard(card)) categories.push({ href: '/self-custody-crypto-cards',  label: 'Self-Custody Cards',      icon: 'fa-key' });
  if (hasCashbackFilter(card)) categories.push({ href: '/crypto-cards-with-cashback', label: 'Cards With Cashback',     icon: 'fa-percent' });
  if (isUSACard(card))         categories.push({ href: '/best-crypto-cards-usa',      label: 'Best Cards in the USA',   icon: 'fa-flag-usa' });
  if (isEuropeCard(card))      categories.push({ href: '/best-crypto-cards-europe',   label: 'Best Cards in Europe',    icon: 'fa-earth-europe' });
  if (isUKCard(card))          categories.push({ href: '/best-crypto-cards-uk',       label: 'Best Cards in the UK',    icon: 'fa-sterling-sign' });
  if (isAsiaCard(card))        categories.push({ href: '/best-crypto-cards-asia',     label: 'Best Cards in Asia',      icon: 'fa-earth-asia' });
  if (card.cardType.toLowerCase().includes('virtual') && !card.cardType.toLowerCase().includes('physical'))
    categories.push({ href: '/virtual-crypto-cards', label: 'Virtual Crypto Cards', icon: 'fa-mobile-screen' });
  if (card.cardType.toLowerCase().includes('physical'))
    categories.push({ href: '/physical-crypto-cards', label: 'Physical Crypto Cards', icon: 'fa-id-card' });
  return categories.slice(0, 5);
}
