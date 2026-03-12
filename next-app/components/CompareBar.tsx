import React from 'react';
import { Card } from '@/lib/data';
import Link from 'next/link';

interface Props {
  list: Card[];
  onRemove: (slug: string) => void;
  onClear: () => void;
}

export default function CompareBar({ list, onRemove, onClear }: Props) {
  // Generate comparison URL
  const compareUrl = `/compare?ids=${list.map(c => c.slug).join(',')}`;

  return (
    <div id="compareBar" className="compare-bar">
      <div className="container compare-bar-content">
        <div className="compare-info">
          <span className="compare-title">Compare Cards ({list.length}/4)</span>
          <div className="compare-slots">
            {list.map(card => (
              <div key={card.slug} className="compare-slot">
                <img src={card.logo} alt={card.name} />
                <button className="remove-slot" onClick={() => onRemove(card.slug)}>&times;</button>
              </div>
            ))}
            {[...Array(4 - list.length)].map((_, i) => (
              <div key={`empty-${i}`} className="compare-slot empty"></div>
            ))}
          </div>
        </div>
        <div className="compare-actions">
          <button className="btn btn-outline" onClick={onClear}>Clear All</button>
          <Link 
            href={compareUrl} 
            className={`btn btn-primary ${list.length < 2 ? 'disabled' : ''}`}
            aria-disabled={list.length < 2}
            onClick={(e) => { if (list.length < 2) e.preventDefault(); }}
          >
            Compare Now
          </Link>
        </div>
      </div>
    </div>
  );
}
