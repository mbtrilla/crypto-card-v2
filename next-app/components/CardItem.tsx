import React from 'react';
import { CardListItem } from '@/lib/data';
import Link from 'next/link';
import Image from 'next/image';

interface Props {
  card: CardListItem;
  onCompare: () => void;
  isCompared: boolean;
}

export default function CardItem({ card, onCompare, isCompared }: Props) {
  const name = card.name;
  const logo = card.logo; // In real app, handle gdrive transformation if needed
  
  const network = card.network;
  const custody = card.custody;
  const cardType = card.cardType;
  const cashback = card.mainPageCashback || card.cashback || 'None';
  const regions = card.regions;

  return (
    <div className="crypto-card">
      <Link href={`/cards/${card.slug}`} className="card-link-overlay">
        <div className="card-image-wrapper">
          <Image
              src={logo}
              alt={`${name} — ${network} crypto debit card`}
              className="card-full-image"
              width={400}
              height={250}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
        </div>
        
        <div className="card-content-bottom">
          <div className="card-meta-tags">
            <span className="badge badge-custody">{custody.toUpperCase()}</span>
            {network && <span className="badge badge-network">{network.toUpperCase()}</span>}
          </div>

          <h3 className="card-title-large">{name}</h3>

          <div className="outline-pill" title={cardType}>{cardType.split(',')[0].toUpperCase()}</div>
          <div className="outline-pill">CASHBACK: {cashback.toUpperCase()}</div>
          <div className="outline-pill">REGION: {regions.toUpperCase()}</div>

          <div style={{ marginTop: 'auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button className="get-card-btn" onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open('#', '_blank'); }}>Get Card</button>
            <button 
              className={`compare-btn ${isCompared ? 'active' : ''}`} 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onCompare(); }}
            >
              <i className={`fa-solid ${isCompared ? 'fa-check' : 'fa-plus'}`}></i> {isCompared ? 'Added to Compare' : 'Add to Compare'}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
