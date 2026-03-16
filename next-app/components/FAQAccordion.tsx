'use client';

import { useState } from 'react';

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface FAQItem {
  q: string;
  /**
   * Answer text. May contain inline HTML (links, <br> line-breaks).
   * Rendered with dangerouslySetInnerHTML — ensure the source is trusted
   * server-generated content only.
   */
  a: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  /**
   * Namespace prefix for element IDs.
   * Prevents aria-controls / id collisions if two accordions exist on the
   * same page. Defaults to "faq". Use the card slug on card detail pages.
   */
  ns?: string;
}

// ─── Component ─────────────────────────────────────────────────────────────────

/**
 * Accessible FAQ accordion — WAI-ARIA Accordion pattern.
 *
 * - Each question is an <h3> containing a <button> with aria-expanded.
 * - Each panel is a <div role="region"> linked via aria-controls / aria-labelledby.
 * - Height is animated with a CSS grid-template-rows transition (no JS measurement).
 * - Font Awesome fa-plus / fa-minus icons indicate open/closed state.
 * - The first item is open by default; clicking an open item collapses it.
 *
 * Text rendered in the visible FAQ exactly matches the FAQPage JSON-LD schema
 * (both sourced from the same `items` array), ensuring schema/content parity.
 */
export default function FAQAccordion({ items, ns = 'faq' }: FAQAccordionProps) {
  // -1 = all collapsed; ≥0 = index of the open item
  const [openIdx, setOpenIdx] = useState<number>(0);

  function toggle(i: number) {
    setOpenIdx(prev => (prev === i ? -1 : i));
  }

  return (
    <div className="faq-accordion" role="list">
      {items.map(({ q, a }, i) => {
        const isOpen = openIdx === i;
        const btnId   = `${ns}-btn-${i}`;
        const panelId = `${ns}-panel-${i}`;

        return (
          <div
            key={i}
            className={`faq-accordion__item${isOpen ? ' faq-accordion__item--open' : ''}`}
            role="listitem"
          >
            {/*
              WAI-ARIA Accordion: heading > button.
              Screen readers announce "Q text, collapsed, button, heading level 3".
              h3 is correct here — the FAQ section opens with an h2.
            */}
            <h3 className="faq-accordion__heading">
              <button
                id={btnId}
                type="button"
                className="faq-accordion__trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(i)}
              >
                <span className="faq-accordion__q">{q}</span>
                <span className="faq-accordion__icon" aria-hidden="true">
                  {isOpen
                    ? <i className="fa-solid fa-minus" />
                    : <i className="fa-solid fa-plus" />}
                </span>
              </button>
            </h3>

            {/*
              Panel — always in the DOM so CSS transitions work.
              Height is animated by toggling grid-template-rows between 0fr ↔ 1fr.
              The direct grid child (.faq-accordion__panel-body) must have
              overflow:hidden so the grid row can collapse to true 0 height.
            */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              className="faq-accordion__panel"
            >
              {/* Direct grid child — overflow:hidden enables grid-row collapse */}
              <div className="faq-accordion__panel-body">
                {/* Padding lives here so it doesn't "bleed" when the row is 0fr */}
                <div
                  className="faq-accordion__answer"
                  dangerouslySetInnerHTML={{ __html: a.replace(/\n/g, '<br>') }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
