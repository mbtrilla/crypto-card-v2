import { getAllCards, toCardListItem } from "@/lib/data";
import { generateHomeMetaDescription } from "@/lib/meta";
import { generateHomeItemListSchema, generateFAQPageSchema } from "@/lib/schemas";
import CardSkeleton from "@/components/CardSkeleton";
import FAQAccordion, { type FAQItem } from "@/components/FAQAccordion";
import dynamic from "next/dynamic";
import { Metadata } from "next";

// CardsGridClient owns all filter/search/compare state — defer its JS so the
// hero HTML and static card-index reach the browser before the filter chunk.
const CardsGridClient = dynamic(() => import("@/components/CardsGridClient"), {
  loading: () => (
    <section className="results-section" aria-busy="true">
      <div className="container">
        <div className="results-header">
          <h2 className="results-title">Available Cards</h2>
        </div>
        <div className="cards-grid">
          {Array.from({ length: 12 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    </section>
  ),
});

export const revalidate = 3600; // ISR: Update every hour

export async function generateMetadata(): Promise<Metadata> {
  const cards = await getAllCards();
  const count = cards.length;
  const title = `Best Crypto Debit & Credit Cards 2026 — Compare ${count} Cards | Sweepbase`;
  const description = generateHomeMetaDescription(count);
  return {
    title,
    description,
    alternates: {
      canonical: "https://sweepbase.com",
    },
    openGraph: {
      title,
      url: "https://sweepbase.com",
      type: "website",
      images: [
        {
          url: `https://sweepbase.com/api/og?title=${encodeURIComponent('Best Crypto Debit & Credit Cards 2026')}&count=${count}&subtitle=Compare+fees%2C+cashback+%26+availability`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@sweepbase",
      creator: "@sweepbase",
      title,
      description,
      images: [`https://sweepbase.com/api/og?title=${encodeURIComponent('Best Crypto Debit & Credit Cards 2026')}&count=${count}&subtitle=Compare+fees%2C+cashback+%26+availability`],
    },
    robots: { index: true, follow: true },
  };
}

export default async function Home() {
  const allCards = await getAllCards();

  // Top-12 ItemList with FinancialProduct + AggregateRating for rich results
  const itemListJsonLd = generateHomeItemListSchema(allCards);

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Sweepbase",
    "url": "https://sweepbase.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://sweepbase.com/?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  const HOME_FAQ_ITEMS: FAQItem[] = [
    {
      q: 'What is a crypto debit card?',
      a: 'A crypto debit card lets you spend cryptocurrency at any merchant that accepts Visa or Mastercard. When you make a purchase, your crypto (Bitcoin, USDT, ETH, etc.) is automatically converted to local fiat currency at the point of sale. Most cards work with Apple Pay and Google Pay.',
    },
    {
      q: 'How do I choose the best crypto card?',
      a: 'Consider five key factors: fees (issuance, monthly, FX markup), cashback rewards, supported cryptocurrencies, regional availability, and whether you prefer custodial or self-custody. Use our comparison tool to filter cards by these criteria.',
    },
    {
      q: 'Are crypto debit cards safe?',
      a: 'Licensed crypto card issuers are regulated by financial authorities (FCA, FinCEN, etc.) and cards are issued through Visa/Mastercard networks with standard consumer protections. Self-custody cards add an extra layer of security by letting you keep control of your private keys.',
    },
    {
      q: 'Do crypto cards charge fees?',
      a: 'Most crypto cards charge some combination of: issuance fee ($0\u2013$50), monthly fee ($0\u2013$15), ATM withdrawal fees, and foreign exchange markup (0%\u20133%). Several cards like Binance and Crypto.com offer zero-fee options for verified users.',
    },
    {
      q: 'Which countries support crypto cards?',
      a: `Availability varies by issuer. Most cards serve the US, EU/EEA, and UK. Sweepbase tracks ${allCards.length} cards across 200+ countries \u2014 use our region filter to find cards available in your country.`,
    },
    {
      q: 'Can I get cashback with a crypto card?',
      a: 'Yes. Many crypto cards offer 1%\u20138% cashback in crypto (BTC, BNB, CRO) or stablecoins. The cashback rate often depends on your staking tier or account level. Compare cashback rates across all cards on Sweepbase.',
    },
  ];

  const homeFaqJsonLd = generateFAQPageSchema(HOME_FAQ_ITEMS);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sweepbase.com" },
    ],
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Sweepbase",
    "url": "https://sweepbase.com",
    "logo": "https://sweepbase.com/logo.png",
    "description": "Independent aggregator for comparing crypto debit and credit cards worldwide.",
    "foundingDate": "2024",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "contact@sweepbase.com",
      "contactType": "editorial"
    },
    "sameAs": [
      "https://twitter.com/sweepbase",
      "https://www.linkedin.com/company/sweepbase",
      "https://t.me/sweepbase"
    ],
    "knowsAbout": [
      "crypto debit cards",
      "crypto credit cards",
      "cryptocurrency",
      "Bitcoin payments",
      "crypto rewards",
      "self-custody wallets",
      "Visa crypto cards",
      "Mastercard crypto cards"
    ]
  };

  const siteNavJsonLd = {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    "name": "Main Navigation",
    "url": "https://sweepbase.com",
    "hasPart": [
      { "@type": "SiteNavigationElement", "name": "Discover", "url": "https://sweepbase.com/#discover" },
      { "@type": "SiteNavigationElement", "name": "All Cards", "url": "https://sweepbase.com/cards" },
      { "@type": "SiteNavigationElement", "name": "Compare", "url": "https://sweepbase.com/compare" },
      { "@type": "SiteNavigationElement", "name": "Calculator", "url": "https://sweepbase.com/calculator" },
      { "@type": "SiteNavigationElement", "name": "Guides", "url": "https://sweepbase.com/guides" },
      { "@type": "SiteNavigationElement", "name": "About", "url": "https://sweepbase.com/about" },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavJsonLd) }}
      />
      <section className="hero-section">
        <div className="container hero-content">
          <h1 className="hero-title">Find Your <span className="text-gradient">Crypto Card</span></h1>
          <p className="hero-tagline">
            Compare {allCards.length} cards by fees, cashback, custody, and regional availability.
            Last updated: <time dateTime="2026-03-18">March 18, 2026</time>.
          </p>
        </div>
      </section>

      <CardsGridClient initialCards={allCards.map(toCardListItem)} />

      {/* ── Browse by Category ── */}
      <section className="browse-categories-section">
        <div className="container">
          <h2 className="browse-categories-heading">
            Browse by <span className="text-gradient">Category</span>
          </h2>
          <p className="browse-categories-subheading">
            Find the right card for your region, network, or reward preference.
          </p>
          <div className="browse-categories-grid">
            <a href="/best-crypto-cards-usa" className="browse-category-tile">
              <span className="browse-category-emoji" aria-hidden="true">&#x1F1FA;&#x1F1F8;</span>
              <div className="browse-category-info">
                <span className="browse-category-name">Best Cards in the USA</span>
                <span className="browse-category-desc">Cards available to US residents</span>
              </div>
            </a>
            <a href="/best-crypto-cards-europe" className="browse-category-tile">
              <span className="browse-category-emoji" aria-hidden="true">&#x1F1EA;&#x1F1FA;</span>
              <div className="browse-category-info">
                <span className="browse-category-name">Best Cards in Europe</span>
                <span className="browse-category-desc">EEA &amp; EU-available cards</span>
              </div>
            </a>
            <a href="/visa-crypto-cards" className="browse-category-tile">
              <span className="browse-category-emoji" aria-hidden="true">&#x1F4B3;</span>
              <div className="browse-category-info">
                <span className="browse-category-name">Visa Crypto Cards</span>
                <span className="browse-category-desc">All Visa network cards compared</span>
              </div>
            </a>
            <a href="/mastercard-crypto-cards" className="browse-category-tile">
              <span className="browse-category-emoji" aria-hidden="true">&#x1F4B3;</span>
              <div className="browse-category-info">
                <span className="browse-category-name">Mastercard Crypto Cards</span>
                <span className="browse-category-desc">All Mastercard network cards compared</span>
              </div>
            </a>
            <a href="/self-custody-crypto-cards" className="browse-category-tile">
              <span className="browse-category-emoji" aria-hidden="true">&#x1F512;</span>
              <div className="browse-category-info">
                <span className="browse-category-name">Self-Custody Cards</span>
                <span className="browse-category-desc">Keep control of your private keys</span>
              </div>
            </a>
            <a href="/crypto-cards-with-cashback" className="browse-category-tile">
              <span className="browse-category-emoji" aria-hidden="true">&#x1F4B0;</span>
              <div className="browse-category-info">
                <span className="browse-category-name">Cards With Cashback</span>
                <span className="browse-category-desc">Earn BTC, tokens, or stablecoins</span>
              </div>
            </a>
            <a href="/best-crypto-cards-uk" className="browse-category-tile">
              <span className="browse-category-emoji" aria-hidden="true">&#x1F1EC;&#x1F1E7;</span>
              <div className="browse-category-info">
                <span className="browse-category-name">Best Cards in the UK</span>
                <span className="browse-category-desc">FCA-regulated cards for UK residents</span>
              </div>
            </a>
            <a href="/best-crypto-cards-canada" className="browse-category-tile">
              <span className="browse-category-emoji" aria-hidden="true">&#x1F1E8;&#x1F1E6;</span>
              <div className="browse-category-info">
                <span className="browse-category-name">Best Cards in Canada</span>
                <span className="browse-category-desc">Cards for Canadian residents</span>
              </div>
            </a>
            <a href="/best-crypto-cards-latin-america" className="browse-category-tile">
              <span className="browse-category-emoji" aria-hidden="true">&#x1F30E;</span>
              <div className="browse-category-info">
                <span className="browse-category-name">Cards in Latin America</span>
                <span className="browse-category-desc">MX, BR, AR, CO &amp; more</span>
              </div>
            </a>
            <a href="/best-crypto-cards-africa" className="browse-category-tile">
              <span className="browse-category-emoji" aria-hidden="true">&#x1F30D;</span>
              <div className="browse-category-info">
                <span className="browse-category-name">Best Cards in Africa</span>
                <span className="browse-category-desc">NG, ZA, KE, GH &amp; more</span>
              </div>
            </a>
            <a href="/best-crypto-cards-middle-east" className="browse-category-tile">
              <span className="browse-category-emoji" aria-hidden="true">&#x1F54C;</span>
              <div className="browse-category-info">
                <span className="browse-category-name">Best Cards in Middle East</span>
                <span className="browse-category-desc">UAE, SA, BH, QA &amp; more</span>
              </div>
            </a>
            <a href="/virtual-crypto-cards" className="browse-category-tile">
              <span className="browse-category-emoji" aria-hidden="true">&#x1F4F1;</span>
              <div className="browse-category-info">
                <span className="browse-category-name">Virtual Crypto Cards</span>
                <span className="browse-category-desc">Instant issue, no physical card</span>
              </div>
            </a>
            <a href="/physical-crypto-cards" className="browse-category-tile">
              <span className="browse-category-emoji" aria-hidden="true">&#x1F4B3;</span>
              <div className="browse-category-info">
                <span className="browse-category-name">Physical Crypto Cards</span>
                <span className="browse-category-desc">Tap-to-pay &amp; ATM access</span>
              </div>
            </a>
            <a href="/crypto-cards-no-fees" className="browse-category-tile">
              <span className="browse-category-emoji" aria-hidden="true">&#x1F195;</span>
              <div className="browse-category-info">
                <span className="browse-category-name">Free Cards (No Fees)</span>
                <span className="browse-category-desc">Zero issuance &amp; annual fee</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      <section className="seo-content-section">
        <div className="container seo-content">
          <details className="seo-collapse">
            <summary className="seo-collapse__summary">
              <h2>How It Works</h2>
              <p className="seo-collapse__preview">
                Sweepbase is the most comprehensive crypto card comparison platform, tracking{' '}
                {allCards.length} debit and credit cards from issuers worldwide.
              </p>
            </summary>
          <p>
            Whether you&apos;re looking
            for a <a href="/cards">Bitcoin debit card</a> with high cashback, a{' '}
            <a href="/self-custody-crypto-cards">self-custody</a> Visa card, or the cheapest option
            for international spending &mdash; our real-time database makes it easy to compare fees,
            rewards, and availability side by side.
          </p>
          <p>
            Every card listing includes verified data on issuance fees, monthly charges, ATM limits,
            supported cryptocurrencies, cashback rates, and regional restrictions. We categorize cards
            by custody model (custodial, self-custody, and hybrid) so you can choose the level of
            control that matches your security preferences.
          </p>
          <p>
            Our regional filters cover the{' '}
            <a href="/best-crypto-cards-usa">USA</a>,{' '}
            <a href="/best-crypto-cards-europe">Europe</a>,{' '}
            <a href="/best-crypto-cards-uk">UK</a>,{' '}
            <a href="/best-crypto-cards-canada">Canada</a>,{' '}
            <a href="/best-crypto-cards-latin-america">Latin America</a>,{' '}
            <a href="/best-crypto-cards-asia">Asia</a>, and{' '}
            <a href="/best-crypto-cards-australia">Australia</a>.
            Card data is sourced directly from issuers and updated regularly to reflect the latest fee
            changes and new card launches in 2026.
          </p>
          <p>
            Use our free <a href="/compare">comparison tool</a> to evaluate up to 4 cards at once.
            New to crypto cards? Start with our{' '}
            <a href="/guides/how-to-choose-a-crypto-card">guide to choosing a crypto card</a>, learn
            about <a href="/guides/crypto-card-fees-explained">fee structures</a>, or read our{' '}
            <a href="/guides/best-crypto-cards-for-beginners">beginner&apos;s guide</a> for
            the simplest options to get started.
          </p>
          </details>
        </div>
      </section>

      <section className="seo-content-section seo-content-section--alt">
        <div className="container seo-content">
          <details className="seo-collapse">
            <summary className="seo-collapse__summary">
              <h2>Crypto Card Comparison: What to Look For in 2026</h2>
              <p className="seo-collapse__preview">
                Compare fees, cashback, custody models, and Visa vs Mastercard networks to find the right crypto card.
              </p>
            </summary>

          <h3>Fees and Hidden Costs</h3>
          <p>
            The true cost of a crypto card goes far beyond the issuance fee. While many cards
            advertise zero upfront cost, recurring charges like monthly maintenance fees ($0–$15),
            foreign exchange markups (0.5%–3%), and ATM withdrawal fees can add up quickly. The most
            overlooked cost is the crypto-to-fiat conversion spread — the difference between the
            mid-market exchange rate and the rate the card actually gives you. Even &quot;fee-free&quot;
            cards often embed a 0.5%–2% markup in this spread. To find the cheapest option, calculate
            the total annual cost based on your expected spending pattern. Our{' '}
            <a href="/calculator">cost calculator</a> and{' '}
            <a href="/guides/crypto-card-fees-explained">fees guide</a> can help you compare
            the real cost across cards, and our <a href="/crypto-cards-no-fees">no-fee cards</a>{' '}
            category filters for zero issuance and zero annual fee options.
          </p>

          <h3>Cashback and Rewards Programs</h3>
          <p>
            Crypto card cashback ranges from 0.5% to 8%, but the headline rate rarely tells the full
            story. Most high-cashback cards require staking the issuer&apos;s native token — locking
            up $400–$40,000 in a potentially volatile asset to unlock premium reward tiers. The
            cashback currency matters too: Bitcoin and stablecoin rewards hold their value, while
            obscure platform tokens can depreciate significantly. Monthly cashback caps, category
            restrictions, and clawback clauses further reduce effective returns. The best approach is
            to calculate net rewards after all fees and compare cards at your actual spending level.
            Browse our <a href="/crypto-cards-with-cashback">cashback cards</a> category to see
            verified reward rates, staking requirements, and cap structures side by side.
          </p>

          <h3>Self-Custody vs Custodial: Security Trade-offs</h3>
          <p>
            Custodial cards from exchanges like <a href="/cards/binance-card">Binance</a> and{' '}
            <a href="/cards/cryptocom-visa-card">Crypto.com</a> hold your funds on their platform —
            simple to use, but your crypto is at risk if the platform becomes insolvent. Self-custody
            cards like <a href="/cards/metamask-card">MetaMask Card</a> and{' '}
            <a href="/cards/gnosis-pay-card">Gnosis Pay</a> keep your private keys under your
            control until the moment of purchase, eliminating counterparty risk but adding UX
            complexity and gas fees per transaction. Hybrid solutions are emerging that blend both
            approaches. For a detailed comparison, read our{' '}
            <a href="/guides/self-custody-vs-custodial-crypto-cards">custody guide</a> or browse{' '}
            <a href="/self-custody-crypto-cards">self-custody cards</a> directly.
          </p>

          <h3>Visa vs Mastercard: Network Differences for Crypto</h3>
          <p>
            Both Visa and Mastercard offer near-universal merchant acceptance, but there are subtle
            differences for crypto card users. <a href="/visa-crypto-cards">Visa crypto cards</a>{' '}
            dominate the US market with broader ATM network access and Apple Pay compatibility, while{' '}
            <a href="/mastercard-crypto-cards">Mastercard crypto cards</a> are more prevalent among
            European and UK issuers, often qualifying for World or World Elite tiers with travel perks.
            Contactless payment limits, FX rate markup timing (weekend rates can differ), and
            chargeback policies also vary between networks. For most users, the issuing platform and
            fee structure matter more than the network — but if you travel frequently or need specific
            ATM coverage, the network choice can make a measurable difference.
          </p>
          </details>
        </div>
      </section>

      <section id="about" className="about-section">
        <div className="container">
          <div className="about-panel">
            <h2 className="about-heading">About <span className="text-gradient">Sweepbase</span></h2>
            <p className="about-lead">
              Sweepbase is an independent aggregator that helps you find, compare, and evaluate
              crypto debit and credit cards from around the world. We surface fees, cashback rates,
              supported networks, and regional availability in one place — so you can make confident
              decisions without bouncing between dozens of card issuer websites.
            </p>
            <div className="about-features">
              <div className="about-feature-card">
                <div className="about-feature-icon">
                  <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
                </div>
                <h3>Discover</h3>
                <p>Browse a curated database of crypto cards updated regularly. Filter by network, custody type, region, and more.</p>
              </div>
              <div className="about-feature-card">
                <div className="about-feature-icon">
                  <i className="fa-solid fa-scale-balanced" aria-hidden="true"></i>
                </div>
                <h3>Compare</h3>
                <p>Select up to 4 cards side-by-side to compare fees, limits, cashback rewards, and accepted top-up methods.</p>
              </div>
              <div className="about-feature-card">
                <div className="about-feature-icon">
                  <i className="fa-solid fa-shield-halved" aria-hidden="true"></i>
                </div>
                <h3>Trusted Data</h3>
                <p>All card details are sourced directly from issuers and kept current. No hidden affiliate bias in our listings.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-faq-section">
        <div className="container">
          <h2 className="category-faq__title">Frequently Asked Questions About Crypto Cards</h2>
          <FAQAccordion items={HOME_FAQ_ITEMS} ns="home-faq" />
        </div>
      </section>

      {/*
        Server-rendered index of all card pages.
        Visible in the HTML delivered to Googlebot so all 114 /cards/[slug]
        pages receive internal links and can be crawled without JS execution.
        The sitemap.xml also lists every URL, but direct <a> links provide
        additional link-equity flow from the homepage.
      */}
      {/*
        Server-rendered index of all card pages — critical for crawlability.
        Wrapped in <details> to reduce initial layout cost (~114 DOM nodes
        hidden until user expands). Googlebot still indexes <a> inside
        closed <details> elements.
      */}
      <nav className="card-index-section" aria-label="Card index">
        <div className="container">
          <details className="card-index-details">
            <summary className="card-index-heading">
              Browse All {allCards.length} Crypto Cards
            </summary>
            <ul className="card-index-list">
              {[...allCards]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(card => (
                  <li key={card.slug}>
                    <a href={`/cards/${card.slug}`} className="card-index-link">
                      {card.name}
                    </a>
                  </li>
                ))}
            </ul>
          </details>
        </div>
      </nav>
    </main>
  );
}
