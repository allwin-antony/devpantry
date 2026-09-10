import { MetadataRoute } from 'next';
import { getAllIconPrefixes, getAllServiceResponseIds } from '@/lib/datasetLoader';

export async function generateSitemaps() {
  return [
    { id: 'core' },
    { id: 'fonts' },
    { id: 'icons' },
    { id: 'templates' },
  ];
}

export default function sitemap({ id }: { id: string }): MetadataRoute.Sitemap {
  const baseUrl = 'https://devpantry.com';
  const staticDate = new Date('2026-09-09');

  if (id === 'core') {
    return [
      { url: baseUrl, lastModified: staticDate, changeFrequency: 'daily', priority: 1.0 },
      { url: `${baseUrl}/mock-data`, lastModified: staticDate, changeFrequency: 'weekly', priority: 0.95 },
      { url: `${baseUrl}/fonts`, lastModified: staticDate, changeFrequency: 'weekly', priority: 0.95 },
      { url: `${baseUrl}/icons`, lastModified: staticDate, changeFrequency: 'weekly', priority: 0.95 },
      { url: `${baseUrl}/api-templates`, lastModified: staticDate, changeFrequency: 'weekly', priority: 0.9 },
      { url: `${baseUrl}/background-remover`, lastModified: staticDate, changeFrequency: 'weekly', priority: 0.95 },
      { url: `${baseUrl}/image-resizer`, lastModified: staticDate, changeFrequency: 'weekly', priority: 0.95 },
      { url: `${baseUrl}/image-compressor`, lastModified: staticDate, changeFrequency: 'weekly', priority: 0.95 },
      { url: `${baseUrl}/jwt-decoder`, lastModified: staticDate, changeFrequency: 'weekly', priority: 0.95 },
    ];
  }

  if (id === 'fonts') {
    const allFonts = require('@/lib/loaders/fontLoader').getAllFonts();
    const { isFontIndexable } = require('@/lib/loaders/fontLoader');
    
    const indexableFonts = allFonts.filter((f: any) => isFontIndexable(f));

    return indexableFonts.map((f: any) => ({
      url: `${baseUrl}/fonts/${f.slug}`,
      lastModified: staticDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    }));
  }

  if (id === 'icons') {
    const iconPrefixes = getAllIconPrefixes();
    return iconPrefixes.map(prefix => ({
      url: `${baseUrl}/icons/${prefix}`,
      lastModified: staticDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    }));
  }

  if (id === 'templates') {
    const templateIds = getAllServiceResponseIds();
    return templateIds.map(tid => ({
      url: `${baseUrl}/api-templates/${tid}`,
      lastModified: staticDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    }));
  }

  return [];
}
