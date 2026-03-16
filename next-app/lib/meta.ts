import type { Card } from '@/lib/data';

const YEAR = '2026';
const MAX_LEN = 155;

// ── helpers ──────────────────────────────────────────────────────────────────

function isFreeVal(val: string): boolean {
  return /^(free|\$0|€0|0|0\.00|zero|none|no\s+fee)$/i.test(val.trim());
}

const DNA_RE = /^(dna|n\/a|data\s+not\s+available|not\s+available|\?|-)$/i;

function isDNA(val: string): boolean {
  return !val || DNA_RE.test(val.trim());
}

function hasMeaningfulCashback(cb: string): boolean {
  const v = cb.toLowerCase().trim();
  return (
    !!v &&
    v !== 'n/a' &&
    v !== '0%' &&
    v !== '0' &&
    v !== 'none' &&
    v !== 'no' &&
    !v.startsWith('no ') &&
    !isDNA(v)
  );
}

/** Extract the shortest useful cashback label, e.g. "Up to 8%" or "5%". */
function shortCashback(cb: string): string {
  const upTo = cb.match(/up\s+to\s+(\d+(?:\.\d+)?%)/i);
  if (upTo) return `Up to ${upTo[1]}`;
  const pct = cb.match(/(\d+(?:\.\d+)?%)/i);
  if (pct) return pct[1];
  return cb.length <= 15 ? cb : cb.substring(0, 12) + '…';
}

function geoPhrase(card: Card): string {
  const reg = (card.regions + ' ' + card.countries).toLowerCase();
  if (reg.includes('worldwide') || reg.includes('global')) return 'worldwide';
  if (reg.includes('eea') || (reg.includes('europe') && !reg.includes('north america'))) return 'EEA';
  if (
    reg.includes('usa') ||
    reg.includes('united states') ||
    reg.includes('us only') ||
    reg.includes('us residents')
  ) return 'US';
  if (card.regions && !isDNA(card.regions)) {
    const r = card.regions.trim();
    return r.length <= 20 ? r : '';
  }
  return '';
}

// ── generateCardMetaDescription ──────────────────────────────────────────────

/**
 * Generates an SEO meta description for a card page.
 * Strict 155-character limit.
 * Formula: "[Name] review 2026: [cashback], [fees], [network], [geo]. Compare fees & eligibility at Sweepbase."
 */
export function generateCardMetaDescription(card: Card): string {
  const base = `${card.name} review ${YEAR}: `;
  const suffix = ' Compare fees & eligibility at Sweepbase.';
  const budget = MAX_LEN - base.length - suffix.length;

  const parts: string[] = [];

  const tryAdd = (str: string): boolean => {
    const joined = [...parts, str].join(', ') + '.';
    if (joined.length <= budget) {
      parts.push(str);
      return true;
    }
    return false;
  };

  // Priority 1: cashback (prefer mainPageCashback for brevity)
  const cbSource = card.mainPageCashback || card.cashback;
  if (hasMeaningfulCashback(cbSource)) {
    tryAdd(shortCashback(cbSource) + ' cashback');
  }

  // Priority 2: zero fees
  if (isFreeVal(card.issuanceFee) && isFreeVal(card.annualFee)) {
    tryAdd('no fees');
  } else if (!isDNA(card.annualFee) && isFreeVal(card.annualFee)) {
    tryAdd('no annual fee');
  }

  // Priority 3: Visa / Mastercard network
  const net = card.network.toLowerCase();
  const netStr = net.includes('visa')
    ? 'Visa'
    : net.includes('mastercard')
    ? 'Mastercard'
    : '';
  if (netStr) tryAdd(netStr);

  // Priority 4: geographic availability
  const geo = geoPhrase(card);
  if (geo) tryAdd('available ' + geo);

  const middle =
    parts.length > 0 ? parts.join(', ') + '.' : 'full fees & details compared.';
  const result = base + middle + suffix;

  // Hard safety clamp (should not normally trigger)
  return result.length <= MAX_LEN ? result : result.substring(0, MAX_LEN - 1) + '…';
}

// ── generateCategoryMetaDescription ─────────────────────────────────────────

const CATEGORY_FACTS: Record<string, { label: string; tagline: string }> = {
  'best-crypto-cards-usa': {
    label: 'crypto cards for US residents',
    tagline: 'Filtered for US KYC availability',
  },
  'best-crypto-cards-europe': {
    label: 'crypto cards in Europe & the EEA',
    tagline: 'Covering all 27 EU member states',
  },
  'visa-crypto-cards': {
    label: 'Visa crypto cards',
    tagline: 'Accepted at 80M+ merchants worldwide',
  },
  'mastercard-crypto-cards': {
    label: 'Mastercard crypto cards',
    tagline: 'Global Mastercard merchant acceptance',
  },
  'self-custody-crypto-cards': {
    label: 'self-custody crypto cards',
    tagline: 'Keep your keys until the point of purchase',
  },
  'crypto-cards-with-cashback': {
    label: 'crypto cards with cashback',
    tagline: 'Earn BTC, stablecoins or token rewards',
  },
};

/**
 * Generates an SEO meta description for a category page.
 * Strict 155-character limit. Embeds real card count for freshness signals.
 */
export function generateCategoryMetaDescription(
  slug: string,
  cardCount: number,
): string {
  const fact = CATEGORY_FACTS[slug];
  const desc = fact
    ? `Compare ${cardCount} ${fact.label} in ${YEAR}. ${fact.tagline}. Compare fees, rewards & availability at Sweepbase.`
    : `Compare ${cardCount} crypto cards in this category. Filter by fees, cashback, and availability. Updated ${YEAR}.`;

  return desc.length <= MAX_LEN ? desc : desc.substring(0, MAX_LEN - 1) + '…';
}

// ── generateHomeMetaDescription ──────────────────────────────────────────────

/**
 * Generates an SEO meta description for the site home/index page.
 * Strict 155-character limit.
 */
export function generateHomeMetaDescription(cardCount: number): string {
  const desc = `Compare ${cardCount} crypto debit & credit cards by fees, cashback, and availability. Find the best Bitcoin, USDT or DeFi card for your region. Updated ${YEAR}.`;
  return desc.length <= MAX_LEN ? desc : desc.substring(0, MAX_LEN - 1) + '…';
}
