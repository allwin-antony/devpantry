import type { Metadata } from 'next';
import { Suspense } from 'react';
import { BgRemovalClient } from '@/components/clients/BgRemovalClient';

export const metadata: Metadata = {
  title: 'Free Client-Side AI Background Remover — No Signup & Unlimited',
  description: 'Remove backgrounds from unlimited images instantly inside your browser with zero server uploads and no signup required. Powered by Edge AI, ONNX Runtime Web, and WebGPU neural acceleration. 100% private, free forever.',
  keywords: [
    'remove background from image free',
    'ai background remover online',
    'transparent background maker',
    'background remover no signup',
    'unlimited background removal',
    'free background remover no signup',
    'remove background without signup',
    'unlimited background remover free',
    'free background removal',
    'remove background client side',
    'browser background remover no signup',
    'edge ai background removal unlimited',
    'webassembly background removal',
    'webgpu image segmentation',
    'transparent png generator no signup',
    'ai image cutout tool unlimited',
    'private background remover no signup',
    'no upload background remover'
  ],
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
    canonical: 'https://devpantry.com/background-removal',
  },
};

export default function BackgroundRemovalPage() {
  const jsonLd = {
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
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center p-8 bg-[var(--bg-app)] text-[var(--text-muted)] font-mono text-xs">
            Loading AI Background Removal Studio...
          </div>
        }
      >
        <BgRemovalClient initialMode="bg-removal" />
      </Suspense>
    </>
  );
}
