import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ChaosTemplatesClient } from '@/components/clients/ChaosTemplatesClient';

export default function ChaosTemplatesPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'DevPantry API Chaos Templates',
      description: 'Production API response mock data templates injected with high-entropy testing fixtures.',
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
        { '@type': 'ListItem', position: 2, name: 'API Mocks', item: 'https://devpantry.com/api-templates' }
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col shrink-0 w-full">
        <h1 className="sr-only">API Mock Responses & Templates</h1>
        <Suspense fallback={<div className="p-4 text-xs font-mono text-[var(--text-muted)]">Loading Chaos Templates...</div>}>
          <ChaosTemplatesClient />
        </Suspense>
      </div>
      
      {/* SEO Content Block */}
      <article className="tool-seo-content prose prose-sm max-w-none dark:prose-invert">
        <h2>Production API Response Mocks for Stress Testing</h2>
        <p>
          Testing your frontend against clean, perfectly formatted API responses is a recipe for disaster in production. The real world is messy. APIs return nulls, unexpected data types, extreme string lengths, and Unicode anomalies. DevPantry's API Chaos Templates solve this by providing <strong>dirty mock data</strong> injected directly into real-world API response schemas.
        </p>
        
        <h3>Real-World API Schemas</h3>
        <p>
          We've mapped out the exact JSON schemas for some of the most popular APIs and Webhooks, including:
        </p>
        <ul>
          <li><strong>Authentication & SSO:</strong> Google OpenID Connect ID Tokens, GitHub OAuth Profiles, and Supabase Auth Sessions.</li>
          <li><strong>Payments & Billing:</strong> Stripe Webhook events like `invoice.payment_succeeded` and `customer.subscription.updated`.</li>
          <li><strong>E-Commerce:</strong> Shopify Storefront API and Admin REST responses.</li>
          <li><strong>Infrastructure:</strong> Vercel Deployment hooks and Resend Email delivery statuses.</li>
        </ul>
        
        <h3>Why Chaos Testing Matters</h3>
        <p>
          By injecting edge-cases into standard payloads, you can proactively test how your application handles unescaped characters, massive integers (like JavaScript's MAX_SAFE_INTEGER bounds), and missing fields. 
        </p>

        <h3>Related Tools</h3>
        <ul>
          <li><a href="/tools/mock-data" className="text-rose-400 hover:underline">Mock Data Generator</a> — Customize and expand these templates with your own schemas.</li>
          <li><a href="/tools/jwt-decoder" className="text-rose-400 hover:underline">JWT Decoder</a> — Debug the authentication tokens embedded in these responses.</li>
          <li><a href="/tools/collab" className="text-rose-400 hover:underline">P2P Collab Editor (Beta)</a> — Real-time peer-to-peer editor to discuss API schemas.</li>
        </ul>
      </article>
    </div>
  );
}
