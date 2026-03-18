import { getAllCards, toCardListItem } from '@/lib/data';
import { isVisaCard } from '@/lib/filters';
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
    q: 'What is the difference between a Visa crypto card and a regular Visa?',
    a: 'A Visa crypto card works exactly like a regular Visa debit or prepaid card at point of sale, but your balance is funded with cryptocurrency instead of traditional bank funds. When you spend, the card automatically converts the required amount of crypto to local fiat currency at the prevailing exchange rate. The merchant sees a standard Visa transaction.',
  },
  {
    q: 'Which Visa crypto card has the best cashback in 2026?',
    a: 'Cashback rates vary significantly by tier and token type. Crypto.com Visa offers up to 5% CRO cashback on its highest staking tier. Nexo Card offers up to 2% in BTC or NEXO. For flat-rate BTC cashback with no staking requirement, Fold Card offers competitive rates. Use the compare tool to filter by cashback rate.',
  },
  {
    q: 'Are Visa crypto cards accepted everywhere regular Visa cards are?',
    a: 'Yes. Visa crypto cards carry the standard Visa logo and are accepted at all 150+ million Visa merchant locations globally. The card is indistinguishable from a regular Visa at the terminal. The only limitation is that some cards are prepaid or debit, which a minority of merchants may not accept.',
  },
  {
    q: 'How does a Visa crypto card convert crypto to fiat at checkout?',
    a: 'When you tap or swipe your Visa crypto card, the issuer\'s platform automatically sells the required amount of crypto from your balance at the current market rate and settles the transaction in the local currency via Visa\'s network. This happens in real time — typically under 2 seconds. FX fees (usually 0–2.5%) are applied on top of the market rate.',
  },
  {
    q: 'Can I use a Visa crypto card for online purchases and subscriptions?',
    a: 'Yes. Visa crypto cards work for online purchases, recurring subscriptions (Netflix, Spotify, etc.), and any merchant that accepts Visa online. Virtual card numbers are available on most issuers for extra security. Some cards also support 3D Secure (Verified by Visa) for additional authentication on online transactions.',
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const allCards = await getAllCards();
  const cards = allCards.filter(isVisaCard);
  const title = 'Best Visa Crypto Cards 2026 — Compare All Visa Cards | Sweepbase';
  const description = generateCategoryMetaDescription('visa-crypto-cards', cards.length);
  return {
    title,
    description,
    alternates: { canonical: 'https://sweepbase.com/visa-crypto-cards' },
    openGraph: {
      title,
      description,
      url: 'https://sweepbase.com/visa-crypto-cards',
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

export default async function VisaCryptoCards() {
  const allCards = await getAllCards();
  const cards = allCards.filter(isVisaCard);

  const webPageJsonLd = generateCategoryWebPageSchema(
    'Best Visa Crypto Cards 2026',
    'https://sweepbase.com/visa-crypto-cards',
    [
      { name: 'Home', item: 'https://sweepbase.com' },
      { name: 'Visa Crypto Cards', item: 'https://sweepbase.com/visa-crypto-cards' },
    ],
  );

  const itemListJsonLd = generateCategoryItemListSchema(
    cards,
    'https://sweepbase.com/visa-crypto-cards',
    'Best Visa Crypto Cards 2026',
  );

  const faqJsonLd = generateFAQPageSchema(FAQ_ITEMS);

  return (
    <main className="category-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="container">
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'Visa Crypto Cards' },
        ]} />

        <section className="category-hero">
          <h1 className="category-h1">Best Visa Crypto Debit &amp; Credit Cards</h1>
          <p className="category-intro">
            Visa crypto cards are accepted at over 150 million merchants in more than 200 countries,
            making them the widest-reaching option for everyday crypto spending. Sweepbase has
            identified <strong>{cards.length} Visa crypto cards</strong> in our database — from
            beginner-friendly custodial cards issued by major exchanges to advanced DeFi-native
            cards that preserve self-custody of your digital assets. Visa crypto cards typically
            offer the broadest global acceptance, support for contactless payments via Apple Pay and
            Google Pay, and robust chargeback protections at supported merchants. Cashback on Visa
            crypto cards commonly arrives in Bitcoin, platform tokens, or stablecoins, with rates
            ranging from 0.5% to 8% depending on staking requirements and spending tier. Use the
            compare tool below to evaluate issuance fees, annual charges, ATM withdrawal limits, FX
            rates, and cashback structures across all available Visa crypto cards.
          </p>
        </section>

        <section className="category-why">
          <h2 className="category-why__title">Why These Cards?</h2>
          <ul className="category-why__list">
            <li className="category-why__item">
              <strong>Global acceptance at 150M+ merchants</strong> — Visa is accepted in 200+ countries, making these cards the most versatile choice for crypto spending both domestically and while travelling.
            </li>
            <li className="category-why__item">
              <strong>Contactless &amp; mobile wallet ready</strong> — all listed Visa crypto cards support Apple Pay and/or Google Pay for tap-to-pay, with virtual card numbers available for secure online purchases.
            </li>
            <li className="category-why__item">
              <strong>Visa Zero Liability protection</strong> — qualifying purchases are covered by Visa&apos;s Zero Liability policy, giving you chargeback rights and fraud protection that pure crypto transactions lack.
            </li>
          </ul>
        </section>
        <div className="category-also-see">
          <span className="category-also-see__label">Also see:</span>
          <a href="/mastercard-crypto-cards" className="category-also-see__chip">
            <i className="fa-solid fa-circle-dot" aria-hidden="true"></i>
            Mastercard Crypto Cards
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
          <FAQAccordion items={FAQ_ITEMS} ns="visa-faq" />
        </section>
      </div>
    </main>
  );
}
