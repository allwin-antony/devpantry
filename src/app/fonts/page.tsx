import type { Metadata } from 'next';
import { FontsClient } from '@/components/clients/FontsClient';

export const metadata: Metadata = {
  title: '2,180+ Free Open Source Fonts — Preview, Test & Get Code',
  description: 'Explore, test, and integrate 2,180+ open-source typefaces from Fontshare, Fontsource, and GitHub. Live interactive type tester with size, weight, and tracking sliders, plus one-click CSS and npm snippets.',
  keywords: [
    'free fonts for websites',
    'free fonts for commercial use',
    'open source fonts',
    'preview fonts online',
    'test fonts online',
    'google fonts alternative',
    'font pairing tool',
    'compare web fonts side by side',
    'css font import generator',
    'fontshare fonts',
    'sil ofl fonts',
    'typography playground',
    'web font tester',
    'satoshi font',
    'clash display font',
    'jetbrains mono font',
    'fira code font',
    'tailwind font family generator'
  ],
  openGraph: {
    title: '2,180+ Free Open Source Fonts | DevPantry',
    description: 'Explore, test, and integrate 2,180+ open-source typefaces with live typing playground, weight controls, and CSS @import snippets.',
  },
  twitter: {
    card: 'summary_large_image',
    title: '2,180+ Free Open Source Fonts',
    description: 'Live interactive type tester with size, weight, and tracking sliders for 2,180+ free open-source fonts.',
  },
  alternates: {
    canonical: 'https://devpantry.dev/fonts',
  },
};

export default function FontsPage() {
  const jsonLd = {
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
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FontsClient />
    </>
  );
}
