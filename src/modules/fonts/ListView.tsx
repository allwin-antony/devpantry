import { FontsClient } from '@/components/clients/FontsClient';

export default function FontsListView() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'DevPantry Fonts Studio',
      description: 'Live typography playground to test and integrate 2,180+ open-source fonts for web projects.',
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
        { '@type': 'ListItem', position: 2, name: 'Fonts', item: 'https://devpantry.com/fonts' }
      ]
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="sr-only">Fonts Studio - 2,180+ Open Source Fonts</h1>
      <FontsClient />
    </>
  );
}
