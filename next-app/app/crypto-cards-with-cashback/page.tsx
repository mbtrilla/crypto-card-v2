import { getAllCards, toCardListItem } from '@/lib/data';
import { hasCashback } from '@/lib/filters';
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
    q: 'How does crypto cashback work on a debit card?',
    a: 'When you make a purchase with a crypto cashback card, a percentage of the transaction value is deposited to your account as cryptocurrency — typically within 24–48 hours. The cashback is usually credited in the issuer\'s native token, Bitcoin, or a stablecoin. Some cards offer instant cashback; others batch rewards weekly or monthly.',
  },
  {
    q: 'Is crypto cashback taxable income?',
    a: 'In most jurisdictions, crypto cashback is treated as ordinary income at the fair market value on the date received — similar to cash rebates. In the US, the IRS guidance treats crypto rewards as income; in the UK, HMRC takes a similar position. You should track the value of each cashback credit and report it appropriately. Consult a tax professional for your specific situation.',
  },
  {
    q: 'Which crypto card offers the highest cashback rate in 2026?',
    a: 'Crypto.com\'s Obsidian tier offers up to 8% CRO cashback but requires staking 400,000 CRO. Plutus offers up to 9% PLU rewards for subscribers. For no-staking flat cashback, Fold Card and Wirex offer competitive BTC and native token rates. The best rate depends on your willingness to stake tokens and your tolerance for reward-token volatility.',
  },
  {
    q: 'What is the difference between BTC cashback and token cashback?',
    a: 'BTC cashback rewards you in Bitcoin — a liquid, widely traded asset with deep markets. Token cashback rewards you in the issuer\'s native token (e.g., CRO, NEXO, PLU), which often offers higher headline rates but carries additional price risk and liquidity risk. If the token loses value, the effective cashback rate drops accordingly.',
  },
  {
    q: 'Do I need to stake tokens to earn cashback on a crypto card?',
    a: 'Not always. Many cards offer a base cashback tier (typically 0.5–2%) with no staking requirement. Higher tiers — offering 3–8% — usually require locking up the issuer\'s native token for a fixed period (often 6 months). If you don\'t want to lock up capital, filter by "no staking required" cards to find flat-rate cashback options.',
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const allCards = await getAllCards();
  const cards = allCards.filter(hasCashback);
  const title = 'Best Crypto Cards With Cashback 2026 | Sweepbase';
  const description = generateCategoryMetaDescription('crypto-cards-with-cashback', cards.length);
  return {
    title,
    description,
    alternates: { canonical: 'https://sweepbase.com/crypto-cards-with-cashback' },
    openGraph: {
      title,
      description,
      url: 'https://sweepbase.com/crypto-cards-with-cashback',
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

export default async function CryptoCardsWithCashback() {
  const allCards = await getAllCards();
  const cards = allCards.filter(hasCashback);

  const webPageJsonLd = generateCategoryWebPageSchema(
    'Best Crypto Cards With Cashback 2026',
    'https://sweepbase.com/crypto-cards-with-cashback',
    [
      { name: 'Home', item: 'https://sweepbase.com' },
      { name: 'Crypto Cards With Cashback', item: 'https://sweepbase.com/crypto-cards-with-cashback' },
    ],
  );

  const itemListJsonLd = generateCategoryItemListSchema(
    cards,
    'https://sweepbase.com/crypto-cards-with-cashback',
    'Best Crypto Cards With Cashback 2026',
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
          { label: 'Crypto Cards With Cashback' },
        ]} />

        <section className="category-hero">
          <h1 className="category-h1">Best Crypto Cards With Cashback Rewards</h1>
          <p className="category-intro">
            Crypto cashback cards let you earn digital asset rewards on every purchase — whether
            that means Bitcoin, stablecoins, or platform-native tokens deposited directly to your
            wallet after each transaction. Sweepbase has identified{' '}
            <strong>{cards.length} crypto cards</strong> that offer meaningful cashback rewards,
            from entry-level cards with flat 1% BTC back to premium staking-tier products returning
            5–8% in exchange tokens. Cashback structures vary widely: some cards offer a flat
            percentage on all spending with no minimums, while others require staking a
            platform&apos;s native token to unlock higher tiers — for example, holding CRO for
            Crypto.com or locking NEXO tokens. Several cards also offer bonus cashback at specific
            merchant categories such as travel, dining, or popular subscriptions like Netflix and
            Spotify. When comparing crypto cashback cards, consider not just the headline rate but
            the underlying token&apos;s liquidity and price stability — earning 5% in a highly
            volatile token may be worth less in practice than 1.5% in Bitcoin or USDC. Use the
            compare tool below to evaluate all cashback rates, staking requirements, and fee
            structures side by side.
          </p>
        </section>

        <section className="category-why">
          <h2 className="category-why__title">Why These Cards?</h2>
          <ul className="category-why__list">
            <li className="category-why__item">
              <strong>Verified cashback rates</strong> — every card in this list is confirmed to offer at least 0.5% meaningful reward on general spending; cards with cashback limited to a single merchant category are excluded.
            </li>
            <li className="category-why__item">
              <strong>Reward currency transparency</strong> — we flag whether cashback is paid in Bitcoin, stablecoins, or volatile native tokens so you can evaluate the real after-volatility value of each reward programme.
            </li>
            <li className="category-why__item">
              <strong>Staking requirements disclosed</strong> — lock-up periods, minimum staking amounts, and tier thresholds are clearly documented for every card so you can weigh the opportunity cost of staking before applying.
            </li>
          </ul>
        </section>
      </div>

      <CategoryCardsGrid cards={cards.map(toCardListItem)} />

      <div className="container">
        <section className="category-faq">
          <h2 className="category-faq__title">Frequently Asked Questions</h2>
          <FAQAccordion items={FAQ_ITEMS} ns="cashback-faq" />
        </section>
      </div>
    </main>
  );
}
