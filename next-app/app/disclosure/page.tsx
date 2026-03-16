import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Affiliate Disclosure | Sweepbase',
  description:
    'Sweepbase earns commissions from affiliate links to crypto card issuers. Read our full affiliate disclosure in compliance with FTC guidelines and GDPR requirements.',
  alternates: {
    canonical: 'https://sweepbase.com/disclosure',
  },
  openGraph: {
    title: 'Affiliate Disclosure | Sweepbase',
    description:
      'How Sweepbase earns revenue through affiliate links — and why it does not affect our editorial independence.',
    url: 'https://sweepbase.com/disclosure',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function DisclosurePage() {
  return (
    <main className="legal-page">
      <div className="container">
        <nav className="breadcrumb-nav">
          <a href="/">Home</a>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Affiliate Disclosure</span>
        </nav>

        <h1 className="legal-h1">Affiliate Disclosure</h1>
        <p className="legal-meta">Last updated: March 16, 2026</p>

        <div className="legal-notice-box">
          <p>
            <strong>Summary:</strong> Some links on Sweepbase are affiliate links. If you click one
            and apply for or obtain a card, we may earn a commission from the issuer — at no extra
            cost to you. This does not influence which cards we list, how we rank them, or what we
            write about them. See below for the full details.
          </p>
        </div>

        <div className="legal-body">
          <h2>1. Our Relationship with Card Issuers</h2>
          <p>
            Sweepbase (sweepbase.com) maintains affiliate partnerships with a number of
            cryptocurrency card issuers and related financial service providers. These partnerships
            are commercial arrangements under which Sweepbase may receive a referral fee or
            commission when a user:
          </p>
          <ul>
            <li>Clicks a designated affiliate link on our site and visits an issuer&apos;s platform,</li>
            <li>Submits an application for a card through that link, or</li>
            <li>Successfully opens an account or activates a card within a defined attribution window.</li>
          </ul>
          <p>
            The exact commission structure varies by issuer and may be a fixed fee per approved
            application, a percentage of first-year spend, or another arrangement agreed with the
            issuer. Sweepbase does not charge users any fee for accessing the comparison service.
          </p>

          <h2>2. How Affiliate Links Are Identified</h2>
          <p>
            Affiliate links on Sweepbase are typically the &quot;Visit Card&quot; or &quot;Apply
            Now&quot; buttons on each card listing page and the corresponding call-to-action
            elements throughout the Site. When you click one of these links, your browser is
            redirected to the issuer&apos;s website via a tracking URL that allows the issuer (or
            an affiliate network acting on its behalf) to attribute the visit to Sweepbase.
          </p>
          <p>
            Not every outbound link on Sweepbase is an affiliate link. Some links — for example,
            links to regulatory filings, news articles, or third-party research — are purely
            informational and carry no tracking parameter.
          </p>

          <h2>3. Editorial Independence</h2>
          <p>
            Sweepbase operates under a strict editorial independence policy. The existence or
            absence of an affiliate relationship with an issuer does not determine:
          </p>
          <ul>
            <li>Whether a card is included in our database,</li>
            <li>How a card is rated or scored,</li>
            <li>The order in which cards appear in default or filtered listings,</li>
            <li>The content of individual card review pages, or</li>
            <li>Which cards are featured in category pages or homepage highlights.</li>
          </ul>
          <p>
            Cards are included and assessed based on publicly available information about their
            features, fees, reward structures, supported assets, custody model, and regional
            availability. We include cards that do not have affiliate programs alongside those that
            do.
          </p>
          <p>
            If editorial content is sponsored or influenced by an issuer in any way, this will be
            clearly labelled as &quot;Sponsored&quot; or &quot;Promoted&quot; content. At the time
            of this writing, Sweepbase does not publish sponsored editorial content.
          </p>

          <h2>4. Not Financial Advice</h2>
          <p>
            Nothing on Sweepbase — including card comparisons, ratings, editorial commentary,
            category pages, or this disclosure — constitutes financial, investment, tax, or legal
            advice. Sweepbase is a comparison and information service only.
          </p>
          <p>
            Cryptocurrency debit and credit cards involve financial risk. Card terms, fees,
            supported assets, and availability change frequently. Always verify current information
            directly with the card issuer before applying, and consider consulting a qualified
            financial adviser if you are uncertain whether a particular product is appropriate for
            your circumstances.
          </p>

          <h2>5. FTC Compliance (United States)</h2>
          <p>
            In accordance with the United States Federal Trade Commission&apos;s{' '}
            <em>Guides Concerning the Use of Endorsements and Testimonials in Advertising</em>{' '}
            (16 C.F.R. Part 255) and associated guidance on affiliate marketing, Sweepbase
            discloses its material connections to card issuers clearly and conspicuously.
          </p>
          <p>
            Our disclosure is presented on this page, in our site footer on every page, and via
            summary notices on card listing pages. We believe this satisfies the FTC&apos;s
            requirement that affiliate relationships be disclosed in a &quot;clear and conspicuous&quot;
            manner that is unavoidable and understandable to the average reader.
          </p>
          <p>
            Sweepbase does not receive free products, paid reviews, or guaranteed positive coverage
            from card issuers. Commissions are earned only on qualifying user actions as described
            in Section 1.
          </p>

          <h2>6. For European Users (GDPR)</h2>
          <p>
            When you click an affiliate link, a tracking cookie or parameter is typically set by the
            issuer&apos;s affiliate network to attribute the referral. This tracking is subject to
            the issuer&apos;s own privacy policy and cookie notice, not Sweepbase&apos;s.
          </p>
          <p>
            Sweepbase does not transmit your personal data to issuers or affiliate networks on your
            behalf. The affiliate tracking interaction is initiated by your browser upon clicking
            the link, at which point you are subject to the destination site&apos;s data processing
            practices. We recommend reviewing the issuer&apos;s privacy policy before submitting an
            application.
          </p>
          <p>
            For information about how Sweepbase itself processes data (including analytics cookies),
            see our <a href="/privacy-policy">Privacy Policy</a>.
          </p>

          <h2>7. Accuracy of Card Information</h2>
          <p>
            While we strive to keep all card data accurate and current, affiliate commissions are
            not contingent on presenting any issuer&apos;s card in a favourable light. Our data is
            sourced from publicly available issuer documentation, terms and conditions pages, and
            direct issuer communications. Errors or outdated information may exist; always verify
            with the issuer directly.
          </p>
          <p>
            If you notice inaccurate information about any card on Sweepbase, please contact us at{' '}
            <a href="mailto:contact@sweepbase.com">contact@sweepbase.com</a> and we will
            investigate and correct it promptly.
          </p>

          <h2>8. Questions</h2>
          <p>
            If you have any questions about our affiliate relationships, editorial policies, or this
            disclosure, please reach out at{' '}
            <a href="mailto:contact@sweepbase.com">contact@sweepbase.com</a>. We are committed to
            transparency and will respond to all enquiries.
          </p>
        </div>
      </div>
    </main>
  );
}
