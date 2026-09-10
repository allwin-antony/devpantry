import type { Metadata } from 'next';
import { Suspense } from 'react';
import { BgRemovalClient } from '@/components/clients/BgRemovalClient';

export const metadata: Metadata = {
  title: 'Free Unlimited Image Resizer & Artboard Studio — No Signup',
  description: 'Resize unlimited images to exact pixel dimensions, aspect ratios, and custom padding entirely inside your browser with no signup. 100% private, free forever, and instant.',
  openGraph: {
    title: 'Free Unlimited Image Resizer & Artboard Studio — No Signup | DevPantry',
    description: 'Instant, unlimited image resizing, aspect ratio framing, and padding directly in your browser. No signup required, zero cloud uploads, 100% private.',
    type: 'website',
    images: [{ url: '/og-image-studio.png', width: 1200, height: 630, alt: 'DevPantry Image Resizer Studio' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Unlimited Image Resizer & Artboard Studio — No Signup | DevPantry',
    description: 'Resize and frame unlimited images directly in your browser with no signup. 100% private, zero uploads, custom aspect ratios and target pixel sizes.',
    images: ['/og-image-studio.png'],
  },
  alternates: {
    canonical: 'https://devpantry.com/image-resizer',
  },
};

export default function ImageResizerPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'DevPantry Image Resizer',
      description: 'Client-side image resizer and cropper. Resize unlimited images to exact pixel dimensions privately in your browser.',
      applicationCategory: 'MultimediaApplication',
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
        { '@type': 'ListItem', position: 2, name: 'Image Resizer', item: 'https://devpantry.com/image-resizer' }
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-[calc(100vh-48px)] flex flex-col shrink-0">
        <Suspense
          fallback={
            <div className="flex-1 flex items-center justify-center p-8 bg-[var(--bg-app)] text-[var(--text-muted)] font-mono text-xs">
              Loading Image Resizer Studio...
            </div>
          }
        >
          <BgRemovalClient initialMode="resizer" />
        </Suspense>
      </div>
      
      {/* SEO Content Block */}
      <article className="tool-seo-content prose prose-sm max-w-none dark:prose-invert">
        <h2>Developer-Focused Image Resizer & Canvas Padder</h2>
        <p>
          Stop struggling with complex desktop software just to pad an image to a 16:9 ratio. DevPantry's Image Resizer is built specifically for developers, designers, and marketers who need pixel-perfect dimensions instantly, without cloud uploads or subscriptions.
        </p>
        
        <h3>Perfect Aspect Ratios with Canvas Padding</h3>
        <p>
          Unlike basic croppers that cut off parts of your image, our resizer allows you to specify a target canvas size (e.g., 1200x630 for Open Graph images) and then pad the original image to fit perfectly inside it. You can choose any solid background color for the padding, or keep it transparent.
        </p>
        
        <h3>100% Client-Side Privacy</h3>
        <p>
          By utilizing the HTML5 Canvas API and WebAssembly, all scaling algorithms run natively on your machine's hardware. Your images never hit our servers, making this tool completely secure for sensitive client assets and proprietary product photography.
        </p>

        <h3>Related Tools</h3>
        <ul>
          <li><a href="/image-compressor" className="text-rose-400 hover:underline">Image Compressor</a> — Compress your resized images to save bandwidth.</li>
          <li><a href="/background-remover" className="text-rose-400 hover:underline">Background Remover</a> — Extract subjects from backgrounds with Edge AI.</li>
        </ul>
      </article>
    </div>
  );
}
