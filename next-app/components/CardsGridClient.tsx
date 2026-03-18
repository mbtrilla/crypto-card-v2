'use client';

import React, { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { CardListItem } from '@/lib/data';
import { normalizeCountry, normalizeCountryList } from '@/lib/country-normalize';
import CardItem from './CardItem';

// CompareBar is only shown after the user adds a card to compare — defer it
// so its JS never blocks the initial page render.
const CompareBar = dynamic(() => import('./CompareBar'), {
  ssr: false,
  loading: () => null,
});

interface Props {
  initialCards: CardListItem[];
}

const CARDS_PER_PAGE = 12;

export default function CardsGridClient({ initialCards }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    custody: 'all',
    network: 'all',
    type: 'all',
    region: 'all',
    country: 'all',
  });
  const [visibleCount, setVisibleCount] = useState(CARDS_PER_PAGE);
  const [compareList, setCompareList] = useState<CardListItem[]>([]);

  // Filtering Logic
  const filteredCards = useMemo(() => {
    return initialCards.filter(card => {
      const searchTerm = searchQuery.toLowerCase().trim();
      let matchesSearch = true;
      if (searchTerm) {
        matchesSearch = card.name.toLowerCase().includes(searchTerm) || 
                        card.description.toLowerCase().includes(searchTerm) || 
                        card.topUpMethods.toLowerCase().includes(searchTerm);
      }

      let matchesCustody = true;
      if (filters.custody !== 'all') {
        const cVal = filters.custody.toLowerCase();
        const cCard = card.custody.toLowerCase();
        if (cVal === 'custodial') matchesCustody = cCard.includes('custodial');
        else if (cVal === 'self-custody') matchesCustody = cCard.includes('self-custody');
        else if (cVal === 'hybrid') matchesCustody = cCard.includes('hybrid');
      }

      let matchesNetwork = filters.network === 'all' || card.network.toLowerCase().includes(filters.network.toLowerCase());
      let matchesType = filters.type === 'all' || card.cardType.toLowerCase().includes(filters.type.toLowerCase());
      let matchesRegion = filters.region === 'all' || card.regions.toLowerCase().includes(filters.region.toLowerCase());
      let matchesCountry = filters.country === 'all' || normalizeCountryList(card.countries).some(c => c === filters.country);

      return matchesSearch && matchesCustody && matchesNetwork && matchesType && matchesRegion && matchesCountry;
    });
  }, [initialCards, searchQuery, filters]);

  useEffect(() => {
    setVisibleCount(CARDS_PER_PAGE);
  }, [searchQuery, filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setSearchQuery('');
    setFilters({ custody: 'all', network: 'all', type: 'all', region: 'all', country: 'all' });
  };

  const toggleCompare = (card: CardListItem) => {
    setCompareList(prev => {
      const exists = prev.find(c => c.slug === card.slug);
      if (exists) return prev.filter(c => c.slug !== card.slug);
      if (prev.length < 4) return [...prev, card];
      return prev;
    });
  };

  // Unique countries for filter (normalized to canonical names)
  const countries = useMemo(() => {
    const set = new Set<string>();
    initialCards.forEach(card => {
      if (card.countries) {
        normalizeCountryList(card.countries).forEach(c => set.add(c));
      }
    });
    return Array.from(set).sort();
  }, [initialCards]);

  return (
    <>
      <section id="discover" className="filter-section" aria-label="Card filters">
        <div className="container">
          <div className="filter-glass-panel">
            <div className="search-box">
              <i className="fa-solid fa-search search-icon"></i>
              <input 
                type="text" 
                placeholder="Search by card name, crypto, or feature..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="filters-grid">
              <div className="filter-group">
                <label htmlFor="filter-custody">Custody</label>
                <div className="custom-select">
                  <select id="filter-custody" value={filters.custody} onChange={(e) => handleFilterChange('custody', e.target.value)}>
                    <option value="all">All Types</option>
                    <option value="Custodial">Custodial</option>
                    <option value="Self-custody">Self-Custody</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                  <i className="fa-solid fa-chevron-down select-icon"></i>
                </div>
              </div>
              <div className="filter-group">
                <label htmlFor="filter-network">Network</label>
                <div className="custom-select">
                  <select id="filter-network" value={filters.network} onChange={(e) => handleFilterChange('network', e.target.value)}>
                    <option value="all">All Networks</option>
                    <option value="Visa">Visa</option>
                    <option value="Mastercard">Mastercard</option>
                  </select>
                  <i className="fa-solid fa-chevron-down select-icon"></i>
                </div>
              </div>
              <div className="filter-group">
                <label htmlFor="filter-type">Card Type</label>
                <div className="custom-select">
                  <select id="filter-type" value={filters.type} onChange={(e) => handleFilterChange('type', e.target.value)}>
                    <option value="all">Any Type</option>
                    <option value="Virtual">Virtual</option>
                    <option value="Physical">Physical</option>
                  </select>
                  <i className="fa-solid fa-chevron-down select-icon"></i>
                </div>
              </div>
              <div className="filter-group">
                <label htmlFor="filter-region">Region</label>
                <div className="custom-select">
                  <select id="filter-region" value={filters.region} onChange={(e) => handleFilterChange('region', e.target.value)}>
                    <option value="all">All Regions</option>
                    <option value="usa">USA</option>
                    <option value="europe">Europe</option>
                    <option value="asia">Asia</option>
                  </select>
                  <i className="fa-solid fa-chevron-down select-icon"></i>
                </div>
              </div>
              <div className="filter-group">
                <label htmlFor="filter-country">Country</label>
                <div className="custom-select">
                  <select id="filter-country" value={filters.country} onChange={(e) => handleFilterChange('country', e.target.value)}>
                    <option value="all">All Countries</option>
                    {countries.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <i className="fa-solid fa-chevron-down select-icon"></i>
                </div>
              </div>
              <button type="button" className="btn btn-outline reset-btn" onClick={resetFilters}>Reset</button>
            </div>
          </div>
        </div>
      </section>

      <section className="results-section">
        <div className="container">
          <div className="results-header">
            <h2 className="results-title">Available Cards <span className="badge">{filteredCards.length}</span></h2>
          </div>

          {filteredCards.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon"><i className="fa-solid fa-ghost"></i></div>
              <h3>No cards found</h3>
              <p>Try adjusting your search or filters.</p>
              <button onClick={resetFilters} className="btn btn-primary">Reset Filters</button>
            </div>
          ) : (
            <>
              <div className="cards-grid">
                {filteredCards.slice(0, visibleCount).map(card => (
                  <CardItem 
                    key={card.slug} 
                    card={card} 
                    onCompare={() => toggleCompare(card)} 
                    isCompared={compareList.some(c => c.slug === card.slug)} 
                  />
                ))}
              </div>
              {visibleCount < filteredCards.length && (
                <div className="load-more-container">
                  <button className="load-more-btn" onClick={() => setVisibleCount(v => v + CARDS_PER_PAGE)}>
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
