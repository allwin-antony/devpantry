import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ChaosTemplatesClient } from '@/components/clients/ChaosTemplatesClient';

export const metadata: Metadata = {
  title: 'API Mock Response Templates — Google, Stripe, GitHub & More',
  description: 'Stress-test your frontend and API handlers with real-world response schemas from Google SSO, GitHub OAuth, Stripe Billing, Shopify, Supabase, and Resend filled with high-entropy chaos mock data.',
  keywords: [
    'api mock response',
    'sample api json response',
    'stripe webhook example',
    'google oauth response example',
    'github api mock data',
    'api chaos templates',
    'sso edge case fixtures',
    'google sso dirty mock data',
    'stripe webhook chaos fixture',
    'github oauth test payloads',
    'api response stress testing',
    'typescript interface generator',
    'naughty strings mock generator'
  ],
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
    canonical: 'https://devpantry.com/chaos-templates',
  },
};

export default function ChaosTemplatesPage() {
  const jsonLd = {
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
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={<div className="p-4 text-xs font-mono text-[var(--text-muted)]">Loading Chaos Templates...</div>}>
        <ChaosTemplatesClient />
      </Suspense>
    </>
  );
}
