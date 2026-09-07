import type { Metadata } from 'next';
import { Suspense } from 'react';
import { BgRemovalClient } from '@/components/clients/BgRemovalClient';

export const metadata: Metadata = {
  title: 'Free Unlimited Image Compressor & WebP Converter — No Signup',
  description: 'Compress unlimited images under 500 KB, 1 MB, 200 KB, or custom file size budgets with no signup. Convert between PNG, JPEG, and WebP entirely in your browser with zero data storage and 100% privacy.',
  keywords: [
    'image compressor no signup',
    'unlimited image compressor',
    'free image compressor no signup',
    'compress image without signup',
    'unlimited webp converter',
    'free webp converter no signup',
    'compress image under 500kb',
    'compress image under 1mb',
    'client side image compressor',
    'png to webp converter no signup',
    'reduce image file size unlimited',
    'target file size compressor',
    'private photo compressor no signup',
    'browser image optimizer unlimited'
  ],
  openGraph: {
    title: 'Free Unlimited Image Compressor & WebP Converter — No Signup | DevPlayground',
    description: 'Compress unlimited images to target file size budgets (<500 KB, <1 MB) and convert WebP/PNG/JPEG entirely inside your browser. No signup, zero uploads, 100% private.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Unlimited Image Compressor & WebP Converter — No Signup | DevPlayground',
    description: 'Compress unlimited images and convert to WebP directly in your browser with no signup. Set strict file size limits with smart iterative quality tuning.',
  },
  alternates: {
    canonical: 'https://devplayground.io/image-compressor',
  },
};

export default function ImageCompressorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center p-8 bg-[var(--bg-app)] text-[var(--text-muted)] font-mono text-xs">
          Loading Image Compressor Studio...
        </div>
      }
    >
      <BgRemovalClient initialMode="compressor" />
    </Suspense>
  );
}
