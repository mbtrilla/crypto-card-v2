import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  experimental: {
    // Tree-shake package imports that ship large barrel files (e.g. icon libraries).
    // Add any future heavy packages here so only used exports are bundled.
    optimizePackageImports: ['lucide-react'],
  },
};

export default withBundleAnalyzer(nextConfig);
