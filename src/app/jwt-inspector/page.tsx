import type { Metadata } from 'next';
import { Suspense } from 'react';
import { JwtInspectorClient } from '@/components/clients/JwtInspectorClient';

export const metadata: Metadata = {
  title: 'Free JWT Decoder & Token Inspector Online — No Signup, 100% Private',
  description:
    '100% in-memory client-side JWT decoder and chaos debugger. Inspect claims, decode headers, verify signatures with WebCrypto, and simulate edge-case authentication failures (expired tokens, clock skew, alg: none exploit simulation, claim stripping, BLNS injections) with zero network transmission. Completely private, free, unlimited, and no signup required.',
  keywords: [
    'decode jwt token online free',
    'jwt.io alternative',
    'jwt token viewer',
    'client side jwt inspector',
    'jwt debugger zero leak',
    'jwt tamperer',
    'expire jwt online',
    'simulate alg none exploit',
    'jwt clock skew test',
    'no signup jwt decoder',
    'unlimited jwt inspector',
    'jwt header payload signature visualizer',
    'webcrypto jwt signer',
    'supabase jwt inspector',
    'google oidc id token debugger',
    'clerk auth0 token inspector',
    'test negative auth paths',
    'devpantry jwt'
  ],
  openGraph: {
    title: 'Client-Side JWT Inspector & Chaos Tamperer — No Signup & Zero Leak | DevPantry',
    description:
      'Zero-leak in-memory JWT inspector and chaos simulator. Decode tokens, verify signatures locally with WebCrypto, and test edge-case authentication failures.',
    url: 'https://devpantry.dev/jwt-inspector',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Client-Side JWT Inspector & Chaos Tamperer — DevPantry',
    description:
      'Zero-leak client-side JWT debugger and chaos tamperer. 100% in-memory sandbox, zero network requests, and 1-click edge-case simulations.',
  },
  alternates: {
    canonical: 'https://devpantry.dev/jwt-inspector',
  },
};

export default function JwtInspectorPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'DevPantry JWT Inspector',
    description: '100% client-side zero-leak JWT decoder and chaos debugger for simulating edge-case authentication failures.',
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
      <Suspense
        fallback={
          <div className="p-6 text-xs font-mono text-[var(--text-muted)] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            Loading JWT Chaos Studio...
          </div>
        }
      >
        <JwtInspectorClient />
      </Suspense>
    </>
  );
}
