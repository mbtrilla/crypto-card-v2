import { getAllCards, toCardListItem } from '@/lib/data';
import Breadcrumb from '@/components/Breadcrumb';
import CardSkeleton from '@/components/CardSkeleton';
import dynamic from 'next/dynamic';
import { Metadata } from 'next';

// CategoryCardsGrid holds client-side compare/load-more state — deferred so
// the static hero + breadcrumb HTML renders before the interactive chunk loads.
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

export const metadata: Metadata = {
  title: 'All Crypto Cards — Browse 114 Cards | Sweepbase',
  description:
    'Browse the complete Sweepbase database of crypto debit and credit cards. Compare all 114 Bitcoin, USDC, Visa, and Mastercard crypto cards by fees, cashback, and availability.',
  alternates: {
    canonical: 'https://sweepbase.com/cards',
  },
  openGraph: {
    title: 'All Crypto Cards — Browse 114 Cards | Sweepbase',
    description:
      'Browse the complete Sweepbase database of crypto debit and credit cards. Compare all 114 Bitcoin, USDC, Visa, and Mastercard crypto cards by fees, cashback, and availability.',
    url: 'https://sweepbase.com/cards',
    type: 'website',
    images: [{ url: 'https://sweepbase.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Crypto Cards — Browse 114 Cards | Sweepbase',
    description:
      'Browse the complete Sweepbase database of crypto debit and credit cards.',
    images: ['https://sweepbase.com/og-image.png'],
  },
  robots: { index: true, follow: true },
};

export default async function AllCardsPage() {
  const cards = await getAllCards();

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sweepbase.com' },
      { '@type': 'ListItem', position: 2, name: 'All Cards', item: 'https://sweepbase.com/cards' },
    ],
  };

  return (
    <main className="category-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="container">
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'All Cards' },
        ]} />

        <section className="category-hero">
          <h1 className="category-h1">All Crypto Debit &amp; Credit Cards</h1>
          <p className="category-updated">Last updated: <time dateTime="2026-03-18">March 18, 2026</time></p>
          <p className="category-intro">
            The complete Sweepbase database — <strong>{cards.length} crypto cards</strong> from
            issuers worldwide, covering Visa and Mastercard products that let you spend Bitcoin,
            Ethereum, USDC, and hundreds of other digital assets at over 150 million merchants
            globally. Use the compare tool to evaluate up to four cards side by side, or visit a
            card&apos;s detail page for a full breakdown of fees, cashback rates, supported
            networks, and regional availability.
          </p>
        </section>
      </div>

      <CategoryCardsGrid cards={cards.map(toCardListItem)} />
    </main>
  );
}
