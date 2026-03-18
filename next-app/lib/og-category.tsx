import { ImageResponse } from 'next/og';

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = 'image/png';

interface CategoryOGProps {
  title: string;
  cardCount: number;
  subtitle?: string;
}

export function generateCategoryOG({ title, cardCount, subtitle }: CategoryOGProps) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #0d1230 0%, #151d50 60%, #1a2268 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: '56px 64px',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: '#5b7cff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                fontWeight: 900,
                color: 'white',
              }}
            >
              S
            </div>
            <span style={{ color: 'white', fontSize: '26px', fontWeight: 700, letterSpacing: '-0.3px' }}>
              SWEEPBASE
            </span>
          </div>
          <span style={{ color: '#8b9abf', fontSize: '18px' }}>sweepbase.com</span>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {subtitle && (
            <p
              style={{
                color: '#8b9abf',
                fontSize: '22px',
                margin: '0 0 14px 0',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {subtitle}
            </p>
          )}

          <h1
            style={{
              color: 'white',
              fontSize: title.length > 35 ? '56px' : '68px',
              fontWeight: 800,
              margin: '0 0 36px 0',
              lineHeight: 1.1,
              letterSpacing: '-1px',
            }}
          >
            {title}
          </h1>

          {/* Badges */}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <div
              style={{
                background: '#5b7cff',
                color: 'white',
                padding: '10px 24px',
                borderRadius: '10px',
                fontSize: '20px',
                fontWeight: 700,
              }}
            >
              {cardCount} Cards Compared
            </div>
            <div
              style={{
                background: 'rgba(91, 124, 255, 0.18)',
                border: '1px solid rgba(91, 124, 255, 0.4)',
                color: '#a0b4ff',
                padding: '10px 24px',
                borderRadius: '10px',
                fontSize: '18px',
              }}
            >
              Updated 2026
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '24px',
            borderTop: '1px solid #2d3561',
          }}
        >
          <span style={{ color: '#5b7cff', fontSize: '18px', fontWeight: 600 }}>
            sweepbase.com
          </span>
          <span style={{ color: '#8b9abf', fontSize: '18px' }}>
            Independent Crypto Card Comparison
          </span>
        </div>
      </div>
    ),
    { ...ogSize },
  );
}
