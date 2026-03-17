import { describe, it, expect } from 'vitest';
import {
  generateCardMetaDescription,
  generateCategoryMetaDescription,
  generateHomeMetaDescription,
} from './meta';
import type { Card } from './data';

// ── test helpers ──────────────────────────────────────────────────────────────

function makeCard(overrides: Partial<Card> = {}): Card {
  return {
    name: 'Test Card',
    slug: 'test-card',
    logo: '',
    cardType: 'Debit',
    custody: 'Custodial',
    network: 'Visa',
    issuanceFee: 'Free',
    annualFee: 'Free',
    cashback: '5% BTC',
    regions: 'Worldwide',
    fxFee: '0%',
    topUpMethods: 'BTC, ETH',
    spendLimit: '$10,000/day',
    atmLimit: '$500/day',
    pros: '',
    cons: '',
    description: 'A test card.',
    mainPageCashback: '5% BTC',
    countries: '',
    ...overrides,
  };
}

const ALL_CATEGORY_SLUGS = [
  'best-crypto-cards-usa',
  'best-crypto-cards-europe',
  'visa-crypto-cards',
  'mastercard-crypto-cards',
  'self-custody-crypto-cards',
  'crypto-cards-with-cashback',
] as const;

// ── generateCardMetaDescription ──────────────────────────────────────────────

describe('generateCardMetaDescription', () => {
  it('length is always ≤ 155 chars', () => {
    const card = makeCard();
    expect(generateCardMetaDescription(card).length).toBeLessThanOrEqual(155);
  });

  it('contains the year 2026', () => {
    expect(generateCardMetaDescription(makeCard())).toContain('2026');
  });

  it('contains the card name', () => {
    const card = makeCard({ name: 'Binance Card' });
    expect(generateCardMetaDescription(card)).toContain('Binance Card');
  });

  it('mentions cashback when card has meaningful cashback', () => {
    const card = makeCard({ cashback: 'Up to 8% CRO', mainPageCashback: 'Up to 8% CRO' });
    expect(generateCardMetaDescription(card).toLowerCase()).toContain('cashback');
  });

  it('does not mention cashback when card has N/A cashback', () => {
    const card = makeCard({ cashback: 'N/A', mainPageCashback: '' });
    expect(generateCardMetaDescription(card).toLowerCase()).not.toContain('cashback');
  });

  it('does not mention cashback when card has "None"', () => {
    const card = makeCard({ cashback: 'None', mainPageCashback: '' });
    expect(generateCardMetaDescription(card).toLowerCase()).not.toContain('cashback');
  });

  it('ends with "at Sweepbase."', () => {
    expect(generateCardMetaDescription(makeCard())).toMatch(/at Sweepbase\.(…)?$/);
  });

  it('handles cards with very long names without exceeding 155 chars', () => {
    const card = makeCard({ name: 'A Really Very Quite Long Crypto Card Name Ltd' });
    expect(generateCardMetaDescription(card).length).toBeLessThanOrEqual(155);
  });

  it('includes "no issuance or annual fee" for cards with free issuance and annual fee', () => {
    const card = makeCard({
      issuanceFee: 'Free',
      annualFee: 'Free',
      cashback: 'N/A',
      mainPageCashback: '',
    });
    const desc = generateCardMetaDescription(card);
    expect(desc).toContain('no issuance or annual fee');
    expect(desc.length).toBeLessThanOrEqual(155);
  });

  it('includes "Visa" for Visa-network cards', () => {
    const card = makeCard({ network: 'Visa', cashback: 'N/A', mainPageCashback: '' });
    expect(generateCardMetaDescription(card)).toContain('Visa');
  });

  it('includes "Mastercard" for Mastercard-network cards', () => {
    const card = makeCard({ network: 'Mastercard', cashback: 'N/A', mainPageCashback: '' });
    expect(generateCardMetaDescription(card)).toContain('Mastercard');
  });

  it('includes "worldwide" geo phrase for global cards', () => {
    const card = makeCard({
      regions: 'Worldwide',
      cashback: 'N/A',
      mainPageCashback: '',
      issuanceFee: 'N/A',
      annualFee: 'N/A',
    });
    expect(generateCardMetaDescription(card)).toContain('worldwide');
  });

  it('stays ≤ 155 for a worst-case combination', () => {
    const card = makeCard({
      name: 'Hypothetically Very Long Crypto Card Name',
      cashback: 'Up to 12% in platform tokens',
      mainPageCashback: 'Up to 12%',
      issuanceFee: 'Free',
      annualFee: 'Free',
      network: 'Mastercard',
      regions: 'EEA',
    });
    expect(generateCardMetaDescription(card).length).toBeLessThanOrEqual(155);
  });
});

// ── generateCategoryMetaDescription ─────────────────────────────────────────

describe('generateCategoryMetaDescription', () => {
  it.each(ALL_CATEGORY_SLUGS)('length ≤ 155 for slug "%s" with count=42', (slug) => {
    expect(generateCategoryMetaDescription(slug, 42).length).toBeLessThanOrEqual(155);
  });

  it.each(ALL_CATEGORY_SLUGS)('length ≤ 155 for slug "%s" with count=1', (slug) => {
    expect(generateCategoryMetaDescription(slug, 1).length).toBeLessThanOrEqual(155);
  });

  it.each(ALL_CATEGORY_SLUGS)('length ≤ 155 for slug "%s" with count=999', (slug) => {
    expect(generateCategoryMetaDescription(slug, 999).length).toBeLessThanOrEqual(155);
  });

  it('contains the year 2026', () => {
    expect(generateCategoryMetaDescription('visa-crypto-cards', 50)).toContain('2026');
  });

  it('contains the card count', () => {
    expect(generateCategoryMetaDescription('visa-crypto-cards', 63)).toContain('63');
  });

  it('mentions "Visa" for visa-crypto-cards slug', () => {
    expect(generateCategoryMetaDescription('visa-crypto-cards', 50)).toContain('Visa');
  });

  it('mentions "Mastercard" for mastercard-crypto-cards slug', () => {
    expect(generateCategoryMetaDescription('mastercard-crypto-cards', 30)).toContain('Mastercard');
  });

  it('mentions "cashback" for crypto-cards-with-cashback slug', () => {
    expect(generateCategoryMetaDescription('crypto-cards-with-cashback', 40)).toContain('cashback');
  });

  it('handles unknown slug gracefully within 155 chars', () => {
    const desc = generateCategoryMetaDescription('unknown-future-slug', 10);
    expect(desc.length).toBeLessThanOrEqual(155);
  });

  it('handles unknown slug and still contains year', () => {
    expect(generateCategoryMetaDescription('unknown-future-slug', 10)).toContain('2026');
  });
});

// ── generateHomeMetaDescription ──────────────────────────────────────────────

describe('generateHomeMetaDescription', () => {
  it('length is ≤ 155 chars for typical card count', () => {
    expect(generateHomeMetaDescription(114).length).toBeLessThanOrEqual(155);
  });

  it('contains the year 2026', () => {
    expect(generateHomeMetaDescription(50)).toContain('2026');
  });

  it('contains the card count', () => {
    expect(generateHomeMetaDescription(99)).toContain('99');
  });

  it('works for any realistic card count without exceeding 155', () => {
    [1, 10, 50, 100, 200, 999].forEach((count) => {
      expect(generateHomeMetaDescription(count).length).toBeLessThanOrEqual(155);
    });
  });

  it('mentions "crypto" cards', () => {
    expect(generateHomeMetaDescription(100).toLowerCase()).toContain('crypto');
  });
});
