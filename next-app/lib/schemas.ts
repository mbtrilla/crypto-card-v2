/**
 * schemas.ts — Centralised JSON-LD schema generators
 *
 * All schema functions return plain objects ready for JSON.stringify().
 * Inject into pages via:
 *   <script type="application/ld+json"
 *     dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
 */

import type { Card } from '@/lib/data';
import type { FAQItem } from '@/components/FAQAccordion';
import { calculateCardRating, getReviewCount } from '@/lib/ratings';
import { isThinCard } from '@/lib/thin-cards';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://sweepbase.com';

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
  description?: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': ['CollectionPage', 'WebPage'],
    name: pageName,
    url: pageUrl,
    ...(description ? { description } : {}),
    dateModified: '2026-03-18',
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: crumb.name,
        item: crumb.item,
      })),
    },
    publisher: {
      '@type': 'Organization',
      name: 'Sweepbase',
      url: BASE_URL,
    },
  };
}

// ---------------------------------------------------------------------------
// Homepage — enriched ItemList with AggregateRating
// ---------------------------------------------------------------------------

/**
 * Generates an enriched `ItemList` schema for the homepage covering ALL cards.
 *
 * Each `ListItem.item` is a `FinancialProduct` with an `AggregateRating`
 * computed from Sweepbase's editorial scoring model.
 *
 * @param cards - Full card array returned by `getAllCards()`.
 */
export function generateHomeItemListSchema(cards: Card[]) {
  // Keep lightweight — 20 items, no ratings, short descriptions (~100 chars)
  const TOP_N = 20;
  const topCards = cards.filter(c => !isThinCard(c)).slice(0, TOP_N);
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Best Crypto Debit & Credit Cards 2026',
    description: `Top ${topCards.length} crypto debit and credit cards curated by Sweepbase.`,
    url: BASE_URL,
    numberOfItems: topCards.length,
    itemListElement: topCards.map((card, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: card.name,
      url: `${BASE_URL}/cards/${card.slug}`,
    })),
  };
}

// ---------------------------------------------------------------------------
// Standalone BreadcrumbList schema
// ---------------------------------------------------------------------------

/**
 * Generates a standalone `BreadcrumbList` JSON-LD schema.
 * Use on pages that don't already embed breadcrumbs in a WebPage schema.
 *
 * @param items - Array of { name, url } in order from root to current page.
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// ---------------------------------------------------------------------------
// FAQPage schema
// ---------------------------------------------------------------------------

/**
 * Generates a `FAQPage` JSON-LD schema from an array of FAQ items.
 * Use alongside the `FAQAccordion` component so structured data
 * matches the visible content (required by Google's guidelines).
 *
 * @param items - Array of `{ q, a }` objects — same array passed to FAQAccordion.
 */
export function generateFAQPageSchema(items: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: a.replace(/<[^>]+>/g, ''), // strip any inline HTML for schema text
      },
    })),
  };
}
