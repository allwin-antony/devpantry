import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ChaosDataClient } from '@/components/clients/ChaosDataClient';

export const metadata: Metadata = {
  title: 'Mock Data Generator — Edge-Case Test Data & Schema Builder',
  description: 'Generate high-entropy edge-case mock records across E-Commerce, B2B Users, Invoicing, and 100+ Naughty Strings. Design custom schemas with 13+ field types and per-column chaos sliders.',
  keywords: [
    'mock data generator',
    'test data generator online',
    'fake data generator online',
    'json test data generator',
    'realistic mock data',
    'edge case test data',
    'generate sample api data',
    'fake data for testing',
    'json mock data',
    'generate realistic test data',
    'naughty strings',
    'blns generator',
    'custom schema builder',
    'typescript interface generator',
    'zod schema generator',
    'sql insert generator'
  ],
  openGraph: {
    title: 'Mock Data Generator — Edge-Case Test Data & Schema Builder | DevPantry',
    description: 'High-entropy edge-case testing: 100+ BLNS naughty strings, custom schemas, 13+ field types, and 5 export formats.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mock Data Generator & Schema Builder',
    description: 'Generate dirty mock data with 100+ naughty strings and export to JSON, CSV, SQL, Zod, and TypeScript.',
  },
  alternates: {
    canonical: 'https://devpantry.dev/chaos-data',
  },
};

export default function ChaosDataPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'DevPantry Chaos Mock Data Synthesizer',
    description: 'Generate dirty mock data with edge cases, 100+ BLNS naughty strings, and precision traps. Export to JSON, CSV, SQL, or TypeScript/Zod schemas.',
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
      <Suspense fallback={<div className="p-4 text-xs font-mono text-[var(--text-muted)]">Loading Chaos Studio...</div>}>
        <ChaosDataClient />
      </Suspense>
    </>
  );
}
