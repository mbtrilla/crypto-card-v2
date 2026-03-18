import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import TopCards from '@/components/TopCards';
import FAQAccordion, { type FAQItem } from '@/components/FAQAccordion';
import { generateFAQPageSchema } from '@/lib/schemas';

export const metadata: Metadata = {
  title: 'Self-Custody vs Custodial Crypto Cards — Which Is Better? | Sweepbase',
  description:
    'Compare self-custody and custodial crypto cards. Understand the trade-offs in security, convenience, and control to choose the right model for you.',
  alternates: { canonical: 'https://sweepbase.com/guides/self-custody-vs-custodial-crypto-cards' },
  openGraph: {
    title: 'Self-Custody vs Custodial Crypto Cards — Which Is Better? | Sweepbase',
    description:
      'Compare self-custody and custodial crypto cards. Understand the trade-offs in security, convenience, and control.',
    url: 'https://sweepbase.com/guides/self-custody-vs-custodial-crypto-cards',
    type: 'article',
    images: [{ url: 'https://sweepbase.com/og-image.png', width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
};

const FAQ_ITEMS: FAQItem[] = [
  {
    q: 'What happens to my crypto on a custodial card if the company goes bankrupt?',
    a: 'If a custodial card issuer becomes insolvent, your crypto held on their platform may be treated as part of the bankruptcy estate. Unlike bank deposits (which may have FDIC/FSCS protection), crypto balances on most custodial platforms are not insured. This is one of the key risks of custodial cards and a major argument for self-custody alternatives.',
  },
  {
    q: 'Can I use a hardware wallet with a self-custody crypto card?',
    a: 'Some self-custody cards integrate directly with hardware wallets like Ledger. Others connect to software wallets like MetaMask or Phantom. The card typically initiates a transaction that you approve in your wallet, and the crypto is converted to fiat only at the moment of purchase.',
  },
  {
    q: 'Are self-custody cards harder to use than custodial ones?',
    a: 'Self-custody cards have improved significantly but still require more steps: you need to manage your own wallet, approve transactions, and handle gas fees. Custodial cards feel more like traditional debit cards — load funds, tap, and go. The trade-off is control vs convenience.',
  },
];

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Self-Custody vs Custodial Crypto Cards',
  description: 'Compare self-custody and custodial crypto card models.',
  url: 'https://sweepbase.com/guides/self-custody-vs-custodial-crypto-cards',
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
  mainEntityOfPage: 'https://sweepbase.com/guides/self-custody-vs-custodial-crypto-cards',
};

export default function CustodyGuide() {
  const faqJsonLd = generateFAQPageSchema(FAQ_ITEMS);

  return (
    <main className="guide-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="container guide-container">
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'Guides', href: '/guides' },
          { label: 'Self-Custody vs Custodial' },
        ]} />

        <article className="guide-article">
          <h1>Self-Custody vs Custodial Crypto Cards</h1>
          <p className="guide-meta">By Sweepbase Editorial Team · Last updated: <time dateTime="2026-03-18">March 18, 2026</time></p>
          <p className="guide-lead">
            The custody model is one of the most important decisions when choosing a crypto card. It
            determines who controls your private keys, how your funds are protected, and what happens
            if something goes wrong.
          </p>

          <section>
            <h2>What Is a Custodial Crypto Card?</h2>
            <p>
              A custodial card is issued by a platform (exchange, neobank, or fintech) that holds your
              crypto on your behalf. You deposit funds into your account on their platform, and the
              card draws from that balance when you make a purchase.
            </p>
            <p><strong>Examples:</strong> Binance Card, Crypto.com Visa, Coinbase Card, Bybit Card.</p>
            <h3>Pros</h3>
            <ul>
              <li>Simple onboarding and familiar UX (similar to traditional banking apps)</li>
              <li>Instant conversion at point of sale — no wallet interaction needed</li>
              <li>Often higher cashback rates due to platform token incentives</li>
              <li>Integrated portfolio management and trading within the same app</li>
            </ul>
            <h3>Cons</h3>
            <ul>
              <li>You don&apos;t hold your private keys — &quot;not your keys, not your coins&quot;</li>
              <li>Counterparty risk: if the platform fails, your funds may be lost</li>
              <li>Platform can freeze your account (regulatory compliance, suspicious activity)</li>
              <li>Less privacy — full KYC and transaction monitoring</li>
            </ul>
          </section>

          <section>
            <h2>What Is a Self-Custody Crypto Card?</h2>
            <p>
              A self-custody card connects to your own non-custodial wallet (MetaMask, Ledger, Phantom,
              Gnosis Safe, etc.). Your crypto stays in your wallet until the exact moment of purchase,
              when it&apos;s converted to fiat and sent to the merchant via the card network.
            </p>
            <p><strong>Examples:</strong> MetaMask Card, Gnosis Pay, Ledger Card, Holyheld Card.</p>
            <h3>Pros</h3>
            <ul>
              <li>You retain full control of your private keys</li>
              <li>No counterparty risk — funds aren&apos;t held by a third party</li>
              <li>Works with DeFi protocols (spend directly from yield-generating positions)</li>
              <li>Greater privacy (depending on the wallet and chain used)</li>
            </ul>
            <h3>Cons</h3>
            <ul>
              <li>More complex UX — requires wallet management and transaction signing</li>
              <li>Gas fees on each top-up or conversion transaction</li>
              <li>Fewer card options available (market is still maturing)</li>
              <li>May require specific chains or tokens for compatibility</li>
            </ul>
          </section>

          <section>
            <h2>Side-by-Side Comparison</h2>
            <div className="compare-table-wrapper">
              <table className="compare-table">
                <thead>
                  <tr>
                    <th scope="col">Factor</th>
                    <th scope="col">Custodial</th>
                    <th scope="col">Self-Custody</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Key control</td><td>Platform holds keys</td><td>You hold keys</td></tr>
                  <tr><td>Counterparty risk</td><td>High</td><td>Low</td></tr>
                  <tr><td>Ease of use</td><td>Simple</td><td>Moderate</td></tr>
                  <tr><td>Cashback rates</td><td>Often higher</td><td>Variable</td></tr>
                  <tr><td>DeFi integration</td><td>Limited</td><td>Native</td></tr>
                  <tr><td>Account freezing risk</td><td>Yes</td><td>Minimal</td></tr>
                  <tr><td>Gas fees</td><td>None</td><td>Per transaction</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2>Which Should You Choose?</h2>
            <p><strong>Choose custodial if:</strong></p>
            <ul>
              <li>You want the simplest possible experience</li>
              <li>You already use an exchange and want an integrated card</li>
              <li>Maximising cashback is your priority</li>
              <li>You&apos;re comfortable with the platform&apos;s reputation and track record</li>
            </ul>
            <p><strong>Choose self-custody if:</strong></p>
            <ul>
              <li>You believe in &quot;not your keys, not your coins&quot;</li>
              <li>You want to spend directly from DeFi positions or cold storage</li>
              <li>You&apos;re technically comfortable managing wallets and signing transactions</li>
              <li>Minimising counterparty risk is your top priority</li>
            </ul>
          </section>

          <TopCards
            title="Top Self-Custody Cards"
            cards={[
              { slug: 'metamask-card', name: 'MetaMask Card', detail: 'Spend from MetaMask wallet, Mastercard' },
              { slug: 'gnosis-pay-card', name: 'Gnosis Pay', detail: 'Gnosis Safe wallet, Visa, EEA' },
              { slug: 'ledger-card', name: 'Ledger Card', detail: 'Hardware wallet backed, Visa' },
              { slug: 'holyheld-card', name: 'Holyheld Card', detail: 'DeFi-native, multi-chain' },
            ]}
          />

          <section className="guide-cta-section">
            <h2>Browse by Custody Type</h2>
            <p>
              Use Sweepbase to filter cards by custody model and compare them side by side.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link href="/self-custody-crypto-cards" className="btn btn-primary">
                Self-Custody Cards
              </Link>
              <Link href="/" className="btn btn-outline">
                All Cards
              </Link>
            </div>
          </section>

          <section className="category-faq">
            <h2 className="category-faq__title">Frequently Asked Questions</h2>
            <FAQAccordion items={FAQ_ITEMS} ns="custody-guide-faq" />
          </section>
        </article>
      </div>
    </main>
  );
}
