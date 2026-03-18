import { getAllCards, toCardListItem } from '@/lib/data';
import { isPhysicalCard } from '@/lib/filters';
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
    q: 'How long does it take to receive a physical crypto card?',
    a: 'Delivery times vary by issuer and your location. Most providers ship physical crypto cards within 7-14 business days for standard delivery, with some offering express shipping (3-5 days) for an additional fee. Cards shipped internationally may take longer, especially to regions with limited postal infrastructure.',
  },
  {
    q: 'Can I use a physical crypto card at any ATM?',
    a: 'Physical crypto cards issued on the Visa or Mastercard network can be used at any ATM displaying the corresponding logo worldwide. ATM withdrawal fees vary by issuer — some offer a monthly fee-free allowance while others charge a flat fee or percentage per withdrawal. Check each card\'s ATM fee structure before relying on cash withdrawals.',
  },
  {
    q: 'Are metal crypto cards worth the premium?',
    a: 'Metal crypto cards typically come with higher card tiers that include perks like airport lounge access, higher cashback rates, increased spending limits, and dedicated support. Whether the premium is worth it depends on your spending volume and how much you value the additional benefits. For casual users, a standard plastic card may be sufficient.',
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const allCards = await getAllCards();
  const cards = allCards.filter(isPhysicalCard);
  const title = 'Best Physical Crypto Cards 2026 — Tap-to-Pay | Sweepbase';
  const description = generateCategoryMetaDescription('physical-crypto-cards', cards.length);
  const ogImage = `https://sweepbase.com/api/og?title=${encodeURIComponent('Best Physical Crypto Cards 2026')}&count=${cards.length}&subtitle=Card+Type`;
  return {
    title,
    description,
    alternates: { canonical: 'https://sweepbase.com/physical-crypto-cards' },
    openGraph: {
      title,
      description,
      url: 'https://sweepbase.com/physical-crypto-cards',
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

export default async function PhysicalCryptoCards() {
  const allCards = await getAllCards();
  const cards = allCards.filter(isPhysicalCard);

  const webPageJsonLd = generateCategoryWebPageSchema(
    'Best Physical Crypto Cards 2026',
    'https://sweepbase.com/physical-crypto-cards',
    [
      { name: 'Home', item: 'https://sweepbase.com' },
      { name: 'Physical Crypto Cards', item: 'https://sweepbase.com/physical-crypto-cards' },
    ],
  );

  const itemListJsonLd = generateCategoryItemListSchema(
    cards,
    'https://sweepbase.com/physical-crypto-cards',
    'Best Physical Crypto Cards 2026',
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
          { label: 'Physical Crypto Cards' },
        ]} />

        <section className="category-hero">
          <h1 className="category-h1">Best Physical Crypto Cards 2026</h1>
          <p className="category-intro">
            Physical crypto cards let you tap-to-pay at terminals, withdraw cash from ATMs, and use
            your crypto everywhere Visa or Mastercard is accepted. Sweepbase tracks{' '}
            <strong>{cards.length} crypto cards</strong> with physical card options — including
            standard plastic, premium metal, and contactless-enabled cards shipped worldwide. A
            physical card gives you the full traditional banking experience powered by your crypto
            holdings, from in-store payments to ATM withdrawals in local currency. Use the
            comparison tool below to evaluate card materials, shipping regions, ATM withdrawal
            limits, contactless support, and fee structures to find the best physical crypto card
            for your spending habits.
          </p>
        </section>

        <section className="category-why">
          <h2 className="category-why__title">Why These Cards?</h2>
          <ul className="category-why__list">
            <li className="category-why__item">
              <strong>Tap-to-pay at any terminal</strong> — all listed physical cards support contactless NFC payments at Visa or Mastercard terminals worldwide.
            </li>
            <li className="category-why__item">
              <strong>ATM cash withdrawal</strong> — withdraw local currency from ATMs globally, with monthly fee-free allowances available on many cards.
            </li>
            <li className="category-why__item">
              <strong>Premium metal options available</strong> — several issuers offer metal card tiers with higher limits, airport lounge access, and enhanced rewards.
            </li>
          </ul>
        </section>

        <div className="category-also-see">
          <span className="category-also-see__label">Also see:</span>
          <a href="/virtual-crypto-cards" className="category-also-see__chip">
            <i className="fa-solid fa-mobile-screen" aria-hidden="true"></i>
            Virtual Crypto Cards
          </a>
          <a href="/visa-crypto-cards" className="category-also-see__chip">
            <i className="fa-brands fa-cc-visa" aria-hidden="true"></i>
            Visa Crypto Cards
          </a>
          <a href="/mastercard-crypto-cards" className="category-also-see__chip">
            <i className="fa-brands fa-cc-mastercard" aria-hidden="true"></i>
            Mastercard Crypto Cards
          </a>
        </div>
      </div>

      <CategoryCardsGrid cards={cards.map(toCardListItem)} />

      <div className="container">
        <section className="category-faq">
          <h2 className="category-faq__title">Frequently Asked Questions</h2>
          <FAQAccordion items={FAQ_ITEMS} ns="physical-faq" />
        </section>
      </div>
    </main>
  );
}
