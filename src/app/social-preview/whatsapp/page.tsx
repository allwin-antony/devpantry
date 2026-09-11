import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SocialPreviewClient } from '@/components/clients/SocialPreviewClient';

export const metadata: Metadata = {
  title: 'WhatsApp Link Preview — OG Tag Checker | DevPantry',
  description:
    'Preview how your URL appears as a link preview in WhatsApp chats. Validate og:title, og:description, and og:image tags for WhatsApp\'s compact card format.',
  openGraph: {
    title: 'WhatsApp Link Preview & OG Tag Checker | DevPantry',
    description: 'See how your link renders in WhatsApp chats. Validate Open Graph meta tags for WhatsApp link previews.',
    url: 'https://devpantry.com/social-preview/whatsapp',
    type: 'website',
    images: [{ url: '/og-image-devtools.png', width: 1200, height: 630, alt: 'DevPantry WhatsApp Preview' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WhatsApp Link Preview & OG Tag Checker | DevPantry',
    description: 'Preview WhatsApp link previews for any URL. Validate OG tags for compact chat cards.',
    images: ['/og-image-devtools.png'],
  },
  alternates: {
    canonical: 'https://devpantry.com/social-preview/whatsapp',
  },
};

export default function WhatsAppPreviewPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'DevPantry WhatsApp Link Preview',
      description: 'Preview and validate how URLs render as link previews in WhatsApp.',
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
        { '@type': 'ListItem', position: 3, name: 'WhatsApp', item: 'https://devpantry.com/social-preview/whatsapp' },
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-full">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="flex flex-col w-full flex-1">
        <h1 className="sr-only">WhatsApp Link Preview & OG Tag Checker</h1>
        <Suspense
          fallback={
            <div className="p-6 text-xs font-mono text-[var(--text-muted)] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
              Loading WhatsApp Preview...
            </div>
          }
        >
          <SocialPreviewClient initialPlatform="whatsapp" />
        </Suspense>

        <article className="tool-seo-content prose prose-sm max-w-none dark:prose-invert">
          <h2>WhatsApp Link Preview Tool</h2>
          <p>
            WhatsApp shows compact link previews in chat bubbles with a large image at the top, bold title, short description, and domain text. This tool lets you preview exactly how your URL will render inside a WhatsApp conversation.
          </p>
          <h3>WhatsApp-Specific Notes</h3>
          <ul>
            <li>WhatsApp uses Open Graph tags (<code>og:title</code>, <code>og:description</code>, <code>og:image</code>) — it does not read Twitter Card tags.</li>
            <li>Title is limited to roughly 60 characters before truncation in the chat bubble.</li>
            <li>Images are rendered in a 1.91:1 aspect ratio.</li>
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
