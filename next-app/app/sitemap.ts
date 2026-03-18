import { MetadataRoute } from 'next';
import { getAllCards } from '@/lib/data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cards = await getAllCards();
  
  const cardEntries: MetadataRoute.Sitemap = cards.map((card) => ({
    url: `https://sweepbase.com/cards/${card.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const categoryEntries: MetadataRoute.Sitemap = [
    'best-crypto-cards-usa',
    'best-crypto-cards-europe',
    'best-crypto-cards-uk',
    'best-crypto-cards-canada',
    'best-crypto-cards-latin-america',
    'best-crypto-cards-asia',
    'best-crypto-cards-australia',
    'visa-crypto-cards',
    'mastercard-crypto-cards',
    'self-custody-crypto-cards',
    'crypto-cards-with-cashback',
  ].map((slug) => ({
    url: `https://sweepbase.com/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  const legalEntries: MetadataRoute.Sitemap = [
    'privacy-policy',
    'terms',
    'disclosure',
  ].map((slug) => ({
    url: `https://sweepbase.com/${slug}`,
    lastModified: new Date('2026-03-16'),
    changeFrequency: 'monthly' as const,
    priority: 0.3,
  }));

  return [
    {
      url: 'https://sweepbase.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: 'https://sweepbase.com/cards',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: 'https://sweepbase.com/compare',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: 'https://sweepbase.com/calculator',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: 'https://sweepbase.com/about',
      lastModified: new Date('2026-03-16'),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: 'https://sweepbase.com/guides',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: 'https://sweepbase.com/guides/how-to-choose-a-crypto-card',
      lastModified: new Date('2026-03-18'),
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    },
    {
      url: 'https://sweepbase.com/guides/crypto-card-fees-explained',
      lastModified: new Date('2026-03-18'),
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    },
    {
      url: 'https://sweepbase.com/guides/self-custody-vs-custodial-crypto-cards',
      lastModified: new Date('2026-03-18'),
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    },
    {
      url: 'https://sweepbase.com/guides/best-crypto-cards-for-beginners',
      lastModified: new Date('2026-03-18'),
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    },
    ...categoryEntries,
    ...cardEntries,
    ...legalEntries,
  ];
}
