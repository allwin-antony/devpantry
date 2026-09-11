import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SocialPreviewClient } from '@/components/clients/SocialPreviewClient';

export const metadata: Metadata = {
  title: 'Slack Link Preview — OG Tag Checker for Unfurling | DevPantry',
  description:
    'Preview how your URL unfurls in Slack channels. Validate og:title, og:description, og:image, and og:site_name for Slack\'s link unfurling format with favicon, site name, and inline image.',
  openGraph: {
    title: 'Slack Link Unfurl Preview & OG Tag Checker | DevPantry',
    description: 'See how your link unfurls in Slack. Validate Open Graph tags for Slack\'s attachment-style preview cards.',
    url: 'https://devpantry.com/social-preview/slack',
    type: 'website',
    images: [{ url: '/og-image-devtools.png', width: 1200, height: 630, alt: 'DevPantry Slack Preview' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Slack Link Unfurl Preview & OG Tag Checker | DevPantry',
    description: 'Preview how URLs unfurl in Slack. Validate OG tags for attachment-style cards.',
    images: ['/og-image-devtools.png'],
  },
  alternates: {
    canonical: 'https://devpantry.com/social-preview/slack',
  },
};

export default function SlackPreviewPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'DevPantry Slack Link Unfurl Preview',
      description: 'Preview and validate how URLs unfurl in Slack channels.',
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
        { '@type': 'ListItem', position: 3, name: 'Slack', item: 'https://devpantry.com/social-preview/slack' },
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-full">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="flex flex-col w-full flex-1">
        <h1 className="sr-only">Slack Link Unfurl Preview & OG Tag Checker</h1>
        <Suspense
          fallback={
            <div className="p-6 text-xs font-mono text-[var(--text-muted)] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
              Loading Slack Preview...
            </div>
          }
        >
          <SocialPreviewClient initialPlatform="slack" />
        </Suspense>

        <article className="tool-seo-content prose prose-sm max-w-none dark:prose-invert">
          <h2>Slack Link Unfurl Preview Tool</h2>
          <p>
            When you paste a URL in Slack, the platform "unfurls" it into an attachment-style card with a left border bar, favicon, site name, clickable title, description, and optional image. This tool previews exactly what that unfurl looks like.
          </p>
          <h3>Slack-Specific Notes</h3>
          <ul>
            <li>Slack uses <code>og:site_name</code> (with the favicon) as the bold header line.</li>
            <li>The title is rendered as a clickable blue link.</li>
            <li>Images are shown inline below the description, capped at ~360px width.</li>
          </ul>
          <h3>Related Previews</h3>
          <ul>
            <li><a href="/social-preview/discord" className="text-rose-400 hover:underline">Discord Preview</a></li>
            <li><a href="/social-preview/linkedin" className="text-rose-400 hover:underline">LinkedIn Preview</a></li>
            <li><a href="/social-preview" className="text-rose-400 hover:underline">All Platforms →</a></li>
          </ul>
        </article>
      </div>
    </div>
  );
}
