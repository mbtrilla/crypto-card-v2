'use client';

import { useState } from 'react';

interface ShareButtonsProps {
  cardName: string;
  cardUrl: string;
}

/**
 * "Share this card" strip for card detail pages.
 * - Twitter/X: opens tweet intent with card name + URL + via @sweepbase
 * - Copy link: writes URL to clipboard, shows two-second confirmation
 */
export default function ShareButtons({ cardName, cardUrl }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const tweetText = `Compare the ${cardName} — fees, cashback & availability at Sweepbase`;
  const tweetHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(cardUrl)}&via=sweepbase`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(cardUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers without clipboard API
      const input = document.createElement('input');
      input.value = cardUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="share-buttons" role="group" aria-label="Share this card">
      <span className="share-buttons__label" aria-hidden="true">Share:</span>

      <a
        href={tweetHref}
        className="share-btn share-btn--twitter"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Share ${cardName} on X (Twitter)`}
      >
        {/* X (Twitter) logo — inline SVG avoids FA brand dependency */}
        <svg className="share-btn__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.261 5.635 5.902-5.635Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        Post
      </a>

      <button
        type="button"
        className={`share-btn share-btn--copy${copied ? ' share-btn--copied' : ''}`}
        onClick={handleCopy}
        aria-label={copied ? 'Link copied!' : 'Copy link to this card'}
      >
        {copied ? (
          <>
            <i className="fa-solid fa-check share-btn__icon" aria-hidden="true"></i>
            Copied!
          </>
        ) : (
          <>
            <i className="fa-solid fa-link share-btn__icon" aria-hidden="true"></i>
            Copy link
          </>
        )}
      </button>
    </div>
  );
}
