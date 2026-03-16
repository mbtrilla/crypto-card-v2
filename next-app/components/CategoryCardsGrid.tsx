'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Card } from '@/lib/data';
import CardItem from './CardItem';

// CompareBar is only shown after the user adds a card to compare — defer it
// so its JS never blocks the initial page render.
const CompareBar = dynamic(() => import('./CompareBar'), {
  ssr: false,
  loading: () => null,
});

interface Props {
  cards: Card[];
}

const CARDS_PER_PAGE = 12;

export default function CategoryCardsGrid({ cards }: Props) {
  const [visibleCount, setVisibleCount] = useState(CARDS_PER_PAGE);
  const [compareList, setCompareList] = useState<Card[]>([]);

  const toggleCompare = (card: Card) => {
    setCompareList(prev => {
      const exists = prev.find(c => c.slug === card.slug);
      if (exists) return prev.filter(c => c.slug !== card.slug);
      if (prev.length < 4) return [...prev, card];
      return prev;
    });
  };

  return (
    <>
      <section className="results-section">
        <div className="container">
          <div className="results-header">
            <h2 className="results-title">
              Cards Found <span className="badge">{cards.length}</span>
            </h2>
          </div>

          {cards.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon"><i className="fa-solid fa-ghost"></i></div>
              <h3>No cards found</h3>
              <p>Check back soon — we update our database regularly.</p>
            </div>
          ) : (
            <>
              <div className="cards-grid">
                {cards.slice(0, visibleCount).map(card => (
                  <CardItem
                    key={card.slug}
                    card={card}
                    onCompare={() => toggleCompare(card)}
                    isCompared={compareList.some(c => c.slug === card.slug)}
                  />
                ))}
              </div>
              {visibleCount < cards.length && (
                <div className="load-more-container">
                  <button
                    className="load-more-btn"
                    onClick={() => setVisibleCount(v => v + CARDS_PER_PAGE)}
                  >
                    Load More <i className="fa-solid fa-chevron-down"></i>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {compareList.length > 0 && (
        <CompareBar
          list={compareList}
          onRemove={(slug) => setCompareList(l => l.filter(c => c.slug !== slug))}
          onClear={() => setCompareList([])}
        />
      )}
    </>
  );
}
