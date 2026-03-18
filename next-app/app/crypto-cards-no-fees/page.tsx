import { getAllCards, toCardListItem } from '@/lib/data';
import { isNoFeeCard } from '@/lib/filters';
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
    q: 'Are free crypto cards really free?',
    a: 'Cards listed here have zero issuance fees and zero annual fees, meaning you pay nothing to obtain or maintain the card. However, other costs may still apply when using the card — including FX conversion fees, crypto-to-fiat spreads, ATM withdrawal fees, and inactivity fees. Always review the full fee schedule on each card\'s detail page.',
  },
  {
    q: 'How do free crypto card issuers make money?',
    a: 'Card issuers typically generate revenue through interchange fees (a percentage of each transaction paid by the merchant), crypto-to-fiat conversion spreads, premium tier upgrades, and partner token incentives. The free card tier serves as an entry point to attract users who may later upgrade to paid premium tiers.',
  },
  {
    q: 'Should I choose a free card or a paid card with better rewards?',
    a: 'It depends on your spending volume. If you spend less than $1,000/month on the card, a free card with modest rewards may save you more overall. High-volume spenders may benefit from paid tiers that offer higher cashback rates, lower FX fees, and perks like airport lounge access — the rewards can outweigh the annual cost.',
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const allCards = await getAllCards();
  const cards = allCards.filter(isNoFeeCard);
  const title = 'Free Crypto Cards With No Fees 2026 | Sweepbase';
  const description = generateCategoryMetaDescription('crypto-cards-no-fees', cards.length);
  const ogImage = `https://sweepbase.com/api/og?title=${encodeURIComponent('Free Crypto Cards With No Fees 2026')}&count=${cards.length}&subtitle=Fee+Filter`;
  return {
    title,
    description,
    alternates: { canonical: 'https://sweepbase.com/crypto-cards-no-fees' },
    openGraph: {
      title,
      description,
      url: 'https://sweepbase.com/crypto-cards-no-fees',
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

export default async function CryptoCardsNoFees() {
  const allCards = await getAllCards();
  const cards = allCards.filter(isNoFeeCard);

  const webPageJsonLd = generateCategoryWebPageSchema(
    'Free Crypto Cards With No Fees 2026',
    'https://sweepbase.com/crypto-cards-no-fees',
    [
      { name: 'Home', item: 'https://sweepbase.com' },
      { name: 'Free Crypto Cards', item: 'https://sweepbase.com/crypto-cards-no-fees' },
    ],
  );

  const itemListJsonLd = generateCategoryItemListSchema(
    cards,
    'https://sweepbase.com/crypto-cards-no-fees',
    'Free Crypto Cards With No Fees 2026',
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
          { label: 'Free Crypto Cards' },
        ]} />

        <section className="category-hero">
          <h1 className="category-h1">Free Crypto Cards With No Issuance or Annual Fees</h1>
          <p className="category-intro">
            Looking for a crypto card that costs nothing to get started? Sweepbase has identified{' '}
            <strong>{cards.length} cards</strong> with zero issuance fee AND zero annual fee. While
            these cards are free to obtain, note that FX conversion fees and crypto-to-fiat spreads
            may still apply when spending. Use our comparison tool to evaluate the total cost of
            ownership. Free cards are an excellent way to try crypto spending without financial
            commitment — if the experience suits your needs, you can always upgrade to a premium
            tier later. Compare cashback rates, supported cryptocurrencies, spending limits, and
            hidden fees below to find the best no-cost crypto card for your wallet.
          </p>
        </section>

        <section className="category-why">
          <h2 className="category-why__title">Why These Cards?</h2>
          <ul className="category-why__list">
            <li className="category-why__item">
              <strong>Zero upfront cost</strong> — no issuance or activation fee means you can get started without spending a penny on the card itself.
            </li>
            <li className="category-why__item">
              <strong>No recurring charges</strong> — zero annual or monthly maintenance fees, so the card never costs you money just for having it in your wallet.
            </li>
            <li className="category-why__item">
              <strong>Risk-free to try</strong> — with no financial commitment, you can test crypto spending and compare cards before deciding on a long-term option.
            </li>
          </ul>
        </section>

        <div className="category-also-see">
          <span className="category-also-see__label">Also see:</span>
          <a href="/crypto-cards-with-cashback" className="category-also-see__chip">
            <i className="fa-solid fa-percent" aria-hidden="true"></i>
            Cashback Cards
          </a>
          <a href="/virtual-crypto-cards" className="category-also-see__chip">
            <i className="fa-solid fa-mobile-screen" aria-hidden="true"></i>
            Virtual Crypto Cards
          </a>
          <a href="/guides/best-crypto-cards-for-beginners" className="category-also-see__chip">
            <i className="fa-solid fa-graduation-cap" aria-hidden="true"></i>
            Beginners Guide
          </a>
        </div>
      </div>

      <CategoryCardsGrid cards={cards.map(toCardListItem)} />

      <div className="container">
        <section className="category-faq">
          <h2 className="category-faq__title">Frequently Asked Questions</h2>
          <FAQAccordion items={FAQ_ITEMS} ns="no-fees-faq" />
        </section>
      </div>
    </main>
  );
}
