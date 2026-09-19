import { MetadataRoute } from 'next';
import { moduleRegistry } from '@/lib/moduleRegistry';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const dynamicSitemaps = moduleRegistry.map(m => `https://devpantry.com/sitemap/${m.type}.xml`);

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: [
      'https://devpantry.com/sitemap/core.xml',
      'https://devpantry.com/sitemap/templates.xml',
      ...dynamicSitemaps,
    ],
  };
}
