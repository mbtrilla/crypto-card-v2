import React from 'react';

interface ExternalLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Add rel="sponsored" for affiliate/paid links */
  sponsored?: boolean;
}

/**
 * External link with proper rel attributes for SEO.
 * Always adds noopener noreferrer nofollow. Optionally adds sponsored.
 */
export function ExternalLink({ sponsored, children, ...props }: ExternalLinkProps) {
  const rel = sponsored
    ? 'noopener noreferrer nofollow sponsored'
    : 'noopener noreferrer nofollow';
  return (
    <a rel={rel} target="_blank" {...props}>
      {children}
    </a>
  );
}

/**
 * Affiliate link — always includes nofollow + sponsored.
 * Use for "Get Card" buttons that link to card issuer websites.
 */
export function AffiliateLink({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a rel="noopener noreferrer nofollow sponsored" target="_blank" {...props}>
      {children}
    </a>
  );
}
