import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://devplayground.io';
  const now = new Date();

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/chaos-data`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/fonts`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/icons`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/api-vault`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];
}
