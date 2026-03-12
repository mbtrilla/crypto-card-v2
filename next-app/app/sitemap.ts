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

  return [
    {
      url: 'https://sweepbase.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    ...cardEntries,
  ];
}
