'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const BROWSE_LINKS = [
  { href: '/best-crypto-cards-usa',       label: 'Best Cards in the USA',       icon: 'fa-flag-usa' },
  { href: '/best-crypto-cards-europe',    label: 'Best Cards in Europe',        icon: 'fa-earth-europe' },
  { href: '/visa-crypto-cards',           label: 'Visa Crypto Cards',           icon: 'fa-credit-card' },
  { href: '/mastercard-crypto-cards',     label: 'Mastercard Crypto Cards',     icon: 'fa-circle-dot' },
  { href: '/self-custody-crypto-cards',   label: 'Self-Custody Cards',          icon: 'fa-key' },
  { href: '/crypto-cards-with-cashback',  label: 'Cards With Cashback',         icon: 'fa-percent' },
];

export default function SiteNav() {
  const [browseOpen, setBrowseOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setBrowseOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setBrowseOpen(false);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <header className="navbar">
      <div className="container nav-content">
        <Link href="/" className="logo">
          <Image
            src="/logo.png"
            alt="Sweepbase Logo"
            className="brand-logo"
            width={160}
            height={40}
            priority
          />
        </Link>

        <nav className="nav-links">
          <Link href="/#discover">Discover</Link>

          {/* Browse dropdown */}
          <div className="nav-dropdown" ref={dropdownRef}>
            <button
              className="nav-dropdown-trigger"
              aria-expanded={browseOpen}
              aria-haspopup="true"
              onClick={() => setBrowseOpen(o => !o)}
            >
              Browse
              <i className="fa-solid fa-chevron-down"></i>
            </button>

            {browseOpen && (
              <div className="nav-dropdown-panel" role="menu">
                {BROWSE_LINKS.map(({ href, label, icon }) => (
                  <Link
                    key={href}
                    href={href}
                    role="menuitem"
                    onClick={() => setBrowseOpen(false)}
                  >
                    <i className={`fa-solid ${icon}`}></i>
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/about">About</Link>
        </nav>
      </div>
    </header>
  );
}
