import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SocialPreviewClient } from '@/components/clients/SocialPreviewClient';

export const metadata: Metadata = {
  title: 'Twitter Card Preview & Validator — Test summary_large_image & summary | DevPantry',
  description:
    'Preview and validate Twitter/X card meta tags (twitter:card, twitter:title, twitter:image) for any URL. See exactly how your summary_large_image or summary card will render. No signup, no cache, works on staging.',
  openGraph: {
    title: 'Twitter Card Preview & Validator | DevPantry',
    description: 'Test how your page renders as a Twitter/X card. Validate twitter:card, twitter:title, twitter:description, and twitter:image tags instantly.',
    url: 'https://devpantry.com/social-preview/twitter',
    type: 'website',
    images: [{ url: '/og-image-devtools.png', width: 1200, height: 630, alt: 'DevPantry Twitter Card Preview' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Twitter Card Preview & Validator | DevPantry',
    description: 'Preview how your page looks when shared on X/Twitter. Validate summary_large_image and summary card types.',
    images: ['/og-image-devtools.png'],
  },
  alternates: {
    canonical: 'https://devpantry.com/social-preview/twitter',
  },
};

export default function TwitterPreviewPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'DevPantry Twitter Card Preview',
      description: 'Preview and validate Twitter/X card meta tags for any URL.',
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
        { '@type': 'ListItem', position: 3, name: 'Twitter', item: 'https://devpantry.com/social-preview/twitter' },
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-full">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="flex flex-col w-full flex-1">
        <h1 className="sr-only">Twitter / X Card Preview & Validator</h1>
        <Suspense
          fallback={
            <div className="p-6 text-xs font-mono text-[var(--text-muted)] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
              Loading Twitter Card Preview...
            </div>
          }
        >
          <SocialPreviewClient initialPlatform="twitter" />
        </Suspense>

        <article className="tool-seo-content prose prose-sm max-w-none dark:prose-invert">
          <h2>Twitter / X Card Preview Tool</h2>
          <p>
            See how your page looks when shared on <strong>X (formerly Twitter)</strong>. This tool validates your <code>twitter:card</code>, <code>twitter:title</code>, <code>twitter:description</code>, and <code>twitter:image</code> meta tags, and renders a pixel-accurate preview of both <code>summary_large_image</code> and <code>summary</code> card types.
          </p>
          <h3>Twitter Card Types</h3>
          <ul>
            <li><strong>summary_large_image</strong> — Large 2:1 ratio image at the top, title and description below. Best for blog posts, articles, and landing pages.</li>
            <li><strong>summary</strong> — Square thumbnail (min 144×144px) on the left, title and description on the right. Best for product pages and profiles.</li>
          </ul>
          <h3>Related Previews</h3>
          <ul>
            <li><a href="/social-preview/linkedin" className="text-rose-400 hover:underline">LinkedIn Preview</a></li>
            <li><a href="/social-preview/discord" className="text-rose-400 hover:underline">Discord Preview</a></li>
            <li><a href="/social-preview" className="text-rose-400 hover:underline">All Platforms →</a></li>
          </ul>
        </article>
      </div>
    </div>
  );
}
