import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import TopCards from '@/components/TopCards';
import FAQAccordion, { type FAQItem } from '@/components/FAQAccordion';
import { generateFAQPageSchema } from '@/lib/schemas';

export const metadata: Metadata = {
  title: 'Crypto Card Fees Explained — Complete Breakdown 2026 | Sweepbase',
  description:
    'Understand every fee on a crypto debit card: issuance, annual, FX markup, ATM charges, and hidden spreads. Compare real costs across 100+ cards.',
  alternates: { canonical: 'https://sweepbase.com/guides/crypto-card-fees-explained' },
  openGraph: {
    title: 'Crypto Card Fees Explained — Complete Breakdown 2026 | Sweepbase',
    description:
      'Understand every fee on a crypto debit card: issuance, annual, FX markup, ATM charges, and hidden spreads.',
    url: 'https://sweepbase.com/guides/crypto-card-fees-explained',
    type: 'article',
    images: [{ url: 'https://sweepbase.com/og-image.png', width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
};

const FAQ_ITEMS: FAQItem[] = [
  {
    q: 'Are there crypto cards with no fees at all?',
    a: 'A few cards advertise zero issuance and zero annual fees, but almost all charge some form of conversion spread or FX markup. "No fees" usually means no explicit fees — the cost is embedded in the exchange rate. Always check the crypto-to-fiat conversion spread.',
  },
  {
    q: 'What is a typical FX fee on a crypto card?',
    a: 'FX fees on crypto cards range from 0% to 3%. Cards with 0% FX typically recover costs through wider conversion spreads. A good benchmark is under 1% total cost (FX fee + spread combined) for regular spending.',
  },
  {
    q: 'Do crypto cards charge differently for ATM vs POS transactions?',
    a: 'Yes. Most cards charge a separate ATM fee (either flat or percentage) on top of any FX or conversion fees. Some cards offer a free ATM allowance per month (e.g., $200-500) before fees kick in. POS (point-of-sale) transactions typically only incur the FX/conversion charge.',
  },
];

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Crypto Card Fees Explained',
  description: 'Complete breakdown of all fees charged by crypto debit and credit cards.',
  url: 'https://sweepbase.com/guides/crypto-card-fees-explained',
  datePublished: '2026-03-16',
  dateModified: '2026-03-18',
  author: {
    '@type': 'Organization',
    name: 'Sweepbase Editorial Team',
    url: 'https://sweepbase.com/about',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Sweepbase',
    url: 'https://sweepbase.com',
    logo: { '@type': 'ImageObject', url: 'https://sweepbase.com/logo.png' },
  },
  mainEntityOfPage: 'https://sweepbase.com/guides/crypto-card-fees-explained',
};

export default function FeesGuide() {
  const faqJsonLd = generateFAQPageSchema(FAQ_ITEMS);

  return (
    <main className="guide-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="container guide-container">
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'Guides', href: '/guides' },
          { label: 'Crypto Card Fees Explained' },
        ]} />

        <article className="guide-article">
          <h1>Crypto Card Fees Explained</h1>
          <p className="guide-meta">By Sweepbase Editorial Team · Last updated: <time dateTime="2026-03-18">March 18, 2026</time></p>
          <p className="guide-lead">
            Crypto card fees can be confusing — some are visible, others are hidden in conversion rates.
            This guide breaks down every type of fee so you can calculate the true cost of any card.
          </p>

          <nav className="guide-toc" aria-label="Table of contents">
            <h2>In This Guide</h2>
            <ol>
              <li><a href="#issuance">Issuance fees</a></li>
              <li><a href="#annual">Annual &amp; monthly fees</a></li>
              <li><a href="#fx">FX &amp; conversion fees</a></li>
              <li><a href="#atm">ATM withdrawal fees</a></li>
              <li><a href="#hidden">Hidden costs &amp; spreads</a></li>
              <li><a href="#calculate">How to calculate true cost</a></li>
            </ol>
          </nav>

          <section id="issuance">
            <h2>Issuance Fees</h2>
            <p>
              The issuance fee is a one-time charge to create and ship your card. Virtual cards are
              typically free; physical cards range from $0 to $50. Some premium metal cards charge
              $100 or more.
            </p>
            <p>
              <strong>What to watch:</strong> Cards that advertise &quot;free&quot; issuance may charge for
              shipping, especially for international delivery. Always check if the price includes
              delivery to your country.
            </p>
          </section>

          <section id="annual">
            <h2>Annual &amp; Monthly Fees</h2>
            <p>
              Recurring fees range from $0 to $200+/year. Some cards waive annual fees if you maintain
              a minimum balance or stake the issuer&apos;s token. Monthly subscription models are
              becoming more common, especially for cards with premium perks like airport lounge access
              or higher cashback tiers.
            </p>
            <p>
              <strong>Pro tip:</strong> Calculate the annual fee against expected cashback earnings.
              A $120/year card with 3% cashback only breaks even if you spend $4,000/year on it.
            </p>
          </section>

          <section id="fx">
            <h2>FX &amp; Conversion Fees</h2>
            <p>
              FX (foreign exchange) fees apply when the card&apos;s settlement currency differs from
              the merchant&apos;s currency. For crypto cards, there are two layers of conversion:
            </p>
            <ol>
              <li><strong>Crypto → fiat conversion:</strong> When your BTC or ETH is converted to USD/EUR at the point of sale.</li>
              <li><strong>Fiat → fiat FX:</strong> When the card&apos;s base currency (e.g., USD) differs from the merchant&apos;s currency (e.g., EUR).</li>
            </ol>
            <p>
              Some cards charge an explicit FX percentage (0.5%–3%); others embed the cost in the
              conversion rate spread. The best cards offer 0% FX with tight spreads — effectively
              under 0.5% total conversion cost.
            </p>
          </section>

          <section id="atm">
            <h2>ATM Withdrawal Fees</h2>
            <p>
              ATM fees typically have two components: the card issuer&apos;s fee (flat or percentage)
              and the ATM operator&apos;s surcharge. Many crypto cards offer a monthly free withdrawal
              allowance ($200–$500), after which fees of 1.5%–3% apply.
            </p>
            <p>
              <strong>Tip:</strong> If you need frequent cash access, prioritise cards with high free
              ATM limits. If you rarely use ATMs, this fee is less important than FX and annual costs.
            </p>
          </section>

          <section id="hidden">
            <h2>Hidden Costs &amp; Spreads</h2>
            <p>
              The crypto-to-fiat conversion spread is the most commonly overlooked cost. Even cards
              with &quot;0% fees&quot; may add a 0.5%–2% markup to the exchange rate. This spread is
              the difference between the mid-market rate and the rate the card actually gives you.
            </p>
            <p>Other hidden costs include:</p>
            <ul>
              <li><strong>Inactivity fees:</strong> Charged if you don&apos;t use the card for 3–12 months.</li>
              <li><strong>Card replacement:</strong> Lost or stolen card replacement can cost $5–$50.</li>
              <li><strong>Top-up fees:</strong> Some cards charge for certain deposit methods (credit card top-up is often 1%–3%).</li>
              <li><strong>Minimum load requirements:</strong> Some cards require a minimum top-up amount.</li>
            </ul>
          </section>

          <section id="calculate">
            <h2>How to Calculate True Cost</h2>
            <p>
              To find the real cost of a crypto card, use this formula:
            </p>
            <p className="guide-formula">
              <strong>True Annual Cost</strong> = Annual Fee + (Monthly Spend × 12 × FX Fee%) + (Monthly Spend × 12 × Spread%) − Annual Cashback Earned
            </p>
            <p>
              For example, a card with $60/year fee, 1% FX, 0.5% spread, and 2% cashback on $1,000/month spending:
            </p>
            <p className="guide-formula">
              $60 + ($12,000 × 1%) + ($12,000 × 0.5%) − ($12,000 × 2%) = $60 + $120 + $60 − $240 = <strong>$0 net cost</strong>
            </p>
            <p>
              Use the <Link href="/compare">Sweepbase comparison tool</Link> to see fee breakdowns
              side by side for up to 4 cards.
            </p>
          </section>

          <TopCards
            title="Low-Fee Cards to Consider"
            cards={[
              { slug: 'binance-card', name: 'Binance Card', detail: 'No issuance fee, no annual fee' },
              { slug: 'cryptocom-visa-card', name: 'Crypto.com Visa', detail: 'Zero annual fee on base tier' },
              { slug: 'bybit-card', name: 'Bybit Card', detail: 'No FX markup, free virtual card' },
              { slug: 'nexo-card', name: 'Nexo Card', detail: '0% FX fee, no monthly charge' },
              { slug: 'redotpay-card', name: 'RedotPay Card', detail: 'Low issuance, global availability' },
            ]}
          />

          <section className="guide-cta-section">
            <h2>Start Comparing Fees</h2>
            <p>
              Every card on Sweepbase lists issuance fees, annual fees, FX charges, and ATM limits.
              Filter and compare to find the lowest-cost card for your spending pattern.
            </p>
            <Link href="/" className="btn btn-primary">
              Compare All Cards
            </Link>
          </section>

          <section className="category-faq">
            <h2 className="category-faq__title">Frequently Asked Questions</h2>
            <FAQAccordion items={FAQ_ITEMS} ns="fees-guide-faq" />
          </section>
        </article>
      </div>
    </main>
  );
}
