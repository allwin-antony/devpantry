import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SocialPreviewClient } from '@/components/clients/SocialPreviewClient';

export const metadata: Metadata = {
  title: 'Social Share Preview — Open Graph & Twitter Card Checker | DevPantry',
  description:
    'Instantly preview how your page looks when shared on Twitter/X, LinkedIn, Facebook, Discord, Slack, and WhatsApp. Inspect og:title, og:image, og:description, and twitter:card tags with validation warnings. No cache, no ownership verification, works on staging via paste-source mode.',
  openGraph: {
    title: 'Social Share Preview — Open Graph & Twitter Card Checker | DevPantry',
    description:
      'Preview social share cards for any URL across Twitter/X, LinkedIn, Facebook, Discord, Slack, and WhatsApp. Validate Open Graph and Twitter Card meta tags instantly.',
    url: 'https://devpantry.com/social-preview',
    type: 'website',
    images: [{ url: '/og-image-devtools.png', width: 1200, height: 630, alt: 'DevPantry Social Share Preview Tool' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Social Share Preview — Open Graph & Twitter Card Checker | DevPantry',
    description:
      'Preview how your page appears on Twitter/X, LinkedIn, Facebook, Discord, Slack, and WhatsApp. Validate OG tags, check image dimensions, and catch missing metadata.',
    images: ['/og-image-devtools.png'],
  },
  alternates: {
    canonical: 'https://devpantry.com/social-preview',
  },
};

export default function SocialPreviewPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'DevPantry Social Share Preview',
      description: 'Preview and validate Open Graph, Twitter Card, and social share metadata for any URL. Pixel-accurate card mockups for Twitter/X, LinkedIn, Facebook, Discord, Slack, and WhatsApp.',
      applicationCategory: 'DeveloperApplication',
      applicationSubCategory: 'Developer Tools',
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
        { '@type': 'ListItem', position: 2, name: 'Social Share Preview', item: 'https://devpantry.com/social-preview' }
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
        <h1 className="sr-only">Social Share Preview — Open Graph & Twitter Card Checker</h1>
        <Suspense
          fallback={
            <div className="p-6 text-xs font-mono text-[var(--text-muted)] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
              Loading Social Share Preview...
            </div>
          }
        >
          <SocialPreviewClient>
            {/* SEO Content Block */}
          </SocialPreviewClient>
        </Suspense>

        <article className="tool-seo-content prose prose-sm max-w-none dark:prose-invert">
          <h2>Preview Social Share Cards Instantly</h2>
          <p>
            See exactly how your page will look when shared on <strong>Twitter/X</strong>, <strong>LinkedIn</strong>, <strong>Facebook</strong>, <strong>Discord</strong>, <strong>Slack</strong>, and <strong>WhatsApp</strong> — before you hit publish. DevPantry's Social Share Preview tool inspects your Open Graph and Twitter Card meta tags and renders pixel-accurate card mockups for each platform.
          </p>

          <h3>No Cache, No Ownership Verification</h3>
          <p>
            Unlike Meta's Sharing Debugger or LinkedIn's Post Inspector, DevPantry doesn't require you to own the domain, doesn't cache stale results, and works on staging and preview URLs. Need to test a page behind a firewall or running on <code>localhost</code>? Switch to <strong>Paste Source</strong> mode and paste your HTML directly — everything is parsed client-side.
          </p>

          <h3>Validation Warnings</h3>
          <p>
            The tool automatically checks for common issues that cause broken or suboptimal social cards:
          </p>
          <ul>
            <li><strong>Missing og:image</strong> — cards will render without a preview image.</li>
            <li><strong>Image too small</strong> — platforms recommend at least 1200×630 pixels.</li>
            <li><strong>Title or description too long</strong> — text gets truncated differently on each platform.</li>
            <li><strong>Missing twitter:card</strong> — some clients don't fall back cleanly to Open Graph tags.</li>
          </ul>

          <h3>Privacy & Architecture</h3>
          <p>
            The URL fetch is handled by a single, stateless Cloudflare edge function that extracts only <code>&lt;meta&gt;</code> tags from the <code>&lt;head&gt;</code>. It persists nothing, logs nothing, and caches results for only 5 minutes at the edge. The rest of the tool — HTML parsing, card rendering, validation — is 100% client-side JavaScript.
          </p>

          <h3>Related Tools</h3>
          <ul>
            <li><a href="/jwt-decoder" className="text-rose-400 hover:underline">JWT Decoder</a> — Inspect and chaos-test authentication tokens client-side.</li>
            <li><a href="/mock-data" className="text-rose-400 hover:underline">Mock Data Generator</a> — Synthesize edge-case test data for any schema.</li>
            <li><a href="/api-templates" className="text-rose-400 hover:underline">API Templates</a> — Real-world OAuth, webhook, and REST response fixtures.</li>
          </ul>
        </article>
      </div>
    </div>
  );
}
