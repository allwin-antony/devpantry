import { Metadata } from 'next';
import { HomeClient } from '@/components/clients/HomeClient';

export const metadata: Metadata = {
  title: 'DevPantry — Free Developer Tools: Icons, Fonts, Mock Data & Image Studio',
  description: 'Free developer tools: 2,180+ open source fonts, 353,000+ vector icons, high-entropy mock data generator, image compressor no signup, and zero-leak JWT inspector.',
  keywords: [
    'free developer tools online',
    'web developer utility kit',
    'frontend design resources',
    'open source fonts',
    'font preview',
    'free vector icons',
    'mock data generator',
    'image compressor no signup'
  ],
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
};

export default function HomePage() {
  return <HomeClient />;
}
