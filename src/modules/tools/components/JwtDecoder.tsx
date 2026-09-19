import type { Metadata } from 'next';
import { Suspense } from 'react';
import { JwtInspectorClient } from '@/components/clients/JwtInspectorClient';

export default function JwtInspectorPage() {
  const jsonLd = [
    {
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
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://devpantry.com' },
        { '@type': 'ListItem', position: 2, name: 'JWT Decoder', item: 'https://devpantry.com/jwt-decoder' }
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
        <h1 className="sr-only">JWT Decoder & Chaos Tamperer</h1>
        <Suspense
          fallback={
            <div className="p-6 text-xs font-mono text-[var(--text-muted)] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              Loading JWT Chaos Studio...
            </div>
          }
        >
          <JwtInspectorClient>
            {/* SEO Content Block */}
          </JwtInspectorClient>
            <article className="tool-seo-content prose prose-sm max-w-none dark:prose-invert">
              <h2>Zero-Leak Client-Side JWT Decoder</h2>
              <p>
                Unlike traditional JWT tools that may send your sensitive tokens to a server for processing, DevPantry's JWT Decoder runs <strong>100% locally in your browser</strong> using the native WebCrypto API. Your tokens, secrets, and decoded payloads never leave your machine.
              </p>
              
              <h3>Advanced Authentication Chaos Testing</h3>
              <p>
                Decoding a token is just the first step. DevPantry goes further by allowing you to actively tamper with JWTs to test your backend's resilience:
              </p>
              <ul>
                <li><strong>Expired Token Simulation:</strong> Instantly rewind the `exp` claim to generate an expired token.</li>
                <li><strong>Algorithm Exploits:</strong> Test the infamous `alg: none` exploit to ensure your API rejects unsigned tokens.</li>
                <li><strong>Signature Verification:</strong> Input a secret key to verify the token signature using WebCrypto.</li>
                <li><strong>Claim Injection:</strong> Inject edge-case data, null values, or large payloads to test input validation and database constraints.</li>
              </ul>
              
              <h3>Supported Algorithms</h3>
              <p>
                We support standard JSON Web Signature (JWS) algorithms including HS256, HS384, HS512, RS256, and more, all processed client-side. Whether you are debugging an OIDC ID token, a Supabase session, or a custom microservice JWT, DevPantry provides a safe sandbox environment.
              </p>

              <h3>Related Tools</h3>
              <ul>
                <li><a href="/tools/api-templates" className="text-rose-400 hover:underline">API Templates</a> — Test your decoders with real OAuth and OIDC responses.</li>
                <li><a href="/tools/mock-data" className="text-rose-400 hover:underline">Mock Data Generator</a> — Synthesize custom edge-case claims.</li>
                <li><a href="/tools/collab" className="text-rose-400 hover:underline">P2P Collab Editor (Beta)</a> — Securely pair program or share decrypted payloads using zero-knowledge WebRTC.</li>
              </ul>
            </article>
        </Suspense>
      </div>
    </div>
  );
}
