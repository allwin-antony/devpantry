import type { Metadata } from 'next';
import { Suspense } from 'react';
import { IconsClient } from '@/components/clients/IconsClient';

export const metadata: Metadata = {
  title: 'Vector Icons Studio & Live SVG Customizer',
  description: 'Search, preview, and customize 353,000+ vector icons from 238 open-source libraries: Lucide, Tabler, Heroicons, Phosphor, Simple Icons, Material Symbols, and Radix. Interactive canvas to adjust stroke, size, and copy React, SVG, and Vue code.',
  keywords: [
    'vector icons',
    'svg icon customizer',
    'lucide icons',
    'tabler icons',
    'heroicons',
    'phosphor icons',
    'material symbols',
    'react icons',
    'vue icons',
    'copy svg',
    'free commercial icons',
    'open source icons'
  ],
  openGraph: {
    title: 'Vector Icons Studio & Live SVG Customizer | DevPantry',
    description: 'Interactive SVG icon playground: adjust size, stroke width, and colors across 353,000+ vector icons from 238 open-source libraries.',
  }
};

export default function IconsPage() {
  return (
    <Suspense fallback={<div className="p-4 text-xs font-mono text-[var(--text-muted)]">Loading Icons Studio...</div>}>
      <IconsClient />
    </Suspense>
  );
}
