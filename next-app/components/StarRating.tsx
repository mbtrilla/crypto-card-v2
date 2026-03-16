/** Server component — no 'use client' needed. */

const STAR_FILLED  = '#F59E0B';
const STAR_EMPTY   = '#334155';
const STAR_POINTS  = '12,2.5 14.83,9.06 22,9.97 16.9,14.72 18.35,21.77 12,18.27 5.65,21.77 7.1,14.72 2,9.97 9.17,9.06';

interface StarProps {
  fill: 'full' | 'half' | 'empty';
  /** Used to generate a unique clipPath id — pass the star index (0–4). */
  index: number;
  /** Unique suffix per card to avoid collisions when multiple cards render on the same page. */
  uid: string;
}

function Star({ fill, index, uid }: StarProps) {
  const clipId = `sr-${uid}-${index}`;

  if (fill === 'full') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <polygon
          points={STAR_POINTS}
          fill={STAR_FILLED}
          stroke={STAR_FILLED}
          strokeWidth="0.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (fill === 'empty') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <polygon
          points={STAR_POINTS}
          fill="none"
          stroke={STAR_EMPTY}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // Half star — left 50 % filled via clipPath
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={clipId}>
          <rect x="0" y="0" width="12" height="24" />
        </clipPath>
      </defs>
      {/* Empty shell */}
      <polygon
        points={STAR_POINTS}
        fill="none"
        stroke={STAR_EMPTY}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Filled left half */}
      <polygon
        points={STAR_POINTS}
        fill={STAR_FILLED}
        stroke={STAR_FILLED}
        strokeWidth="0.5"
        strokeLinejoin="round"
        clipPath={`url(#${clipId})`}
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------

interface StarRatingProps {
  /** Numeric rating between 1.0 and 5.0 (1 decimal place). */
  rating: number;
  /** Number of editorial reviews. */
  reviewCount: number;
  /**
   * Unique identifier used to namespace SVG clipPath ids.
   * Pass the card slug to avoid collisions.
   */
  uid: string;
}

export default function StarRating({ rating, reviewCount, uid }: StarRatingProps) {
  const stars = ([1, 2, 3, 4, 5] as const).map((i) => {
    if (rating >= i)       return 'full'  as const;
    if (rating >= i - 0.5) return 'half'  as const;
    return                        'empty' as const;
  });

  const formattedCount = reviewCount.toLocaleString('en-US');

  return (
    <div
      className="star-rating"
      aria-label={`Editorial rating: ${rating.toFixed(1)} out of 5 based on ${formattedCount} reviews`}
    >
      <span className="star-icons" aria-hidden="true">
        {stars.map((fill, i) => (
          <Star key={i} fill={fill} index={i} uid={uid} />
        ))}
      </span>
      <span className="star-score">{rating.toFixed(1)}<span className="star-score-max">&nbsp;/ 5.0</span></span>
      <span className="star-separator" aria-hidden="true">·</span>
      <span className="star-count">{formattedCount} reviews</span>
    </div>
  );
}
