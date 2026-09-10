import { Metadata } from 'next';
import { HomeClient } from '@/components/clients/HomeClient';

export const metadata: Metadata = {
  title: 'DevPantry — Free Browser-Based Developer Tools',
  description: 'Free developer tools: 2,180+ open source fonts, 353,000+ vector icons, high-entropy mock data generator, image compressor no signup, and zero-leak JWT inspector.',

  openGraph: {
    title: 'DevPantry — Free Developer Tools: Icons, Fonts, Mock Data & Image Studio',
    description: 'Free developer tools: 2,180+ open source fonts, 353,000+ vector icons, high-entropy mock data generator, image compressor no signup, and zero-leak JWT inspector.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevPantry — Free Developer Tools',
    description: 'The ultimate web developer utility kit: icons, fonts, chaos data, and image tools.',
  },
  alternates: {
    canonical: 'https://devpantry.com',
  },
};

export default function HomePage() {
  return <HomeClient />;
}
