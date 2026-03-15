import { getAllCards } from '@/lib/data';
import { isEuropeCard } from '@/lib/filters';
import CategoryCardsGrid from '@/components/CategoryCardsGrid';
import { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Best Crypto Cards in Europe 2026 — Top Picks | Sweepbase',
  description:
    'Compare the best crypto debit and credit cards available in Europe and the EEA in 2026. Visa and Mastercard options for UK, Germany, France, Spain, and 30+ countries.',
  alternates: {
    canonical: 'https://sweepbase.com/best-crypto-cards-europe',
  },
  openGraph: {
    title: 'Best Crypto Cards in Europe 2026 — Top Picks | Sweepbase',
    description:
      'Compare the best crypto debit and credit cards available in Europe and the EEA in 2026. Visa and Mastercard options for UK, Germany, France, Spain, and 30+ countries.',
    url: 'https://sweepbase.com/best-crypto-cards-europe',
    type: 'website',
    images: [{ url: 'https://sweepbase.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Crypto Cards in Europe 2026 — Top Picks | Sweepbase',
    description:
      'Compare the best crypto debit and credit cards available in Europe and the EEA in 2026.',
    images: ['https://sweepbase.com/og-image.png'],
  },
};

export default async function BestCryptoCardsEurope() {
  const allCards = await getAllCards();
  const cards = allCards.filter(isEuropeCard);

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sweepbase.com' },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Best Crypto Cards in Europe',
        item: 'https://sweepbase.com/best-crypto-cards-europe',
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
      </div>

      <CategoryCardsGrid cards={cards} />
    </main>
  );
}
