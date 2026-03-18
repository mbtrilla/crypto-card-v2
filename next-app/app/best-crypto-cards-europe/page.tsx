import { getAllCards, toCardListItem } from '@/lib/data';
import { isEuropeCard } from '@/lib/filters';
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
    q: 'Are crypto cards available across the European Union?',
    a: 'Yes. Most crypto cards listed here are available in all 27 EU member states plus Norway, Iceland, and Liechtenstein (the broader EEA). Some issuers also cover Switzerland and the UK separately. Check each card\'s detail page to confirm availability in your specific country.',
  },
  {
    q: 'What regulations govern crypto cards in Europe?',
    a: 'European crypto cards are issued under the EU\'s Payment Services Directive 2 (PSD2) and Electronic Money Directive (EMD2). Issuers must hold an e-money licence from a national competent authority — commonly the Bank of Lithuania, FCA (UK), or De Nederlandsche Bank. AML/KYC requirements follow AMLD5/AMLD6.',
  },
  {
    q: 'Which European crypto card has the highest cashback?',
    a: 'Premium staking-tier cards from Crypto.com (up to 5% CRO), Nexo (up to 2% in NEXO), and Plutus (up to 9% PLU for subscribers) offer the highest rates in Europe. However, cashback in native tokens introduces price risk — compare the actual USD equivalent when evaluating headline rates.',
  },
  {
    q: 'Do European crypto cards work outside the EU?',
    a: 'Yes. Visa and Mastercard cards issued in Europe work globally wherever those networks are accepted. Foreign transaction fees (typically 0–2.5%) and ATM withdrawal fees vary by issuer. Cards with Mastercard World or Visa Infinite status often include fee waivers on FX transactions.',
  },
  {
    q: 'Can UK residents still use EU crypto cards after Brexit?',
    a: 'Most EU-issued cards continue to work in the UK. However, some issuers segregate EU and UK products due to regulatory requirements. Several issuers — including Revolut and Wirex — hold both FCA (UK) and EU e-money licences, providing seamless service to customers in both regions.',
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const allCards = await getAllCards();
  const cards = allCards.filter(isEuropeCard);
  const title = 'Best Crypto Cards in Europe 2026 — Top Picks | Sweepbase';
  const description = generateCategoryMetaDescription('best-crypto-cards-europe', cards.length);
  const ogImage = `https://sweepbase.com/api/og?title=${encodeURIComponent('Best Crypto Cards in Europe 2026')}&count=${cards.length}&subtitle=Regional+Guide`;
  return {
    title,
    description,
    alternates: { canonical: 'https://sweepbase.com/best-crypto-cards-europe' },
    openGraph: {
      title,
      description,
      url: 'https://sweepbase.com/best-crypto-cards-europe',
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

export default async function BestCryptoCardsEurope() {
  const allCards = await getAllCards();
  const cards = allCards.filter(isEuropeCard);

  const webPageJsonLd = generateCategoryWebPageSchema(
    'Best Crypto Cards in Europe 2026',
    'https://sweepbase.com/best-crypto-cards-europe',
    [
      { name: 'Home', item: 'https://sweepbase.com' },
      { name: 'Best Crypto Cards in Europe', item: 'https://sweepbase.com/best-crypto-cards-europe' },
    ],
  );

  const itemListJsonLd = generateCategoryItemListSchema(
    cards,
    'https://sweepbase.com/best-crypto-cards-europe',
    'Best Crypto Cards in Europe 2026',
  );

  const faqJsonLd = generateFAQPageSchema(FAQ_ITEMS);

  return (
    <main className="category-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="container">
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'Best Crypto Cards in Europe' },
        ]} />

        <section className="category-hero">
          <h1 className="category-h1">Best Crypto Debit &amp; Credit Cards for European Users</h1>
          <p className="category-intro">
            European crypto card users benefit from robust consumer protections under the EU&apos;s
            Payment Services Directive and access to SEPA instant transfers, making crypto-to-EUR
            top-ups faster and cheaper than almost anywhere else in the world. Sweepbase has
            identified <strong>{cards.length} crypto cards</strong> available across EEA and EU
            member states — from UK-based Mastercard products issued under FCA regulation to
            pan-European Visa cards backed by licensed e-money institutions in Lithuania, Malta, and
            beyond. Whether you live in Germany, France, Spain, the Netherlands, or anywhere in the
            European Economic Area, you&apos;ll find suitable options below. European users should
            pay close attention to FX fees (especially important for travel outside the eurozone),
            the card issuer&apos;s regulatory licence, and which spending tier unlocks the best
            cashback rate. Many European crypto cards offer rewards in platform-native tokens —
            such as PLU, CRO, or BAXA — that can be staked for higher earning rates. Use the
            compare tool to find the best crypto card for your country before applying.
          </p>
        </section>

        <section className="category-why">
          <h2 className="category-why__title">Why These Cards?</h2>
          <ul className="category-why__list">
            <li className="category-why__item">
              <strong>Regulated issuers only</strong> — all cards are issued under FCA, Bank of Lithuania, or equivalent EEA national competent authority licences, ensuring consumer protection and deposit safeguarding.
            </li>
            <li className="category-why__item">
              <strong>SEPA-compatible funding</strong> — every listed card supports SEPA Credit Transfer or SEPA Instant top-ups for low-cost euro deposits directly from your bank account.
            </li>
            <li className="category-why__item">
              <strong>Multi-currency flexibility</strong> — selected cards handle EUR, GBP, CHF, and PLN spending without punitive conversion fees, ideal for users travelling across eurozone borders.
            </li>
          </ul>
        </section>

        <div className="category-also-see">
          <span className="category-also-see__label">Also see:</span>
          <a href="/best-crypto-cards-uk" className="category-also-see__chip">
            <i className="fa-solid fa-sterling-sign" aria-hidden="true"></i>
            Best Cards in the UK
          </a>
          <a href="/best-crypto-cards-usa" className="category-also-see__chip">
            <i className="fa-solid fa-flag-usa" aria-hidden="true"></i>
            Best Cards in the USA
          </a>
          <a href="/best-crypto-cards-asia" className="category-also-see__chip">
            <i className="fa-solid fa-earth-asia" aria-hidden="true"></i>
            Best Cards in Asia
          </a>
          <a href="/best-crypto-cards-canada" className="category-also-see__chip">
            <i className="fa-solid fa-leaf" aria-hidden="true"></i>
            Best Cards in Canada
          </a>
        </div>
      </div>

      <CategoryCardsGrid cards={cards.map(toCardListItem)} />

      <div className="container">
        <section className="category-faq">
          <h2 className="category-faq__title">Frequently Asked Questions</h2>
          <FAQAccordion items={FAQ_ITEMS} ns="europe-faq" />
        </section>
      </div>
    </main>
  );
}
