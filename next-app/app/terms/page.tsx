import { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata: Metadata = {
  title: 'Terms of Service | Sweepbase',
  description:
    'Read the Sweepbase Terms of Service. Sweepbase is an independent crypto card comparison site — not a financial adviser. Content is for informational purposes only.',
  alternates: {
    canonical: 'https://sweepbase.com/terms',
  },
  openGraph: {
    title: 'Terms of Service | Sweepbase',
    description:
      'Sweepbase Terms of Service — informational comparison site, not financial advice.',
    url: 'https://sweepbase.com/terms',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <main className="legal-page">
      <div className="container">
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'Terms of Service' },
        ]} />

        <h1 className="legal-h1">Terms of Service</h1>
        <p className="legal-meta">Last updated: March 16, 2026</p>

        <div className="legal-notice-box">
          <p>
            <strong>Important:</strong> Sweepbase provides crypto card comparisons for informational
            purposes only. Nothing on this site constitutes financial, investment, tax, or legal
            advice. Always conduct your own research before applying for any financial product.
          </p>
        </div>

        <div className="legal-body">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using sweepbase.com (&quot;the Site&quot;), you agree to be bound by
            these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, please
            do not use the Site. We reserve the right to update these Terms at any time; continued
            use of the Site constitutes your acceptance of any changes.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            Sweepbase is an independent comparison platform that aggregates publicly available
            information about cryptocurrency debit and credit cards from various issuers worldwide.
            Our database currently covers over 100 cards across multiple networks (Visa, Mastercard,
            and others), geographies, custody models, and reward structures.
          </p>
          <p>
            We do not issue cards, open accounts, process payments, hold digital assets, or act as
            an intermediary between you and any card issuer. All applications must be made directly
            with the respective issuer on their own platform.
          </p>

          <h2>3. Not Financial Advice</h2>
          <p>
            All content on Sweepbase — including card comparisons, fee tables, reward rates, region
            availability, ratings, and editorial commentary — is provided for <strong>informational
            and educational purposes only</strong>. It does not constitute:
          </p>
          <ul>
            <li>Financial or investment advice</li>
            <li>Legal or tax advice</li>
            <li>A recommendation or endorsement of any specific card or issuer</li>
            <li>An offer or solicitation to purchase any financial product</li>
          </ul>
          <p>
            Cryptocurrency products involve significant risk, including the potential loss of
            principal. Past performance is not indicative of future results. You should consult a
            qualified financial adviser before making decisions based on information found on this
            Site.
          </p>

          <h2>4. Accuracy of Information</h2>
          <p>
            We make reasonable efforts to keep card data accurate and up to date. However, card
            terms, fees, availability, and features change frequently. Sweepbase does not guarantee
            the accuracy, completeness, or timeliness of any information on the Site.
          </p>
          <p>
            Always verify current terms directly with the card issuer before applying. Fee
            structures and availability may differ from what is shown on Sweepbase due to recent
            changes, geographic variations, or promotional conditions.
          </p>

          <h2>5. Affiliate Relationships</h2>
          <p>
            Some links on Sweepbase are affiliate links. When you click one and subsequently apply
            for or obtain a card, we may receive a commission from the issuer at no additional cost
            to you. This helps fund the operation of the Site. For full details, see our{' '}
            <a href="/disclosure">Affiliate Disclosure</a>. Affiliate relationships do not influence
            our editorial assessments or the order in which cards are displayed.
          </p>

          <h2>6. Intellectual Property</h2>
          <p>
            All content on Sweepbase, including text, graphics, logos, icons, and data
            compilations, is the property of Sweepbase or its content suppliers and is protected by
            applicable copyright, trademark, and database laws. You may not reproduce, distribute,
            or create derivative works from Site content without our express written permission.
          </p>
          <p>
            Card images, brand names, and trademarks displayed on the Site are the property of
            their respective owners and are used for identification and comparison purposes only.
            Use of such marks does not imply endorsement by those trademark owners.
          </p>

          <h2>7. User Conduct</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the Site for any unlawful purpose or in violation of any regulations.</li>
            <li>
              Scrape, crawl, or systematically extract data from the Site without prior written
              consent.
            </li>
            <li>
              Attempt to gain unauthorised access to any part of the Site or its underlying
              infrastructure.
            </li>
            <li>
              Transmit any malware, spam, or other harmful code through the Site.
            </li>
            <li>
              Misrepresent your identity or affiliation with any person or organisation.
            </li>
          </ul>

          <h2>8. Third-Party Links</h2>
          <p>
            The Site contains links to external websites operated by card issuers, affiliate
            networks, and other third parties. These links are provided for your convenience.
            Sweepbase has no control over third-party sites and accepts no responsibility for their
            content, privacy practices, or availability. Accessing third-party sites is entirely at
            your own risk.
          </p>

          <h2>9. Disclaimer of Warranties</h2>
          <p>
            The Site and all content are provided &quot;as is&quot; and &quot;as available&quot;
            without warranties of any kind, either express or implied, including but not limited to
            warranties of merchantability, fitness for a particular purpose, non-infringement, or
            uninterrupted, error-free operation. We do not warrant that the Site will be free from
            viruses or other harmful components.
          </p>

          <h2>10. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by applicable law, Sweepbase and its operators, officers,
            employees, and agents shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages — including loss of profits, loss of data, loss of
            goodwill, or financial loss — arising out of or in connection with your use of, or
            inability to use, the Site or any content herein, even if advised of the possibility of
            such damages.
          </p>
          <p>
            Our total aggregate liability for any claim arising out of these Terms or your use of
            the Site shall not exceed the greater of USD $100 or the amount you have paid us in the
            twelve months preceding the claim (which in most cases will be zero, as the Site is
            free to use).
          </p>

          <h2>11. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless Sweepbase and its operators from and against
            any claims, liabilities, damages, losses, and expenses (including reasonable legal fees)
            arising out of or in any way connected with your access to or use of the Site, your
            violation of these Terms, or your infringement of any intellectual property or other
            rights of any person or entity.
          </p>

          <h2>12. Modifications to the Service</h2>
          <p>
            We reserve the right to modify, suspend, or discontinue the Site or any part of it at
            any time without notice. We shall not be liable to you or any third party for any such
            modification, suspension, or discontinuation.
          </p>

          <h2>13. Governing Law and Disputes</h2>
          <p>
            These Terms shall be governed by and construed in accordance with applicable law. Any
            dispute arising under or in connection with these Terms shall first be attempted to be
            resolved through good-faith negotiation. If negotiation fails, disputes shall be
            submitted to binding arbitration or the competent courts of the jurisdiction in which
            Sweepbase operates, as applicable.
          </p>

          <h2>14. Severability</h2>
          <p>
            If any provision of these Terms is found to be invalid or unenforceable, that provision
            will be limited or eliminated to the minimum extent necessary, and the remaining
            provisions of these Terms will remain in full force and effect.
          </p>

          <h2>15. Contact Us</h2>
          <p>
            If you have questions about these Terms, please contact us at:{' '}
            <a href="mailto:contact@sweepbase.com">contact@sweepbase.com</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
