import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // All crawlers: allow everything except internal Next.js routes and API
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/static/'],
      },
      // Restrict AI training bots from API endpoints
      {
        userAgent: 'GPTBot',
        disallow: ['/api/'],
      },
      {
        userAgent: 'ClaudeBot',
        disallow: ['/api/'],
      },
    ],
    sitemap: 'https://sweepbase.com/sitemap.xml',
  };
}
