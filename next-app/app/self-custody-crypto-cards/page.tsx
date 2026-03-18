import { getAllCards, toCardListItem } from '@/lib/data';
import { isSelfCustodyCard } from '@/lib/filters';
import { generateCategoryMetaDescription } from '@/lib/meta';
import { generateCategoryItemListSchema, generateCategoryWebPageSchema, generateFAQPageSchema } from '@/lib/schemas';
import Breadcrumb from '@/components/Breadcrumb';
import CardSkeleton from '@/components/CardSkeleton';
import FAQAccordion, { type FAQItem } from '@/components/FAQAccordion';
import dynamic from 'next/dynamic';
import { Metadata } from 'next';

const CategoryCardsGrid = dynamic(() => import('@/components/CategoryCardsGrid'), {
  loading: () => (
    <section className="results-section" aria-busy="true">
      <div className="container">
        <div className="cards-grid">
          {Array.from({ length: 12 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    </section>
  ),
});

export const revalidate = 3600;

const FAQ_ITEMS: FAQItem[] = [
  {
    q: 'What is a self-custody crypto card?',
    a: 'A self-custody crypto card lets you retain full control of your private keys and crypto assets until the moment you make a purchase. Unlike custodial cards (where the exchange holds your funds), non-custodial cards connect to your personal Web3 wallet — such as MetaMask, Ledger, or a hardware wallet — and only trigger a crypto transfer when you spend.',
  },
  {
    q: 'How do self-custody cards convert crypto to fiat at the point of sale?',
    a: 'Self-custody cards typically use a smart contract or an on-chain delegation mechanism to authorise a spend. When you tap your card, the card platform pulls the exact fiat equivalent from your wallet balance — either by selling crypto in real time or drawing from a pre-approved credit line backed by your collateral. The merchant receives standard fiat via Visa or Mastercard.',
  },
  {
    q: 'Do self-custody crypto cards require KYC?',
    a: 'KYC requirements vary by issuer. Most self-custody cards require at least basic identity verification (government ID + selfie) to comply with AML regulations in their licensing jurisdiction. Some cards offer tiered KYC where lower spending limits require less verification. Fully zero-KYC crypto cards are rare and usually have significant spending restrictions.',
  },
  {
    q: 'Are self-custody crypto cards as safe as hardware wallets?',
    a: 'Self-custody cards reduce counterparty risk (no exchange holding your funds), but security depends on how well you protect your own wallet. Smart contract bugs and oracle manipulation are additional risks specific to DeFi-based card mechanisms. Always use a hardware wallet where supported and enable all available security features on your card account.',
  },
  {
    q: 'Which blockchains do self-custody crypto cards support?',
    a: 'Self-custody card support varies widely. Ethereum and EVM-compatible chains (Arbitrum, Base, Optimism, Polygon) are the most common. Some cards — like the Avalanche Card — are chain-specific. Others support Solana or Bitcoin via UTXO-locking mechanisms. Check each card\'s listing for the specific supported networks and wallet compatibility.',
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const allCards = await getAllCards();
  const cards = allCards.filter(isSelfCustodyCard);
  const title = 'Best Self-Custody Crypto Cards 2026 — No KYC Options | Sweepbase';
  const description = generateCategoryMetaDescription('self-custody-crypto-cards', cards.length);
  const ogImage = `https://sweepbase.com/api/og?title=${encodeURIComponent('Best Self-Custody Crypto Cards 2026')}&count=${cards.length}&subtitle=Custody+Filter`;
  return {
    title,
    description,
    alternates: { canonical: 'https://sweepbase.com/self-custody-crypto-cards' },
    openGraph: {
      title,
      description,
      url: 'https://sweepbase.com/self-custody-crypto-cards',
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  };
}

export default async function SelfCustodyCryptoCards() {
  const allCards = await getAllCards();
  const cards = allCards.filter(isSelfCustodyCard);

  const webPageJsonLd = generateCategoryWebPageSchema(
    'Best Self-Custody Crypto Cards 2026',
    'https://sweepbase.com/self-custody-crypto-cards',
    [
      { name: 'Home', item: 'https://sweepbase.com' },
      { name: 'Self-Custody Crypto Cards', item: 'https://sweepbase.com/self-custody-crypto-cards' },
    ],
  );

  const itemListJsonLd = generateCategoryItemListSchema(
    cards,
    'https://sweepbase.com/self-custody-crypto-cards',
    'Best Self-Custody Crypto Cards 2026',
  );

  const faqJsonLd = generateFAQPageSchema(FAQ_ITEMS);

  return (
    <main className="category-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="container">
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'Self-Custody Crypto Cards' },
        ]} />

        <section className="category-hero">
          <h1 className="category-h1">Best Self-Custody Crypto Cards</h1>
          <p className="category-intro">
            Self-custody crypto cards let you maintain full control of your private keys right up
            until the moment you make a purchase — unlike custodial exchange cards where the
            platform holds your funds. Sweepbase has identified{' '}
            <strong>{cards.length} self-custody crypto cards</strong>, making them ideal for DeFi
            enthusiasts, privacy-conscious users, and anyone who lives by the maxim &ldquo;not your
            keys, not your coins.&rdquo; These non-custodial cards typically connect directly to
            your Web3 wallet — such as MetaMask, Ledger, or a platform-native wallet — and convert
            crypto to fiat in real time at the point of sale without requiring a centralised
            exchange to hold your balance. Because these cards operate without a custodial
            intermediary, KYC requirements vary widely: some require full identity verification
            while others offer minimal-KYC or even zero-KYC onboarding. Many self-custody cards
            also support staking or yield features on idle balances. Compare supported blockchains,
            cashback rates, FX fees, and ATM limits below to find the best non-custodial crypto
            card for your security model.
          </p>
        </section>

        <section className="category-why">
          <h2 className="category-why__title">Why These Cards?</h2>
          <ul className="category-why__list">
            <li className="category-why__item">
              <strong>True non-custodial architecture</strong> — all listed cards are verified to keep funds in the user&apos;s own wallet until purchase, not in an exchange hot wallet, eliminating exchange counterparty and insolvency risk.
            </li>
            <li className="category-why__item">
              <strong>DeFi-compatible</strong> — selected cards work alongside DeFi lending, staking, and yield protocols, allowing your collateral to earn yield while simultaneously being available for card spending.
            </li>
            <li className="category-why__item">
              <strong>Smart contract security verified</strong> — we flag cards whose smart contract code has been audited by third-party security firms, helping you evaluate the technical risk profile before choosing a non-custodial card.
            </li>
          </ul>
        </section>
        <div className="category-also-see">
          <span className="category-also-see__label">Also see:</span>
          <a href="/visa-crypto-cards" className="category-also-see__chip">
            <i className="fa-solid fa-credit-card" aria-hidden="true"></i>
            Visa Crypto Cards
          </a>
          <a href="/mastercard-crypto-cards" className="category-also-see__chip">
            <i className="fa-solid fa-circle-dot" aria-hidden="true"></i>
            Mastercard Crypto Cards
          </a>
          <a href="/crypto-cards-with-cashback" className="category-also-see__chip">
            <i className="fa-solid fa-percent" aria-hidden="true"></i>
            Cards With Cashback
          </a>
        </div>
      </div>

      <CategoryCardsGrid cards={cards.map(toCardListItem)} />

      <div className="container">
        <section className="category-faq">
          <h2 className="category-faq__title">Frequently Asked Questions</h2>
          <FAQAccordion items={FAQ_ITEMS} ns="selfcustody-faq" />
        </section>
      </div>
    </main>
  );
}
