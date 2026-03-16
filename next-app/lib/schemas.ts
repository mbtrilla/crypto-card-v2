/**
 * schemas.ts — Centralised JSON-LD schema generators
 *
 * All schema functions return plain objects ready for JSON.stringify().
 * Inject into pages via:
 *   <script type="application/ld+json"
 *     dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
 */

import type { Card } from '@/lib/data';
import { calculateCardRating, getReviewCount } from '@/lib/ratings';

const BASE_URL = 'https://sweepbase.com';

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Returns an absolute URL for a card logo, or undefined when unavailable. */
function cardImageUrl(card: Card): string | undefined {
  if (!card.logo) return undefined;
  return card.logo.startsWith('http')
    ? card.logo
    : `${BASE_URL}${card.logo}`;
}

/** Truncates a string to `max` chars, appending "…" when cut. */
function truncate(str: string, max = 160): string {
  if (!str) return '';
  return str.length > max ? str.slice(0, max - 1) + '\u2026' : str;
}

// ---------------------------------------------------------------------------
// Category pages — ItemList
// ---------------------------------------------------------------------------

/**
 * Generates an `ItemList` JSON-LD schema for a category page.
 *
 * @param cards        - The filtered card array for this category.
 * @param categoryUrl  - Absolute canonical URL of the category page.
 * @param categoryName - Human-readable list name, e.g. "Best Crypto Cards in the USA 2026".
 *
 * @example
 *   const schema = generateCategoryItemListSchema(
 *     cards,
 *     'https://sweepbase.com/best-crypto-cards-usa',
 *     'Best Crypto Cards in the USA 2026',
 *   );
 */
export function generateCategoryItemListSchema(
  cards: Card[],
  categoryUrl: string,
  categoryName: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: categoryName,
    url: categoryUrl,
    numberOfItems: cards.length,
    itemListElement: cards.map((card, index) => {
      // Build item conditionally so we never emit undefined/empty properties
      const entry: Record<string, unknown> = {
        '@type': 'ListItem',
        position: index + 1,
        name: card.name,
        url: `${BASE_URL}/cards/${card.slug}`,
      };

      const desc = truncate(card.description);
      if (desc) entry.description = desc;

      const img = cardImageUrl(card);
      if (img) entry.image = img;

      return entry;
    }),
  };
}

// ---------------------------------------------------------------------------
// Category pages — WebPage (replaces standalone BreadcrumbList)
// ---------------------------------------------------------------------------

/**
 * Generates a `WebPage` JSON-LD schema with an embedded `BreadcrumbList`.
 * Use this instead of emitting a separate BreadcrumbList on category pages.
 *
 * @param pageName    - Full page title, e.g. "Best Crypto Cards in the USA 2026".
 * @param pageUrl     - Absolute canonical URL of the page.
 * @param breadcrumbs - Ordered breadcrumb items: [{ name, item }].
 *
 * @example
 *   const schema = generateCategoryWebPageSchema(
 *     'Best Crypto Cards in the USA 2026',
 *     'https://sweepbase.com/best-crypto-cards-usa',
 *     [
 *       { name: 'Home', item: 'https://sweepbase.com' },
 *       { name: 'Best Crypto Cards in the USA', item: 'https://sweepbase.com/best-crypto-cards-usa' },
 *     ],
 *   );
 */
export function generateCategoryWebPageSchema(
  pageName: string,
  pageUrl: string,
  breadcrumbs: Array<{ name: string; item: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: pageName,
    url: pageUrl,
    dateModified: '2026-03-16',
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: crumb.name,
        item: crumb.item,
      })),
    },
  };
}

// ---------------------------------------------------------------------------
// Homepage — enriched ItemList with AggregateRating
// ---------------------------------------------------------------------------

/**
 * Generates an enriched `ItemList` schema for the homepage covering the
 * first `limit` cards (i.e. those visible without clicking "Load More").
 *
 * Each `ListItem.item` is a `FinancialProduct` with an `AggregateRating`
 * computed from Sweepbase's editorial scoring model.
 *
 * @param cards - Full card array returned by `getAllCards()`.
 * @param limit - How many cards to include; default 12 (initial grid view).
 */
export function generateHomeItemListSchema(cards: Card[], limit = 12) {
  const top = cards.slice(0, limit);

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Best Crypto Debit & Credit Cards 2026',
    url: BASE_URL,
    numberOfItems: top.length,
    itemListElement: top.map((card, index) => {
      const ratingValue = calculateCardRating(card);
      const reviewCount = getReviewCount(card.slug);
      const img = cardImageUrl(card);
      const desc = truncate(card.description);

      const product: Record<string, unknown> = {
        '@type': 'FinancialProduct',
        name: card.name,
        url: `${BASE_URL}/cards/${card.slug}`,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue,
          reviewCount,
          bestRating: 5,
          worstRating: 1,
        },
      };

      if (desc) product.description = desc;
      if (img) product.image = img;

      return {
        '@type': 'ListItem',
        position: index + 1,
        item: product,
      };
    }),
  };
}
