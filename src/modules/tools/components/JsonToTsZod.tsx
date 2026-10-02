import type { Metadata } from 'next';
import { Suspense } from 'react';
import { JsonToTsZodClient } from '@/components/clients/JsonToTsZodClient';

export default function JsonToTsZodPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'DevPantry JSON to TS & Zod',
      description: '100% client-side zero-leak JSON to TypeScript and Zod schema generator.',
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
        { '@type': 'ListItem', position: 2, name: 'JSON to TS & Zod', item: 'https://devpantry.com/json-to-ts-zod' }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Is this JSON to TypeScript converter private?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! DevPantry uses 100% client-side AST parsing. Your JSON payloads never leave your browser, making it completely safe for proprietary API responses.'
          }
        },
        {
          '@type': 'Question',
          name: 'Can this tool generate Zod schemas?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, it simultaneously generates strict TypeScript interfaces and Zod schemas for runtime validation based on your JSON input.'
          }
        }
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col w-full flex-1">
        <h1 className="sr-only">JSON to TypeScript & Zod Schema Generator</h1>
        <Suspense
          fallback={
            <div className="p-6 text-xs font-mono text-[var(--text-muted)] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              Loading Schema Generator Studio...
            </div>
          }
        >
          <JsonToTsZodClient>
            <article className="tool-seo-content prose prose-sm max-w-none dark:prose-invert">
              <h2>Zero-Leak Client-Side TypeScript & Zod Generator</h2>
              <p>
                Unlike traditional online converters that send your proprietary JSON payloads to a server for processing, DevPantry's <strong>JSON to TypeScript and Zod generator</strong> runs <strong>100% locally in your browser</strong>. Using Abstract Syntax Tree (AST) parsing, your sensitive data, private configurations, and internal API responses never leave your machine.
              </p>
              
              <h3>Instantly Type Your APIs</h3>
              <p>
                Simply paste any valid JSON API response and immediately get strictly-typed TypeScript interfaces along with robust Zod validation schemas. We intelligently infer arrays, nested objects, and primitive types to produce clean, usable code ready to be dropped into your Next.js, React, or Node.js applications.
              </p>

              <h3>Why Use Zod with TypeScript?</h3>
              <p>
                While TypeScript interfaces provide excellent compile-time safety, they disappear at runtime. If you are fetching data from external APIs, you need <strong>runtime validation</strong> to ensure the incoming payload matches your expectations. By pairing TypeScript interfaces with Zod schemas, you guarantee end-to-end type safety.
              </p>

              <h3>Related Developer Tools</h3>
              <p>
                Supercharge your API development workflow with our other local-first tools:
              </p>
              <ul>
                <li><a href="/tools/mock-data" className="text-emerald-500 hover:underline">Mock Data Generator</a> — Create dirty, high-entropy JSON datasets to test your newly generated Zod schemas.</li>
                <li><a href="/tools/jwt-decoder" className="text-emerald-500 hover:underline">JWT Decoder & Chaos Tamperer</a> — Inspect authentication payloads 100% locally.</li>
                <li><a href="/tools/api-templates" className="text-emerald-500 hover:underline">API Chaos Templates</a> — Use real-world JSON fixtures from Stripe, Supabase, and GitHub to generate your types.</li>
                <li><a href="/tools/public-apis" className="text-emerald-500 hover:underline">Public APIs Registry</a> — Find free APIs to consume and type-check with this tool.</li>
              </ul>
            </article>
          </JsonToTsZodClient>
        </Suspense>
      </div>
    </div>
  );
}
