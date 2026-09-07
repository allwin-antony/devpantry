import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getAllIconCollections, getIconCollectionByPrefix, getAllIconPrefixes } from '@/lib/loaders/iconLoader';
import { IconDetailClient } from '@/components/clients/IconDetailClient';

interface PageProps {
  params: Promise<{ prefix: string }>;
}

export async function generateStaticParams() {
  const prefixes = getAllIconPrefixes();
  return prefixes.map(prefix => ({ prefix }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { prefix } = await params;
  const collection = getIconCollectionByPrefix(prefix);

  if (!collection) {
    return {
      title: 'Icon Library Not Found | DevPlayground',
      description: 'The requested vector icon library could not be found.',
    };
  }

  return {
    title: `${collection.name} (${collection.total_icons.toLocaleString()} Icons) — Free Open Source SVGs`,
    description: `Browse, search, and copy ${collection.total_icons.toLocaleString()} free ${collection.license} vector icons from ${collection.name} by ${collection.author}. Includes live SVG customizer, React JSX, and Vue snippets.`,
    keywords: [
      `${collection.name} icons`,
      `${collection.prefix} icons`,
      `${collection.name} react icons`,
      `${collection.name} svg download`,
      'open source svg icons',
      'free vector icons',
      'commercial use icons'
    ],
    openGraph: {
      title: `${collection.name} (${collection.total_icons.toLocaleString()} Icons) | DevPlayground`,
      description: `Live SVG customizer, React JSX generator, and searchable icon library for ${collection.name}.`,
    },
  };
}

export default async function IconDetailPage({ params }: PageProps) {
  const { prefix } = await params;
  const collection = getIconCollectionByPrefix(prefix);

  if (!collection) {
    notFound();
  }

  return (
    <Suspense fallback={<div className="p-4 text-xs font-mono text-[var(--text-muted)]">Loading Icon Collection...</div>}>
      <IconDetailClient collection={collection} />
    </Suspense>
  );
}
