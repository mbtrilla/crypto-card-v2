import { getAllCards } from '@/lib/data';
import { isUSACard } from '@/lib/filters';
import { generateCategoryMetaDescription } from '@/lib/meta';
import { generateCategoryItemListSchema, generateCategoryWebPageSchema } from '@/lib/schemas';
import CategoryCardsGrid from '@/components/CategoryCardsGrid';
import Breadcrumb from '@/components/Breadcrumb';
import { Metadata } from 'next';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const allCards = await getAllCards();
  const cards = allCards.filter(isUSACard);
  const title = 'Best Crypto Cards in the USA 2026 — Top Picks | Sweepbase';
  const description = generateCategoryMetaDescription('best-crypto-cards-usa', cards.length);
  return {
    title,
    description,
    alternates: { canonical: 'https://sweepbase.com/best-crypto-cards-usa' },
    openGraph: {
      title,
      description,
      url: 'https://sweepbase.com/best-crypto-cards-usa',
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
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'Best Crypto Cards in the USA' },
        ]} />

        <section className="category-hero">
          <h1 className="category-h1">Best Crypto Debit &amp; Credit Cards for US Users</h1>
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

        <div className="category-also-see">
          <span className="category-also-see__label">Also see:</span>
          <a href="/best-crypto-cards-europe" className="category-also-see__chip">
            <i className="fa-solid fa-earth-europe" aria-hidden="true"></i>
            Best Cards in Europe
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
