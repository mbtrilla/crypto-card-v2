import { MetadataRoute } from 'next';
import { getAllCards } from '@/lib/data';
import { SITE_URL } from '@/lib/siteConfig';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cards = await getAllCards();

  const cardEntries: MetadataRoute.Sitemap = cards.map((card) => ({
    url: `${SITE_URL}/cards/${card.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    ...cardEntries,
  ];
}
