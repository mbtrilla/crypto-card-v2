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

// ─── Regional filters — Asia & Australia ────────────────────────────────────

/**
 * Asian country names used for country-level matching when a card's regions
 * field does not explicitly mention "Asia" or "APAC".
 */
const ASIA_COUNTRIES = [
  'japan', 'south korea', 'korea', 'singapore', 'hong kong', 'thailand',
  'vietnam', 'indonesia', 'malaysia', 'philippines', 'india', 'taiwan',
  'china', 'bangladesh', 'myanmar', 'cambodia', 'laos', 'nepal', 'sri lanka',
  'pakistan', 'uae', 'united arab emirates', 'saudi arabia', 'bahrain',
];

/**
 * Returns true if the card is available in at least one Asian country.
 * First checks whether the regions string mentions "Asia" or "APAC";
 * falls back to scanning the countries list against known Asian names.
 */
export function isAsiaCard(card: Card): boolean {
  const r = card.regions.toLowerCase();
  const c = card.countries.toLowerCase();

  if (r.includes('asia') || r.includes('apac')) return true;

  return ASIA_COUNTRIES.some(country => c.includes(country));
}

/**
 * Returns true if the card is available in Australia.
 * Matches any explicit mention of "Australia" in regions or countries,
 * as well as broader APAC designations.
 */
export function isAustraliaCard(card: Card): boolean {
  const r = card.regions.toLowerCase();
  const c = card.countries.toLowerCase();

  return (
    c.includes('australia') ||
    r.includes('australia') ||
    r.includes('anzac') ||
    r.includes('apac')
  );
}

// ─── Additional regional filters ────────────────────────────────────────────

const LATAM_COUNTRIES = [
  'mexico', 'brazil', 'argentina', 'colombia', 'chile', 'peru', 'ecuador',
  'venezuela', 'uruguay', 'paraguay', 'bolivia', 'costa rica', 'panama',
  'guatemala', 'dominican republic', 'el salvador', 'honduras', 'nicaragua',
  'cuba', 'jamaica', 'trinidad', 'bahamas', 'barbados', 'belize', 'guyana',
  'suriname', 'cayman islands',
];

/** Returns true if the card is available in the United Kingdom. */
export function isUKCard(card: Card): boolean {
  const r = card.regions.toLowerCase();
  const c = card.countries.toLowerCase();

  return (
    c.includes('united kingdom') ||
    c.includes('uk') ||
    r.includes(' uk') ||
    r.includes('uk ') ||
    r.includes('uk,') ||
    r.includes('uk)') ||
    r.includes('(uk') ||
    r.includes('uk only') ||
    r.includes('united kingdom')
  );
}

/** Returns true if the card is available in Canada. */
export function isCanadaCard(card: Card): boolean {
  const r = card.regions.toLowerCase();
  const c = card.countries.toLowerCase();

  return (
    c.includes('canada') ||
    r.includes('canada') ||
    r.includes('north america')
  );
}

/**
 * Returns true if the card is available in at least one Latin American country.
 * Checks the regions string for "latin america", "latam", or "caribbean",
 * then falls back to scanning the countries list.
 */
export function isLatAmCard(card: Card): boolean {
  const r = card.regions.toLowerCase();
  const c = card.countries.toLowerCase();

  if (r.includes('latin america') || r.includes('latam') || r.includes('caribbean'))
    return true;

  return LATAM_COUNTRIES.some(country => c.includes(country));
}

// ─── Generic category dispatcher ────────────────────────────────────────────

/**
 * Filters a cards array to the subset matching a named category.
 * Provides a single dispatch point so page components and API routes
 * can resolve a URL slug to the correct filter without importing each
 * individual predicate directly.
 *
 * Supported category keys:
 *   'usa' | 'europe' | 'visa' | 'mastercard' | 'self-custody' |
 *   'cashback' | 'asia' | 'australia'
 *
 * Returns the original array unchanged for unknown category values.
 */
export function filterCardsByCategory(cards: Card[], category: string): Card[] {
  switch (category) {
    case 'usa':          return cards.filter(isUSACard);
    case 'europe':       return cards.filter(isEuropeCard);
    case 'visa':         return cards.filter(isVisaCard);
    case 'mastercard':   return cards.filter(isMastercardCard);
    case 'self-custody': return cards.filter(isSelfCustodyCard);
    case 'cashback':     return cards.filter(hasCashback);
    case 'asia':         return cards.filter(isAsiaCard);
    case 'australia':    return cards.filter(isAustraliaCard);
    case 'uk':           return cards.filter(isUKCard);
    case 'canada':       return cards.filter(isCanadaCard);
    case 'latam':        return cards.filter(isLatAmCard);
    default:             return cards;
  }
}
