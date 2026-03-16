import { getAllCards } from '@/lib/data';
import { isAustraliaCard } from '@/lib/filters';
import { generateCategoryMetaDescription } from '@/lib/meta';
import { generateCategoryItemListSchema, generateCategoryWebPageSchema } from '@/lib/schemas';
import CategoryCardsGrid from '@/components/CategoryCardsGrid';
import Breadcrumb from '@/components/Breadcrumb';
import { Metadata } from 'next';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const allCards = await getAllCards();
  const cards = allCards.filter(isAustraliaCard);
  const title = 'Best Crypto Cards in Australia 2026 — Compare All Options | Sweepbase';
  const description = generateCategoryMetaDescription('best-crypto-cards-australia', cards.length);
  return {
    title,
    description,
    alternates: { canonical: 'https://sweepbase.com/best-crypto-cards-australia' },
    openGraph: {
      title,
      description,
      url: 'https://sweepbase.com/best-crypto-cards-australia',
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

        <div className="category-also-see">
          <span className="category-also-see__label">Also see:</span>
          <a href="/best-crypto-cards-asia" className="category-also-see__chip">
            <i className="fa-solid fa-earth-asia" aria-hidden="true"></i>
            Best Cards in Asia
          </a>
          <a href="/best-crypto-cards-europe" className="category-also-see__chip">
            <i className="fa-solid fa-earth-europe" aria-hidden="true"></i>
            Best Cards in Europe
          </a>
          <a href="/best-crypto-cards-usa" className="category-also-see__chip">
            <i className="fa-solid fa-flag-usa" aria-hidden="true"></i>
            Best Cards in the USA
          </a>
        </div>
      </div>

      <CategoryCardsGrid cards={cards} />
    </main>
  );
}
