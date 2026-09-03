import { MetadataRoute } from 'next';
import { getAllFontSlugs, getAllIconPrefixes } from '@/lib/datasetLoader';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://devplayground.io';
  const now = new Date();

  const coreRoutes: MetadataRoute.Sitemap = [
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
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/icons`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/chaos-templates`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  // Font detail pages
  const fontSlugs = getAllFontSlugs();
  const fontRoutes: MetadataRoute.Sitemap = fontSlugs.map(slug => ({
    url: `${baseUrl}/fonts/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // Icon library detail pages
  const iconPrefixes = getAllIconPrefixes();
  const iconRoutes: MetadataRoute.Sitemap = iconPrefixes.map(prefix => ({
    url: `${baseUrl}/icons/${prefix}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...coreRoutes, ...fontRoutes, ...iconRoutes];
}
