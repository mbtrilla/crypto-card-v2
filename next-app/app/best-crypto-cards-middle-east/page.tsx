import { getAllCards, toCardListItem } from '@/lib/data';
import { isMiddleEastCard } from '@/lib/filters';
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
    q: 'Are crypto cards legal in the UAE and Saudi Arabia?',
    a: 'Yes. The UAE has established a comprehensive regulatory framework for virtual assets through VARA (Virtual Assets Regulatory Authority) in Dubai and ADGM in Abu Dhabi. Saudi Arabia is developing its regulatory approach, with several licensed providers already operating. Crypto cards issued by regulated entities are legal to use in both countries.',
  },
  {
    q: 'Can I fund a crypto card with AED or SAR?',
    a: 'Several crypto card providers in the Middle East support AED (UAE Dirham) funding via local bank transfers and some support SAR (Saudi Riyal). Most cards also accept stablecoin deposits (USDT/USDC) which can be a convenient alternative for users across the GCC region.',
  },
  {
    q: 'Are there Sharia-compliant crypto cards available?',
    a: 'Some crypto card issuers in the Middle East are working toward Sharia-compliance certifications or offer products structured to align with Islamic finance principles. This is an evolving area — check individual card details for any Sharia-compliance disclosures or certifications from recognized scholars.',
  },
  {
    q: 'Which Middle Eastern countries have the best crypto card availability?',
    a: 'The UAE leads the region with the most crypto card options, followed by Bahrain, which has a progressive regulatory environment. Turkey, Israel, and other regional markets also have growing availability. Coverage varies by issuer, so always verify your country is supported before applying.',
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const allCards = await getAllCards();
  const cards = allCards.filter(isMiddleEastCard);
  const title = 'Best Crypto Cards in the Middle East 2026 — Top Picks | Sweepbase';
  const description = generateCategoryMetaDescription('best-crypto-cards-middle-east', cards.length);
  const ogImage = `https://sweepbase.com/api/og?title=${encodeURIComponent('Best Crypto Cards in the Middle East 2026')}&count=${cards.length}&subtitle=Regional+Guide`;
  return {
    title,
    description,
    alternates: { canonical: 'https://sweepbase.com/best-crypto-cards-middle-east' },
    openGraph: {
      title,
      description,
      url: 'https://sweepbase.com/best-crypto-cards-middle-east',
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

export default async function BestCryptoCardsMiddleEast() {
  const allCards = await getAllCards();
  const cards = allCards.filter(isMiddleEastCard);

  const webPageJsonLd = generateCategoryWebPageSchema(
    'Best Crypto Cards in the Middle East 2026',
    'https://sweepbase.com/best-crypto-cards-middle-east',
    [
      { name: 'Home', item: 'https://sweepbase.com' },
      { name: 'Best Crypto Cards in the Middle East', item: 'https://sweepbase.com/best-crypto-cards-middle-east' },
    ],
  );

  const itemListJsonLd = generateCategoryItemListSchema(
    cards,
    'https://sweepbase.com/best-crypto-cards-middle-east',
    'Best Crypto Cards in the Middle East 2026',
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
          { label: 'Best Crypto Cards in the Middle East' },
        ]} />

        <section className="category-hero">
          <h1 className="category-h1">Best Crypto Debit &amp; Credit Cards in the Middle East</h1>
          <p className="category-intro">
            The Middle East is emerging as a major hub for crypto adoption, with the UAE, Saudi
            Arabia, and Bahrain leading regulatory clarity. Sweepbase has identified{' '}
            <strong>{cards.length} crypto cards</strong> available to users across the region. Key
            factors include AED/SAR funding support, Sharia-compliance considerations, and
            compatibility with regional payment networks. From premium metal cards with concierge
            services to everyday spending cards with competitive cashback, the Middle Eastern crypto
            card market is rapidly maturing. Use the comparison tool below to evaluate supported
            countries, funding currencies, fee structures, and reward programmes to find the card
            that best fits your needs in the GCC and broader MENA region.
          </p>
        </section>

        <section className="category-why">
          <h2 className="category-why__title">Why These Cards?</h2>
          <ul className="category-why__list">
            <li className="category-why__item">
              <strong>UAE/GCC regulatory compliance</strong> — listed cards operate under recognised regulatory frameworks including VARA, ADGM, or equivalent regional licences.
            </li>
            <li className="category-why__item">
              <strong>AED and multi-currency support</strong> — cards support AED funding or stablecoin deposits with competitive FX rates for regional currencies.
            </li>
            <li className="category-why__item">
              <strong>Premium card tiers available</strong> — several providers offer metal cards and premium tiers with airport lounge access and concierge services popular in the region.
            </li>
          </ul>
        </section>

        <div className="category-also-see">
          <span className="category-also-see__label">Also see:</span>
          <a href="/best-crypto-cards-africa" className="category-also-see__chip">
            <i className="fa-solid fa-earth-africa" aria-hidden="true"></i>
            Best Cards in Africa
          </a>
          <a href="/best-crypto-cards-asia" className="category-also-see__chip">
            <i className="fa-solid fa-earth-asia" aria-hidden="true"></i>
            Best Cards in Asia
          </a>
          <a href="/best-crypto-cards-europe" className="category-also-see__chip">
            <i className="fa-solid fa-earth-europe" aria-hidden="true"></i>
            Best Cards in Europe
          </a>
        </div>
      </div>

      <CategoryCardsGrid cards={cards.map(toCardListItem)} />

      <div className="container">
        <section className="category-faq">
          <h2 className="category-faq__title">Frequently Asked Questions</h2>
          <FAQAccordion items={FAQ_ITEMS} ns="middle-east-faq" />
        </section>
      </div>
    </main>
  );
}
