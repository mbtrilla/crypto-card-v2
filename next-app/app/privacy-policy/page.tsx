import { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Privacy Policy | Sweepbase',
  description:
    'Read the Sweepbase Privacy Policy to understand how we collect, use, and protect your information when you use our crypto card comparison service.',
  alternates: {
    canonical: 'https://sweepbase.com/privacy-policy',
  },
  openGraph: {
    title: 'Privacy Policy | Sweepbase',
    description: 'How Sweepbase collects, uses, and protects your information.',
    url: 'https://sweepbase.com/privacy-policy',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="legal-page">
      <div className="container">
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'Privacy Policy' },
        ]} />

        <h1 className="legal-h1">Privacy Policy</h1>
        <p className="legal-meta">Last updated: March 16, 2026</p>

        <div className="legal-notice-box">
          <p>
            Sweepbase is committed to protecting your privacy. This policy explains what information
            we collect when you visit <strong>sweepbase.com</strong>, how we use it, and your rights
            regarding that information. If you have any questions, contact us at{' '}
            <a href="mailto:contact@sweepbase.com">contact@sweepbase.com</a>.
          </p>
        </div>

        <div className="legal-body">
          <h2>1. Who We Are</h2>
          <p>
            Sweepbase (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the website
            sweepbase.com, an independent comparison platform for cryptocurrency debit and credit
            cards. We do not issue cards, process payments, or hold user funds. We are not a
            financial institution, broker, or investment adviser.
          </p>

          <h2>2. Information We Collect</h2>
          <p>
            We do not require registration or account creation. We do not knowingly collect or store
            personally identifiable information (PII) such as your name, email address, or payment
            details through the site itself.
          </p>
          <p>We may collect the following categories of non-personal data automatically:</p>
          <ul>
            <li>
              <strong>Usage data</strong> — pages visited, time on site, referring URL, browser
              type, device type, operating system, and approximate geographic region (country/city
              level, derived from IP address).
            </li>
            <li>
              <strong>Interaction data</strong> — clicks on card listings, filter selections, and
              compare actions. No financial or personal data is transmitted in these events.
            </li>
            <li>
              <strong>Cookies and similar technologies</strong> — see Section 4 below.
            </li>
          </ul>
          <p>
            If you contact us by email, we will receive your email address and any information you
            include in your message. We use this solely to respond to your inquiry.
          </p>

          <h2>3. How We Use Your Information</h2>
          <p>We use automatically collected data to:</p>
          <ul>
            <li>Understand how visitors navigate the site and improve content relevance.</li>
            <li>Monitor site performance and diagnose technical issues.</li>
            <li>Measure the effectiveness of our card listings and category pages.</li>
            <li>Detect and prevent fraudulent or abusive traffic.</li>
          </ul>
          <p>
            We do not sell, rent, or trade any data about our visitors to third parties for marketing
            purposes.
          </p>

          <h2>4. Cookies and Tracking Technologies</h2>
          <p>
            Sweepbase uses cookies and similar tracking technologies to operate and improve the
            service. Cookies are small text files stored in your browser.
          </p>
          <ul>
            <li>
              <strong>Essential cookies</strong> — required for the site to function correctly (e.g.
              session management, security). These cannot be disabled.
            </li>
            <li>
              <strong>Analytics cookies</strong> — we use a privacy-friendly analytics tool to
              measure aggregate traffic. IP addresses are anonymised before processing. No
              cross-site tracking profiles are built.
            </li>
            <li>
              <strong>Affiliate cookies</strong> — when you click a card link, the issuer&apos;s
              site may set a cookie to attribute the visit for commission purposes. This is governed
              by the third-party issuer&apos;s own privacy policy, not ours.
            </li>
          </ul>
          <p>
            You can disable non-essential cookies through your browser settings or a consent
            management tool. Disabling analytics cookies will not affect your ability to use the
            site.
          </p>

          <h2>5. Third-Party Services</h2>
          <p>
            We may use the following categories of third-party services that process data on our
            behalf:
          </p>
          <ul>
            <li>
              <strong>Web analytics</strong> — aggregated, anonymised traffic statistics.
            </li>
            <li>
              <strong>Content delivery network (CDN)</strong> — to serve static assets quickly and
              securely worldwide.
            </li>
            <li>
              <strong>Affiliate networks</strong> — commission tracking when you click through to a
              card issuer. See our{' '}
              <a href="/disclosure">Affiliate Disclosure</a> for details.
            </li>
          </ul>
          <p>
            Each third-party provider is governed by its own privacy policy. We select providers
            that offer data processing agreements (DPAs) compatible with GDPR requirements.
          </p>

          <h2>6. Your Rights</h2>
          <p>
            Depending on your jurisdiction, you may have the following rights regarding your personal
            data:
          </p>
          <ul>
            <li>
              <strong>EEA / UK residents (GDPR / UK GDPR)</strong> — right to access, rectify,
              erase, restrict processing, data portability, and to object to processing. You also
              have the right to lodge a complaint with your local supervisory authority.
            </li>
            <li>
              <strong>California residents (CCPA / CPRA)</strong> — right to know what personal
              information is collected, right to delete, right to opt out of the sale of personal
              information (we do not sell personal information), and right to non-discrimination.
            </li>
          </ul>
          <p>
            Because we collect minimal personal data and do not require accounts, most rights
            requests cannot be linked to a specific individual. To exercise any right, please
            contact us at{' '}
            <a href="mailto:contact@sweepbase.com">contact@sweepbase.com</a> with a description of
            your request.
          </p>

          <h2>7. Data Retention</h2>
          <p>
            Anonymised analytics data is retained for up to 24 months for trend analysis. Email
            correspondence is retained for as long as necessary to resolve your inquiry and for a
            reasonable period thereafter for record-keeping, then deleted.
          </p>

          <h2>8. International Transfers</h2>
          <p>
            Some of our third-party providers may process data outside the European Economic Area
            (EEA). Where this occurs, we rely on appropriate safeguards such as the EU Standard
            Contractual Clauses (SCCs) or equivalent mechanisms.
          </p>

          <h2>9. Children&apos;s Privacy</h2>
          <p>
            Sweepbase is not directed at children under the age of 18. We do not knowingly collect
            personal information from minors. If you believe a child has provided us with personal
            data, please contact us and we will delete it promptly.
          </p>

          <h2>10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. When we do, we will revise the
            &quot;Last updated&quot; date at the top of this page. We encourage you to review this
            policy periodically. Continued use of the site after changes constitutes acceptance of
            the revised policy.
          </p>

          <h2>11. Contact Us</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy or our data practices,
            please contact us at:{' '}
            <a href="mailto:contact@sweepbase.com">contact@sweepbase.com</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
