import { getAllCards } from '@/lib/data';
import { isSelfCustodyCard } from '@/lib/filters';
import CategoryCardsGrid from '@/components/CategoryCardsGrid';
import { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Best Self-Custody Crypto Cards 2026 — No KYC Options | Sweepbase',
  description:
    'Compare the best self-custody and non-custodial crypto debit cards in 2026. Keep control of your private keys while spending Bitcoin and DeFi assets at 150M+ merchants.',
  alternates: {
    canonical: 'https://sweepbase.com/self-custody-crypto-cards',
  },
  openGraph: {
    title: 'Best Self-Custody Crypto Cards 2026 — No KYC Options | Sweepbase',
    description:
      'Compare the best self-custody and non-custodial crypto debit cards in 2026. Keep control of your private keys while spending Bitcoin and DeFi assets.',
    url: 'https://sweepbase.com/self-custody-crypto-cards',
    type: 'website',
    images: [{ url: 'https://sweepbase.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Self-Custody Crypto Cards 2026 — No KYC Options | Sweepbase',
    description:
      'Compare the best self-custody and non-custodial crypto debit cards in 2026.',
    images: ['https://sweepbase.com/og-image.png'],
  },
};

export default async function SelfCustodyCryptoCards() {
  const allCards = await getAllCards();
  const cards = allCards.filter(isSelfCustodyCard);

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sweepbase.com' },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Self-Custody Crypto Cards',
        item: 'https://sweepbase.com/self-custody-crypto-cards',
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
          <span className="breadcrumb-current">Self-Custody Crypto Cards</span>
        </nav>

        <section className="category-hero">
          <h1 className="category-h1">Best Self-Custody Crypto Cards</h1>
          <p className="category-intro">
            Self-custody crypto cards let you maintain full control of your private keys right up
            until the moment you make a purchase — unlike custodial exchange cards where the
            platform holds your funds. Sweepbase has identified{' '}
            <strong>{cards.length} self-custody crypto cards</strong>, making them ideal for DeFi
            enthusiasts, privacy-conscious users, and anyone who lives by the maxim &ldquo;not your
            keys, not your coins.&rdquo; These non-custodial cards typically connect directly to
            your Web3 wallet — such as MetaMask, Ledger, or a platform-native wallet — and convert
            crypto to fiat in real time at the point of sale without requiring a centralised
            exchange to hold your balance. Because these cards operate without a custodial
            intermediary, KYC requirements vary widely: some require full identity verification
            while others offer minimal-KYC or even zero-KYC onboarding. Many self-custody cards
            also support staking or yield features on idle balances. Compare supported blockchains,
            cashback rates, FX fees, and ATM limits below to find the best non-custodial crypto
            card for your security model.
          </p>
        </section>
      </div>

      <CategoryCardsGrid cards={cards} />
    </main>
  );
}
