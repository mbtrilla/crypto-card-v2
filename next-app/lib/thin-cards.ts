import type { Card } from './data';

/**
 * Returns true if a card has insufficient data to be considered
 * meaningful content (thin content risk for Google indexing).
 *
 * A card is "thin" when 3+ of its key fields are DNA/N/A/empty.
 */
const DNA_RE = /^(dna|dnd|n\/a|data\s+not\s+available|not\s+available|not\s+yet\s+disclosed|information\s+not\s+found|\?|-|)$/i;

export function isThinCard(card: Card): boolean {
  const fields = [
    card.network,
    card.custody,
    card.regions,
    card.description,
    card.cashback,
  ];
  const dnaCount = fields.filter(v => DNA_RE.test(v.trim())).length;
  return dnaCount >= 3;
}

/**
 * Known thin card slugs — hardcoded for sitemap/schema exclusion
 * where the full Card object isn't available. Keep in sync with
 * the isThinCard() heuristic by re-running:
 *   node -e "..." (see scripts in commit message)
 */
export const THIN_CARD_SLUGS = new Set([
  'aisi-bank-card',
  'ampblack-card',
  'bling-money-card',
  'crydit-card',
  'satpay-card',
  'stealf-card',
  'valeo-card',
  'veil-card',
]);
