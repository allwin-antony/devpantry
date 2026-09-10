import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ChaosDataClient } from '@/components/clients/ChaosDataClient';

export const metadata: Metadata = {
  title: 'Mock Data Generator — Realistic Test Data Online | DevPantry',
  description: 'Generate high-entropy, realistic mock data for UI and API stress testing. Includes Naughty Strings, Unicode anomalies, max-bounds integers, and schema builders. 100% private, client-side generation.',
  openGraph: {
    title: 'Mock Data Generator — Edge-Case Test Data & Schema Builder | DevPantry',
    description: 'High-entropy edge-case testing: 100+ BLNS naughty strings, custom schemas, 13+ field types, and 5 export formats.',
    images: [{ url: '/og-image-devtools.png', width: 1200, height: 630, alt: 'DevPantry Chaos Mock Data Generator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mock Data Generator & Schema Builder',
    description: 'Generate dirty mock data with 100+ naughty strings and export to JSON, CSV, SQL, Zod, and TypeScript.',
    images: ['/og-image-devtools.png'],
  },
  alternates: {
    canonical: 'https://devpantry.com/mock-data',
  },
};

export default function ChaosDataPage() {
  const jsonLd = [
    {
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
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://devpantry.com' },
        { '@type': 'ListItem', position: 2, name: 'Mock Data Generator', item: 'https://devpantry.com/mock-data' }
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-[calc(100vh-48px)] flex flex-col shrink-0">
        <Suspense fallback={<div className="p-4 text-xs font-mono text-[var(--text-muted)]">Loading Chaos Studio...</div>}>
          <ChaosDataClient />
        </Suspense>
      </div>
      
      {/* SEO Content Block */}
      <article className="tool-seo-content prose prose-sm max-w-none dark:prose-invert">
        <h2>Generate Edge-Case Mock Data for Resilient Applications</h2>
        <p>
          Testing with standard placeholder data often hides critical bugs that only surface in production. DevPantry's Mock Data Generator is designed to synthesize <strong>high-entropy, "dirty" datasets</strong> that aggressively test your application boundaries.
        </p>
        
        <h3>Why Use a Chaos Data Generator?</h3>
        <ul>
          <li><strong>BLNS Integration:</strong> Inject the Big List of Naughty Strings into your schemas to test encoding, XSS, and database constraints.</li>
          <li><strong>Zero-Leak Client-Side:</strong> All data is generated directly in your browser. No API calls are made, ensuring your schema definitions remain private.</li>
          <li><strong>Multiple Formats:</strong> Instantly export generated datasets as JSON, CSV, or SQL Insert statements.</li>
          <li><strong>Type Safety:</strong> Automatically generate TypeScript Interfaces and Zod Validation Schemas based on your custom visual schema.</li>
        </ul>
        
        <h3>Custom Schema Builder</h3>
        <p>
          Need more than standard domain presets like E-Commerce or Users? Use the Visual Schema Builder to construct highly specific data structures with over 13 unique field types. Adjust the chaos slider on each column to control the frequency of nulls, emojis, and boundary-breaking values.
        </p>

        <h3>Related Tools</h3>
        <ul>
          <li><a href="/api-templates" className="text-rose-400 hover:underline">API Templates</a> — Inject mock data directly into production schemas.</li>
          <li><a href="/jwt-decoder" className="text-rose-400 hover:underline">JWT Decoder</a> — Inspect tokens generated from mock claims.</li>
        </ul>
      </article>
    </div>
  );
}
