/**
 * CardSkeleton — loading placeholder that mirrors the .crypto-card layout.
 * Uses a CSS shimmer animation defined in globals.css (.skeleton-block).
 */
export default function CardSkeleton() {
  return (
    <div className="crypto-card skeleton-card" aria-hidden="true">
      {/* Card image area */}
      <div className="card-image-wrapper">
        <div className="skeleton-block skeleton-image" />
      </div>

      {/* Card content bottom */}
      <div className="card-content-bottom">
        {/* Badge row */}
        <div className="card-meta-tags" style={{ display: 'flex', gap: '0.5rem' }}>
          <div className="skeleton-block skeleton-badge" />
          <div className="skeleton-block skeleton-badge" />
        </div>

        {/* Title */}
        <div className="skeleton-block skeleton-title" />

        {/* Cashback (wide, tall) */}
        <div className="skeleton-block skeleton-cashback" />

        {/* Region */}
        <div className="skeleton-block skeleton-region" />

        {/* Type (short) */}
        <div className="skeleton-block skeleton-type" />

        {/* Action buttons */}
        <div className="card-actions">
          <div className="skeleton-block skeleton-btn" />
          <div className="skeleton-block skeleton-btn-ghost" />
        </div>
      </div>
    </div>
  );
}
