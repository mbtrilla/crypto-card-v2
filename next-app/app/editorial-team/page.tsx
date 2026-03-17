import { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Editorial Team & Review Methodology — Sweepbase',
  description:
    'Meet the Sweepbase editorial team and learn how we independently review and rate 100+ crypto debit cards. Our methodology, sources, and editorial standards.',
  alternates: { canonical: 'https://sweepbase.com/editorial-team' },
  openGraph: {
    title: 'Editorial Team & Review Methodology — Sweepbase',
    description:
      'Meet the Sweepbase editorial team and learn how we independently review and rate 100+ crypto debit cards.',
    url: 'https://sweepbase.com/editorial-team',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Editorial Team & Review Methodology — Sweepbase',
    description:
      'Meet the Sweepbase editorial team and learn how we independently review and rate 100+ crypto debit cards.',
    site: '@sweepbase',
    creator: '@sweepbase',
  },
  robots: { index: true, follow: true },
};

// ── Team data ────────────────────────────────────────────────────────────────

const TEAM = [
  {
    initials: 'AR',
    name: 'Alex Rivera',
    title: 'Founder & Editor-in-Chief',
    bio: 'Fintech journalist with 8+ years covering digital payments and consumer finance. Alex founded Sweepbase in 2024 to bring data-driven transparency to the crypto card market and oversees all editorial output.',
    linkedinUrl: 'https://www.linkedin.com/company/sweepbase',
  },
  {
    initials: 'JK',
    name: 'Jordan Kim',
    title: 'Data & Research Lead',
    bio: 'Jordan maintains the Sweepbase card database, verifies fee schedules against official issuer documentation, and coordinates the weekly data-refresh cycle across 100+ products.',
    linkedinUrl: 'https://www.linkedin.com/company/sweepbase',
  },
  {
    initials: 'MP',
    name: 'Morgan Patel',
    title: 'Regional Research Analyst',
    bio: 'Specialises in European and Asian crypto card markets. Morgan monitors regulatory changes across EEA, UK, and APAC regions and tracks how licensing updates affect product availability.',
    linkedinUrl: 'https://www.linkedin.com/company/sweepbase',
  },
];

// ── Review criteria ──────────────────────────────────────────────────────────

const REVIEW_CRITERIA = [
  {
    icon: 'fa-money-bill-transfer',
    title: 'Fee Structure',
    desc: 'We verify issuance fees, annual fees, FX conversion rates, and ATM withdrawal charges directly from official issuer documentation.',
  },
  {
    icon: 'fa-percent',
    title: 'Cashback & Rewards',
    desc: 'Cashback percentages, earning caps, qualifying categories, staking requirements, and reward token type are all documented.',
  },
  {
    icon: 'fa-key',
    title: 'Custody Model',
    desc: 'We classify each card as custodial, self-custody, or hybrid and explain the security trade-offs of each approach.',
  },
  {
    icon: 'fa-credit-card',
    title: 'Network & Card Type',
    desc: 'Visa or Mastercard, virtual or physical, Apple Pay and Google Pay compatibility — all confirmed against issuer specs.',
  },
  {
    icon: 'fa-earth-americas',
    title: 'Geographic Availability',
    desc: 'KYC regions, supported countries, and regulatory restrictions are verified through official documentation and licensing records.',
  },
  {
    icon: 'fa-coins',
    title: 'Supported Cryptocurrencies',
    desc: 'Top-up assets, spending currencies, and stablecoin support are catalogued for every product in our database.',
  },
  {
    icon: 'fa-gauge-high',
    title: 'Limits & Thresholds',
    desc: 'Daily spending limits, ATM withdrawal caps, and tier-based threshold upgrades are recorded and compared.',
  },
  {
    icon: 'fa-rotate',
    title: 'Data Freshness',
    desc: 'Every card page carries a "Last reviewed" date. Fee changes are updated within 48 hours of official confirmation.',
  },
];

// ── Page component ───────────────────────────────────────────────────────────

