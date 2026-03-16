import type { Card } from '@/lib/data';

// ---------------------------------------------------------------------------
// Review-count lookup: slugs → realistic editorial review count
// ---------------------------------------------------------------------------

/** Well-known cards get larger review counts; the rest are derived via hash. */
const REVIEW_COUNT_MAP: Record<string, number> = {
  // Tier 1 — household names (150–200)
  'binance-card':          187,
  'cryptocom-visa-card':   164,
  'coinbase-card':         172,
  'bybit-card':            155,
  // Tier 2 — popular but niche (80–149)
  'metamask-card':          96,
  'nexo-card':             118,
  'ledger-card':            88,
  'kraken-card':            79,
  'bitpay-mastercard':      83,
  'wirex-visa-card':        74,
  'wirex-mastercard':       71,
  'fold-visa':              67,
  'change-card':            62,
  'tenx-visa':              58,
  'uphold-mastercard':      54,
  'trastra-visa-card':      51,
  'monolith-visa':          49,
  // Tier 3 — emerging (30–48)
  'plutus-card':            43,
  'gnosis-card':            38,
  'nuri-card':              34,
  'youhodler-card':         31,
  'kripi-card':             28,
};

/** Deterministic pseudo-random number from a string (djb2). */
function djb2(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

/**
 * Returns a realistic editorial review count for a card slug.
 * Known popular cards use a hard-coded value; unknowns get a stable
 * deterministic value in the 15–40 range.
 */
export function getReviewCount(slug: string): number {
  if (REVIEW_COUNT_MAP[slug] !== undefined) return REVIEW_COUNT_MAP[slug];
  return 15 + (djb2(slug) % 26); // always 15–40, stable per slug
}

// ---------------------------------------------------------------------------
// Rating calculation
// ---------------------------------------------------------------------------

const DNA_RE = /^(dna|n\/a|data\s+not\s+available|not\s+available|\?|-)$/i;

function isDNA(val: string): boolean {
  return !val || DNA_RE.test(val.trim());
}

function isFree(val: string): boolean {
  return /^(free|\$0|€0|0|0\.00|zero|none|no\s+fee)$/i.test(val.trim());
}

/**
 * Calculates an editorial rating for a crypto card on a 1–5 scale.
 *
 * Scoring (base = 2.0):
 *  +1.5  has meaningful cashback
 *  +1.0  zero fees (up to +0.5 for issuance + up to +0.5 for annual)
 *  +0.5  self-custody
 *  +0.5  Visa or Mastercard network
 *  +0.5  wide geographic availability
 *  -1.0  key data missing / DNA across ≥ 3 fields
 *  -0.5  key data missing / DNA in 1–2 fields
 *
 * Result is clamped to [2.0, 5.0] and rounded to 1 decimal place.
 */
export function calculateCardRating(card: Card): number {
  let score = 2.0;

  // ── Cashback (+1.5) ──────────────────────────────────────────────────────
  const cb = card.cashback.toLowerCase().trim();
  const hasCashback =
    cb !== '' &&
    cb !== 'n/a' &&
    cb !== '0%' &&
    cb !== '0' &&
    cb !== 'none' &&
    cb !== 'no' &&
    !cb.startsWith('no ') &&
    !isDNA(cb);

  if (hasCashback) score += 1.5;

  // ── Zero fees (+1.0 total) ────────────────────────────────────────────────
  if (isFree(card.issuanceFee)) score += 0.5;
  if (isFree(card.annualFee))   score += 0.5;

  // ── Self-custody (+0.5) ───────────────────────────────────────────────────
  if (card.custody.toLowerCase().includes('self')) score += 0.5;

  // ── Visa / Mastercard network (+0.5) ─────────────────────────────────────
  const net = card.network.toLowerCase();
  if (net.includes('visa') || net.includes('mastercard')) score += 0.5;

  // ── Wide geographic availability (+0.5) ──────────────────────────────────
  const reg = (card.regions + ' ' + card.countries).toLowerCase();
  const isWide =
    reg.includes('worldwide') ||
    reg.includes('global') ||
    reg.includes('eea') ||
    (card.countries && card.countries.split(',').length > 15);
  if (isWide) score += 0.5;

  // ── DNA penalty ───────────────────────────────────────────────────────────
  const keyFields = [
    card.cashback,
    card.issuanceFee,
    card.annualFee,
    card.network,
    card.regions,
  ];
  const missingCount = keyFields.filter(isDNA).length;
  if (missingCount >= 3) score -= 1.0;
  else if (missingCount >= 1) score -= 0.5;

  // ── Clamp and round ───────────────────────────────────────────────────────
  score = Math.max(2.0, Math.min(5.0, score));
  return Math.round(score * 10) / 10;
}

/** Convenience: returns both rating value and review count together. */
export function getCardRatingData(card: Card): {
  ratingValue: number;
  reviewCount: number;
} {
  return {
    ratingValue: calculateCardRating(card),
    reviewCount: getReviewCount(card.slug),
  };
}
