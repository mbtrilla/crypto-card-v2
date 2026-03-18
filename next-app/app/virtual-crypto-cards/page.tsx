import { getAllCards, toCardListItem } from '@/lib/data';
import { isVirtualCard } from '@/lib/filters';
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
    q: 'How quickly can I get a virtual crypto card?',
    a: 'Most virtual crypto cards are issued instantly after completing KYC verification. Once approved, you receive your card number, expiry date, and CVV immediately in the app or dashboard. You can start making online purchases or add the card to Apple Pay / Google Pay within minutes.',
  },
  {
    q: 'Can I add a virtual crypto card to Apple Pay or Google Pay?',
    a: 'Many virtual crypto cards support Apple Pay and Google Pay, allowing you to make contactless tap-to-pay purchases at physical terminals using your phone or smartwatch. Check each card\'s listing for mobile wallet compatibility — not all virtual cards support this feature.',
  },
  {
    q: 'Are virtual crypto cards safe for online shopping?',
    a: 'Virtual crypto cards offer strong security for online shopping. They typically include standard Visa/Mastercard fraud protections, and some issuers allow you to freeze or delete the card instantly from the app. Since no physical card exists, there is no risk of physical theft or card skimming.',
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const allCards = await getAllCards();
  const cards = allCards.filter(isVirtualCard);
  const title = 'Best Virtual Crypto Cards 2026 — Instant Issue | Sweepbase';
  const description = generateCategoryMetaDescription('virtual-crypto-cards', cards.length);
  const ogImage = `https://sweepbase.com/api/og?title=${encodeURIComponent('Best Virtual Crypto Cards 2026')}&count=${cards.length}&subtitle=Card+Type`;
  return {
    title,
    description,
    alternates: { canonical: 'https://sweepbase.com/virtual-crypto-cards' },
    openGraph: {
      title,
      description,
      url: 'https://sweepbase.com/virtual-crypto-cards',
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

export default async function VirtualCryptoCards() {
  const allCards = await getAllCards();
  const cards = allCards.filter(isVirtualCard);

  const webPageJsonLd = generateCategoryWebPageSchema(
    'Best Virtual Crypto Cards 2026',
    'https://sweepbase.com/virtual-crypto-cards',
    [
      { name: 'Home', item: 'https://sweepbase.com' },
      { name: 'Virtual Crypto Cards', item: 'https://sweepbase.com/virtual-crypto-cards' },
    ],
  );

  const itemListJsonLd = generateCategoryItemListSchema(
    cards,
    'https://sweepbase.com/virtual-crypto-cards',
    'Best Virtual Crypto Cards 2026',
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
          { label: 'Virtual Crypto Cards' },
        ]} />

        <section className="category-hero">
          <h1 className="category-h1">Best Virtual Crypto Cards 2026</h1>
          <p className="category-updated">Last updated: <time dateTime="2026-03-18">March 18, 2026</time></p>
          <p className="category-intro">
            Virtual crypto cards are issued instantly and ready for online purchases and mobile
            wallet payments within minutes. No waiting for physical delivery — add to Apple Pay or
            Google Pay and start spending immediately. Sweepbase tracks{' '}
            <strong>{cards.length} virtual-only crypto cards</strong>. Ideal for online shopping,
            subscriptions, and users who prefer a fully digital payment solution. Virtual cards
            eliminate shipping delays and costs, provide instant access to your crypto spending
            power, and often come with lower or zero issuance fees compared to physical alternatives.
            Use the comparison tool below to filter by supported cryptocurrencies, mobile wallet
            compatibility, spending limits, and fee structures.
          </p>
        </section>

        <section className="category-why">
          <h2 className="category-why__title">Why These Cards?</h2>
          <ul className="category-why__list">
            <li className="category-why__item">
              <strong>Instant issuance</strong> — get your card number immediately after sign-up and KYC approval, with no waiting for physical delivery.
            </li>
            <li className="category-why__item">
              <strong>Mobile wallet ready</strong> — most virtual cards support Apple Pay and Google Pay for tap-to-pay at contactless terminals worldwide.
            </li>
            <li className="category-why__item">
              <strong>Lower or zero issuance fees</strong> — without manufacturing and shipping costs, virtual cards are typically cheaper to obtain than physical alternatives.
            </li>
          </ul>
        </section>

        <div className="category-also-see">
          <span className="category-also-see__label">Also see:</span>
          <a href="/physical-crypto-cards" className="category-also-see__chip">
            <i className="fa-solid fa-credit-card" aria-hidden="true"></i>
            Physical Crypto Cards
          </a>
          <a href="/self-custody-crypto-cards" className="category-also-see__chip">
            <i className="fa-solid fa-key" aria-hidden="true"></i>
            Self-Custody Cards
          </a>
          <a href="/crypto-cards-with-cashback" className="category-also-see__chip">
            <i className="fa-solid fa-percent" aria-hidden="true"></i>
            Cashback Cards
          </a>
        </div>
      </div>

      <CategoryCardsGrid cards={cards.map(toCardListItem)} />

      <div className="container">
        <section className="category-faq">
          <h2 className="category-faq__title">Frequently Asked Questions</h2>
          <FAQAccordion items={FAQ_ITEMS} ns="virtual-faq" />
        </section>
      </div>
    </main>
  );
}
