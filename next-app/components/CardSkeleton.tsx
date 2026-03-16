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

        {/* Three outline pills */}
        <div className="skeleton-block skeleton-pill" />
        <div className="skeleton-block skeleton-pill" />
        <div className="skeleton-block skeleton-pill" />

        {/* Action buttons */}
        <div style={{ marginTop: 'auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="skeleton-block skeleton-btn" />
          <div className="skeleton-block skeleton-btn" />
        </div>
      </div>
    </div>
  );
}
