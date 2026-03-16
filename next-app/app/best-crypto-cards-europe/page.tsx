import { getAllCards } from '@/lib/data';
import { isEuropeCard } from '@/lib/filters';
import { generateCategoryMetaDescription } from '@/lib/meta';
import { generateCategoryItemListSchema, generateCategoryWebPageSchema } from '@/lib/schemas';
import CategoryCardsGrid from '@/components/CategoryCardsGrid';
import { Metadata } from 'next';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const allCards = await getAllCards();
  const cards = allCards.filter(isEuropeCard);
  const title = 'Best Crypto Cards in Europe 2026 — Top Picks | Sweepbase';
  const description = generateCategoryMetaDescription('best-crypto-cards-europe', cards.length);
  return {
    title,
    description,
    alternates: { canonical: 'https://sweepbase.com/best-crypto-cards-europe' },
    openGraph: {
      title,
      description,
      url: 'https://sweepbase.com/best-crypto-cards-europe',
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

export default async function BestCryptoCardsEurope() {
  const allCards = await getAllCards();
  const cards = allCards.filter(isEuropeCard);

  const webPageJsonLd = generateCategoryWebPageSchema(
    'Best Crypto Cards in Europe 2026',
    'https://sweepbase.com/best-crypto-cards-europe',
    [
      { name: 'Home', item: 'https://sweepbase.com' },
      { name: 'Best Crypto Cards in Europe', item: 'https://sweepbase.com/best-crypto-cards-europe' },
    ],
  );

  const itemListJsonLd = generateCategoryItemListSchema(
    cards,
    'https://sweepbase.com/best-crypto-cards-europe',
    'Best Crypto Cards in Europe 2026',
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
          <span className="breadcrumb-current">Best Crypto Cards in Europe</span>
        </nav>

        <section className="category-hero">
          <h1 className="category-h1">Best Crypto Debit &amp; Credit Cards for European Users</h1>
          <p className="category-intro">
            European crypto card users benefit from robust consumer protections under the EU&apos;s
            Payment Services Directive and access to SEPA instant transfers, making crypto-to-EUR
            top-ups faster and cheaper than almost anywhere else in the world. Sweepbase has
            identified <strong>{cards.length} crypto cards</strong> available across EEA and EU
            member states — from UK-based Mastercard products issued under FCA regulation to
            pan-European Visa cards backed by licensed e-money institutions in Lithuania, Malta, and
            beyond. Whether you live in Germany, France, Spain, the Netherlands, or anywhere in the
            European Economic Area, you&apos;ll find suitable options below. European users should
            pay close attention to FX fees (especially important for travel outside the eurozone),
            the card issuer&apos;s regulatory licence, and which spending tier unlocks the best
            cashback rate. Many European crypto cards offer rewards in platform-native tokens —
            such as PLU, CRO, or BAXA — that can be staked for higher earning rates. Use the
            compare tool to find the best crypto card for your country before applying.
          </p>
        </section>

        <div className="category-also-see">
          <span className="category-also-see__label">Also see:</span>
          <a href="/best-crypto-cards-usa" className="category-also-see__chip">
            <i className="fa-solid fa-flag-usa" aria-hidden="true"></i>
            Best Cards in the USA
          </a>
          <a href="/best-crypto-cards-asia" className="category-also-see__chip">
            <i className="fa-solid fa-earth-asia" aria-hidden="true"></i>
            Best Cards in Asia
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
