import { ImageResponse } from 'next/og';
import { getAllCards } from '@/lib/data';

export const runtime = 'nodejs';
export const alt = 'Sweepbase — Crypto Card Review';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getNetworkStyle(network: string): { bg: string; label: string } {
  const n = network.toLowerCase();
  if (n.includes('visa'))       return { bg: '#1434CB', label: 'VISA' };
  if (n.includes('mastercard')) return { bg: '#FF5F00', label: 'MASTERCARD' };
  return { bg: '#3b4a7a', label: network.toUpperCase() };
}

function hasMeaningfulCashback(cashback: string): boolean {
  const v = cashback.toLowerCase().trim();
  return !!v && v !== 'n/a' && v !== '0%' && v !== '0' && v !== 'none' && v !== 'no' && !v.startsWith('no ');
}

/** Truncate long card names so they fit on one line at 68px */
function truncateName(name: string, max = 38): string {
  return name.length > max ? name.slice(0, max - 1) + '…' : name;
}

// ─── Image ────────────────────────────────────────────────────────────────────

export default async function OGImage({ params }: { params: { slug: string } }) {
  const cards = await getAllCards();
  const card  = cards.find(c => c.slug === params.slug);

  const cardName   = card ? truncateName(card.name) : 'Crypto Card Review';
  const network    = card ? getNetworkStyle(card.network) : { bg: '#3b4a7a', label: 'CRYPTO' };
  const cashback   = card && hasMeaningfulCashback(card.cashback) ? card.cashback : null;
  const mainCb     = card?.mainPageCashback || cashback;
  const displayCb  = mainCb && hasMeaningfulCashback(mainCb) ? mainCb : cashback;

  return new ImageResponse(
    (
      <div
        style={{
          width:           '1200px',
          height:          '630px',
          display:         'flex',
          flexDirection:   'column',
          background:      'linear-gradient(135deg, #0d1230 0%, #151d50 60%, #1a2268 100%)',
          fontFamily:      'system-ui, -apple-system, sans-serif',
          padding:         '56px 64px',
        }}
      >
        {/* ── Header ─────────────────────────────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Sweepbase wordmark */}
            <div
              style={{
                width:        '40px',
                height:       '40px',
                borderRadius: '10px',
                background:   '#5b7cff',
                display:      'flex',
                alignItems:   'center',
                justifyContent: 'center',
                fontSize:     '22px',
                fontWeight:   900,
                color:        'white',
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

        {/* ── Main content ────────────────────────────────────────── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p
            style={{
              color:        '#8b9abf',
              fontSize:     '22px',
              margin:       '0 0 14px 0',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Crypto Card Review 2026
          </p>

          <h1
            style={{
              color:       'white',
              fontSize:    cardName.length > 28 ? '60px' : '72px',
              fontWeight:  800,
              margin:      '0 0 36px 0',
              lineHeight:  1.1,
              letterSpacing: '-1px',
            }}
          >
            {cardName}
          </h1>

          {/* ── Badges ──────────────────────────────────────────── */}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            {/* Network badge */}
            <div
              style={{
                background:   network.bg,
                color:        'white',
                padding:      '10px 24px',
                borderRadius: '10px',
                fontSize:     '20px',
                fontWeight:   700,
                letterSpacing: '0.04em',
              }}
            >
              {network.label}
            </div>

            {/* Cashback badge */}
            {displayCb && (
              <div
                style={{
                  background:   '#16a34a',
                  color:        'white',
                  padding:      '10px 24px',
                  borderRadius: '10px',
                  fontSize:     '20px',
                  fontWeight:   600,
                }}
              >
                {displayCb} Cashback
              </div>
            )}

            {/* Reviewed badge */}
            <div
              style={{
                background:   'rgba(91, 124, 255, 0.18)',
                border:       '1px solid rgba(91, 124, 255, 0.4)',
                color:        '#a0b4ff',
                padding:      '10px 24px',
                borderRadius: '10px',
                fontSize:     '18px',
              }}
            >
              ✓ Independently Reviewed
            </div>
          </div>
        </div>

        {/* ── Footer divider + tagline ────────────────────────────── */}
        <div
          style={{
            display:         'flex',
            justifyContent:  'space-between',
            alignItems:      'center',
            paddingTop:      '24px',
            borderTop:       '1px solid #2d3561',
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
    {
      ...size,
    },
  );
}
