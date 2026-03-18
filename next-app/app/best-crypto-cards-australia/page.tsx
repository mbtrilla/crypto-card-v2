import { getAllCards, toCardListItem } from '@/lib/data';
import { isAustraliaCard } from '@/lib/filters';
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
    q: 'Are crypto debit cards legal in Australia?',
    a: 'Yes. Crypto debit cards are legal in Australia when issued by or in partnership with an AUSTRAC-registered digital currency exchange. The regulatory framework is overseen by AUSTRAC for AML/CTF compliance and ASIC for financial services. Always verify that the issuer holds appropriate Australian registrations before applying.',
  },
  {
    q: 'Do I need to pay CGT when using a crypto card in Australia?',
    a: 'Yes. The Australian Taxation Office (ATO) treats cryptocurrency as a capital gains tax (CGT) asset. Each time you spend crypto via a card — triggering a fiat conversion — it is considered a disposal event and may give rise to a capital gain or loss. Personal-use asset exemptions may apply for small amounts used for everyday purchases; consult a tax adviser for your situation.',
  },
  {
    q: 'Which crypto card is best for Australians travelling overseas?',
    a: 'Cards with low or zero FX fees are best for international travel. Look for cards offering fee-free Visa or Mastercard foreign currency transactions, ideally with no ATM withdrawal fees abroad. Cards from global issuers like Crypto.com and Nexo cover 200+ countries and have competitive FX rates for Australian travellers.',
  },
  {
    q: 'Can I top up an Australian crypto card with PayID or bank transfer?',
    a: 'Some Australia-available cards from local or APAC-focused issuers support PayID or direct bank transfer (BSB/Account) for AUD deposits. Global issuers typically require international wire or crypto deposit. Check each card\'s supported top-up methods in the listing detail before applying.',
  },
  {
    q: 'Do any crypto cards offer AUD settlement in Australia?',
    a: 'A small number of Australia-available cards offer AUD settlement, meaning your balance is held and settled in Australian dollars. Most global cards settle in USD or a stablecoin and apply a real-time AUD conversion at the point of sale. AUD settlement cards reduce currency risk but may have fewer supported assets.',
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const allCards = await getAllCards();
  const cards = allCards.filter(isAustraliaCard);
  const title = 'Best Crypto Cards in Australia 2026 — Compare All Options | Sweepbase';
  const description = generateCategoryMetaDescription('best-crypto-cards-australia', cards.length);
  const ogImage = `https://sweepbase.com/api/og?title=${encodeURIComponent('Best Crypto Cards in Australia 2026')}&count=${cards.length}&subtitle=Regional+Guide`;
  return {
    title,
    description,
    alternates: { canonical: 'https://sweepbase.com/best-crypto-cards-australia' },
    openGraph: {
      title,
      description,
      url: 'https://sweepbase.com/best-crypto-cards-australia',
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

export default async function BestCryptoCardsAustralia() {
  const allCards = await getAllCards();
  const cards = allCards.filter(isAustraliaCard);

  const webPageJsonLd = generateCategoryWebPageSchema(
    'Best Crypto Cards in Australia 2026',
    'https://sweepbase.com/best-crypto-cards-australia',
    [
      { name: 'Home', item: 'https://sweepbase.com' },
      { name: 'Best Crypto Cards in Australia', item: 'https://sweepbase.com/best-crypto-cards-australia' },
    ],
  );

  const itemListJsonLd = generateCategoryItemListSchema(
    cards,
    'https://sweepbase.com/best-crypto-cards-australia',
    'Best Crypto Cards in Australia 2026',
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
          { label: 'Best Crypto Cards in Australia' },
        ]} />

        <section className="category-hero">
          <h1 className="category-h1">Best Crypto Debit &amp; Credit Cards for Australians</h1>
          <p className="category-intro">
            Australia has one of the highest rates of crypto ownership per capita globally, and the
            local regulatory environment — overseen by AUSTRAC and ASIC — has matured significantly
            in recent years, making it easier for both local and international card issuers to serve
            Australian residents. Sweepbase has identified{' '}
            <strong>{cards.length} crypto cards</strong> available to Australian users, including
            global Visa and Mastercard products from major exchanges such as Crypto.com and Binance,
            as well as APAC-focused providers with AUD settlement and PayID top-up support. Key
            considerations for Australian cardholders include FX conversion fees when spending in
            currencies other than AUD, whether the issuer holds an Australian Financial Services
            Licence (AFSL), and compatibility with Apple Pay and Google Pay for tap-to-pay
            convenience at local merchants. Cashback rewards on Australia-available cards range from
            0.5% flat BTC back to 5% or more in platform tokens for higher staking tiers. Compare
            all fees, limits, and reward structures below to find the right crypto card for everyday
            Australian spending.
          </p>
        </section>

        <section className="category-why">
          <h2 className="category-why__title">Why These Cards?</h2>
          <ul className="category-why__list">
            <li className="category-why__item">
              <strong>AUSTRAC-compliant issuers</strong> — all listed cards are offered by providers registered with AUSTRAC as digital currency exchanges, ensuring compliance with Australia&apos;s AML/CTF laws.
            </li>
            <li className="category-why__item">
              <strong>Apple Pay &amp; Google Pay support</strong> — every card listed supports at least one major mobile wallet for tap-to-pay convenience at the majority of Australian merchants accepting contactless payments.
            </li>
            <li className="category-why__item">
              <strong>Transparent FX fees</strong> — we surface each card&apos;s foreign currency conversion rate so you can compare the true cost of spending AUD vs. overseas currencies before choosing.
            </li>
          </ul>
        </section>

        <div className="category-also-see">
          <span className="category-also-see__label">Also see:</span>
          <a href="/best-crypto-cards-asia" className="category-also-see__chip">
            <i className="fa-solid fa-earth-asia" aria-hidden="true"></i>
            Best Cards in Asia
          </a>
          <a href="/best-crypto-cards-uk" className="category-also-see__chip">
            <i className="fa-solid fa-sterling-sign" aria-hidden="true"></i>
            Best Cards in the UK
          </a>
          <a href="/best-crypto-cards-europe" className="category-also-see__chip">
            <i className="fa-solid fa-earth-europe" aria-hidden="true"></i>
            Best Cards in Europe
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
          <FAQAccordion items={FAQ_ITEMS} ns="australia-faq" />
        </section>
      </div>
    </main>
  );
}
