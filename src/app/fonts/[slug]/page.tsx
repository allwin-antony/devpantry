import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllFonts, getFontBySlug, getAllFontSlugs } from '@/lib/loaders/fontLoader';
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
      title: 'Font Not Found | DevPantry',
      description: 'The requested open-source font could not be found.',
    };
  }

  return {
    title: `${font.name} Font — Free Open Source ${font.category} Typography`,
    description: `Test, preview, and download ${font.name}, a free ${font.category} font by ${font.designers.join(', ')} (${font.publisher}). Includes CSS @import, HTML link, Tailwind config, and npm install snippet.`,

    openGraph: {
      title: `${font.name} Font — Free Open-Source Typography | DevPantry`,
      description: `Live interactive tester, weight specimens, and copy-paste code snippets for ${font.name}.`,
    },
    alternates: {
      canonical: `https://devpantry.com/fonts/${font.slug}`,
    },
  };
}

export default async function FontDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const font = getFontBySlug(slug);
  const { isFontIndexable } = await import('@/lib/loaders/fontLoader');

  if (!font) {
    notFound();
  }

  const isIndexable = isFontIndexable(font);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `${font.name} Font`,
    description: `Free open source ${font.category} font by ${font.publisher}.`,
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
      {!isIndexable && <meta name="robots" content="noindex" />}
      
      <div className="flex flex-col shrink-0 w-full">
        <h1 className="sr-only">{font.name} Font</h1>
        <FontDetailClient font={font} />
      </div>

      <article className="tool-seo-content prose prose-sm max-w-none dark:prose-invert">
        <h2>About {font.name}</h2>
        <p>
          {font.name} is a free, open-source {font.category.toLowerCase()} typeface published by {font.publisher}. 
          It is distributed under the {font.license_type} license, making it completely free for commercial and personal use.
        </p>

        <h3>Font Weights & Styles</h3>
        <p>
          This typeface includes {font.styles_count} styles. The available weights are: {font.weights.join(', ')}.
        </p>

        <h3>Installation</h3>
        <p>You can install {font.name} via npm:</p>
        <pre><code>npm install {font.npm_package}</code></pre>

        <p>Or import it via CSS:</p>
        <pre><code>@import url('{font.cdn_stylesheet_url}');</code></pre>
        
        <h3>Related Tools</h3>
        <ul>
          <li><a href="/icons" className="text-rose-400 hover:underline">Icon Library</a> — Pair {font.name} with vector icons.</li>
          <li><a href="/image-resizer" className="text-rose-400 hover:underline">Image Resizer</a> — Pad images for social media covers.</li>
        </ul>
      </article>
    </div>
  );
}
