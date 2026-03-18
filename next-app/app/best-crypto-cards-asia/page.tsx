import { getAllCards, toCardListItem } from '@/lib/data';
import { isAsiaCard } from '@/lib/filters';
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
    q: 'Which Asian countries have the best crypto card options?',
    a: 'Singapore, Japan, and Hong Kong have the broadest selection of regulated crypto card products. Singapore benefits from MAS licensing, Japan from FSA oversight, and Hong Kong from SFC registration. India, South Korea, the Philippines, and Vietnam also have growing coverage from global issuers.',
  },
  {
    q: 'Is using a crypto card legal in Japan and Singapore?',
    a: 'Yes. Japan regulates virtual currency exchanges and payment services under the Payment Services Act (PSA), and FSA-licensed issuers can offer crypto cards to Japanese residents. Singapore\'s MAS licenses digital payment token service providers under the Payment Services Act 2019, with several MAS-regulated crypto card issuers active in the market.',
  },
  {
    q: 'How do I top up a crypto card in India?',
    a: 'Most India-available cards accept UPI, IMPS, or NEFT bank transfers. You typically deposit INR to the issuer\'s platform, convert to a stablecoin or the card\'s settlement currency, and the balance becomes available for spending. Some global cards also support international wire transfers in USD or EUR.',
  },
  {
    q: 'Are crypto cards available in China?',
    a: 'Mainland China restricts crypto trading and most crypto card services. However, residents of Hong Kong can access a wider range of products under the SFC licensing framework. Users travelling through or residing in other Asian jurisdictions should verify their specific country\'s regulations before applying.',
  },
  {
    q: 'What currencies do Asia-available crypto cards support?',
    a: 'Most cards settle in USD or a major stablecoin (USDC/USDT) and apply a real-time FX conversion when you spend in local currency. Some cards offer JPY, SGD, or HKD settlement for lower conversion costs. Bitcoin, Ethereum, BNB, and SOL are the most commonly supported top-up assets for Asia-region cards.',
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const allCards = await getAllCards();
  const cards = allCards.filter(isAsiaCard);
  const title = 'Best Crypto Cards in Asia 2026 — Japan, Singapore, India & More | Sweepbase';
  const description = generateCategoryMetaDescription('best-crypto-cards-asia', cards.length);
  const ogImage = `https://sweepbase.com/api/og?title=${encodeURIComponent('Best Crypto Cards in Asia 2026')}&count=${cards.length}&subtitle=Regional+Guide`;
  return {
    title,
    description,
    alternates: { canonical: 'https://sweepbase.com/best-crypto-cards-asia' },
    openGraph: {
      title,
      description,
      url: 'https://sweepbase.com/best-crypto-cards-asia',
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

export default async function BestCryptoCardsAsia() {
  const allCards = await getAllCards();
  const cards = allCards.filter(isAsiaCard);

  const webPageJsonLd = generateCategoryWebPageSchema(
    'Best Crypto Cards in Asia 2026',
    'https://sweepbase.com/best-crypto-cards-asia',
    [
      { name: 'Home', item: 'https://sweepbase.com' },
      { name: 'Best Crypto Cards in Asia', item: 'https://sweepbase.com/best-crypto-cards-asia' },
    ],
  );

  const itemListJsonLd = generateCategoryItemListSchema(
    cards,
    'https://sweepbase.com/best-crypto-cards-asia',
    'Best Crypto Cards in Asia 2026',
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
          { label: 'Best Crypto Cards in Asia' },
        ]} />

        <section className="category-hero">
          <h1 className="category-h1">Best Crypto Debit &amp; Credit Cards in Asia</h1>
          <p className="category-intro">
            Asia is home to some of the world&apos;s most active crypto markets, with Japan, South Korea,
            Singapore, Hong Kong, and India collectively accounting for a significant share of global
            digital asset trading volume. Sweepbase has identified{' '}
            <strong>{cards.length} crypto cards</strong> available to residents of Asian countries —
            spanning Visa and Mastercard products issued by both regional and global providers with
            KYC processes tailored for APAC jurisdictions. Singapore-based users benefit from MAS
            regulatory oversight, while Japanese residents can access FSA-licensed providers offering
            yen-denominated settlement. Indian users should look for cards that support UPI and IMPS
            top-ups, and South Korean users may find won-denominated stablecoin options attractive.
            Many Asia-available cards offer Bitcoin, ETH, or stablecoin top-ups with real-time
            conversion at the point of sale. Cashback programmes on cards available in Asia typically
            offer 1–5% in BTC, platform tokens, or native rewards. Compare FX fees, KYC
            requirements, supported cryptocurrencies, and ATM withdrawal limits below to find
            the best crypto card for your country in Asia.
          </p>
        </section>

        <section className="category-why">
          <h2 className="category-why__title">Why These Cards?</h2>
          <ul className="category-why__list">
            <li className="category-why__item">
              <strong>APAC-licensed issuers</strong> — cards are filtered to include providers regulated by MAS (Singapore), FSA (Japan), SFC (Hong Kong), or equivalent APAC authorities, ensuring legal compliance in key Asian markets.
            </li>
            <li className="category-why__item">
              <strong>Local payment method support</strong> — selected cards accept UPI, PayNow, PromptPay, or local bank transfers for fast, low-cost top-ups in your home currency without international wire fees.
            </li>
            <li className="category-why__item">
              <strong>Broad crypto support</strong> — all listed cards accept at least Bitcoin and Ethereum; many also support BNB, SOL, XRP, and region-popular tokens for maximum flexibility in Asia&apos;s diverse crypto ecosystem.
            </li>
          </ul>
        </section>

        <div className="category-also-see">
          <span className="category-also-see__label">Also see:</span>
          <a href="/best-crypto-cards-australia" className="category-also-see__chip">
            <i className="fa-solid fa-earth-oceania" aria-hidden="true"></i>
            Best Cards in Australia
          </a>
          <a href="/best-crypto-cards-europe" className="category-also-see__chip">
            <i className="fa-solid fa-earth-europe" aria-hidden="true"></i>
            Best Cards in Europe
          </a>
          <a href="/best-crypto-cards-latin-america" className="category-also-see__chip">
            <i className="fa-solid fa-earth-americas" aria-hidden="true"></i>
            Best Cards in Latin America
          </a>
          <a href="/best-crypto-cards-usa" className="category-also-see__chip">
            <i className="fa-solid fa-flag-usa" aria-hidden="true"></i>
            Best Cards in the USA
          </a>
        </div>
      </div>

      <CategoryCardsGrid cards={cards.map(toCardListItem)} />

      <div className="container">
        <section className="category-faq">
          <h2 className="category-faq__title">Frequently Asked Questions</h2>
          <FAQAccordion items={FAQ_ITEMS} ns="asia-faq" />
        </section>
      </div>
    </main>
  );
}
