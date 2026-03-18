import { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';

export const revalidate = 86400; // Cache for 24 h — static editorial content

export const metadata: Metadata = {
  title: 'About Sweepbase — Our Mission & Editorial Standards',
  description:
    'Sweepbase independently researches and rates crypto debit cards. Learn about our editorial methodology, data sources, and team of fintech analysts.',
  alternates: { canonical: 'https://sweepbase.com/about' },
  openGraph: {
    title: 'About Sweepbase — Our Mission & Editorial Standards',
    description:
      'Sweepbase independently researches and rates crypto debit cards. Learn about our editorial methodology, data sources, and team of fintech analysts.',
    url: 'https://sweepbase.com/about',
    type: 'website',
    images: [{ url: 'https://sweepbase.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Sweepbase — Our Mission & Editorial Standards',
    description:
      'Sweepbase independently researches and rates crypto debit cards. Learn about our editorial methodology, data sources, and team of fintech analysts.',
    site: '@sweepbase',
    creator: '@sweepbase',
  },
  robots: { index: true, follow: true },
};

const TEAM = [
  {
    initials: 'AR',
    name: 'Alex Rivera',
    title: 'Founder & Editor-in-Chief',
    bio: 'With a background in fintech and consumer finance journalism, Alex founded Sweepbase in 2024 to bring data-driven transparency to the crypto card market. Alex oversees editorial direction and ensures all published data meets Sweepbase quality standards.',
    linkedin: 'https://www.linkedin.com/company/sweepbase',
  },
  {
    initials: 'JK',
    name: 'Jordan Kim',
    title: 'Data & Research Lead',
    bio: 'Jordan maintains the Sweepbase card database, verifies fee schedules directly against official issuer documentation, and coordinates the weekly data-refresh cycle. Jordan also monitors issuer announcements for real-time fee changes.',
    linkedin: 'https://www.linkedin.com/company/sweepbase',
  },
  {
    initials: 'MP',
    name: 'Morgan Patel',
    title: 'Regional Research Analyst',
    bio: 'Morgan specialises in European and Asian crypto card markets, monitoring regulatory changes across the EEA, UK, and APAC regions and tracking how licensing updates affect product availability for users in those territories.',
    linkedin: 'https://www.linkedin.com/company/sweepbase',
  },
];

export default function AboutPage() {
  const aboutPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    'name': 'About Sweepbase',
    'description':
      'Sweepbase is an independent aggregator that helps users find, compare, and evaluate crypto debit and credit cards worldwide.',
    'url': 'https://sweepbase.com/about',
    'dateModified': '2026-03-16',
    'publisher': {
      '@type': 'Organization',
      'name': 'Sweepbase',
      'url': 'https://sweepbase.com',
      'logo': 'https://sweepbase.com/logo.png',
      'foundingDate': '2024',
      'contactPoint': {
        '@type': 'ContactPoint',
        'email': 'contact@sweepbase.com',
        'contactType': 'editorial',
      },
      'sameAs': [
        'https://twitter.com/sweepbase',
        'https://www.linkedin.com/company/sweepbase',
        'https://t.me/sweepbase',
      ],
    },
  };

  return (
    <main className="about-page-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageJsonLd) }}
      />

      <div className="container">
        {/* ── Breadcrumb ── */}
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'About' },
        ]} />

        {/* ── H1 Hero ── */}
        <section className="about-page-section about-page-hero-section">
          <h1 className="about-page-h1">About Sweepbase</h1>
          <p className="about-page-lead">
            Sweepbase is an independent aggregator that helps you find, compare, and evaluate
            the world&apos;s best crypto debit and credit cards. We surface fees, cashback rates,
            supported networks, custody models, and regional availability in one place — so you
            can make confident decisions without bouncing between dozens of issuer websites.
          </p>
          <p className="about-page-lead">
            We are not affiliated with any card issuer, bank, or crypto exchange in an editorial
            capacity. Every card listed on Sweepbase is evaluated on the same objective criteria,
            regardless of commercial relationships.
          </p>
        </section>

        {/* ── Our Mission ── */}
        <section className="about-page-section">
          <h2>
            <i className="fa-solid fa-bullseye"></i> Our Mission
          </h2>
          <p className="about-page-body">
            The crypto card market is complex, fast-moving, and often poorly documented. Fee
            schedules change without announcement, KYC requirements shift with regulatory updates,
            and cashback tiers depend on staking conditions buried in fine print. Users deserve a
            single, reliable source of truth.
          </p>
          <p className="about-page-body">
            Sweepbase was founded in 2024 with a single mandate: publish accurate, up-to-date
            comparison data for every significant crypto card product available globally, and present
            it in a format that empowers informed decision-making — not one that pushes users toward
            the highest-commission option.
          </p>
          <p className="about-page-body">
            We cover cards across all major networks (Visa and Mastercard), custody models
            (custodial, self-custody, and hybrid), and regions (USA, Europe, Asia-Pacific, and
            global). Our database currently spans over 100 cards and is refreshed weekly.
          </p>
        </section>

        {/* ── How We Rate Cards ── */}
        <section className="about-page-section">
          <h2>
            <i className="fa-solid fa-clipboard-check"></i> How We Rate Cards
          </h2>
          <p className="about-page-body">
            Every card in our database is evaluated and scored on a consistent set of criteria.
            Below is a full explanation of our editorial methodology.
          </p>

          <div className="methodology-grid">
            {/* Data collected */}
            <div className="methodology-card">
              <h3>
                <i className="fa-solid fa-database"></i> Data We Collect
              </h3>
              <ul>
                <li>Issuance and annual fees (exact amounts in local currency)</li>
                <li>FX conversion fees for cross-currency transactions</li>
                <li>Cashback rates and any staking or tier requirements</li>
                <li>Card network (Visa or Mastercard) and card type (physical / virtual)</li>
                <li>Custody model — custodial, self-custody, or hybrid</li>
                <li>Geographic availability and KYC regions</li>
                <li>Supported cryptocurrencies for top-up and spending</li>
                <li>ATM withdrawal and daily spending limits</li>
                <li>Apple Pay / Google Pay compatibility</li>
              </ul>
            </div>

            {/* Update frequency */}
            <div className="methodology-card">
              <h3>
                <i className="fa-solid fa-rotate"></i> Update Frequency
              </h3>
              <ul>
                <li>Full database review: <strong>weekly</strong></li>
                <li>Fee changes are updated within 48 hours of official confirmation</li>
                <li>New card launches are added within one week of public availability</li>
                <li>Discontinued cards are removed or flagged promptly</li>
                <li>All card pages carry a &ldquo;Last reviewed&rdquo; date so you always know how fresh the data is</li>
              </ul>
            </div>

            {/* Sources */}
            <div className="methodology-card">
              <h3>
                <i className="fa-solid fa-magnifying-glass"></i> Our Sources
              </h3>
              <ul>
                <li>Official issuer websites and help centres</li>
                <li>Public product documentation and terms of service</li>
                <li>Verified press releases and official announcements</li>
                <li>Regulatory disclosures (FCA, FinCEN, MiCA-compliant filings)</li>
                <li>We do not rely on user-submitted data or unverified third-party sources</li>
              </ul>
            </div>

            {/* What doesn't affect ratings */}
            <div className="methodology-card">
              <h3>
                <i className="fa-solid fa-shield-halved"></i> Editorial Independence
              </h3>
              <ul>
                <li>Sweepbase earns revenue through affiliate partnerships with some issuers</li>
                <li>Affiliate status has <strong>zero influence</strong> on ratings or rankings</li>
                <li>No issuer can pay to improve their position in our comparison results</li>
                <li>Sponsored placements, if any, are clearly labelled as such</li>
                <li>Our editorial team operates independently of our commercial team</li>
              </ul>
            </div>
          </div>

          <div className="methodology-disclaimer">
            <i className="fa-solid fa-circle-info" style={{ color: 'var(--accent-primary)', marginRight: '0.6rem' }}></i>
            <strong>Affiliate disclosure:</strong> Some links on Sweepbase are affiliate links. If you
            apply for a card through one of these links, we may earn a commission at no extra cost to
            you. This never influences which cards we feature or how we rate them. Read our full{' '}
            <a href="/disclosure">Affiliate Disclosure</a>.
          </div>
        </section>

        {/* ── Meet the Team ── */}
        <section className="about-page-section">
          <h2>
            <i className="fa-solid fa-users"></i> Meet the Team
          </h2>
          <p className="about-page-body">
            Sweepbase is run by a small, dedicated team of fintech researchers and editors committed
            to accurate, independent crypto card coverage.
          </p>
          <div className="team-grid">
            {TEAM.map(({ initials, name, title, bio, linkedin }) => (
              <div key={name} className="team-card">
                <div className="team-avatar" aria-hidden="true">{initials}</div>
                <div>
                  <p className="team-name">{name}</p>
                  <p className="team-title">{title}</p>
                </div>
                <p className="team-bio">{bio}</p>
                <a
                  href={linkedin}
                  className="team-linkedin"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  aria-label={`${name} on LinkedIn`}
                >
                  <i className="fa-brands fa-linkedin"></i> LinkedIn
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* ── Contact Us ── */}
        <section className="about-page-section">
          <h2>
            <i className="fa-solid fa-envelope"></i> Contact Us
          </h2>
          <p className="about-page-body">
            We welcome corrections, data update requests, and press enquiries. If you spot an error
            in our card data or have a question about our methodology, please get in touch — we aim
            to respond within two business days.
          </p>
          <div className="contact-box">
            <div className="contact-icon" aria-hidden="true">
              <i className="fa-solid fa-envelope-open-text"></i>
            </div>
            <div>
              <p style={{ fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
                Editorial &amp; Data Corrections
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                For fee corrections, missing card data, or editorial feedback:
              </p>
              <a href="mailto:contact@sweepbase.com" className="about-email-link">
                contact@sweepbase.com
              </a>
            </div>
          </div>
        </section>

        {/* ── Founded note ── */}
        <p className="about-founded-note">
          <i className="fa-regular fa-calendar" style={{ marginRight: '0.4rem' }}></i>
          Founded 2024 &nbsp;·&nbsp; Independent &amp; Editorially Autonomous &nbsp;·&nbsp;
          Last updated March 2026
        </p>
      </div>
    </main>
  );
}
