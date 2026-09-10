import type { Metadata } from 'next';
import { Suspense } from 'react';
import { BgRemovalClient } from '@/components/clients/BgRemovalClient';

export const metadata: Metadata = {
  title: 'Free Background Remover — AI-Powered, No Signup | DevPantry',
  description: 'Remove backgrounds from unlimited images instantly inside your browser with zero server uploads and no signup required. Powered by Edge AI, ONNX Runtime Web, and WebGPU neural acceleration. 100% private, free forever.',
  openGraph: {
    title: 'Free Client-Side AI Background Remover — No Signup & Unlimited | DevPantry',
    description: 'Instant, unlimited background removal powered by Edge AI & ONNX WebAssembly. No signup, zero server uploads, high-resolution PNG/WebP exports, and interactive before/after comparison.',
    type: 'website',
    images: [{ url: '/og-image-studio.png', width: 1200, height: 630, alt: 'DevPantry AI Background Remover' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Client-Side AI Background Remover — No Signup & Unlimited | DevPantry',
    description: 'Remove image backgrounds from unlimited photos entirely inside your browser. No signup required, 100% private, zero server uploads, powered by Edge AI.',
    images: ['/og-image-studio.png'],
  },
  alternates: {
    canonical: 'https://devpantry.com/background-remover',
  },
};

export default function BackgroundRemovalPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'DevPantry AI Background Remover',
      description: 'Client-side AI tool to remove image backgrounds securely and privately using Edge AI and WebGPU.',
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
        { '@type': 'ListItem', position: 2, name: 'Background Remover', item: 'https://devpantry.com/background-remover' }
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
        <h1 className="sr-only">Free AI Background Remover</h1>
        <Suspense
          fallback={
            <div className="flex-1 flex items-center justify-center p-8 bg-[var(--bg-app)] text-[var(--text-muted)] font-mono text-xs">
              Loading AI Background Removal Studio...
            </div>
          }
        >
          <BgRemovalClient initialMode="bg-removal" />
        </Suspense>
      </div>
      
      {/* SEO Content Block */}
      <article className="tool-seo-content prose prose-sm max-w-none dark:prose-invert">
        <h2>Free, Unlimited AI Background Removal</h2>
        <p>
          Remove backgrounds from images instantly without uploading your files to a server. DevPantry's Background Remover utilizes state-of-the-art Edge AI models (U-Net architectures) compiled to WebAssembly and accelerated by WebGPU to perform neural segmentation directly in your browser.
        </p>
        
        <h3>100% Private and Secure</h3>
        <p>
          Because all processing happens on your local device:
        </p>
        <ul>
          <li><strong>Zero Uploads:</strong> Your images are never sent over the internet, ensuring complete privacy for personal photos, proprietary designs, and client assets.</li>
          <li><strong>No Limits:</strong> Remove backgrounds from as many images as you want. There are no paywalls, credits, or daily limits.</li>
          <li><strong>No Signup:</strong> Jump straight into editing without creating an account or handing over your email address.</li>
        </ul>
        
        <h3>High-Fidelity Exports</h3>
        <p>
          Once the background is removed, you can interactively refine the edges and export the result as a transparent PNG or highly compressed WebP. Our AI model preserves fine details like hair and semi-transparent edges.
        </p>
        
        <h3>Related Tools</h3>
        <ul>
          <li><a href="/image-resizer" className="text-rose-400 hover:underline">Image Resizer</a> — Crop and resize your transparent cutout.</li>
          <li><a href="/image-compressor" className="text-rose-400 hover:underline">Image Compressor</a> — Optimize your final PNG or WebP for web delivery.</li>
        </ul>
      </article>
    </div>
  );
}
