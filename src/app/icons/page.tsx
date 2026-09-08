import type { Metadata } from 'next';
import { Suspense } from 'react';
import { IconsClient } from '@/components/clients/IconsClient';

export const metadata: Metadata = {
  title: '353,000+ Free SVG Icons — Browse, Customize & Copy Code',
  description: 'Search, preview, and customize 353,000+ free svg icons from 238 open-source libraries. Interactive canvas to adjust stroke, size, and copy React, SVG, and Vue code.',
  keywords: [
    'free svg icons',
    'browse icons online',
    'copy svg code',
    'icon search engine',
    'customize icon color and size',
    'free svg icons for websites',
    'copy icon as react component',
    'iconify browser',
    'react icons',
    'vue icons',
    'free commercial icons',
    'open source icons'
  ],
  openGraph: {
    title: '353,000+ Free SVG Icons | DevPantry',
    description: 'Interactive SVG icon playground: adjust size, stroke width, and colors across 353,000+ vector icons from 238 open-source libraries.',
  },
  twitter: {
    card: 'summary_large_image',
    title: '353,000+ Free SVG Icons — Browse & Copy Code',
    description: 'Live SVG customizer, React JSX generator, and searchable icon library with 353,000+ open source icons.',
  },
  alternates: {
    canonical: 'https://devpantry.dev/icons',
  },
};

export default function IconsPage() {
  const jsonLd = {
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
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={<div className="p-4 text-xs font-mono text-[var(--text-muted)]">Loading Icons Studio...</div>}>
        <IconsClient />
      </Suspense>
    </>
  );
}
