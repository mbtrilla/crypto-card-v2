import { getAllCards } from '@/lib/data';
import { hasCashback } from '@/lib/filters';
import { generateCategoryMetaDescription } from '@/lib/meta';
import { generateCategoryItemListSchema, generateCategoryWebPageSchema } from '@/lib/schemas';
import CategoryCardsGrid from '@/components/CategoryCardsGrid';
import { Metadata } from 'next';

export const revalidate = 3600;

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

      <div className="container">
        <nav className="breadcrumb-nav" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Crypto Cards With Cashback</span>
        </nav>

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
      </div>

      <CategoryCardsGrid cards={cards} />
    </main>
  );
}
