import { getAllCards, toCardListItem } from '@/lib/data';
import { isUSACard } from '@/lib/filters';
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
    q: 'Are crypto debit cards legal in the United States?',
    a: 'Yes. Crypto debit cards are legal in the US when issued by a licensed money-services business or bank. Most cards are issued under FinCEN registration and state money-transmitter licences. Some issuers voluntarily restrict certain states — notably New York — due to the BitLicense requirement, so always verify state-by-state availability before applying.',
  },
  {
    q: 'Which states have the most crypto card options?',
    a: 'California, Texas, Florida, and most other states have broad coverage. New York and Hawaii have the fewest options due to stricter licensing requirements. Cards like the Coinbase Card, Crypto.com Visa, and Nexo Card cover the majority of US states.',
  },
  {
    q: 'Do I need to pay taxes on crypto cashback earned in the US?',
    a: 'The IRS treats crypto rewards as ordinary income at the fair market value on the date received, similar to cash-back rebates being considered a purchase discount. You should report crypto cashback on your tax return; consult a tax professional for your specific situation.',
  },
  {
    q: 'Can I use a crypto card with Apple Pay or Google Pay in the US?',
    a: 'Many US-issued crypto cards support Apple Pay and Google Pay for tap-to-pay at NFC-enabled terminals. Check the individual card listing for wallet compatibility before applying — not all physical or virtual cards support mobile wallets.',
  },
  {
    q: 'What is the best crypto card for US residents in 2026?',
    a: 'The best card depends on your priorities. For highest cashback, look at cards with native-token staking tiers. For simplicity and wide state coverage, the Coinbase Card and Crypto.com Visa are popular choices. Use the compare tool on this page to filter by cashback rate, fee structure, and state availability.',
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const allCards = await getAllCards();
  const cards = allCards.filter(isUSACard);
  const title = 'Best Crypto Cards in the USA 2026 — Top Picks | Sweepbase';
  const description = generateCategoryMetaDescription('best-crypto-cards-usa', cards.length);
  const ogImage = `https://sweepbase.com/api/og?title=${encodeURIComponent('Best Crypto Cards in the USA 2026')}&count=${cards.length}&subtitle=Regional+Guide`;
  return {
    title,
    description,
    alternates: { canonical: 'https://sweepbase.com/best-crypto-cards-usa' },
    openGraph: {
      title,
      description,
      url: 'https://sweepbase.com/best-crypto-cards-usa',
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

export default async function BestCryptoCardsUSA() {
  const allCards = await getAllCards();
  const cards = allCards.filter(isUSACard);

  const webPageJsonLd = generateCategoryWebPageSchema(
    'Best Crypto Cards in the USA 2026',
    'https://sweepbase.com/best-crypto-cards-usa',
    [
      { name: 'Home', item: 'https://sweepbase.com' },
      { name: 'Best Crypto Cards in the USA', item: 'https://sweepbase.com/best-crypto-cards-usa' },
    ],
  );

  const itemListJsonLd = generateCategoryItemListSchema(
    cards,
    'https://sweepbase.com/best-crypto-cards-usa',
    'Best Crypto Cards in the USA 2026',
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
          { label: 'Best Crypto Cards in the USA' },
        ]} />

        <section className="category-hero">
          <h1 className="category-h1">Best Crypto Debit &amp; Credit Cards for US Users</h1>
          <p className="category-updated">Last updated: <time dateTime="2026-03-18">March 18, 2026</time></p>
          <p className="category-intro">
            The United States is one of the largest markets for crypto debit and credit cards, with
            dozens of issuers now offering Visa and Mastercard products that convert Bitcoin,
            Ethereum, USDC, and other digital assets at the point of sale. Sweepbase has identified{' '}
            <strong>{cards.length} crypto cards</strong> currently available to US residents —
            covering both cards issued within the US and globally-available cards that accept
            customers in most American states. Key factors for US users include state-by-state
            availability (some cards restrict certain US states), ACH and wire top-up options,
            FDIC-pass-through deposit protection, and compatibility with Apple Pay and Google Pay
            for contactless spending. Cards range from fully custodial exchange products with high
            cashback in platform tokens to self-custody options that preserve control of your
            private keys until purchase. Use the compare feature below to evaluate issuance fees,
            annual costs, ATM withdrawal limits, and reward structures side by side before applying
            for the best Bitcoin or crypto card for your US spending needs.
          </p>
        </section>

        <section className="category-why">
          <h2 className="category-why__title">Why These Cards?</h2>
          <ul className="category-why__list">
            <li className="category-why__item">
              <strong>State compliance verified</strong> — every card listed covers at least the majority of US states; state restrictions are noted in each card&apos;s detail page.
            </li>
            <li className="category-why__item">
              <strong>US-friendly funding</strong> — all listed cards support ACH bank transfer, US debit card top-up, or wire funding so you can load dollars without extra friction.
            </li>
            <li className="category-why__item">
              <strong>Dollar liquidity</strong> — cards settle in USD or USDC, minimising FX slippage when spending domestically and keeping conversions transparent.
            </li>
          </ul>
        </section>

        <div className="category-also-see">
          <span className="category-also-see__label">Also see:</span>
          <a href="/best-crypto-cards-europe" className="category-also-see__chip">
            <i className="fa-solid fa-earth-europe" aria-hidden="true"></i>
            Best Cards in Europe
          </a>
          <a href="/best-crypto-cards-uk" className="category-also-see__chip">
            <i className="fa-solid fa-sterling-sign" aria-hidden="true"></i>
            Best Cards in the UK
          </a>
          <a href="/best-crypto-cards-canada" className="category-also-see__chip">
            <i className="fa-solid fa-leaf" aria-hidden="true"></i>
            Best Cards in Canada
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
          <FAQAccordion items={FAQ_ITEMS} ns="usa-faq" />
        </section>
      </div>
    </main>
  );
}
