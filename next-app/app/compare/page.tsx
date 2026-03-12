import React from 'react';
import { getAllCards } from '@/lib/data';
import Link from 'next/link';

export const revalidate = 3600;

export default async function ComparePage({
  searchParams,
}: {
  searchParams: { ids?: string };
}) {
  const allCards = await getAllCards();
  const slugs = (searchParams.ids || '').split(',').filter(Boolean);
  const selectedCards = slugs.map(slug => allCards.find(c => c.slug === slug)).filter(Boolean) as any[];

  if (selectedCards.length === 0) {
    return (
      <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
        <h2>No cards selected for comparison</h2>
        <Link href="/" className="btn btn-primary" style={{ marginTop: '20px' }}>Back to Cards</Link>
      </div>
    );
  }

  const comparisonRows = [
    { label: 'Card Type', key: 'cardType' },
    { label: 'Custody', key: 'custody' },
    { label: 'Network', key: 'network' },
    { label: 'Issuance Fee', key: 'issuanceFee' },
    { label: 'Annual Fee', key: 'annualFee' },
    { label: 'FX Fee', key: 'fxFee' },
    { label: 'Cashback', key: 'cashback' },
    { label: 'Daily Spend Limit', key: 'spendLimit' },
    { label: 'ATM Withdrawal Limit', key: 'atmLimit' },
    { label: 'Top-up Methods', key: 'topUpMethods' },
    { label: 'Regions', key: 'regions' },
  ];

  return (
    <div className="container" style={{ padding: '60px 0' }}>
      <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 className="hero-title" style={{ margin: 0 }}>Card <span className="text-gradient">Comparison</span></h1>
        <Link href="/" className="btn btn-outline"><i className="fa-solid fa-arrow-left"></i> Back</Link>
      </div>

      <div className="compare-table-wrapper">
        <table className="compare-table">
          <thead>
            <tr>
              <th className="sticky-col">Features</th>
              {selectedCards.map(card => (
                <th key={card.slug}>
                  <div className="compare-card-header">
                    <img src={card.logo} alt={card.name} />
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
                  <button className="get-card-btn" style={{ fontSize: '0.9rem' }}>Get Card</button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
