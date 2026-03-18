/**
 * Normalizes country name variants to a single canonical form.
 * Used both for building the filter dropdown (display) and for
 * matching cards during filtering (lookup).
 */

const COUNTRY_ALIASES: Record<string, string> = {
  // Ampersand vs "and"
  'antigua & barbuda': 'Antigua and Barbuda',
  'antigua and barbuda': 'Antigua and Barbuda',
  'bosnia & herzegovina': 'Bosnia and Herzegovina',
  'bosnia and herzegovina': 'Bosnia and Herzegovina',
  'st kitts & nevis': 'Saint Kitts and Nevis',
  'st kitts and nevis': 'Saint Kitts and Nevis',
  'saint kitts and nevis': 'Saint Kitts and Nevis',
  'st vincent & the grenadines': 'Saint Vincent and the Grenadines',
  'st vincent and grenadines': 'Saint Vincent and the Grenadines',
  'st vincent and the grenadines': 'Saint Vincent and the Grenadines',
  'saint vincent and the grenadines': 'Saint Vincent and the Grenadines',
  'trinidad & tobago': 'Trinidad and Tobago',
  'trinidad and tobago': 'Trinidad and Tobago',
  'turks & caicos islands': 'Turks and Caicos Islands',
  'turks and caicos islands': 'Turks and Caicos Islands',
  'sao tome and principe': 'São Tomé and Príncipe',
  'são tomé and príncipe': 'São Tomé and Príncipe',
  'sao tome & principe': 'São Tomé and Príncipe',

  // Long-form / parenthetical
  'bolivia (plurinational state of)': 'Bolivia',
  'bolivia': 'Bolivia',
  'cocos (keeling) islands': 'Cocos Islands',
  'cocos keeling islands': 'Cocos Islands',
  'eswatini (swaziland)': 'Eswatini',
  'eswatini': 'Eswatini',
  'swaziland': 'Eswatini',
  'korea republic of': 'South Korea',
  'korea, republic of': 'South Korea',
  'south korea': 'South Korea',
  'republic of cyprus': 'Cyprus',
  'cyprus': 'Cyprus',
  'vatican city state': 'Vatican City',
  'vatican city': 'Vatican City',
  'palestine': 'Palestine',
  'palestinian territory': 'Palestine',
  'palestinian territory, occupied': 'Palestine',
  'micronesia': 'Micronesia',
  'federated states of micronesia': 'Micronesia',
  'micronesia (federated states of)': 'Micronesia',

  // Accent / diacritics
  "cote d'ivoire": "Côte d'Ivoire",
  "côte d'ivoire": "Côte d'Ivoire",
  'saint barthelemy': 'Saint Barthélemy',
  'saint barthélemy': 'Saint Barthélemy',
  'curacao': 'Curaçao',
  'curaçao': 'Curaçao',
  'reunion': 'Réunion',
  'réunion': 'Réunion',

  // Spelling variants
  'macao': 'Macau',
  'macau': 'Macau',
  'the netherlands': 'Netherlands',
  'netherlands': 'Netherlands',
  'pitcairn': 'Pitcairn Islands',
  'pitcairn islands': 'Pitcairn Islands',
  'turkey': 'Türkiye',
  'türkiye': 'Türkiye',

  // Typo fix
  'granada': 'Grenada',
  'grenada': 'Grenada',
};

/**
 * Returns the canonical country name for a given raw country string.
 * Falls back to trimmed original if no alias exists.
 */
export function normalizeCountry(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  const key = trimmed.toLowerCase();
  return COUNTRY_ALIASES[key] ?? trimmed;
}

/**
 * Given a comma-separated countries string (from CSV), returns an array
 * of normalized, deduplicated canonical country names.
 */
export function normalizeCountryList(csv: string): string[] {
  if (!csv) return [];
  const seen = new Set<string>();
  const result: string[] = [];
  for (const raw of csv.split(',')) {
    const canonical = normalizeCountry(raw);
    if (canonical && !seen.has(canonical)) {
      seen.add(canonical);
      result.push(canonical);
    }
  }
  return result;
}
