/**
 * Google Analytics 4 event tracking utilities.
 *
 * All functions are safe to call server-side (they no-op when gtag is unavailable).
 * GA4 Measurement ID is configured via NEXT_PUBLIC_GA_ID env var.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function gtag(...args: unknown[]) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(...args);
  }
}

// ── Card interactions ────────────────────────────────────────────────────────

export function trackCardClick(
  cardName: string,
  action: 'get_card' | 'compare' | 'view',
) {
  gtag('event', action, {
    event_category: 'card_interaction',
    event_label: cardName,
  });
}

// ── Filter usage ─────────────────────────────────────────────────────────────

export function trackFilter(filterType: string, filterValue: string) {
  gtag('event', 'filter_applied', {
    event_category: 'search',
    filter_type: filterType,
    filter_value: filterValue,
  });
}

// ── Share actions ────────────────────────────────────────────────────────────

export function trackShare(cardName: string, platform: 'twitter' | 'linkedin' | 'copy') {
  gtag('event', 'share', {
    event_category: 'social',
    event_label: cardName,
    method: platform,
  });
}

// ── Calculator usage ─────────────────────────────────────────────────────────

export function trackCalculator(action: 'calculate' | 'adjust_spend') {
  gtag('event', action, {
    event_category: 'tool_usage',
  });
}
