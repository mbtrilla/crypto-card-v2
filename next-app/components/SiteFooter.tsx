import Image from 'next/image';
import SocialLinks from '@/components/SocialLinks';

const BROWSE_LINKS = [
  { href: '/cards',                        label: 'All Crypto Cards' },
  { href: '/best-crypto-cards-usa',        label: 'Best Cards in the USA' },
  { href: '/best-crypto-cards-europe',     label: 'Best Cards in Europe' },
  { href: '/best-crypto-cards-asia',       label: 'Best Cards in Asia' },
  { href: '/best-crypto-cards-australia',  label: 'Best Cards in Australia' },
  { href: '/visa-crypto-cards',            label: 'Visa Crypto Cards' },
  { href: '/mastercard-crypto-cards',      label: 'Mastercard Crypto Cards' },
  { href: '/self-custody-crypto-cards',    label: 'Self-Custody Cards' },
  { href: '/crypto-cards-with-cashback',   label: 'Cards With Cashback' },
];

const POPULAR_CARDS = [
  { href: '/cards/binance-card',        label: 'Binance Card' },
  { href: '/cards/cryptocom-visa-card', label: 'Crypto.com Visa Card' },
  { href: '/cards/coinbase-card',       label: 'Coinbase Card' },
  { href: '/cards/metamask-card',       label: 'MetaMask Card' },
  { href: '/cards/ledger-card',         label: 'Ledger Card' },
  { href: '/cards/kraken-card',         label: 'Kraken Card' },
];

export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-columns">
          {/* Brand column */}
          <div className="footer-brand">
            <Image
              src="/logo.png"
              alt="Sweepbase Logo"
              className="brand-logo footer-logo-img"
              width={140}
              height={35}
            />
            <p className="footer-brand-desc">
              Independent crypto card comparison. Find, compare, and evaluate
              the world&apos;s best crypto debit and credit cards in one place.
            </p>
          </div>

          {/* Browse column */}
          <div className="footer-col">
            <p className="footer-col-heading">Browse</p>
            <ul className="footer-col-links">
              {BROWSE_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <a href={href}>{label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Cards column */}
          <div className="footer-col">
            <p className="footer-col-heading">Popular Cards</p>
            <ul className="footer-col-links">
              {POPULAR_CARDS.map(({ href, label }) => (
                <li key={href}>
                  <a href={href}>{label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company column */}
          <div className="footer-col">
            <p className="footer-col-heading">Company</p>
            <ul className="footer-col-links">
              <li><a href="/#about">About Sweepbase</a></li>
              <li><a href="/sitemap.xml">Sitemap</a></li>
            </ul>
          </div>

          {/* Legal column */}
          <div className="footer-col">
            <p className="footer-col-heading">Legal</p>
            <ul className="footer-col-links">
              <li><a href="/privacy-policy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
              <li><a href="/disclosure">Affiliate Disclosure</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">&copy; 2026 Sweepbase. All rights reserved.</p>
          <SocialLinks />
          <nav className="footer-bottom-links">
            <a href="/sitemap.xml">Sitemap</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
