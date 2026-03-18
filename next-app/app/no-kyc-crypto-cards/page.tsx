import { getAllCards, toCardListItem } from '@/lib/data';
import { isNoKycCard } from '@/lib/filters';
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
    q: 'Are crypto cards without KYC legal?',
    a: 'The legality depends on your jurisdiction. Some regions allow limited financial services without full identity verification, while others require it by law. Cards with reduced KYC typically operate under regulatory exemptions for lower-value accounts. Always verify that using a no-KYC card complies with your local regulations.',
  },
  {
    q: 'What are the spending limits on no-KYC crypto cards?',
    a: 'No-KYC or reduced-KYC crypto cards typically have significantly lower limits compared to fully verified accounts. Common restrictions include daily spending caps of $200-$1,000, monthly limits of $1,000-$5,000, and restricted ATM withdrawal amounts. Most issuers allow you to increase limits by completing optional KYC verification later.',
  },
  {
    q: 'What are the trade-offs of using a no-KYC crypto card?',
    a: 'The main trade-offs include lower spending and withdrawal limits, potential restrictions on certain merchant categories, limited customer support options, and reduced regulatory protections. Some no-KYC cards also charge higher fees to offset the compliance risk. Weigh privacy benefits against these limitations based on your use case.',
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const allCards = await getAllCards();
  const cards = allCards.filter(isNoKycCard);
  const title = 'Crypto Cards Without KYC 2026 — No ID Required | Sweepbase';
  const description = generateCategoryMetaDescription('no-kyc-crypto-cards', cards.length);
  const ogImage = `https://sweepbase.com/api/og?title=${encodeURIComponent('Crypto Cards Without KYC 2026')}&count=${cards.length}&subtitle=Privacy+Filter`;
  return {
    title,
    description,
    alternates: { canonical: 'https://sweepbase.com/no-kyc-crypto-cards' },
    openGraph: {
      title,
      description,
      url: 'https://sweepbase.com/no-kyc-crypto-cards',
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

export default async function NoKycCryptoCards() {
  const allCards = await getAllCards();
  const cards = allCards.filter(isNoKycCard);

  const webPageJsonLd = generateCategoryWebPageSchema(
    'Crypto Cards Without KYC 2026',
    'https://sweepbase.com/no-kyc-crypto-cards',
    [
      { name: 'Home', item: 'https://sweepbase.com' },
      { name: 'No-KYC Crypto Cards', item: 'https://sweepbase.com/no-kyc-crypto-cards' },
    ],
  );

  const itemListJsonLd = generateCategoryItemListSchema(
    cards,
    'https://sweepbase.com/no-kyc-crypto-cards',
    'Crypto Cards Without KYC 2026',
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
          { label: 'No-KYC Crypto Cards' },
        ]} />

        <section className="category-hero">
          <h1 className="category-h1">Crypto Cards Without KYC Verification</h1>
          <p className="category-intro">
            Some crypto card issuers offer products with minimal or no identity verification,
            allowing users to maintain greater privacy. Sweepbase has identified{' '}
            <strong>{cards.length} crypto cards</strong> with reduced or optional KYC requirements.
            Note: cards without full KYC typically have lower spending limits and may not be
            available in all jurisdictions. Always verify local regulatory requirements. These cards
            are popular among privacy-conscious users who prefer to minimize personal data sharing,
            though the trade-off is usually reduced functionality compared to fully verified
            accounts. Use the comparison tool below to evaluate KYC levels, spending limits,
            supported cryptocurrencies, and regional availability.
          </p>
        </section>

        <section className="category-why">
          <h2 className="category-why__title">Why These Cards?</h2>
          <ul className="category-why__list">
            <li className="category-why__item">
              <strong>Minimal identity verification</strong> — these cards require little or no personal documentation to get started, with email-only or basic sign-up flows.
            </li>
            <li className="category-why__item">
              <strong>Faster onboarding</strong> — skip lengthy verification queues and start spending in minutes rather than days waiting for document review.
            </li>
            <li className="category-why__item">
              <strong>Greater financial privacy</strong> — reduce the amount of personal data shared with third parties while still accessing crypto-to-fiat spending.
            </li>
          </ul>
        </section>

        <div className="category-also-see">
          <span className="category-also-see__label">Also see:</span>
          <a href="/self-custody-crypto-cards" className="category-also-see__chip">
            <i className="fa-solid fa-key" aria-hidden="true"></i>
            Self-Custody Cards
          </a>
          <a href="/virtual-crypto-cards" className="category-also-see__chip">
            <i className="fa-solid fa-mobile-screen" aria-hidden="true"></i>
            Virtual Crypto Cards
          </a>
          <a href="/" className="category-also-see__chip">
            <i className="fa-solid fa-table-list" aria-hidden="true"></i>
            All Cards
          </a>
        </div>
      </div>

      <CategoryCardsGrid cards={cards.map(toCardListItem)} />

      <div className="container">
        <section className="category-faq">
          <h2 className="category-faq__title">Frequently Asked Questions</h2>
          <FAQAccordion items={FAQ_ITEMS} ns="no-kyc-faq" />
        </section>
      </div>
    </main>
  );
}
