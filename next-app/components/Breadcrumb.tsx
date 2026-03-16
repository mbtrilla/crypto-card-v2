/**
 * Breadcrumb — reusable WAI-ARIA breadcrumb navigation.
 *
 * Uses plain HTML (no microdata) because BreadcrumbList JSON-LD is already
 * emitted by each page that needs structured data — duplicating schema markup
 * would cause conflicts in Google Search Console.
 *
 * Usage:
 *   <Breadcrumb items={[
 *     { label: 'Home',  href: '/' },
 *     { label: 'Cards', href: '/cards' },
 *     { label: 'Binance Card' },          // no href → current page
 *   ]} />
 */

export interface BreadcrumbItem {
  label: string;
  /** Omit for the current (last) item — it will not be rendered as a link. */
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="breadcrumb__list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="breadcrumb__item-wrapper">
              {/* Separator (hidden from screen readers) */}
              {index > 0 && (
                <span className="breadcrumb__separator" aria-hidden="true">
                  ›
                </span>
              )}

              {isLast ? (
                <span
                  className="breadcrumb__item breadcrumb__item--current"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <a className="breadcrumb__link" href={item.href}>
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
