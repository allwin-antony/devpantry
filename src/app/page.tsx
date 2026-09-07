import { Metadata } from 'next';
import { HomeClient } from '@/components/clients/HomeClient';

export const metadata: Metadata = {
  title: 'DevPantry — The Developer Asset Pantry & Edge-Case Studio',
  description: 'Consolidating 2,180+ open-source typefaces with live font CDN injection, 353,000+ vector icons across 238 libraries with global master search, and high-entropy synthetic chaos data engines.',
  keywords: [
    'developer tools',
    'open source fonts',
    'fontshare',
    'google fonts',
    'fontsource',
    'vector icons',
    'iconify',
    'lucide icons',
    'tabler icons',
    'material symbols',
    'chaos engineering',
    'mock data generator',
    'BLNS',
    'punycode test',
    'api fixtures'
  ]
};

export default function HomePage() {
  return <HomeClient />;
}
