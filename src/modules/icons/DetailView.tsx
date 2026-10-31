import { Suspense } from 'react';
import { IconDetailClient } from '@/components/clients/IconDetailClient';

export default function IconsDetailView({ item }: { item: any }) {
  const collection = item;

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
        <h1 className="px-4 pt-6 text-2xl font-bold max-w-6xl mx-auto w-full">{collection.name} Icons</h1>
        <Suspense fallback={<div className="p-4 text-xs font-mono text-[var(--text-muted)]">Loading Icon Collection...</div>}>
          <IconDetailClient collection={collection} />
        </Suspense>
      </div>

      <article className="tool-seo-content prose prose-sm max-w-none dark:prose-invert">
        <h2>About {collection.name} Icons</h2>
        <p>
          {collection.name} is a comprehensive, open-source vector icon library designed by {collection.author}. 
          Our catalogue lists {collection.total_icons.toLocaleString()} SVG icons in the {collection.category || 'general-purpose'} category. Search by icon name, preview the result at your interface’s size, and copy SVG or framework code.
        </p>

        <h3>License & Usage</h3>
        <p>
          The catalogue lists the {collection.license} license.{' '}
          {collection.license_url && <a href={collection.license_url} target="_blank" rel="noopener noreferrer">Read the collection’s license</a>}{' '}
          for attribution, redistribution, and any other terms that apply to your use.
        </p>

        <h3>Installation & Integration</h3>
        <pre><code>{`npm install @iconify/react\n\nimport { Icon } from '@iconify/react';\n\n<Icon icon="${collection.prefix}:${collection.samples[0]}" width={24} />`}</code></pre>
        <p>
          You can interactively search, customize stroke widths, adjust colors, and copy raw SVG code directly from the interface above. 
          Alternatively, you can copy React JSX snippets or Vue templates for immediate integration into your frontend frameworks.
        </p>

        <h3>Try a sample icon</h3>
        <ul>
          {collection.samples.map((name: string) => <li key={name}><a href={`/icons/${collection.prefix}?icon=${encodeURIComponent(name)}`}>{name}</a></li>)}
        </ul>
        
        <h3>Related Design Resources</h3>
        <ul>
          <li><a href="/fonts" className="text-rose-400 hover:underline">Typography Library</a> — Discover 2,180+ open-source fonts to pair with these icons.</li>
          <li><a href="/tools/image-resizer" className="text-rose-400 hover:underline">Image Resizer</a> — Perfectly frame your icons for social media graphics.</li>
        </ul>
      </article>
    </div>
  );
}
