import { getAllCards, toCardListItem } from '@/lib/data';
import { isLatAmCard } from '@/lib/filters';
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
    q: 'Are crypto debit cards available in Latin America?',
    a: 'Yes. A growing number of crypto card issuers now serve Latin American countries including Mexico, Brazil, Argentina, Colombia, Chile, and others. Availability varies by country due to local banking regulations, so always check the individual card listing for your country.',
  },
  {
    q: 'Can I load a crypto card with local currency in Latin America?',
    a: 'It depends on the card. Some issuers accept local bank transfers in MXN, BRL, or ARS. Others require crypto deposits (USDT, USDC, BTC) that are converted at the point of sale. Check funding methods on each card page for local currency support.',
  },
  {
    q: 'Why are crypto cards popular in Latin America?',
    a: 'Crypto cards provide access to dollar-denominated spending in regions with volatile local currencies. They also offer financial inclusion for the unbanked and underbanked populations, and enable cross-border payments without traditional bank intermediaries.',
  },
  {
    q: 'Do crypto cards work with stablecoins like USDT in Latin America?',
    a: 'Yes. Most crypto cards available in Latin America support USDT and USDC as funding currencies. This is particularly popular for users who want to maintain dollar stability while spending locally at Visa and Mastercard terminals.',
  },
  {
    q: 'What is the best crypto card for Latin American users in 2026?',
    a: 'The best card depends on your country and needs. For users seeking dollar-pegged spending, stablecoin-funded cards are ideal. For highest rewards, compare cashback structures across available options. Use the filters on this page to find cards available in your country.',
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const allCards = await getAllCards();
  const cards = allCards.filter(isLatAmCard);
  const title = 'Best Crypto Cards in Latin America 2026 — Top Picks | Sweepbase';
  const description = generateCategoryMetaDescription('best-crypto-cards-latin-america', cards.length);
  const ogImage = `https://sweepbase.com/api/og?title=${encodeURIComponent('Best Crypto Cards in Latin America 2026')}&count=${cards.length}&subtitle=Regional+Guide`;
  return {
    title,
    description,
    alternates: { canonical: 'https://sweepbase.com/best-crypto-cards-latin-america' },
    openGraph: {
      title,
      description,
      url: 'https://sweepbase.com/best-crypto-cards-latin-america',
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

export default async function BestCryptoCardsLatAm() {
  const allCards = await getAllCards();
  const cards = allCards.filter(isLatAmCard);

  const webPageJsonLd = generateCategoryWebPageSchema(
    'Best Crypto Cards in Latin America 2026',
    'https://sweepbase.com/best-crypto-cards-latin-america',
    [
      { name: 'Home', item: 'https://sweepbase.com' },
      { name: 'Best Crypto Cards in Latin America', item: 'https://sweepbase.com/best-crypto-cards-latin-america' },
    ],
  );

  const itemListJsonLd = generateCategoryItemListSchema(
    cards,
    'https://sweepbase.com/best-crypto-cards-latin-america',
    'Best Crypto Cards in Latin America 2026',
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
          { label: 'Best Crypto Cards in Latin America' },
        ]} />

        <section className="category-hero">
          <h1 className="category-h1">Best Crypto Debit &amp; Credit Cards in Latin America</h1>
          <p className="category-intro">
            Latin America is one of the fastest-growing regions for crypto adoption, with crypto debit
            cards providing a bridge between digital assets and everyday spending. Sweepbase has
            identified <strong>{cards.length} crypto cards</strong> currently available to users across
            Latin America and the Caribbean &mdash; covering Mexico, Brazil, Argentina, Colombia, Chile,
            and many other countries. Key factors for Latin American users include stablecoin (USDT/USDC)
            funding support, local currency top-up availability, competitive FX rates, and broad
            merchant acceptance through Visa and Mastercard networks. Crypto cards are especially
            valuable in the region for accessing dollar-denominated spending power and enabling
            cross-border transactions without traditional banking friction.
          </p>
        </section>

        <section className="category-why">
          <h2 className="category-why__title">Why These Cards?</h2>
          <ul className="category-why__list">
            <li className="category-why__item">
              <strong>Dollar-stable spending</strong> &mdash; most cards support USDT and USDC funding, providing stability against local currency volatility.
            </li>
            <li className="category-why__item">
              <strong>Multi-country availability</strong> &mdash; cards listed here serve users across multiple Latin American countries including Mexico, Brazil, Argentina, and Colombia.
            </li>
            <li className="category-why__item">
              <strong>Low-friction onboarding</strong> &mdash; many cards offer streamlined KYC processes tailored to the region with crypto-native funding methods.
            </li>
          </ul>
        </section>

        <div className="category-also-see">
          <span className="category-also-see__label">Also see:</span>
          <a href="/best-crypto-cards-usa" className="category-also-see__chip">
            <i className="fa-solid fa-flag-usa" aria-hidden="true"></i>
            Best Cards in the USA
          </a>
          <a href="/best-crypto-cards-canada" className="category-also-see__chip">
            <i className="fa-solid fa-leaf" aria-hidden="true"></i>
            Best Cards in Canada
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
          <FAQAccordion items={FAQ_ITEMS} ns="latam-faq" />
        </section>
      </div>
    </main>
  );
}
