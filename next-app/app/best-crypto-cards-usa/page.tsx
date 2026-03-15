import { getAllCards } from '@/lib/data';
import { isUSACard } from '@/lib/filters';
import CategoryCardsGrid from '@/components/CategoryCardsGrid';
import { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Best Crypto Cards in the USA 2026 — Top Picks | Sweepbase',
  description:
    'Compare the best crypto debit and credit cards available to US residents in 2026. Filter by Bitcoin, USDC, Visa/Mastercard, cashback, and more. Updated monthly.',
  alternates: {
    canonical: 'https://sweepbase.com/best-crypto-cards-usa',
  },
  openGraph: {
    title: 'Best Crypto Cards in the USA 2026 — Top Picks | Sweepbase',
    description:
      'Compare the best crypto debit and credit cards available to US residents in 2026. Filter by Bitcoin, USDC, Visa/Mastercard, cashback, and more.',
    url: 'https://sweepbase.com/best-crypto-cards-usa',
    type: 'website',
    images: [{ url: 'https://sweepbase.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Crypto Cards in the USA 2026 — Top Picks | Sweepbase',
    description:
      'Compare the best crypto debit and credit cards available to US residents in 2026.',
    images: ['https://sweepbase.com/og-image.png'],
  },
};

export default async function BestCryptoCardsUSA() {
  const allCards = await getAllCards();
  const cards = allCards.filter(isUSACard);

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sweepbase.com' },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Best Crypto Cards in the USA',
        item: 'https://sweepbase.com/best-crypto-cards-usa',
      },
    ],
  };

  return (
    <main className="category-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="container">
        <nav className="breadcrumb-nav">
          <a href="/">Home</a>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Best Crypto Cards in the USA</span>
        </nav>

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
      </div>

      <CategoryCardsGrid cards={cards} />
    </main>
  );
}
