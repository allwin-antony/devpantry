import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: [
      'https://devpantry.com/sitemap/core.xml',
      'https://devpantry.com/sitemap/fonts.xml',
      'https://devpantry.com/sitemap/icons.xml',
      'https://devpantry.com/sitemap/templates.xml',
    ],
  };
}
