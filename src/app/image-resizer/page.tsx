import type { Metadata } from 'next';
import { Suspense } from 'react';
import { BgRemovalClient } from '@/components/clients/BgRemovalClient';

export const metadata: Metadata = {
  title: 'Free Unlimited Image Resizer & Artboard Studio — No Signup',
  description: 'Resize unlimited images to exact pixel dimensions, aspect ratios, and custom padding entirely inside your browser with no signup. 100% private, free forever, and instant.',
  keywords: [
    'image resizer no signup',
    'unlimited image resizer',
    'resize image without signup',
    'free image resizer no signup',
    'unlimited photo resizer',
    'client side image resizer',
    'browser image resizer no signup',
    'aspect ratio crop tool unlimited',
    'image padding generator no signup',
    'developer image resizer unlimited',
    'instant image framing no signup',
    'free image scaler unlimited'
  ],
  openGraph: {
    title: 'Free Unlimited Image Resizer & Artboard Studio — No Signup | DevPlayground',
    description: 'Instant, unlimited image resizing, aspect ratio framing, and padding directly in your browser. No signup required, zero cloud uploads, 100% private.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Unlimited Image Resizer & Artboard Studio — No Signup | DevPlayground',
    description: 'Resize and frame unlimited images directly in your browser with no signup. 100% private, zero uploads, custom aspect ratios and target pixel sizes.',
  },
  alternates: {
    canonical: 'https://devplayground.io/image-resizer',
  },
};

export default function ImageResizerPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center p-8 bg-[var(--bg-app)] text-[var(--text-muted)] font-mono text-xs">
          Loading Image Resizer Studio...
        </div>
      }
    >
      <BgRemovalClient initialMode="resizer" />
    </Suspense>
  );
}
