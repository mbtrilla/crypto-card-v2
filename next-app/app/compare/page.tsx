import React from 'react';
import { Metadata } from 'next';
import { getAllCards } from '@/lib/data';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/components/Breadcrumb';

export const revalidate = 3600;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { ids?: string };
}): Promise<Metadata> {
  const hasIds = Boolean(searchParams.ids);
  return {
    title: 'Compare Crypto Cards Side by Side 2026 | Sweepbase',
    description:
      'Compare up to 4 crypto debit and credit cards side by side. Evaluate fees, cashback rates, supported networks, and regional availability in one view.',
    alternates: { canonical: 'https://sweepbase.com/compare' },
    openGraph: {
      title: 'Compare Crypto Cards Side by Side 2026 | Sweepbase',
      description:
        'Compare up to 4 crypto debit and credit cards side by side. Evaluate fees, cashback rates, supported networks, and regional availability in one view.',
      url: 'https://sweepbase.com/compare',
      type: 'website',
      images: [{ url: 'https://sweepbase.com/og-image.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Compare Crypto Cards Side by Side 2026 | Sweepbase',
      description:
        'Compare up to 4 crypto debit and credit cards side by side. Evaluate fees, cashback rates, supported networks, and regional availability in one view.',
      images: ['https://sweepbase.com/og-image.png'],
    },
    // noindex comparison URLs with query params to avoid thin/duplicate content
    robots: hasIds ? { index: false, follow: true } : { index: true, follow: true },
  };
}

const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Compare Crypto Cards Side by Side',
  url: 'https://sweepbase.com/compare',
  description:
    'Compare up to 4 crypto debit and credit cards side by side. Evaluate fees, cashback rates, supported networks, and regional availability.',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sweepbase.com' },
      { '@type': 'ListItem', position: 2, name: 'Compare', item: 'https://sweepbase.com/compare' },
    ],
  },
};

export default async function ComparePage({
  searchParams,
}: {
  searchParams: { ids?: string };
}) {
  const allCards = await getAllCards();
  const slugs = (searchParams.ids || '').split(',').filter(Boolean);
  const selectedCards = slugs.map(slug => allCards.find(c => c.slug === slug)).filter(Boolean) as any[];

  const comparisonRows = [
    { label: 'Card Type',              key: 'cardType' },
    { label: 'Custody',                key: 'custody' },
    { label: 'Network',                key: 'network' },
    { label: 'Issuance Fee',           key: 'issuanceFee' },
    { label: 'Annual Fee',             key: 'annualFee' },
    { label: 'FX Fee',                 key: 'fxFee' },
    { label: 'Cashback',               key: 'cashback' },
    { label: 'Daily Spend Limit',      key: 'spendLimit' },
    { label: 'ATM Withdrawal Limit',   key: 'atmLimit' },
    { label: 'Top-up Methods',         key: 'topUpMethods' },
    { label: 'Regions',                key: 'regions' },
  ];

  return (
    <main className="compare-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />

      <div className="container" style={{ paddingTop: '40px' }}>
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'Compare Cards' },
        ]} />

        {/* Static SEO content — always rendered regardless of query params */}
        <section className="category-hero" style={{ marginBottom: '32px' }}>
          <h1 className="category-h1">Compare Crypto Cards Side by Side</h1>
          <p className="category-intro">
            Select up to 4 cards from our database to compare fees, cashback rates, supported
            networks, and regional availability in one view. Use the compare tool on any card
            listing page to add cards, then return here to evaluate them side by side.
          </p>
        </section>
      </div>

      {/* Dynamic comparison content */}
      {selectedCards.length === 0 ? (
        <div className="container" style={{ padding: '40px 0 100px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
            No cards selected yet. Browse our listings and use the compare button to add cards.
          </p>
          <Link href="/" className="btn btn-primary">
            <i className="fa-solid fa-arrow-left" style={{ marginRight: '8px' }}></i>
            Browse All Cards
          </Link>
        </div>
      ) : (
        <div className="container" style={{ paddingBottom: '80px' }}>
          <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Link href="/" className="btn btn-outline">
              <i className="fa-solid fa-arrow-left"></i> Back
            </Link>
          </div>

          <div className="compare-table-wrapper">
            <table className="compare-table">
              <thead>
                <tr>
                  <th scope="col" className="sticky-col">Features</th>
                  {selectedCards.map(card => (
                    <th scope="col" key={card.slug}>
                      <div className="compare-card-header">
                        <Image src={card.logo} alt={card.name} width={80} height={50} priority />
                        <h3>{card.name}</h3>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map(row => (
                  <tr key={row.key}>
                    <td className="sticky-col">{row.label}</td>
                    {selectedCards.map(card => (
                      <td key={`${card.slug}-${row.key}`}>{(card as any)[row.key]}</td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td className="sticky-col"></td>
                  {selectedCards.map(card => (
                    <td key={`${card.slug}-cta`}>
                      <button className="get-card-btn" style={{ fontSize: '0.9rem' }}>Get {card.name}</button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
