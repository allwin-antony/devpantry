import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ChaosTemplatesClient } from '@/components/clients/ChaosTemplatesClient';

export const metadata: Metadata = {
  title: 'API Mock Responses — Stripe, Google, GitHub Templates | DevPantry',
  description: 'Stress-test your frontend and API handlers with real-world response schemas from Google SSO, GitHub OAuth, Stripe Billing, Shopify, Supabase, and Resend filled with high-entropy chaos mock data.',
  openGraph: {
    title: 'API Mock Response Templates & Chaos Sandbox | DevPantry',
    description: '17 real-world production API templates (Google, GitHub, Stripe, Supabase) filled with high-entropy edge cases, Unicode injections, and floating-point traps.',
    images: [{ url: '/og-image-devtools.png', width: 1200, height: 630, alt: 'DevPantry API Mock Templates & Chaos Sandbox' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'API Mock Response Templates | DevPantry',
    description: 'Stress test your app with dirty mock data injected into real-world API schemas.',
    images: ['/og-image-devtools.png'],
  },
  alternates: {
    canonical: 'https://devpantry.com/api-templates',
  },
};

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
      <div className="min-h-[calc(100vh-48px)] flex flex-col shrink-0">
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
          <li><a href="/mock-data" className="text-rose-400 hover:underline">Mock Data Generator</a> — Customize and expand these templates with your own schemas.</li>
          <li><a href="/jwt-decoder" className="text-rose-400 hover:underline">JWT Decoder</a> — Debug the authentication tokens embedded in these responses.</li>
        </ul>
      </article>
    </div>
  );
}
