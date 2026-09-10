import type { Metadata } from 'next';
import { Suspense } from 'react';
import { BgRemovalClient } from '@/components/clients/BgRemovalClient';

export const metadata: Metadata = {
  title: 'Free Unlimited Image Compressor & WebP Converter — No Signup',
  description: 'Compress unlimited images under 500 KB, 1 MB, 200 KB, or custom file size budgets with no signup. Convert between PNG, JPEG, and WebP entirely in your browser with zero data storage and 100% privacy.',
  openGraph: {
    title: 'Free Unlimited Image Compressor & WebP Converter — No Signup | DevPantry',
    description: 'Compress unlimited images to target file size budgets (<500 KB, <1 MB) and convert WebP/PNG/JPEG entirely inside your browser. No signup, zero uploads, 100% private.',
    type: 'website',
    images: [{ url: '/og-image-studio.png', width: 1200, height: 630, alt: 'DevPantry Image Compressor Studio' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Unlimited Image Compressor & WebP Converter — No Signup | DevPantry',
    description: 'Compress unlimited images and convert to WebP directly in your browser with no signup. Set strict file size limits with smart iterative quality tuning.',
    images: ['/og-image-studio.png'],
  },
  alternates: {
    canonical: 'https://devpantry.com/image-compressor',
  },
};

export default function ImageCompressorPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'DevPantry Image Compressor',
      description: 'Client-side image compressor and WebP converter. Set exact file size limits and compress unlimited images privately in your browser.',
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
        { '@type': 'ListItem', position: 2, name: 'Image Compressor', item: 'https://devpantry.com/image-compressor' }
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
              Loading Image Compressor Studio...
            </div>
          }
        >
          <BgRemovalClient initialMode="compressor" />
        </Suspense>
      </div>
      
      {/* SEO Content Block */}
      <article className="tool-seo-content prose prose-sm max-w-none dark:prose-invert">
        <h2>Private & Unlimited Image Compressor</h2>
        <p>
          Compressing images shouldn't require giving up your privacy or dealing with daily upload limits. DevPantry's Image Compressor is built using WebAssembly (Wasm) to perform iterative quality reduction and format conversion <strong>entirely inside your browser</strong>. 
        </p>
        
        <h3>Target Specific File Sizes</h3>
        <p>
          Need to get a banner under 500 KB? Or a thumbnail under 100 KB? Simply set your target file size, and the compressor will automatically test multiple quality settings (using binary search logic) to find the absolute highest visual quality that fits within your budget.
        </p>
        
        <h3>Format Conversion (WebP, PNG, JPEG)</h3>
        <p>
          Modernize your web assets by converting heavy PNGs and JPEGs into highly optimized WebP files. WebP often provides a 30-50% reduction in file size at the same visual fidelity, drastically improving your website's load times and Core Web Vitals. All conversions happen instantly on your CPU.
        </p>

        <h3>Related Tools</h3>
        <ul>
          <li><a href="/image-resizer" className="text-rose-400 hover:underline">Image Resizer</a> — Resize dimensions before compressing.</li>
          <li><a href="/background-remover" className="text-rose-400 hover:underline">Background Remover</a> — Isolate subjects with AI before optimizing.</li>
        </ul>
      </article>
    </div>
  );
}
