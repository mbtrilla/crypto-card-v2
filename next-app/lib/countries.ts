/**
 * Country name normalisation.
 *
 * Maps common variants, abbreviations, typos, and pre-2022 ISO 3166-1 names
 * to a single canonical form.  Applied at CSV parse time so all downstream
 * filter / display code works against clean data.
 *
 * Keys   — lowercase, for case-insensitive matching.
 * Values — canonical display name (ISO 3166-1 preferred where user-friendly).
 */
export const COUNTRY_ALIASES: Record<string, string> = {
  // Bolivia
  'bolivia (plurinational state of)': 'Bolivia',
  'bolivia, plurinational state of':  'Bolivia',

  // Cocos (Keeling) Islands
  'cocos keeling islands':            'Cocos (Keeling) Islands',
  'cocos island':                     'Cocos (Keeling) Islands',

  // Côte d'Ivoire — handle missing diacritics and apostrophe variants
  "cote d'ivoire":                    "Côte d'Ivoire",
  "côte d'ivoire":                    "Côte d'Ivoire",   // already canonical but keep for safety
  'cote divoire':                     "Côte d'Ivoire",

  // Eswatini (formerly Swaziland)
  'eswatini (swaziland)':             'Eswatini',
  'swaziland':                        'Eswatini',

  // Grenada — typo fix
  'granada':                          'Grenada',

  // Korea
  'korea republic of':                'South Korea',
  'korea, republic of':               'South Korea',
  'republic of korea':                'South Korea',

  // Macao / Macau — keep "Macau" as the user-facing English form
  'macao':                            'Macau',

  // Netherlands
  'the netherlands':                  'Netherlands',

  // Türkiye (ISO 3166-1 updated 2022; was "Turkey")
  'turkey':                           'Türkiye',

  // Vatican City
  'vatican city state':               'Vatican City',
  'holy see':                         'Vatican City',

  // Saint Kitts and Nevis
  'st kitts and nevis':               'Saint Kitts and Nevis',
  'st. kitts and nevis':              'Saint Kitts and Nevis',

  // Saint Vincent and the Grenadines
  'st vincent and grenadines':        'Saint Vincent and the Grenadines',
  'st. vincent and grenadines':       'Saint Vincent and the Grenadines',
  'saint vincent and grenadines':     'Saint Vincent and the Grenadines',

  // Saint Lucia
  'st lucia':                         'Saint Lucia',
  'st. lucia':                        'Saint Lucia',

  // Saint Martin
  'st martin':                        'Saint Martin',
  'st. martin':                       'Saint Martin',

  // Sint Maarten (Dutch part — distinct from French Saint Martin)
  'sint maarten (dutch part)':        'Sint Maarten',

  // Micronesia
  'micronesia (federated states of)': 'Micronesia',
  'federated states of micronesia':   'Micronesia',

  // Palestine
  'palestine, state of':              'Palestine',
  'state of palestine':               'Palestine',

  // Taiwan (common English name)
  'taiwan, province of china':        'Taiwan',

  // Tanzania
  'tanzania, united republic of':     'Tanzania',
  'united republic of tanzania':      'Tanzania',

  // Democratic Republic of the Congo
  'congo, democratic republic of the': 'Democratic Republic of the Congo',
  'dr congo':                          'Democratic Republic of the Congo',
  'drc':                               'Democratic Republic of the Congo',

  // Congo (Republic of)
  'congo, republic of the':           'Congo',
  'republic of the congo':            'Congo',

  // Timor-Leste
  'east timor':                       'Timor-Leste',
};

/**
 * Normalise a single country name.
 * Looks up the lowercase form in COUNTRY_ALIASES; returns the canonical name
 * or the original (trimmed) string if no alias is found.
 */
export function normalizeCountry(name: string): string {
  const trimmed = name.trim();
  return COUNTRY_ALIASES[trimmed.toLowerCase()] ?? trimmed;
}

/**
 * Parse, normalise, and deduplicate a raw comma-separated countries string
 * from the CSV data.  Returns a sorted, comma-separated canonical string.
 *
 * Empty input → empty string.
 */
export function normalizeCountriesString(raw: string): string {
  if (!raw || raw === '#NAME?' || /^(dna|n\/a|-)$/i.test(raw.trim())) return raw;

  const seen = new Set<string>();
  const result: string[] = [];

  for (const part of raw.split(',')) {
    const canonical = normalizeCountry(part);
    if (canonical && !seen.has(canonical)) {
      seen.add(canonical);
      result.push(canonical);
    }
  }

  return result.join(', ');
}
