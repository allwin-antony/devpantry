import { MetadataRoute } from 'next';
import { getAllFontSlugs, getAllIconPrefixes, getAllServiceResponseIds } from '@/lib/datasetLoader';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://devpantry.com';
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
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/fonts`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/icons`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/chaos-templates`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/background-removal`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/image-resizer`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/image-compressor`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/jwt-inspector`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.95,
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

  // Chaos API Template detail pages (SEO)
  const templateIds = getAllServiceResponseIds();
  const templateRoutes: MetadataRoute.Sitemap = templateIds.map(id => ({
    url: `${baseUrl}/chaos-templates/${id}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  return [...coreRoutes, ...fontRoutes, ...iconRoutes, ...templateRoutes];
}
