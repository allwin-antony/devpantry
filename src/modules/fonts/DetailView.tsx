import { getFontPairings, isFontIndexable } from '@/lib/loaders/fontLoader';
import { FontDetailClient } from '@/components/clients/FontDetailClient';

export default function FontsDetailView({ item }: { item: any }) {
  const font = item;
  const isIndexable = isFontIndexable(font);
  const pairings = getFontPairings(font);

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
        <FontDetailClient font={font} pairings={pairings} />
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

        <h3>Recommended Font Pairings</h3>
        <p>
          Creating typographic contrast is essential for high-impact web design. Here are battle-tested typeface pairings for {font.name}:
        </p>
        <ul>
          {pairings.map((pairing: any) => (
            <li key={pairing.slug}>
              <strong><a href={`/fonts/${pairing.slug}`} className="text-rose-500 dark:text-rose-400 hover:underline">{pairing.name}</a></strong> ({pairing.category}) — <em>{pairing.role}</em>: {pairing.reason}
            </li>
          ))}
        </ul>
        
        <h3>Related Tools</h3>
        <ul>
          <li><a href="/icons" className="text-rose-400 hover:underline">Icon Library</a> — Pair {font.name} with vector icons.</li>
          <li><a href="/image-resizer" className="text-rose-400 hover:underline">Image Resizer</a> — Pad images for social media covers.</li>
          <li><a href="/jwt-decoder" className="text-rose-400 hover:underline">JWT Decoder</a> — Inspect client tokens without data leaks.</li>
        </ul>
      </article>
    </div>
  );
}
