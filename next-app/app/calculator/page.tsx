import { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import CostCalculator from './CostCalculator';

export const metadata: Metadata = {
  title: 'Crypto Card Cost Calculator 2026 — Find the Cheapest Card | Sweepbase',
  description:
    'Calculate the true annual cost of any crypto card. Enter your monthly spending, and we show you fees, cashback, and net cost side by side.',
  alternates: { canonical: 'https://sweepbase.com/calculator' },
  openGraph: {
    title: 'Crypto Card Cost Calculator 2026 | Sweepbase',
    description:
      'Calculate the true annual cost of any crypto card. Enter your monthly spending, and we show you fees, cashback, and net cost.',
    url: 'https://sweepbase.com/calculator',
    type: 'website',
    images: [{ url: 'https://sweepbase.com/og-image.png', width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
};

const toolJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Crypto Card Cost Calculator',
  url: 'https://sweepbase.com/calculator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  description:
    'Free calculator to estimate the true annual cost of crypto debit and credit cards based on your spending habits.',
  publisher: {
    '@type': 'Organization',
    name: 'Sweepbase',
    url: 'https://sweepbase.com',
  },
};

export default function CalculatorPage() {
  return (
    <main className="category-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolJsonLd) }}
      />

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'Cost Calculator' },
        ]} />

        <section className="category-hero">
          <h1 className="category-h1">Crypto Card Cost Calculator</h1>
          <p className="category-intro">
            Enter your estimated monthly spending and we&apos;ll calculate the true annual cost
            of a crypto card — including fees, FX markups, and cashback rewards. Compare different
            fee structures to find which card saves you the most.
          </p>
        </section>

        <CostCalculator />
      </div>
    </main>
  );
}
