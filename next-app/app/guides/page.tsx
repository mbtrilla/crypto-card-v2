import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { generateBreadcrumbSchema } from '@/lib/schemas';

export const metadata: Metadata = {
  title: 'Crypto Card Guides & Resources 2026 | Sweepbase',
  description:
    'Learn everything about crypto debit and credit cards. Guides on fees, choosing the right card, self-custody vs custodial, and more.',
  alternates: { canonical: 'https://sweepbase.com/guides' },
  openGraph: {
    title: 'Crypto Card Guides & Resources 2026 | Sweepbase',
    description:
      'Learn everything about crypto debit and credit cards. Guides on fees, choosing the right card, self-custody vs custodial, and more.',
    url: 'https://sweepbase.com/guides',
    type: 'website',
    images: [{ url: 'https://sweepbase.com/og-image.png', width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
};

const GUIDES = [
  {
    href: '/guides/how-to-choose-a-crypto-card',
    title: 'How to Choose a Crypto Card in 2026',
    desc: 'A step-by-step framework for evaluating crypto debit and credit cards based on fees, rewards, custody, and regional availability.',
    tag: 'Beginner',
  },
  {
    href: '/guides/crypto-card-fees-explained',
    title: 'Crypto Card Fees Explained',
    desc: 'Understand issuance fees, annual fees, FX markups, ATM charges, and hidden costs so you can compare cards accurately.',
    tag: 'Fees',
  },
  {
    href: '/guides/self-custody-vs-custodial-crypto-cards',
    title: 'Self-Custody vs Custodial Crypto Cards',
    desc: 'The key differences between self-custody and custodial crypto cards, and which model fits your risk tolerance and spending habits.',
    tag: 'Security',
  },
  {
    href: '/guides/best-crypto-cards-for-beginners',
    title: 'Best Crypto Cards for Beginners in 2026',
    desc: 'New to crypto cards? Start here. We break down the simplest, lowest-risk options for first-time users.',
    tag: 'Beginner',
  },
];

const guidesJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Crypto Card Guides',
  url: 'https://sweepbase.com/guides',
  description: 'Educational guides about crypto debit and credit cards.',
  publisher: { '@type': 'Organization', name: 'Sweepbase', url: 'https://sweepbase.com' },
};

export default function GuidesIndex() {
  const breadcrumbJsonLd = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://sweepbase.com' },
    { name: 'Guides', url: 'https://sweepbase.com/guides' },
  ]);

  return (
    <main className="category-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(guidesJsonLd) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="container">
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'Guides' },
        ]} />

        <section className="category-hero">
          <h1 className="category-h1">Crypto Card Guides &amp; Resources</h1>
          <p className="category-intro">
            Whether you&apos;re new to crypto cards or looking to optimise your setup, our guides
            cover everything from fee structures and custody models to choosing the best card for
            your region and spending habits.
          </p>
        </section>

        <div className="guides-grid">
          {GUIDES.map(({ href, title, desc, tag }) => (
            <Link key={href} href={href} className="guide-card">
              <span className="guide-card__tag">{tag}</span>
              <h2 className="guide-card__title">{title}</h2>
              <p className="guide-card__desc">{desc}</p>
              <span className="guide-card__cta">
                Read guide <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
