import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SocialPreviewClient } from '@/components/clients/SocialPreviewClient';

export const metadata: Metadata = {
  title: 'Discord Embed Preview — OG Tag Checker for Rich Embeds | DevPantry',
  description:
    'Preview how your URL renders as a Discord rich embed. Validate og:title, og:description, og:image, and og:site_name for Discord\'s embed card format with the accent bar and site name row.',
  openGraph: {
    title: 'Discord Embed Preview & OG Tag Checker | DevPantry',
    description: 'See how your link renders as a Discord rich embed. Validate meta tags for accent-bar embed cards.',
    url: 'https://devpantry.com/social-preview/discord',
    type: 'website',
    images: [{ url: '/og-image-devtools.png', width: 1200, height: 630, alt: 'DevPantry Discord Embed Preview' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Discord Embed Preview & OG Tag Checker | DevPantry',
    description: 'Preview Discord rich embeds for any URL. Validate Open Graph tags and see the accent bar card.',
    images: ['/og-image-devtools.png'],
  },
  alternates: {
    canonical: 'https://devpantry.com/social-preview/discord',
  },
};

export default function DiscordPreviewPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'DevPantry Discord Embed Preview',
      description: 'Preview and validate how URLs render as Discord rich embeds.',
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
        { '@type': 'ListItem', position: 3, name: 'Discord', item: 'https://devpantry.com/social-preview/discord' },
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-full">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="flex flex-col w-full flex-1">
        <h1 className="sr-only">Discord Embed Preview & OG Tag Checker</h1>
        <Suspense
          fallback={
            <div className="p-6 text-xs font-mono text-[var(--text-muted)] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
              Loading Discord Embed Preview...
            </div>
          }
        >
          <SocialPreviewClient initialPlatform="discord" />
        </Suspense>

        <article className="tool-seo-content prose prose-sm max-w-none dark:prose-invert">
          <h2>Discord Embed Preview Tool</h2>
          <p>
            Discord renders shared URLs as <strong>rich embeds</strong> with a left accent bar, site name, clickable title, description, and inline image. This tool shows you exactly what that embed will look like before you paste the link.
          </p>
          <h3>Discord-Specific Notes</h3>
          <ul>
            <li>Discord uses <code>og:site_name</code> for the blue header text above the title.</li>
            <li>Description can be up to ~350 characters before truncation.</li>
            <li>The embed accent bar color defaults to Discord's brand purple (#5865F2).</li>
          </ul>
          <h3>Related Previews</h3>
          <ul>
            <li><a href="/social-preview/slack" className="text-rose-400 hover:underline">Slack Preview</a></li>
            <li><a href="/social-preview/twitter" className="text-rose-400 hover:underline">Twitter/X Preview</a></li>
            <li><a href="/social-preview" className="text-rose-400 hover:underline">All Platforms →</a></li>
          </ul>
        </article>
      </div>
    </div>
  );
}
