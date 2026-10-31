import { Metadata } from 'next';
import { HomeClient } from '@/components/clients/HomeClient';

export const metadata: Metadata = {
  title: 'DevPantry — Free Browser-Based Developer Tools',
  description: 'Free browser tools for frontend developers: decode JWTs, generate mock data, convert JSON to TypeScript and Zod, and prepare images, fonts, and SVG icons. No signup.',

  openGraph: {
    title: 'DevPantry — Free Tools for Building & Testing Web Apps',
    description: 'Inspect JWTs, generate edge-case data, convert JSON to types, and prepare web assets. Browser-based tools with no account required.',
    url: 'https://devpantry.com',
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
