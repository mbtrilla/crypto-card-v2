'use client';

import { useState } from 'react';
import Link from 'next/link';

interface CardScenario {
  label: string;
  annualFee: number;
  fxFeePercent: number;
  spreadPercent: number;
  cashbackPercent: number;
}

const PRESETS: CardScenario[] = [
  { label: 'Free card, low cashback', annualFee: 0, fxFeePercent: 1.5, spreadPercent: 0.5, cashbackPercent: 0.5 },
  { label: 'Mid-tier card', annualFee: 60, fxFeePercent: 0.5, spreadPercent: 0.3, cashbackPercent: 2 },
  { label: 'Premium card', annualFee: 150, fxFeePercent: 0, spreadPercent: 0.2, cashbackPercent: 4 },
];

function calculate(monthlySpend: number, card: CardScenario) {
  const annualSpend = monthlySpend * 12;
  const fxCost = annualSpend * (card.fxFeePercent / 100);
  const spreadCost = annualSpend * (card.spreadPercent / 100);
  const cashback = annualSpend * (card.cashbackPercent / 100);
  const totalCost = card.annualFee + fxCost + spreadCost;
  const netCost = totalCost - cashback;
  return { annualSpend, fxCost, spreadCost, cashback, totalCost, netCost };
}

function fmt(n: number) {
  return n < 0 ? `-$${Math.abs(n).toFixed(0)}` : `$${n.toFixed(0)}`;
}

export default function CostCalculator() {
  const [monthlySpend, setMonthlySpend] = useState(1000);
  const [cards, setCards] = useState<CardScenario[]>(PRESETS);

  function updateCard(idx: number, field: keyof CardScenario, value: string) {
    setCards(prev => prev.map((c, i) =>
      i === idx ? { ...c, [field]: field === 'label' ? value : Number(value) || 0 } : c
    ));
  }

  return (
    <div className="calculator">
      <div className="calc-input-section">
        <label className="calc-label" htmlFor="monthly-spend">
          Your Monthly Crypto Card Spending
        </label>
        <div className="calc-slider-row">
          <span className="calc-amount">${monthlySpend.toLocaleString()}</span>
          <input
            id="monthly-spend"
            type="range"
            min={100}
            max={10000}
            step={100}
            value={monthlySpend}
            onChange={e => setMonthlySpend(Number(e.target.value))}
            className="calc-slider"
          />
        </div>
        <div className="calc-range-labels">
          <span>$100/mo</span>
          <span>$10,000/mo</span>
        </div>
      </div>

      <div className="calc-cards-grid">
        {cards.map((card, idx) => {
          const r = calculate(monthlySpend, card);
          return (
            <div key={idx} className={`calc-card ${r.netCost <= 0 ? 'calc-card--positive' : ''}`}>
              <input
                className="calc-card-name"
                value={card.label}
                onChange={e => updateCard(idx, 'label', e.target.value)}
                aria-label="Card name"
              />

              <div className="calc-fields">
                <div className="calc-field">
                  <label>Annual fee</label>
                  <div className="calc-input-wrap">
                    <span>$</span>
                    <input type="number" min={0} value={card.annualFee} onChange={e => updateCard(idx, 'annualFee', e.target.value)} />
                  </div>
                </div>
                <div className="calc-field">
                  <label>FX fee</label>
                  <div className="calc-input-wrap">
                    <input type="number" min={0} max={10} step={0.1} value={card.fxFeePercent} onChange={e => updateCard(idx, 'fxFeePercent', e.target.value)} />
                    <span>%</span>
                  </div>
                </div>
                <div className="calc-field">
                  <label>Spread</label>
                  <div className="calc-input-wrap">
                    <input type="number" min={0} max={10} step={0.1} value={card.spreadPercent} onChange={e => updateCard(idx, 'spreadPercent', e.target.value)} />
                    <span>%</span>
                  </div>
                </div>
                <div className="calc-field">
                  <label>Cashback</label>
                  <div className="calc-input-wrap">
                    <input type="number" min={0} max={20} step={0.1} value={card.cashbackPercent} onChange={e => updateCard(idx, 'cashbackPercent', e.target.value)} />
                    <span>%</span>
                  </div>
                </div>
              </div>

              <div className="calc-results">
                <div className="calc-row">
                  <span>Annual spend</span>
                  <span>{fmt(r.annualSpend)}</span>
                </div>
                <div className="calc-row">
                  <span>Annual fee</span>
                  <span className="calc-neg">{fmt(card.annualFee)}</span>
                </div>
                <div className="calc-row">
                  <span>FX fees</span>
                  <span className="calc-neg">{fmt(r.fxCost)}</span>
                </div>
                <div className="calc-row">
                  <span>Spread cost</span>
                  <span className="calc-neg">{fmt(r.spreadCost)}</span>
                </div>
                <div className="calc-row">
                  <span>Cashback earned</span>
                  <span className="calc-pos">-{fmt(r.cashback)}</span>
                </div>
                <div className="calc-row calc-row--total">
                  <span>Net annual cost</span>
                  <span className={r.netCost <= 0 ? 'calc-pos' : 'calc-neg'}>
                    {fmt(r.netCost)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="calc-disclaimer">
        This calculator provides estimates only. Actual costs depend on specific card terms,
        exchange rates, and spending patterns. See individual card pages for exact fee schedules.
      </p>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Link href="/guides/crypto-card-fees-explained" className="btn btn-outline" style={{ marginRight: '12px' }}>
          Read Our Fees Guide
        </Link>
        <Link href="/" className="btn btn-primary">
          Compare All Cards
        </Link>
      </div>
    </div>
  );
}
