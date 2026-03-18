import { getAllCards, toCardListItem } from '@/lib/data';
import { isCanadaCard } from '@/lib/filters';
import { generateCategoryMetaDescription } from '@/lib/meta';
import { generateCategoryItemListSchema, generateCategoryWebPageSchema, generateFAQPageSchema } from '@/lib/schemas';
import Breadcrumb from '@/components/Breadcrumb';
import CardSkeleton from '@/components/CardSkeleton';
import FAQAccordion, { type FAQItem } from '@/components/FAQAccordion';
import dynamic from 'next/dynamic';
import { Metadata } from 'next';

const CategoryCardsGrid = dynamic(() => import('@/components/CategoryCardsGrid'), {
  loading: () => (
    <section className="results-section" aria-busy="true">
      <div className="container">
        <div className="cards-grid">
          {Array.from({ length: 12 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    </section>
  ),
});

export const revalidate = 3600;

const FAQ_ITEMS: FAQItem[] = [
  {
    q: 'Are crypto debit cards legal in Canada?',
    a: 'Yes. Crypto debit cards are legal in Canada when issued by a regulated money-services business registered with FINTRAC. Provincial securities commissions also oversee crypto-asset trading platforms, so card issuers that convert crypto at the point of sale must comply with both federal and provincial rules.',
  },
  {
    q: 'Do I pay tax on crypto card spending in Canada?',
    a: 'The CRA treats spending crypto as a disposition that triggers capital gains (or losses). If the value of your crypto has risen since you acquired it, 50% of the gain is taxable as income. Crypto cashback may be treated as a rebate or income depending on the structure. Consult a Canadian tax professional for details.',
  },
  {
    q: 'Can I load a crypto card with CAD?',
    a: 'Most cards available to Canadian residents support Interac e-Transfer or wire transfers in CAD. Some globally-issued cards may require a USD or EUR conversion. Check the funding methods on each card page for details.',
  },
  {
    q: 'Which provinces have the most crypto card options?',
    a: 'Ontario, British Columbia, Alberta, and Quebec have the broadest coverage. Some card issuers restrict certain provinces due to provincial securities regulations, so always verify province-level availability before applying.',
  },
  {
    q: 'What is the best crypto card for Canadian residents in 2026?',
    a: 'It depends on your goals. For lowest fees, look for cards with no FX markup on CAD spending. For maximum rewards, compare cashback structures and staking-tier programs. Use the filters on this page to sort by your priorities.',
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const allCards = await getAllCards();
  const cards = allCards.filter(isCanadaCard);
  const title = 'Best Crypto Cards in Canada 2026 — Top Picks | Sweepbase';
  const description = generateCategoryMetaDescription('best-crypto-cards-canada', cards.length);
  const ogImage = `https://sweepbase.com/api/og?title=${encodeURIComponent('Best Crypto Cards in Canada 2026')}&count=${cards.length}&subtitle=Regional+Guide`;
  return {
    title,
    description,
    alternates: { canonical: 'https://sweepbase.com/best-crypto-cards-canada' },
    openGraph: {
      title,
      description,
      url: 'https://sweepbase.com/best-crypto-cards-canada',
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  };
}

export default async function BestCryptoCardsCanada() {
  const allCards = await getAllCards();
  const cards = allCards.filter(isCanadaCard);

  const webPageJsonLd = generateCategoryWebPageSchema(
    'Best Crypto Cards in Canada 2026',
    'https://sweepbase.com/best-crypto-cards-canada',
    [
      { name: 'Home', item: 'https://sweepbase.com' },
      { name: 'Best Crypto Cards in Canada', item: 'https://sweepbase.com/best-crypto-cards-canada' },
    ],
  );

  const itemListJsonLd = generateCategoryItemListSchema(
    cards,
    'https://sweepbase.com/best-crypto-cards-canada',
    'Best Crypto Cards in Canada 2026',
  );

  const faqJsonLd = generateFAQPageSchema(FAQ_ITEMS);

  return (
    <main className="category-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="container">
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'Best Crypto Cards in Canada' },
        ]} />

        <section className="category-hero">
          <h1 className="category-h1">Best Crypto Debit &amp; Credit Cards in Canada</h1>
          <p className="category-intro">
            Canada has emerged as a progressive market for crypto financial products, with a growing
            number of debit and credit cards that let you spend Bitcoin, Ethereum, and stablecoins
            at Visa and Mastercard terminals nationwide. Sweepbase has identified{' '}
            <strong>{cards.length} crypto cards</strong> currently available to Canadian residents &mdash;
            including domestically-issued products and international cards that accept Canadian KYC.
            Key factors for Canadian users include CAD top-up support via Interac e-Transfer,
            FX fees on cross-border transactions, province-level regulatory availability, and
            compatibility with Apple Pay and Google Pay for contactless spending.
          </p>
        </section>

        <section className="category-why">
          <h2 className="category-why__title">Why These Cards?</h2>
          <ul className="category-why__list">
            <li className="category-why__item">
              <strong>FINTRAC-compliant</strong> &mdash; every card listed operates under a registered MSB or licensed banking partner meeting Canadian regulatory requirements.
            </li>
            <li className="category-why__item">
              <strong>CAD-friendly funding</strong> &mdash; all listed cards accept Interac e-Transfer, wire transfers, or Canadian debit card top-ups for loading Canadian dollars.
            </li>
            <li className="category-why__item">
              <strong>Broad provincial coverage</strong> &mdash; cards cover the majority of provinces including Ontario, BC, Alberta, and Quebec.
            </li>
          </ul>
        </section>

        <div className="category-also-see">
          <span className="category-also-see__label">Also see:</span>
          <a href="/best-crypto-cards-usa" className="category-also-see__chip">
            <i className="fa-solid fa-flag-usa" aria-hidden="true"></i>
            Best Cards in the USA
          </a>
          <a href="/best-crypto-cards-uk" className="category-also-see__chip">
            <i className="fa-solid fa-sterling-sign" aria-hidden="true"></i>
            Best Cards in the UK
          </a>
          <a href="/best-crypto-cards-latin-america" className="category-also-see__chip">
            <i className="fa-solid fa-earth-americas" aria-hidden="true"></i>
            Best Cards in Latin America
          </a>
        </div>
      </div>

      <CategoryCardsGrid cards={cards.map(toCardListItem)} />

      <div className="container">
        <section className="category-faq">
          <h2 className="category-faq__title">Frequently Asked Questions</h2>
          <FAQAccordion items={FAQ_ITEMS} ns="canada-faq" />
        </section>
      </div>
    </main>
  );
}
