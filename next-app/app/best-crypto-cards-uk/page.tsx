import { getAllCards, toCardListItem } from '@/lib/data';
import { isUKCard } from '@/lib/filters';
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
    q: 'Are crypto debit cards legal in the United Kingdom?',
    a: 'Yes. Crypto debit cards are legal in the UK when issued by an FCA-authorised e-money institution or a licensed partner bank. The FCA regulates crypto-asset activity under the Money Laundering Regulations, so all UK-available cards must meet KYC and AML requirements.',
  },
  {
    q: 'Do I pay tax on crypto card spending in the UK?',
    a: 'HMRC treats disposing of crypto (including spending it via a card) as a Capital Gains Tax event. You may owe CGT if the value of your crypto has increased since acquisition. Crypto cashback rewards are generally treated as miscellaneous income. Consult a tax adviser for your specific situation.',
  },
  {
    q: 'Can I use a crypto card with Apple Pay in the UK?',
    a: 'Many UK-available crypto cards support Apple Pay and Google Pay for contactless payments. Check the individual card listing on Sweepbase for wallet compatibility before applying.',
  },
  {
    q: 'Which crypto cards support GBP top-ups?',
    a: 'Most UK-focused cards support Faster Payments (FPS) bank transfers in GBP. Some also accept UK debit card top-ups. Cards issued under EEA licences may require a SEPA EUR top-up with an FX conversion, so check funding methods on each card page.',
  },
  {
    q: 'What is the best crypto card for UK residents in 2026?',
    a: 'It depends on your priorities. For highest cashback, look at cards with staking-tier rewards. For simple GBP spending with low fees, cards with FPS top-up and zero FX markup are ideal. Use the compare tool on this page to filter by your preferences.',
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const allCards = await getAllCards();
  const cards = allCards.filter(isUKCard);
  const title = 'Best Crypto Cards in the UK 2026 — Top Picks | Sweepbase';
  const description = generateCategoryMetaDescription('best-crypto-cards-uk', cards.length);
  return {
    title,
    description,
    alternates: { canonical: 'https://sweepbase.com/best-crypto-cards-uk' },
    openGraph: {
      title,
      description,
      url: 'https://sweepbase.com/best-crypto-cards-uk',
      type: 'website',
      images: [{ url: 'https://sweepbase.com/og-image.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://sweepbase.com/og-image.png'],
    },
    robots: { index: true, follow: true },
  };
}

export default async function BestCryptoCardsUK() {
  const allCards = await getAllCards();
  const cards = allCards.filter(isUKCard);

  const webPageJsonLd = generateCategoryWebPageSchema(
    'Best Crypto Cards in the UK 2026',
    'https://sweepbase.com/best-crypto-cards-uk',
    [
      { name: 'Home', item: 'https://sweepbase.com' },
      { name: 'Best Crypto Cards in the UK', item: 'https://sweepbase.com/best-crypto-cards-uk' },
    ],
  );

  const itemListJsonLd = generateCategoryItemListSchema(
    cards,
    'https://sweepbase.com/best-crypto-cards-uk',
    'Best Crypto Cards in the UK 2026',
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
          { label: 'Best Crypto Cards in the UK' },
        ]} />

        <section className="category-hero">
          <h1 className="category-h1">Best Crypto Debit &amp; Credit Cards in the UK</h1>
          <p className="category-intro">
            The United Kingdom is one of Europe&apos;s most active crypto markets, with a growing range
            of FCA-compliant debit and credit cards that let you spend Bitcoin, Ethereum, and stablecoins
            at any Visa or Mastercard terminal. Sweepbase has identified{' '}
            <strong>{cards.length} crypto cards</strong> currently available to UK residents &mdash;
            including both UK-issued products and globally-available cards that accept British customers.
            Key considerations for UK users include GBP top-up support via Faster Payments, FX fees on
            non-Sterling transactions, FSCS deposit protection eligibility, and Apple Pay / Google Pay
            compatibility. Cards range from exchange-backed custodial products with cashback in platform
            tokens to self-custody wallets that preserve control of your private keys until the point of
            purchase. Use the filters below to compare issuance fees, annual costs, ATM limits, and
            reward structures side by side.
          </p>
        </section>

        <section className="category-why">
          <h2 className="category-why__title">Why These Cards?</h2>
          <ul className="category-why__list">
            <li className="category-why__item">
              <strong>FCA-regulated issuers</strong> &mdash; every card listed operates under an FCA-authorised e-money licence or a licensed banking partner, ensuring UK regulatory compliance.
            </li>
            <li className="category-why__item">
              <strong>GBP-friendly funding</strong> &mdash; all listed cards accept Faster Payments, UK debit card top-ups, or Open Banking transfers so you can load pounds without extra friction.
            </li>
            <li className="category-why__item">
              <strong>Low FX impact</strong> &mdash; cards settle in GBP or offer competitive FX rates, minimising conversion costs when spending domestically.
            </li>
          </ul>
        </section>

        <div className="category-also-see">
          <span className="category-also-see__label">Also see:</span>
          <a href="/best-crypto-cards-europe" className="category-also-see__chip">
            <i className="fa-solid fa-earth-europe" aria-hidden="true"></i>
            Best Cards in Europe
          </a>
          <a href="/best-crypto-cards-usa" className="category-also-see__chip">
            <i className="fa-solid fa-flag-usa" aria-hidden="true"></i>
            Best Cards in the USA
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
          <FAQAccordion items={FAQ_ITEMS} ns="uk-faq" />
        </section>
      </div>
    </main>
  );
}
