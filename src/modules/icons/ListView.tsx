import { Suspense } from 'react';
import { IconsClient } from '@/components/clients/IconsClient';
import Link from 'next/link';

export default function IconsListView() {
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
      <div className="flex flex-wrap items-center justify-between gap-3 p-4"><h1 className="text-2xl font-bold">SVG icons for your interface</h1><Link href="/icons/catalog/1" className="text-sm text-[var(--accent-blue)] hover:underline">Browse the complete icon directory →</Link></div>
      <Suspense fallback={<div className="p-4 text-xs font-mono text-[var(--text-muted)]">Loading Icons Studio...</div>}>
        <IconsClient />
      </Suspense>
    </>
  );
}
