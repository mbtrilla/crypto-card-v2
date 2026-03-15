import { getAllCards } from '@/lib/data';
import { isMastercardCard } from '@/lib/filters';
import CategoryCardsGrid from '@/components/CategoryCardsGrid';
import { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Best Mastercard Crypto Cards 2026 | Sweepbase',
  description:
    'Compare every Mastercard crypto debit card available in 2026. Find the best Bitcoin and stablecoin Mastercard cards by cashback rate, fees, and country availability.',
  alternates: {
    canonical: 'https://sweepbase.com/mastercard-crypto-cards',
  },
  openGraph: {
    title: 'Best Mastercard Crypto Cards 2026 | Sweepbase',
    description:
      'Compare every Mastercard crypto debit card available in 2026. Find the best Bitcoin and stablecoin Mastercard cards by cashback rate, fees, and country availability.',
    url: 'https://sweepbase.com/mastercard-crypto-cards',
    type: 'website',
    images: [{ url: 'https://sweepbase.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Mastercard Crypto Cards 2026 | Sweepbase',
    description:
      'Compare every Mastercard crypto debit card available in 2026.',
    images: ['https://sweepbase.com/og-image.png'],
  },
  robots: { index: true, follow: true },
};

export default async function MastercardCryptoCards() {
  const allCards = await getAllCards();
  const cards = allCards.filter(isMastercardCard);

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sweepbase.com' },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Mastercard Crypto Cards',
        item: 'https://sweepbase.com/mastercard-crypto-cards',
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
          <span className="breadcrumb-current">Mastercard Crypto Cards</span>
        </nav>

        <section className="category-hero">
          <h1 className="category-h1">Best Mastercard Crypto Debit Cards</h1>
          <p className="category-intro">
            Mastercard crypto cards are accepted at over 100 million locations worldwide and are the
            network of choice for many crypto card issuers targeting European and UK users.
            Sweepbase has identified <strong>{cards.length} Mastercard crypto cards</strong> in our
            database, covering both physical and virtual card options with a range of custody
            models, cashback programs, and supported top-up cryptocurrencies. Mastercard&apos;s
            strong presence in the EEA and UK makes its crypto card products particularly attractive
            for European residents, with many issuers holding FCA or Bank of Lithuania licences for
            regulatory compliance. Several Mastercard crypto cards offer zero-fee issuance and no
            annual charge, making them cost-effective for users who want to bridge their digital
            assets with everyday spending. Cashback is typically earned in native tokens, Bitcoin,
            or cash, with rates between 0.5% and 5% depending on tier. Compare issuance fees, FX
            rates, ATM limits, and reward structures across all Mastercard crypto options below to
            find the best card for your region and spending habits.
          </p>
        </section>
      </div>

      <CategoryCardsGrid cards={cards} />
    </main>
  );
}
