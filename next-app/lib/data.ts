import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { cache } from 'react';

export interface Card {
  name: string;
  slug: string;
  logo: string;
  cardType: string;
  custody: string;
  network: string;
  issuanceFee: string;
  annualFee: string;
  cashback: string;
  regions: string;
  fxFee: string;
  topUpMethods: string;
  spendLimit: string;
  atmLimit: string;
  pros: string;
  cons: string;
  description: string;
  mainPageCashback: string;
  countries: string;
  /** Review month displayed on card detail pages, e.g. "March 2026" */
  lastReviewed: string;
  /** External affiliate/issuer URL. Null if not set. */
  affiliateUrl: string | null;
}

/**
 * Minimal card shape passed to client grid components (CardsGridClient,
 * CategoryCardsGrid, CardItem, CompareBar).  Heavy detail-only fields
 * (pros, cons, issuanceFee, annualFee, fxFee, spendLimit, atmLimit,
 *  lastReviewed) are intentionally excluded so they never appear in the
 * serialised __NEXT_DATA__ / RSC payload for listing pages.
 *
 * Reducing 114-card × ~800 chars of detail fields ≈ 90 kB off every
 * listing-page HTML payload.
 */
export type CardListItem = Pick<
  Card,
  | 'name'
  | 'slug'
  | 'logo'
  | 'cardType'
  | 'custody'
  | 'network'
  | 'cashback'
  | 'mainPageCashback'
  | 'regions'
  | 'countries'
  | 'description'
  | 'topUpMethods'
>;

/** Project a full Card to the slim listing shape. */
export function toCardListItem(card: Card): CardListItem {
  return {
    name: card.name,
    slug: card.slug,
    logo: card.logo,
    cardType: card.cardType,
    custody: card.custody,
    network: card.network,
    cashback: card.cashback,
    mainPageCashback: card.mainPageCashback,
    regions: card.regions,
    countries: card.countries,
    description: card.description,
    topUpMethods: card.topUpMethods,
  };
}

export const FIELDS = {
  name: 'Card Service',
  logo: 'IMG',
  cardType: 'Card Type',
  custody: 'Custody',
  network: 'Visa or Mastercard',
  issuanceFee: 'Card Issuance Fee',
  annualFee: 'Annual Fee',
  cashback: 'Cashback',
  regions: 'Regions KYC Available',
  fxFee: 'FX Fee',
  topUpMethods: 'Top-up Methods',
  spendLimit: 'Daily Spending Limit',
  atmLimit: 'ATM Withdrawal Limit',
  pros: 'Pros',
  cons: 'Cons',
  description: 'Marketing Description',
  mainPageCashback: 'Main Page Cashback',
  countries: ['P Countries Available', 'Counties Available', 'Countries Available'],
  affiliateUrl: 'Affiliate URL',
};

export const getSlug = (text: string) => {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const stripParens = (str: string) => str ? str.replace(/\s*\([^)]*\)/g, '').trim() : '';

const transformGDriveUrl = (url: string) => {
  if (!url || typeof url !== 'string') return url;
  // Match both drive.google.com/.../d/[ID] and lh3.googleusercontent.com/d/[ID]
  const idMatch = url.match(/(?:\/d\/|id=)([a-zA-Z0-9_-]{25,})/);
  if (idMatch && idMatch[1]) {
    const directUrl = `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w800`;
    return `/api/image-proxy?url=${encodeURIComponent(directUrl)}`;
  }
  return url;
};

export const getAllCards = cache(async function getAllCards(): Promise<Card[]> {
  // At runtime __dirname == next-app/.next/server/app (webpack output).
  // Walk up until we find next.config.mjs to locate the true project root,
  // then read data.csv from there — reliable regardless of cwd or launch method.
  let projectRoot = __dirname;
  for (let i = 0; i < 8; i++) {
    if (fs.existsSync(path.join(projectRoot, 'next.config.mjs')) || fs.existsSync(path.join(projectRoot, 'next.config.js'))) break;
    const parent = path.dirname(projectRoot);
    if (parent === projectRoot) { projectRoot = process.cwd(); break; }
    projectRoot = parent;
  }
  const candidates = [
    path.join(projectRoot, 'data.csv'),               // primary: found via next.config.mjs
    path.join(process.cwd(), 'data.csv'),             // fallback: cwd == next-app
    path.join(process.cwd(), 'next-app', 'data.csv'), // fallback: cwd == parent dir
  ];
  const filePath = candidates.find(p => fs.existsSync(p)) ?? candidates[candidates.length - 1];
  const csvFile = fs.readFileSync(filePath, 'utf8');
  
  const { data } = Papa.parse(csvFile, {
    header: true,
    skipEmptyLines: true,
  });

  return (data as any[])
    .filter(item => item[FIELDS.name] && item[FIELDS.name].trim() !== '')
    .map((item: any) => {
      const name = item[FIELDS.name];
      const rawLogo = item[FIELDS.logo] || '';
      const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=18181b&color=fff&size=400`;
      const fallbackImage = `/api/image-proxy?url=${encodeURIComponent(fallbackUrl)}`;

      const slug = name
        .toLowerCase()
        .replace(/['']/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Prefer local WebP if it exists (downloaded by scripts/download-card-images.ts)
      const localWebp = path.join(process.cwd(), 'public', 'images', 'cards', `${slug}.webp`);
      let logo: string;
      if (fs.existsSync(localWebp)) {
        logo = `/images/cards/${slug}.webp`;
      } else if (rawLogo.includes('drive.google.com') || rawLogo.includes('googleusercontent.com')) {
        logo = transformGDriveUrl(rawLogo);
      } else if (rawLogo.startsWith('http')) {
        logo = `/api/image-proxy?url=${encodeURIComponent(rawLogo)}`;
      } else {
        logo = fallbackImage;
      }

      const countriesRaw = (FIELDS.countries
        .map(field => item[field])
        .find(val => val && val !== '#NAME?') || '')
        .replace(/\*\*[^*]*\*\*/g, '')  // strip **markdown bold** labels
        .replace(/\*\*/g, '');

      return {
        name: name,
        slug: getSlug(name),
        logo: logo,
        cardType: stripParens(item[FIELDS.cardType] || ''),
        custody: stripParens(item[FIELDS.custody] || ''),
        network: stripParens(item[FIELDS.network] || ''),
        issuanceFee: item[FIELDS.issuanceFee] || 'N/A',
        annualFee: item[FIELDS.annualFee] || 'N/A',
        cashback: item[FIELDS.cashback] || 'N/A',
        regions: stripParens(item[FIELDS.regions] || ''),
        fxFee: item[FIELDS.fxFee] || 'N/A',
        topUpMethods: item[FIELDS.topUpMethods] || 'N/A',
        spendLimit: item[FIELDS.spendLimit] || 'N/A',
        atmLimit: item[FIELDS.atmLimit] || 'N/A',
        pros: item[FIELDS.pros] || '',
        cons: item[FIELDS.cons] || '',
        description: item[FIELDS.description] || '',
        mainPageCashback: item[FIELDS.mainPageCashback] || item[FIELDS.cashback] || '',
        countries: countriesRaw,
        // Static review date — update this string when the database is next audited
        lastReviewed: 'March 2026',
        affiliateUrl: (item[FIELDS.affiliateUrl] || '').trim().startsWith('http')
          ? (item[FIELDS.affiliateUrl] || '').trim()
          : null,
      };
    });
}); // end cache()
