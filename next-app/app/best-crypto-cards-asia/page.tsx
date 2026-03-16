import { getAllCards } from '@/lib/data';
import { isAsiaCard } from '@/lib/filters';
import { generateCategoryMetaDescription } from '@/lib/meta';
import { generateCategoryItemListSchema, generateCategoryWebPageSchema } from '@/lib/schemas';
import CategoryCardsGrid from '@/components/CategoryCardsGrid';
import { Metadata } from 'next';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const allCards = await getAllCards();
  const cards = allCards.filter(isAsiaCard);
  const title = 'Best Crypto Cards in Asia 2026 — Japan, Singapore, India & More | Sweepbase';
  const description = generateCategoryMetaDescription('best-crypto-cards-asia', cards.length);
  return {
    title,
    description,
    alternates: { canonical: 'https://sweepbase.com/best-crypto-cards-asia' },
    openGraph: {
      title,
      description,
      url: 'https://sweepbase.com/best-crypto-cards-asia',
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

export default async function BestCryptoCardsAsia() {
  const allCards = await getAllCards();
  const cards = allCards.filter(isAsiaCard);

  const webPageJsonLd = generateCategoryWebPageSchema(
    'Best Crypto Cards in Asia 2026',
    'https://sweepbase.com/best-crypto-cards-asia',
    [
      { name: 'Home', item: 'https://sweepbase.com' },
      { name: 'Best Crypto Cards in Asia', item: 'https://sweepbase.com/best-crypto-cards-asia' },
    ],
  );

  const itemListJsonLd = generateCategoryItemListSchema(
    cards,
    'https://sweepbase.com/best-crypto-cards-asia',
    'Best Crypto Cards in Asia 2026',
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
          <span className="breadcrumb-current">Best Crypto Cards in Asia</span>
        </nav>

        <section className="category-hero">
          <h1 className="category-h1">Best Crypto Debit &amp; Credit Cards in Asia</h1>
          <p className="category-intro">
            Asia is home to some of the world&apos;s most active crypto markets, with Japan, South Korea,
            Singapore, Hong Kong, and India collectively accounting for a significant share of global
            digital asset trading volume. Sweepbase has identified{' '}
            <strong>{cards.length} crypto cards</strong> available to residents of Asian countries —
            spanning Visa and Mastercard products issued by both regional and global providers with
            KYC processes tailored for APAC jurisdictions. Singapore-based users benefit from MAS
            regulatory oversight, while Japanese residents can access FSA-licensed providers offering
            yen-denominated settlement. Indian users should look for cards that support UPI and IMPS
            top-ups, and South Korean users may find won-denominated stablecoin options attractive.
            Many Asia-available cards offer Bitcoin, ETH, or stablecoin top-ups with real-time
            conversion at the point of sale. Cashback programmes on cards available in Asia typically
            offer 1–5% in BTC, platform tokens, or native rewards. Compare FX fees, KYC
            requirements, supported cryptocurrencies, and ATM withdrawal limits below to find
            the best crypto card for your country in Asia.
          </p>
        </section>

        <div className="category-also-see">
          <span className="category-also-see__label">Also see:</span>
          <a href="/best-crypto-cards-europe" className="category-also-see__chip">
            <i className="fa-solid fa-earth-europe" aria-hidden="true"></i>
            Best Cards in Europe
          </a>
          <a href="/best-crypto-cards-usa" className="category-also-see__chip">
            <i className="fa-solid fa-flag-usa" aria-hidden="true"></i>
            Best Cards in the USA
          </a>
          <a href="/best-crypto-cards-australia" className="category-also-see__chip">
            <i className="fa-solid fa-earth-oceania" aria-hidden="true"></i>
            Best Cards in Australia
          </a>
        </div>
      </div>

      <CategoryCardsGrid cards={cards} />
    </main>
  );
}
