import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import TopCards from '@/components/TopCards';
import FAQAccordion, { type FAQItem } from '@/components/FAQAccordion';
import { generateFAQPageSchema } from '@/lib/schemas';

export const metadata: Metadata = {
  title: 'Best Crypto Cards for Beginners 2026 — Start Here | Sweepbase',
  description:
    'New to crypto cards? This guide covers the simplest, lowest-risk options for first-time users. Learn what to look for and which cards to start with.',
  alternates: { canonical: 'https://sweepbase.com/guides/best-crypto-cards-for-beginners' },
  openGraph: {
    title: 'Best Crypto Cards for Beginners 2026 — Start Here | Sweepbase',
    description:
      'New to crypto cards? This guide covers the simplest, lowest-risk options for first-time users.',
    url: 'https://sweepbase.com/guides/best-crypto-cards-for-beginners',
    type: 'article',
    images: [{ url: 'https://sweepbase.com/og-image.png', width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
};

const FAQ_ITEMS: FAQItem[] = [
  {
    q: 'Do I need to own crypto before getting a crypto card?',
    a: 'Not necessarily. Many crypto card issuers let you buy crypto directly within their app using a bank transfer or debit card. Some cards also accept fiat deposits, meaning you can load regular currency and the app handles conversion automatically when you spend.',
  },
  {
    q: 'Can I lose money with a crypto card?',
    a: 'The main risk is price volatility. If you load Bitcoin onto a card and its value drops before you spend, you effectively lose purchasing power. To avoid this, many beginners load stablecoins (USDT, USDC) which maintain a 1:1 peg with the US dollar. Fees can also eat into your balance if you don\'t choose a card with a competitive fee structure.',
  },
  {
    q: 'What is the minimum amount I need to start?',
    a: 'Most cards have no minimum balance requirement, though some require a minimum top-up amount ($10-$50). You can start with as little as $20-50 to test the card before committing to larger amounts.',
  },
];

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Best Crypto Cards for Beginners 2026',
  description: 'Guide to the simplest, lowest-risk crypto cards for first-time users.',
  url: 'https://sweepbase.com/guides/best-crypto-cards-for-beginners',
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
  mainEntityOfPage: 'https://sweepbase.com/guides/best-crypto-cards-for-beginners',
};

export default function BeginnersGuide() {
  const faqJsonLd = generateFAQPageSchema(FAQ_ITEMS);

  return (
    <main className="guide-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="container guide-container">
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'Guides', href: '/guides' },
          { label: 'Best Cards for Beginners' },
        ]} />

        <article className="guide-article">
          <h1>Best Crypto Cards for Beginners in 2026</h1>
          <p className="guide-meta">By Sweepbase Editorial Team · Last updated: <time dateTime="2026-03-18">March 18, 2026</time></p>
          <p className="guide-lead">
            Getting your first crypto card doesn&apos;t have to be complicated. This guide helps
            you understand what to look for, avoid common mistakes, and choose a card that matches
            your experience level.
          </p>

          <section>
            <h2>What Makes a Card Beginner-Friendly?</h2>
            <p>Not all crypto cards are created equal. For beginners, the best cards share these traits:</p>
            <ul>
              <li><strong>Simple onboarding:</strong> Quick KYC, intuitive app, no crypto jargon overload.</li>
              <li><strong>Low or no fees:</strong> Free issuance, no annual fee, and transparent pricing.</li>
              <li><strong>Fiat on-ramp:</strong> Ability to load the card with regular currency (USD, EUR, GBP) via bank transfer.</li>
              <li><strong>Stablecoin support:</strong> Option to hold USDT/USDC to avoid price volatility.</li>
              <li><strong>Established issuer:</strong> Backed by a reputable exchange or fintech with a track record.</li>
              <li><strong>Wide acceptance:</strong> Visa or Mastercard network for use at any merchant.</li>
            </ul>
          </section>

          <section>
            <h2>5 Mistakes Beginners Should Avoid</h2>
            <ol>
              <li>
                <strong>Loading volatile crypto and spending immediately.</strong> If Bitcoin drops 10%
                between your top-up and your purchase, you&apos;ve lost 10%. Use stablecoins for everyday
                spending until you&apos;re comfortable.
              </li>
              <li>
                <strong>Ignoring fees.</strong> A &quot;free&quot; card with a 2% FX spread costs $240/year
                on $1,000/month spending. Read our{' '}
                <Link href="/guides/crypto-card-fees-explained">fees guide</Link> to understand the real costs.
              </li>
              <li>
                <strong>Staking tokens for higher cashback tiers.</strong> If you&apos;re new to crypto,
                don&apos;t lock up money in volatile tokens just for an extra 1% cashback. Start with
                the free tier.
              </li>
              <li>
                <strong>Not checking regional availability.</strong> Many cards don&apos;t serve all
                countries. Verify availability before starting the KYC process.
              </li>
              <li>
                <strong>Forgetting about taxes.</strong> Spending crypto is a taxable event in most
                countries. Keep transaction records from day one.
              </li>
            </ol>
          </section>

          <section>
            <h2>Recommended Cards for Beginners</h2>
            <p>
              Based on simplicity, low fees, and broad availability, these types of cards work well
              for first-time users:
            </p>
            <ul>
              <li>
                <strong>Exchange-backed cards</strong> from platforms like{' '}
                <Link href="/cards/coinbase-card">Coinbase</Link>,{' '}
                <Link href="/cards/binance-card">Binance</Link>, or{' '}
                <Link href="/cards/bybit-card">Bybit</Link> — if you already have an exchange account,
                getting the card is often just a few clicks.
              </li>
              <li>
                <strong>Stablecoin-first cards</strong> that let you load USDC or USDT and spend
                without worrying about price volatility.
              </li>
              <li>
                <strong>Cards with fiat on-ramp</strong> — load regular currency from your bank account
                and let the app handle conversion behind the scenes.
              </li>
            </ul>
            <p>
              Browse the full list on Sweepbase and use the filters to find cards with free issuance,
              no annual fee, and your preferred network.
            </p>
          </section>

          <section>
            <h2>Getting Started: Step by Step</h2>
            <ol>
              <li><strong>Choose a card</strong> using the criteria above. Use <Link href="/compare">our comparison tool</Link> if you&apos;re deciding between 2-3 options.</li>
              <li><strong>Complete KYC.</strong> Most cards require ID verification. Have your passport or driver&apos;s licence ready.</li>
              <li><strong>Load with stablecoins or fiat.</strong> Start small ($20-50) to test the card before committing larger amounts.</li>
              <li><strong>Make a small purchase.</strong> Try a low-value transaction to confirm everything works.</li>
              <li><strong>Track your transactions.</strong> Export CSV from the app for tax purposes.</li>
            </ol>
          </section>

          <TopCards
            title="Best Cards for Beginners"
            cards={[
              { slug: 'coinbase-card', name: 'Coinbase Card', detail: 'Simple UX, broad US coverage' },
              { slug: 'binance-card', name: 'Binance Card', detail: 'Zero fees to get started' },
              { slug: 'bybit-card', name: 'Bybit Card', detail: 'Free virtual card, easy setup' },
              { slug: 'cryptocom-visa-card', name: 'Crypto.com Visa', detail: 'Popular worldwide, no annual fee' },
              { slug: 'revolut-card', name: 'Revolut Card', detail: 'Fiat + crypto in one app' },
            ]}
          />

          <section className="guide-cta-section">
            <h2>Find Your First Crypto Card</h2>
            <p>
              Browse all cards on Sweepbase, filter by &quot;free issuance&quot; and your region,
              and compare up to 4 options side by side.
            </p>
            <Link href="/" className="btn btn-primary">
              Browse All Cards
            </Link>
          </section>

          <section className="category-faq">
            <h2 className="category-faq__title">Frequently Asked Questions</h2>
            <FAQAccordion items={FAQ_ITEMS} ns="beginners-guide-faq" />
          </section>
        </article>
      </div>
    </main>
  );
}
