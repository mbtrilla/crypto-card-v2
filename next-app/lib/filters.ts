import { Card } from './data';

/**
 * Returns true if the card is available for US residents.
 * Uses the cleaned `countries` field first (most reliable), then falls back
 * to pattern-matching the free-text `regions` field.
 */
export function isUSACard(card: Card): boolean {
  const r = card.regions.toLowerCase();
  const c = card.countries.toLowerCase();

  if (c.includes('united states')) return true;

  const mentionsUS =
    r.includes('usa') ||
    r.includes(' us ') ||
    r.includes(' us,') ||
    r.includes(' us)') ||
    r.includes('(us,') ||
    r.includes('us only') ||
    r.includes('us and') ||
    r.includes('us states') ||
    r.includes('us available') ||
    r.includes('united states');

  const excludesUS =
    r.includes('not available in us') ||
    r.includes('not us/') ||
    r.includes('not us,') ||
    r.includes('excludes us') ||
    r.includes('us excluded') ||
    r.includes('excluding us') ||
    r.includes('not available in usa');

  return mentionsUS && !excludesUS;
}

/**
 * Returns true if the card is available in EEA / EU / European countries.
 * Matches any region string that explicitly mentions Europe, EEA, EU, or UK.
 */
export function isEuropeCard(card: Card): boolean {
  const r = card.regions.toLowerCase();
  return (
    r.includes('eea') ||
    r.includes('europe') ||
    r.includes('eurozone') ||
    r.includes('eu/') ||
    r.includes('/eu') ||
    r.includes(' eu ') ||
    r.includes(' eu,') ||
    r.includes(' eu)') ||
    r.includes('(eu,') ||
    r.includes('uk and') ||
    r.includes('uk only') ||
    r.includes(', uk') ||
    r.includes('and uk')
  );
}

/** Returns true if the card runs on the Visa network. */
export function isVisaCard(card: Card): boolean {
  return card.network.toLowerCase().includes('visa');
}

/** Returns true if the card runs on the Mastercard network. */
export function isMastercardCard(card: Card): boolean {
  return card.network.toLowerCase().includes('mastercard');
}

/** Returns true if the card uses a self-custody model. */
export function isSelfCustodyCard(card: Card): boolean {
  return card.custody.toLowerCase().includes('self');
}

/**
 * Returns true if the card offers meaningful cashback rewards.
 * Excludes cards where cashback is N/A, 0%, "None", or blank.
 */
export function hasCashback(card: Card): boolean {
  const cb = card.cashback.toLowerCase().trim();
  return (
    cb !== '' &&
    cb !== 'n/a' &&
    cb !== '0%' &&
    cb !== 'none' &&
    cb !== 'no' &&
    !cb.startsWith('no ')
  );
}
