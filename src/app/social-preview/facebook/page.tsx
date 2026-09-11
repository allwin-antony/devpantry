import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SocialPreviewClient } from '@/components/clients/SocialPreviewClient';

export const metadata: Metadata = {
  title: 'Facebook Share Preview — Open Graph Debugger | DevPantry',
  description:
    'Preview how your page appears when shared on Facebook. Validate og:title, og:description, og:image, and og:type tags. No cache, no ownership verification — unlike Meta\'s Sharing Debugger.',
  openGraph: {
    title: 'Facebook Share Preview & OG Debugger | DevPantry',
    description: 'See how your link renders in Facebook feeds. Validate Open Graph tags without cache lock-in.',
    url: 'https://devpantry.com/social-preview/facebook',
    type: 'website',
    images: [{ url: '/og-image-devtools.png', width: 1200, height: 630, alt: 'DevPantry Facebook Share Preview' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Facebook Share Preview & OG Debugger | DevPantry',
    description: 'Preview Facebook share cards for any URL. Validate OG tags without Meta\'s cache lock-in.',
    images: ['/og-image-devtools.png'],
  },
  alternates: {
    canonical: 'https://devpantry.com/social-preview/facebook',
  },
};

export default function FacebookPreviewPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'DevPantry Facebook Share Preview',
      description: 'Preview and validate how links appear when shared on Facebook.',
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
        { '@type': 'ListItem', position: 3, name: 'Facebook', item: 'https://devpantry.com/social-preview/facebook' },
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-full">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="flex flex-col w-full flex-1">
        <h1 className="sr-only">Facebook Share Preview & Open Graph Debugger</h1>
        <Suspense
          fallback={
            <div className="p-6 text-xs font-mono text-[var(--text-muted)] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
              Loading Facebook Preview...
            </div>
          }
        >
          <SocialPreviewClient initialPlatform="facebook" />
        </Suspense>

        <article className="tool-seo-content prose prose-sm max-w-none dark:prose-invert">
          <h2>Facebook Share Preview Tool</h2>
          <p>
            Unlike Meta's Sharing Debugger which requires ownership verification and caches results aggressively, DevPantry fetches your page fresh each time. See how your <code>og:title</code>, <code>og:description</code>, and <code>og:image</code> render in a Facebook news feed card.
          </p>
          <h3>Facebook-Specific Notes</h3>
          <ul>
            <li>Facebook displays images at a <strong>1.91:1</strong> aspect ratio (1200×630 recommended).</li>
            <li>Domain is shown in uppercase above the title.</li>
            <li>Title is truncated at roughly 2 lines; description at 1 line in the feed.</li>
          </ul>
          <h3>Related Previews</h3>
          <ul>
            <li><a href="/social-preview/linkedin" className="text-rose-400 hover:underline">LinkedIn Preview</a></li>
            <li><a href="/social-preview/twitter" className="text-rose-400 hover:underline">Twitter/X Preview</a></li>
            <li><a href="/social-preview" className="text-rose-400 hover:underline">All Platforms →</a></li>
          </ul>
        </article>
      </div>
    </div>
  );
}
