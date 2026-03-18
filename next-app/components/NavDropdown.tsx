'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const TOOL_LINKS = [
  { href: '/compare',    label: 'Compare Cards',   icon: 'fa-scale-balanced' },
  { href: '/calculator', label: 'Cost Calculator',  icon: 'fa-calculator' },
];

const BROWSE_LINKS = [
  { href: '/best-crypto-cards-usa',            label: 'Best Cards in the USA',         icon: 'fa-flag-usa' },
  { href: '/best-crypto-cards-europe',         label: 'Best Cards in Europe',          icon: 'fa-earth-europe' },
  { href: '/best-crypto-cards-uk',             label: 'Best Cards in the UK',          icon: 'fa-sterling-sign' },
  { href: '/best-crypto-cards-canada',         label: 'Best Cards in Canada',          icon: 'fa-leaf' },
  { href: '/best-crypto-cards-latin-america',  label: 'Best Cards in Latin America',   icon: 'fa-earth-americas' },
  { href: '/best-crypto-cards-asia',           label: 'Best Cards in Asia',            icon: 'fa-earth-asia' },
  { href: '/best-crypto-cards-australia',      label: 'Best Cards in Australia',       icon: 'fa-earth-oceania' },
  { href: '/visa-crypto-cards',                label: 'Visa Crypto Cards',             icon: 'fa-credit-card' },
  { href: '/mastercard-crypto-cards',          label: 'Mastercard Crypto Cards',       icon: 'fa-circle-dot' },
  { href: '/self-custody-crypto-cards',        label: 'Self-Custody Cards',            icon: 'fa-key' },
  { href: '/crypto-cards-with-cashback',       label: 'Cards With Cashback',           icon: 'fa-percent' },
];

/**
 * "Browse" dropdown — the only interactive part of the nav bar.
 * Extracted as a client component so SiteNav itself can be a server
 * component: logo, Discover, and About links are plain HTML with no JS.
 */
export default function NavDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="nav-dropdown" ref={ref}>
      <button
        type="button"
        className="nav-dropdown-trigger"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen(o => !o)}
      >
        Browse
        <i className="fa-solid fa-chevron-down" aria-hidden="true"></i>
      </button>

      {open && (
        <div className="nav-dropdown-panel" role="menu">
          {TOOL_LINKS.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              <i className={`fa-solid ${icon}`} aria-hidden="true"></i>
              {label}
            </Link>
          ))}
          <hr className="nav-dropdown-divider" />
          {BROWSE_LINKS.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              <i className={`fa-solid ${icon}`} aria-hidden="true"></i>
              {label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
