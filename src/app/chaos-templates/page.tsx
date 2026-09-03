import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ChaosTemplatesClient } from '@/components/clients/ChaosTemplatesClient';

export const metadata: Metadata = {
  title: 'API Chaos Templates — Real-World API Payloads Injected with Edge-Case Mock Data',
  description: 'Stress-test your frontend and API handlers with real-world response schemas from Google SSO, GitHub OAuth, Stripe Billing, Shopify, Supabase, and Resend filled with high-entropy chaos mock data.',
  keywords: [
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
    title: 'API Chaos Templates — Real-World API Payloads Injected with Chaos Mock Data | DevPlayground',
    description: '17 real-world production API templates (Google, GitHub, Stripe, Supabase) filled with high-entropy edge cases, Unicode injections, and floating-point traps.',
  },
};

export default function ChaosTemplatesPage() {
  return (
    <Suspense fallback={<div className="p-4 text-xs font-mono text-[var(--text-muted)]">Loading Chaos Templates...</div>}>
      <ChaosTemplatesClient />
    </Suspense>
  );
}
