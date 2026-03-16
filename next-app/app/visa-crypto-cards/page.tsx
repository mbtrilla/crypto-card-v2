import { getAllCards } from '@/lib/data';
import { isVisaCard } from '@/lib/filters';
import { generateCategoryMetaDescription } from '@/lib/meta';
import { generateCategoryItemListSchema, generateCategoryWebPageSchema } from '@/lib/schemas';
import CategoryCardsGrid from '@/components/CategoryCardsGrid';
import { Metadata } from 'next';

export const revalidate = 3600;

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
          <span className="breadcrumb-current">Visa Crypto Cards</span>
        </nav>

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
            ranging from 0.5% to 8% depending on staking requirements and spending tier. Some
            cards — such as those issued by Crypto.com and Nexo — require locking up native tokens
            to access higher reward tiers. Use the compare tool below to evaluate issuance fees,
            annual charges, ATM withdrawal limits, FX rates, and cashback structures across all
            available Visa crypto cards before choosing the right card for your needs.
          </p>
        </section>
      </div>

      <CategoryCardsGrid cards={cards} />
    </main>
  );
}
