import type { Metadata } from 'next';
import { FontsClient } from '@/components/clients/FontsClient';

export const metadata: Metadata = {
  title: '2,180+ Free Open Source Fonts — Preview, Test & Get Code',
  description: 'Explore, test, and integrate 2,180+ open-source typefaces from Fontshare, Fontsource, and GitHub. Live interactive type tester with size, weight, and tracking sliders, plus one-click CSS and npm snippets.',
  openGraph: {
    title: '2,180+ Free Open Source Fonts | DevPantry',
    description: 'Explore, test, and integrate 2,180+ open-source typefaces with live typing playground, weight controls, and CSS @import snippets.',
    images: [{ url: '/og-image-assets.png', width: 1200, height: 630, alt: 'DevPantry 2,180+ Open Source Fonts' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '2,180+ Free Open Source Fonts',
    description: 'Live interactive type tester with size, weight, and tracking sliders for 2,180+ free open-source fonts.',
    images: ['/og-image-assets.png'],
  },
  alternates: {
    canonical: 'https://devpantry.com/fonts',
  },
};

export default function FontsPage() {
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
