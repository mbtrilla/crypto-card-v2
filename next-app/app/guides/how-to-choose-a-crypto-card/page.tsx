import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import TopCards from '@/components/TopCards';
import FAQAccordion, { type FAQItem } from '@/components/FAQAccordion';
import { generateFAQPageSchema, generateBreadcrumbSchema } from '@/lib/schemas';

export const metadata: Metadata = {
  title: 'How to Choose a Crypto Card in 2026 — Complete Guide | Sweepbase',
  description:
    'Step-by-step guide to choosing the best crypto debit or credit card. Compare fees, rewards, custody models, and regional availability.',
  alternates: { canonical: 'https://sweepbase.com/guides/how-to-choose-a-crypto-card' },
  openGraph: {
    title: 'How to Choose a Crypto Card in 2026 — Complete Guide | Sweepbase',
    description:
      'Step-by-step guide to choosing the best crypto debit or credit card. Compare fees, rewards, custody models, and regional availability.',
    url: 'https://sweepbase.com/guides/how-to-choose-a-crypto-card',
    type: 'article',
    publishedTime: '2026-03-16T00:00:00Z',
    modifiedTime: '2026-03-18T00:00:00Z',
    authors: ['Sweepbase Editorial Team'],
    section: 'Guides',
    images: [{ url: `https://sweepbase.com/api/og?title=${encodeURIComponent('How to Choose a Crypto Card in 2026')}&subtitle=Guide`, width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
};

const FAQ_ITEMS: FAQItem[] = [
  {
    q: 'What is a crypto debit card?',
    a: 'A crypto debit card is a Visa or Mastercard that converts your cryptocurrency holdings into fiat currency (USD, EUR, GBP, etc.) at the point of sale. You load crypto onto the card — or link a wallet — and spend it anywhere the card network is accepted, just like a traditional debit card.',
  },
  {
    q: 'Are crypto cards safe to use?',
    a: 'Reputable crypto cards issued by regulated entities (FCA, FinCEN, EU EMI-licensed) are generally safe. Look for cards with KYC/AML compliance, insured custodial wallets, and established issuers. Self-custody cards add an extra layer of security by keeping your private keys under your control until the moment of purchase.',
  },
  {
    q: 'Do I need to pay taxes when spending crypto with a card?',
    a: 'In most jurisdictions, spending crypto via a card is a taxable disposal event. In the US, it triggers capital gains tax; in the UK, CGT applies. The card issuer typically provides transaction history, but you are responsible for tracking your cost basis. Consult a tax professional in your country.',
  },
];

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How to Choose a Crypto Card in 2026',
  description: 'Step-by-step guide to choosing the best crypto debit or credit card.',
  url: 'https://sweepbase.com/guides/how-to-choose-a-crypto-card',
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
  mainEntityOfPage: 'https://sweepbase.com/guides/how-to-choose-a-crypto-card',
};

export default function HowToChooseGuide() {
  const faqJsonLd = generateFAQPageSchema(FAQ_ITEMS);
  const breadcrumbJsonLd = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://sweepbase.com' },
    { name: 'Guides', url: 'https://sweepbase.com/guides' },
    { name: 'How to Choose a Crypto Card', url: 'https://sweepbase.com/guides/how-to-choose-a-crypto-card' },
  ]);

  return (
    <main className="guide-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="container guide-container">
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'Guides', href: '/guides' },
          { label: 'How to Choose a Crypto Card' },
        ]} />

        <article className="guide-article">
          <h1>How to Choose a Crypto Card in 2026</h1>
          <p className="guide-meta">By Sweepbase Editorial Team · Last updated: <time dateTime="2026-03-18">March 18, 2026</time></p>
          <p className="guide-lead">
            With over 100 crypto debit and credit cards on the market, finding the right one can be
            overwhelming. This guide walks you through the key factors to consider so you can make a
            confident decision.
          </p>

          <nav className="guide-toc" aria-label="Table of contents">
            <h2>In This Guide</h2>
            <ol>
              <li><a href="#step-1">Define your spending goals</a></li>
              <li><a href="#step-2">Check regional availability</a></li>
              <li><a href="#step-3">Compare fee structures</a></li>
              <li><a href="#step-4">Evaluate cashback &amp; rewards</a></li>
              <li><a href="#step-5">Choose custody model</a></li>
              <li><a href="#step-6">Verify network &amp; wallet support</a></li>
            </ol>
          </nav>

          <section id="step-1">
            <h2>1. Define Your Spending Goals</h2>
            <p>
              Before comparing cards, clarify how you plan to use one. Are you looking to spend crypto
              for daily purchases, or do you want a card primarily for travel? Do you hold Bitcoin
              exclusively, or a mix of tokens? Your answers will narrow the field significantly.
            </p>
            <ul>
              <li><strong>Daily spending:</strong> Prioritise low FX fees and wide merchant acceptance.</li>
              <li><strong>Travel:</strong> Look for cards with no foreign transaction fees and multi-currency support.</li>
              <li><strong>Cashback maximisation:</strong> Focus on cards with the highest reward rates on your typical spend categories.</li>
              <li><strong>DeFi integration:</strong> Consider self-custody cards that connect directly to your on-chain wallet.</li>
            </ul>
          </section>

          <section id="step-2">
            <h2>2. Check Regional Availability</h2>
            <p>
              Not all crypto cards are available everywhere. Regulatory requirements vary by country,
              and many cards restrict certain jurisdictions. Before falling in love with a card&apos;s
              features, confirm it accepts customers in your country or state.
            </p>
            <p>
              Sweepbase lists regional availability for every card. Use our{' '}
              <Link href="/best-crypto-cards-usa">USA</Link>,{' '}
              <Link href="/best-crypto-cards-europe">Europe</Link>,{' '}
              <Link href="/best-crypto-cards-uk">UK</Link>, or{' '}
              <Link href="/best-crypto-cards-asia">Asia</Link>{' '}
              category pages to find cards pre-filtered for your region.
            </p>
          </section>

          <section id="step-3">
            <h2>3. Compare Fee Structures</h2>
            <p>
              Fees are where most of the real cost lives. A card with impressive cashback can still
              cost you more if it charges high issuance, annual, or FX conversion fees.
            </p>
            <p>Key fees to compare:</p>
            <ul>
              <li><strong>Issuance fee:</strong> One-time cost to get the card (many are free).</li>
              <li><strong>Annual/monthly fee:</strong> Recurring cost, sometimes waived with minimum spend or staking.</li>
              <li><strong>FX fee:</strong> Percentage charged on cross-currency transactions. Ranges from 0% to 3%+.</li>
              <li><strong>ATM withdrawal fee:</strong> Per-withdrawal charge plus potential network surcharges.</li>
              <li><strong>Crypto-to-fiat spread:</strong> The hidden margin on conversion at the point of sale.</li>
            </ul>
            <p>
              For a deep dive, read our{' '}
              <Link href="/guides/crypto-card-fees-explained">Crypto Card Fees Explained</Link> guide.
            </p>
          </section>

          <section id="step-4">
            <h2>4. Evaluate Cashback &amp; Rewards</h2>
            <p>
              Many crypto cards offer cashback in BTC, stablecoins, or the issuer&apos;s native token.
              Rates typically range from 0.5% to 8%, with higher tiers requiring token staking or
              premium subscriptions.
            </p>
            <p>Things to watch for:</p>
            <ul>
              <li><strong>Cashback currency:</strong> BTC and stablecoins hold value; volatile tokens may not.</li>
              <li><strong>Caps:</strong> Some cards cap monthly cashback at a fixed dollar amount.</li>
              <li><strong>Staking requirements:</strong> Higher tiers often require locking significant value in platform tokens.</li>
              <li><strong>Net reward:</strong> Always calculate cashback minus all fees to find the true return.</li>
            </ul>
            <p>
              Browse our <Link href="/crypto-cards-with-cashback">cashback cards category</Link> to
              compare options side by side.
            </p>
          </section>

          <section id="step-5">
            <h2>5. Choose Your Custody Model</h2>
            <p>
              This is a fundamental choice that affects security, control, and convenience.
            </p>
            <ul>
              <li>
                <strong>Custodial cards:</strong> The issuer holds your crypto. Simpler UX, but you
                don&apos;t control your private keys. If the platform goes down, your funds may be at risk.
              </li>
              <li>
                <strong>Self-custody cards:</strong> You hold your own keys in a non-custodial wallet.
                Crypto is only converted at the moment of purchase. More control, more responsibility.
              </li>
            </ul>
            <p>
              Learn more in our{' '}
              <Link href="/guides/self-custody-vs-custodial-crypto-cards">
                Self-Custody vs Custodial guide
              </Link>.
            </p>
          </section>

          <section id="step-6">
            <h2>6. Verify Network &amp; Wallet Support</h2>
            <p>
              Most crypto cards run on Visa or Mastercard. Both networks offer near-universal acceptance,
              but there are differences in contactless limits, ATM network coverage, and Apple/Google Pay
              compatibility.
            </p>
            <p>
              Also check which cryptocurrencies the card supports for top-up. If you primarily hold
              assets on a specific chain (Solana, Ethereum L2s, etc.), make sure the card can accept
              deposits from that network without requiring a centralised exchange bridge.
            </p>
            <p>
              Browse by network: <Link href="/visa-crypto-cards">Visa cards</Link> |{' '}
              <Link href="/mastercard-crypto-cards">Mastercard cards</Link>
            </p>
          </section>

          <TopCards
            title="Popular Cards to Start With"
            cards={[
              { slug: 'coinbase-card', name: 'Coinbase Card', detail: 'Easy setup, wide US coverage' },
              { slug: 'cryptocom-visa-card', name: 'Crypto.com Visa', detail: 'Up to 5% cashback, global' },
              { slug: 'binance-card', name: 'Binance Card', detail: 'Zero fees, 8% cashback tier' },
              { slug: 'metamask-card', name: 'MetaMask Card', detail: 'Self-custody, DeFi-native' },
              { slug: 'gnosis-pay-card', name: 'Gnosis Pay', detail: 'Self-custody Visa, EEA' },
            ]}
          />

          <section className="guide-cta-section">
            <h2>Ready to Compare?</h2>
            <p>
              Use the Sweepbase comparison tool to evaluate cards based on the criteria above. Filter
              by region, network, custody model, and cashback rate to find your perfect match.
            </p>
            <Link href="/" className="btn btn-primary">
              Browse All Cards
            </Link>
          </section>

          <section className="category-faq">
            <h2 className="category-faq__title">Frequently Asked Questions</h2>
            <FAQAccordion items={FAQ_ITEMS} ns="choose-guide-faq" />
          </section>
        </article>
      </div>
    </main>
  );
}
