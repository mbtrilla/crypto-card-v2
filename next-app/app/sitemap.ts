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
    ...categoryEntries,
    ...cardEntries,
  ];
}
