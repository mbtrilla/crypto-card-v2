import { getAllCards, toCardListItem } from '@/lib/data';
import { isMastercardCard } from '@/lib/filters';
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
    q: 'What is the difference between Visa and Mastercard crypto cards?',
    a: 'Both networks offer nearly identical global acceptance and consumer protections. The main practical differences are issuer availability by region (Mastercard issuers dominate the UK and EEA; Visa is more prevalent in North America and Asia-Pacific), and some premium Mastercard tiers (World, World Elite) include travel benefits not typically found on standard Visa products.',
  },
  {
    q: 'Which Mastercard crypto card is best for European users?',
    a: 'For European users, Mastercard crypto cards from 1inch, Binance, Bybit, and Nexo are popular due to their EEA availability, SEPA top-up support, and competitive cashback. The 1inch Card offers up to 2% cashback with zero issuance fee. Nexo Card provides up to 2% in BTC or NEXO with no annual fee. Use the filter above to narrow by network and region.',
  },
  {
    q: 'Do Mastercard crypto cards work in the United States?',
    a: 'Some Mastercard crypto cards are available in the US, but US coverage is less common than for Visa products due to Mastercard\'s issuer landscape in North America. Cards from Crypto.com (Visa) and Coinbase (Visa) are the dominant US choices. Check each Mastercard card\'s detail page for US state availability.',
  },
  {
    q: 'Are there any crypto Mastercard cards with no annual fee?',
    a: 'Yes. Several Mastercard crypto cards have zero issuance fee and no annual charge, including the 1inch Card, Bybit Card, and Gate Card on their standard tiers. Premium tiers with higher cashback may require staking the issuer\'s native token. All fees are listed on each card\'s comparison page.',
  },
  {
    q: 'Can I earn cashback with a Mastercard crypto card?',
    a: 'Yes. Cashback programmes on Mastercard crypto cards range from 0.5% flat to 5%+ on premium staking tiers. Rewards are typically paid in the issuer\'s native token (e.g., BXX for 1inch, NEXO for Nexo) or in Bitcoin. Some cards offer cash rewards or stablecoin cashback for users who prefer not to hold volatile assets.',
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const allCards = await getAllCards();
  const cards = allCards.filter(isMastercardCard);
  const title = 'Best Mastercard Crypto Cards 2026 | Sweepbase';
  const description = generateCategoryMetaDescription('mastercard-crypto-cards', cards.length);
  return {
    title,
    description,
    alternates: { canonical: 'https://sweepbase.com/mastercard-crypto-cards' },
    openGraph: {
      title,
      description,
      url: 'https://sweepbase.com/mastercard-crypto-cards',
      type: 'website',
      images: [{ url: 'https://sweepbase.com/og-image.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://sweepbase.com/og-image.png'],
    },
    robots: { index: true, follow: true },
  };
}

export default async function MastercardCryptoCards() {
  const allCards = await getAllCards();
  const cards = allCards.filter(isMastercardCard);

  const webPageJsonLd = generateCategoryWebPageSchema(
    'Best Mastercard Crypto Cards 2026',
    'https://sweepbase.com/mastercard-crypto-cards',
    [
      { name: 'Home', item: 'https://sweepbase.com' },
      { name: 'Mastercard Crypto Cards', item: 'https://sweepbase.com/mastercard-crypto-cards' },
    ],
  );

  const itemListJsonLd = generateCategoryItemListSchema(
    cards,
    'https://sweepbase.com/mastercard-crypto-cards',
    'Best Mastercard Crypto Cards 2026',
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
          { label: 'Mastercard Crypto Cards' },
        ]} />

        <section className="category-hero">
          <h1 className="category-h1">Best Mastercard Crypto Debit Cards</h1>
          <p className="category-intro">
            Mastercard crypto cards are accepted at over 100 million locations worldwide and are the
            network of choice for many crypto card issuers targeting European and UK users.
            Sweepbase has identified <strong>{cards.length} Mastercard crypto cards</strong> in our
            database, covering both physical and virtual card options with a range of custody
            models, cashback programs, and supported top-up cryptocurrencies. Mastercard&apos;s
            strong presence in the EEA and UK makes its crypto card products particularly attractive
            for European residents, with many issuers holding FCA or Bank of Lithuania licences for
            regulatory compliance. Several Mastercard crypto cards offer zero-fee issuance and no
            annual charge, making them cost-effective for users who want to bridge their digital
            assets with everyday spending. Cashback is typically earned in native tokens, Bitcoin,
            or cash, with rates between 0.5% and 5% depending on tier. Compare issuance fees, FX
            rates, ATM limits, and reward structures across all Mastercard crypto options below to
            find the best card for your region and spending habits.
          </p>
        </section>

        <section className="category-why">
          <h2 className="category-why__title">Why These Cards?</h2>
          <ul className="category-why__list">
            <li className="category-why__item">
              <strong>European &amp; UK regulatory coverage</strong> — Mastercard is the dominant network for EEA and UK crypto card issuers, with many holding FCA or Bank of Lithuania e-money licences providing strong consumer protections.
            </li>
            <li className="category-why__item">
              <strong>Premium tier benefits available</strong> — select Mastercard products qualify for World or World Elite status, unlocking airport lounge access, travel insurance, and enhanced ATM withdrawal limits not typically available on standard cards.
            </li>
            <li className="category-why__item">
              <strong>Zero-fee entry options</strong> — several listed cards have no issuance fee and no annual charge on the base tier, making it easy to get started with crypto spending without upfront cost.
            </li>
          </ul>
        </section>
        <div className="category-also-see">
          <span className="category-also-see__label">Also see:</span>
          <a href="/visa-crypto-cards" className="category-also-see__chip">
            <i className="fa-solid fa-credit-card" aria-hidden="true"></i>
            Visa Crypto Cards
          </a>
          <a href="/crypto-cards-with-cashback" className="category-also-see__chip">
            <i className="fa-solid fa-percent" aria-hidden="true"></i>
            Cards With Cashback
          </a>
          <a href="/self-custody-crypto-cards" className="category-also-see__chip">
            <i className="fa-solid fa-key" aria-hidden="true"></i>
            Self-Custody Cards
          </a>
        </div>
      </div>

      <CategoryCardsGrid cards={cards.map(toCardListItem)} />

      <div className="container">
        <section className="category-faq">
          <h2 className="category-faq__title">Frequently Asked Questions</h2>
          <FAQAccordion items={FAQ_ITEMS} ns="mastercard-faq" />
        </section>
      </div>
    </main>
  );
}
