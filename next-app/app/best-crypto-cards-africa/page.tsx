import { getAllCards, toCardListItem } from '@/lib/data';
import { isAfricaCard } from '@/lib/filters';
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
    q: 'Which African countries have access to crypto cards?',
    a: 'Several crypto card providers now serve users in Nigeria, South Africa, Kenya, Ghana, Egypt, and other African nations. Availability varies by issuer — some cards are limited to specific countries while others accept users continent-wide. Always check the issuer\'s supported countries list before applying.',
  },
  {
    q: 'Can I fund my crypto card with mobile money in Africa?',
    a: 'Some crypto card providers in Africa support mobile money funding through integrations with M-Pesa, MTN Mobile Money, and similar services. However, most cards primarily accept funding via stablecoin deposits (USDT/USDC) or bank transfer. Check each card\'s funding options for mobile money compatibility.',
  },
  {
    q: 'Are stablecoins the best way to load a crypto card in Africa?',
    a: 'Yes, stablecoins like USDT and USDC are the most popular funding method for crypto cards in Africa. They avoid local currency volatility, offer dollar-denominated spending power, and typically have lower conversion fees than funding with volatile cryptocurrencies like Bitcoin or Ethereum.',
  },
  {
    q: 'What fees should African users watch out for with crypto cards?',
    a: 'Key fees to consider include foreign exchange (FX) conversion fees when spending in local currencies, ATM withdrawal fees, card issuance and shipping costs, and crypto-to-fiat conversion spreads. Cards with low or zero FX fees are particularly valuable for cross-border spending across African countries.',
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const allCards = await getAllCards();
  const cards = allCards.filter(isAfricaCard);
  const title = 'Best Crypto Cards in Africa 2026 — Top Picks | Sweepbase';
  const description = generateCategoryMetaDescription('best-crypto-cards-africa', cards.length);
  const ogImage = `https://sweepbase.com/api/og?title=${encodeURIComponent('Best Crypto Cards in Africa 2026')}&count=${cards.length}&subtitle=Regional+Guide`;
  return {
    title,
    description,
    alternates: { canonical: 'https://sweepbase.com/best-crypto-cards-africa' },
    openGraph: {
      title,
      description,
      url: 'https://sweepbase.com/best-crypto-cards-africa',
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

export default async function BestCryptoCardsAfrica() {
  const allCards = await getAllCards();
  const cards = allCards.filter(isAfricaCard);

  const webPageJsonLd = generateCategoryWebPageSchema(
    'Best Crypto Cards in Africa 2026',
    'https://sweepbase.com/best-crypto-cards-africa',
    [
      { name: 'Home', item: 'https://sweepbase.com' },
      { name: 'Best Crypto Cards in Africa', item: 'https://sweepbase.com/best-crypto-cards-africa' },
    ],
  );

  const itemListJsonLd = generateCategoryItemListSchema(
    cards,
    'https://sweepbase.com/best-crypto-cards-africa',
    'Best Crypto Cards in Africa 2026',
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
          { label: 'Best Crypto Cards in Africa' },
        ]} />

        <section className="category-hero">
          <h1 className="category-h1">Best Crypto Debit &amp; Credit Cards in Africa</h1>
          <p className="category-updated">Last updated: <time dateTime="2026-03-18">March 18, 2026</time></p>
          <p className="category-intro">
            Africa is one of the fastest-growing crypto markets, with crypto cards enabling financial
            inclusion and dollar-denominated spending across the continent. Sweepbase has identified{' '}
            <strong>{cards.length} crypto cards</strong> available to users in Africa — covering
            Nigeria, South Africa, Kenya, Ghana, Egypt, and more. Key factors for African users
            include stablecoin (USDT/USDC) support, mobile money integration, low FX fees, and
            broad Visa/Mastercard acceptance. Whether you need a card for everyday purchases,
            cross-border payments, or remittances, these options have been evaluated for African
            market compatibility, onboarding requirements, and total cost of ownership. Use the
            comparison tool below to filter by supported countries, funding methods, cashback rates,
            and fee structures to find the best crypto card for your needs.
          </p>
        </section>

        <section className="category-why">
          <h2 className="category-why__title">Why These Cards?</h2>
          <ul className="category-why__list">
            <li className="category-why__item">
              <strong>Stablecoin-first funding</strong> — all listed cards support USDT or USDC deposits, giving you dollar-denominated spending power without local currency volatility.
            </li>
            <li className="category-why__item">
              <strong>Multi-country African coverage</strong> — each card serves users in multiple African nations, with country-specific availability noted on individual card pages.
            </li>
            <li className="category-why__item">
              <strong>Low-barrier onboarding</strong> — these cards offer streamlined KYC processes designed for African users, with accessible ID verification and fast approval times.
            </li>
          </ul>
        </section>

        <div className="category-also-see">
          <span className="category-also-see__label">Also see:</span>
          <a href="/best-crypto-cards-middle-east" className="category-also-see__chip">
            <i className="fa-solid fa-mosque" aria-hidden="true"></i>
            Best Cards in the Middle East
          </a>
          <a href="/best-crypto-cards-latin-america" className="category-also-see__chip">
            <i className="fa-solid fa-earth-americas" aria-hidden="true"></i>
            Best Cards in Latin America
          </a>
          <a href="/best-crypto-cards-asia" className="category-also-see__chip">
            <i className="fa-solid fa-earth-asia" aria-hidden="true"></i>
            Best Cards in Asia
          </a>
        </div>
      </div>

      <CategoryCardsGrid cards={cards.map(toCardListItem)} />

      <div className="container">
        <section className="category-faq">
          <h2 className="category-faq__title">Frequently Asked Questions</h2>
          <FAQAccordion items={FAQ_ITEMS} ns="africa-faq" />
        </section>
      </div>
    </main>
  );
}
