import type { Metadata } from 'next';
import { Suspense } from 'react';
import { IconsClient } from '@/components/clients/IconsClient';

export const metadata: Metadata = {
  title: '353,000+ Free SVG Icons — Browse, Customize & Copy Code',
  description: 'Search, preview, and customize 353,000+ free svg icons from 238 open-source libraries. Interactive canvas to adjust stroke, size, and copy React, SVG, and Vue code.',
  openGraph: {
    title: '353,000+ Free SVG Icons | DevPantry',
    description: 'Interactive SVG icon playground: adjust size, stroke width, and colors across 353,000+ vector icons from 238 open-source libraries.',
    images: [{ url: '/og-image-assets.png', width: 1200, height: 630, alt: 'DevPantry 353,000+ Free SVG Icons' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '353,000+ Free SVG Icons — Browse & Copy Code',
    description: 'Live SVG customizer, React JSX generator, and searchable icon library with 353,000+ open source icons.',
    images: ['/og-image-assets.png'],
  },
  alternates: {
    canonical: 'https://devpantry.com/icons',
  },
};

export default function IconsPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'DevPantry Icons Studio',
      description: 'Interactive SVG icon playground to browse, customize, and copy over 353,000 free open-source vector icons.',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Any',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://devpantry.com' },
        { '@type': 'ListItem', position: 2, name: 'Icons', item: 'https://devpantry.com/icons' }
      ]
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="sr-only">Vector Icons Studio - 353,000+ SVG Icons</h1>
      <Suspense fallback={<div className="p-4 text-xs font-mono text-[var(--text-muted)]">Loading Icons Studio...</div>}>
        <IconsClient />
      </Suspense>
    </>
  );
}
