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
      title: 'Icon Library Not Found | DevPantry',
      description: 'The requested vector icon library could not be found.',
    };
  }

  return {
    title: `${collection.name} (${collection.total_icons.toLocaleString()} Icons) — Free Open Source SVGs`,
    description: `Browse, search, and copy ${collection.total_icons.toLocaleString()} free ${collection.license} vector icons from ${collection.name} by ${collection.author}. Includes live SVG customizer, React JSX, and Vue snippets.`,

    openGraph: {
      title: `${collection.name} (${collection.total_icons.toLocaleString()} Icons) | DevPantry`,
      description: `Live SVG customizer, React JSX generator, and searchable icon library for ${collection.name}.`,
    },
    alternates: {
      canonical: `https://devpantry.com/icons/${collection.prefix}`,
    },
  };
}

export default async function IconDetailPage({ params }: PageProps) {
  const { prefix } = await params;
  const collection = getIconCollectionByPrefix(prefix);

  if (!collection) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `${collection.name} Icon Library`,
    description: `Free open source vector icon library containing ${collection.total_icons} SVG icons.`,
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
  };

  return (
    <div className="flex flex-col min-h-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col shrink-0 w-full">
        <h1 className="sr-only">{collection.name} Icons</h1>
        <Suspense fallback={<div className="p-4 text-xs font-mono text-[var(--text-muted)]">Loading Icon Collection...</div>}>
          <IconDetailClient collection={collection} />
        </Suspense>
      </div>

      <article className="tool-seo-content prose prose-sm max-w-none dark:prose-invert">
        <h2>About {collection.name} Icons</h2>
        <p>
          {collection.name} is a comprehensive, open-source vector icon library designed by {collection.author}. 
          It contains exactly {collection.total_icons.toLocaleString()} individual SVG icons, making it one of the most robust collections available for modern web and application design.
        </p>

        <h3>License & Usage</h3>
        <p>
          This entire collection is distributed under the {collection.license} license. You are free to use these icons in commercial projects, personal websites, and open-source applications.
        </p>

        <h3>Installation & Integration</h3>
        <p>
          You can interactively search, customize stroke widths, adjust colors, and copy raw SVG code directly from the interface above. 
          Alternatively, you can copy React JSX snippets or Vue templates for immediate integration into your frontend frameworks.
        </p>
        
        <h3>Related Design Resources</h3>
        <ul>
          <li><a href="/fonts" className="text-rose-400 hover:underline">Typography Library</a> — Discover 2,180+ open-source fonts to pair with these icons.</li>
          <li><a href="/image-resizer" className="text-rose-400 hover:underline">Image Resizer</a> — Perfectly frame your icons for social media graphics.</li>
        </ul>
      </article>
    </div>
  );
}
