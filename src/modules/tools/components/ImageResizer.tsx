import type { Metadata } from 'next';
import { Suspense } from 'react';
import { BgRemovalClient } from '@/components/clients/BgRemovalClient';

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
      <div className="flex flex-col shrink-0 w-full h-[calc(100vh-3rem)] min-h-[580px]">
        <h1 className="sr-only">Free Unlimited Image Resizer</h1>
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
          <li><a href="/tools/image-compressor" className="text-rose-400 hover:underline">Image Compressor</a> — Compress your resized images to save bandwidth.</li>
          <li><a href="/tools/background-remover" className="text-rose-400 hover:underline">Background Remover</a> — Extract subjects from backgrounds with Edge AI.</li>
        </ul>
      </article>
    </div>
  );
}
