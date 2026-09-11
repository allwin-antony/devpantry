import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SocialPreviewClient } from '@/components/clients/SocialPreviewClient';

export const metadata: Metadata = {
  title: 'LinkedIn Post Preview — OG Tag Checker & Validator | DevPantry',
  description:
    'Preview how your page appears when shared on LinkedIn. Validate og:title, og:description, and og:image tags. No cache lock-in, no ownership verification — unlike LinkedIn\'s own Post Inspector.',
  openGraph: {
    title: 'LinkedIn Post Preview & OG Tag Validator | DevPantry',
    description: 'See exactly how your link will render in LinkedIn feeds. Validate Open Graph tags without cache lock-in.',
    url: 'https://devpantry.com/social-preview/linkedin',
    type: 'website',
    images: [{ url: '/og-image-devtools.png', width: 1200, height: 630, alt: 'DevPantry LinkedIn Preview' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LinkedIn Post Preview & OG Tag Validator | DevPantry',
    description: 'Preview how your link renders on LinkedIn. No cache lock-in, works on staging URLs.',
    images: ['/og-image-devtools.png'],
  },
  alternates: {
    canonical: 'https://devpantry.com/social-preview/linkedin',
  },
};

export default function LinkedInPreviewPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'DevPantry LinkedIn Post Preview',
      description: 'Preview and validate how links appear when shared on LinkedIn.',
      applicationCategory: 'DeveloperApplication',
      applicationSubCategory: 'Developer Tools',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://devpantry.com' },
        { '@type': 'ListItem', position: 2, name: 'Social Share Preview', item: 'https://devpantry.com/social-preview' },
        { '@type': 'ListItem', position: 3, name: 'LinkedIn', item: 'https://devpantry.com/social-preview/linkedin' },
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-full">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="flex flex-col w-full flex-1">
        <h1 className="sr-only">LinkedIn Post Preview & OG Tag Validator</h1>
        <Suspense
          fallback={
            <div className="p-6 text-xs font-mono text-[var(--text-muted)] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
              Loading LinkedIn Preview...
            </div>
          }
        >
          <SocialPreviewClient initialPlatform="linkedin" />
        </Suspense>

        <article className="tool-seo-content prose prose-sm max-w-none dark:prose-invert">
          <h2>LinkedIn Post Preview Tool</h2>
          <p>
            LinkedIn's own Post Inspector is cache-locked and clunky. DevPantry fetches your page fresh every time — no ownership verification, no stale cache. See how your <code>og:title</code>, <code>og:description</code>, and <code>og:image</code> will render in the LinkedIn feed.
          </p>
          <h3>LinkedIn-Specific Notes</h3>
          <ul>
            <li>LinkedIn displays images at a <strong>1.91:1</strong> aspect ratio (1200×628 recommended).</li>
            <li>Title is truncated at roughly 2 lines; description at ~3 lines in most feed layouts.</li>
            <li>Domain is shown below the card in lowercase.</li>
          </ul>
          <h3>Related Previews</h3>
          <ul>
            <li><a href="/social-preview/twitter" className="text-rose-400 hover:underline">Twitter/X Preview</a></li>
            <li><a href="/social-preview/facebook" className="text-rose-400 hover:underline">Facebook Preview</a></li>
            <li><a href="/social-preview" className="text-rose-400 hover:underline">All Platforms →</a></li>
          </ul>
        </article>
      </div>
    </div>
  );
}
