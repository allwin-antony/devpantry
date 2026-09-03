import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllFonts, getFontBySlug, getAllFontSlugs } from '@/lib/datasetLoader';
import { FontDetailClient } from '@/components/clients/FontDetailClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllFontSlugs();
  return slugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const font = getFontBySlug(slug);

  if (!font) {
    return {
      title: 'Font Not Found | DevPlayground',
      description: 'The requested open-source font could not be found.',
    };
  }

  return {
    title: `${font.name} Font — Free Open Source ${font.category} Typography`,
    description: `Test, preview, and download ${font.name}, a free ${font.category} font by ${font.designers.join(', ')} (${font.publisher}). Includes CSS @import, HTML link, Tailwind config, and npm install snippet.`,
    keywords: [
      `${font.name} font`,
      `${font.name} download`,
      `${font.name} google fonts`,
      `${font.name} web font`,
      `free ${font.category.toLowerCase()} font`,
      `${font.slug} fontsource`,
      'open source typography',
      'commercial use font'
    ],
    openGraph: {
      title: `${font.name} Font — Free Open-Source Typography | DevPlayground`,
      description: `Live interactive tester, weight specimens, and copy-paste code snippets for ${font.name}.`,
    },
  };
}

export default async function FontDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const font = getFontBySlug(slug);

  if (!font) {
    notFound();
  }

  return <FontDetailClient font={font} />;
}
