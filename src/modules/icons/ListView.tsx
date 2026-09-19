import { Suspense } from 'react';
import { IconsClient } from '@/components/clients/IconsClient';

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
      <h1 className="sr-only">Vector Icons Studio - 353,000+ SVG Icons</h1>
      <Suspense fallback={<div className="p-4 text-xs font-mono text-[var(--text-muted)]">Loading Icons Studio...</div>}>
        <IconsClient />
      </Suspense>
    </>
  );
}