export default function EditorialTeamPage() {
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'Sweepbase',
    'url': 'https://sweepbase.com',
    'logo': 'https://sweepbase.com/logo.png',
    'foundingDate': '2024',
    'description':
      'Sweepbase is an independent aggregator that helps users compare crypto debit and credit cards by fees, cashback, custody, and availability.',
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
    'member': TEAM.map((member) => ({
      '@type': 'Person',
      'name': member.name,
      'jobTitle': member.title,
      'description': member.bio,
      'url': member.linkedinUrl,
      'worksFor': { '@type': 'Organization', 'name': 'Sweepbase' },
    })),
  };

  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'Sweepbase Editorial Team & Review Methodology',
    'url': 'https://sweepbase.com/editorial-team',
    'description':
      'Meet the Sweepbase editorial team and learn how we independently review and rate 100+ crypto debit cards.',
    'dateModified': '2026-03-16',
    'publisher': {
      '@type': 'Organization',
      'name': 'Sweepbase',
      'url': 'https://sweepbase.com',
    },
  };

  return (
    <main className="about-page-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />

      <div className="container">
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'Editorial Team' },
        ]} />

        {/* ── Hero ── */}
        <section className="about-page-section about-page-hero-section">
          <h1 className="about-page-h1">Sweepbase Editorial Team &amp; Review Methodology</h1>
          <p className="about-page-lead">
            Every card on Sweepbase is reviewed by our in-house editorial team using a
            standardised methodology. We verify fees, cashback rates, custody models, and
            regional availability directly from official sources — so you can trust the data
            you see on every card page.
          </p>
        </section>

        {/* ── How We Review Cards ── */}
        <section className="about-page-section">
          <h2>
            <i className="fa-solid fa-clipboard-check"></i> How We Review Cards
          </h2>
          <p className="about-page-body">
            Each crypto card in our database is evaluated across eight core criteria. Our
            review process is designed to surface the facts that matter most when choosing a
            card — without bias toward any issuer or affiliate partner.
          </p>

          <div className="methodology-grid">
            {REVIEW_CRITERIA.map(({ icon, title, desc }) => (
              <div key={title} className="methodology-card">
                <h3>
                  <i className={`fa-solid ${icon}`}></i> {title}
                </h3>
                <p className="about-page-body" style={{ margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Editorial Independence ── */}
        <section className="about-page-section">
          <h2>
            <i className="fa-solid fa-shield-halved"></i> Editorial Independence
          </h2>
          <p className="about-page-body">
            Sweepbase earns revenue through affiliate partnerships with some card issuers.
            However, our editorial process is completely independent of our commercial
            relationships. No issuer can pay to improve their rating, alter their review
            content, or influence their position in comparison results.
          </p>
          <p className="about-page-body">
            All cards — whether affiliated or not — are evaluated on exactly the same
            criteria. Sponsored placements, if any, are clearly labelled. Our editorial team
            has full autonomy over what gets published and how cards are rated.
          </p>
          <div className="methodology-disclaimer">
            <i className="fa-solid fa-circle-info" style={{ color: 'var(--accent-primary)', marginRight: '0.6rem' }}></i>
            For full details on how we handle affiliate links, read our{' '}
            <a href="/disclosure">Affiliate Disclosure</a>.
          </div>
        </section>

        {/* ── Meet the Team ── */}
        <section className="about-page-section">
          <h2>
            <i className="fa-solid fa-users"></i> Meet the Team
          </h2>
          <p className="about-page-body">
            Sweepbase is run by a small, dedicated team of fintech researchers and editors
            committed to accurate, independent crypto card coverage.
          </p>
          <div className="team-grid">
            {TEAM.map(({ initials, name, title, bio, linkedinUrl }) => (
              <div key={name} className="team-card">
                <div className="team-avatar" aria-hidden="true">{initials}</div>
                <div>
                  <p className="team-name">{name}</p>
                  <p className="team-title">{title}</p>
                </div>
                <p className="team-bio">{bio}</p>
                <a
                  href={linkedinUrl}
                  className="team-linkedin"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${name} on LinkedIn`}
                >
                  <i className="fa-brands fa-linkedin"></i> LinkedIn
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* ── Our Sources ── */}
        <section className="about-page-section">
          <h2>
            <i className="fa-solid fa-magnifying-glass"></i> Our Sources
          </h2>
          <div className="methodology-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
            <div className="methodology-card">
              <h3><i className="fa-solid fa-globe"></i> Official Issuer Websites</h3>
              <p className="about-page-body" style={{ margin: 0 }}>
                Fee schedules, product pages, help centres, and terms of service published
                directly by card issuers.
              </p>
            </div>
            <div className="methodology-card">
              <h3><i className="fa-solid fa-file-lines"></i> Regulatory Filings</h3>
              <p className="about-page-body" style={{ margin: 0 }}>
                FCA, FinCEN, and MiCA-compliant disclosures, licensing databases, and
                official regulatory announcements.
              </p>
            </div>
            <div className="methodology-card">
              <h3><i className="fa-solid fa-newspaper"></i> Verified Press Releases</h3>
              <p className="about-page-body" style={{ margin: 0 }}>
                Official announcements from issuers regarding fee changes, new product
                launches, and geographic expansions.
              </p>
            </div>
          </div>
          <div className="methodology-disclaimer" style={{ marginTop: '1.25rem' }}>
            <i className="fa-solid fa-circle-info" style={{ color: 'var(--accent-primary)', marginRight: '0.6rem' }}></i>
            We do not rely on user-submitted data or unverified third-party sources. If you
            spot an inaccuracy, please contact us at{' '}
            <a href="mailto:contact@sweepbase.com">contact@sweepbase.com</a>.
          </div>
        </section>

        <p className="about-founded-note">
          <i className="fa-regular fa-calendar" style={{ marginRight: '0.4rem' }}></i>
          Founded 2024 &nbsp;&middot;&nbsp; Independent &amp; Editorially Autonomous &nbsp;&middot;&nbsp;
          Last updated March 2026
        </p>
      </div>
    </main>
  );
}
