import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
  },
  experimental: {
    // Tree-shake package imports that ship large barrel files (e.g. icon libraries).
    // Add any future heavy packages here so only used exports are bundled.
    optimizePackageImports: ['lucide-react'],
  },
  async redirects() {
    return [
      // Slug was generated from a Cyrillic "С" in the original card name,
      // producing "kripi-ard". Fixed to "kripi-card" (Latin C).
      {
        source: '/cards/kripi-ard',
        destination: '/cards/kripi-card',
        permanent: true, // 301
      },
      // Card was named "Plutus" (no suffix). Renamed to "Plutus Card".
      {
        source: '/cards/plutus',
        destination: '/cards/plutus-card',
        permanent: true, // 301
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
