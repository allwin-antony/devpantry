import { getFontPairings } from '@/lib/loaders/fontLoader';
import { FontDetailClient } from '@/components/clients/FontDetailClient';
import { getFontSnippets } from '@/lib/fontPresentation';

export default function FontsDetailView({ item }: { item: any }) {
  const font = item;
  const pairings = getFontPairings(font);
  const snippets = getFontSnippets(font);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `${font.name} Font`,
    description: `${font.category} font by ${font.publisher}. Preview and integration resources.`,
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
        <FontDetailClient font={font} pairings={pairings} />
      </div>

      <article className="tool-seo-content prose prose-sm max-w-none dark:prose-invert">
        <h2>About {font.name}</h2>
        <p>
          {font.name} is a {font.category.toLowerCase()} typeface published by {font.publisher}.
          Its listed license is {font.license_type}. {font.is_sil_ofl ? 'It is distributed under the SIL Open Font License.' : 'Free availability does not necessarily mean the font is open source.'}{' '}
          <a href={font.web_url} target="_blank" rel="noopener noreferrer">Check the publisher’s license and distribution details</a> before embedding or redistributing files.
        </p>

        {font.weights.length > 0 && <><h3>Font Weights & Styles</h3>
        <p>
          This typeface includes {font.styles_count} styles. The available weights are: {font.weights.join(', ')}.
        </p></>}

        <h3>Installation</h3>
        {snippets.npm && <><p>Install the available font package for {font.name}:</p><pre><code>{snippets.npm}</code></pre></>}
        {snippets.css ? <><p>Load the supported webfont styles and apply the family:</p><pre><code>{snippets.css}</code></pre></> : <p>Use the official repository for installation instructions for individual families.</p>}

        <h3>Recommended Font Pairings</h3>
        <p>
          Try these contrasting families with {font.name}. Compare them at the sizes used in your interface, especially body text and code:
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
          <li><a href="/tools/image-resizer" className="text-rose-400 hover:underline">Image Resizer</a> — Pad images for social media covers.</li>
          <li><a href="/tools/jwt-decoder" className="text-rose-400 hover:underline">JWT Decoder</a> — Inspect client tokens without data leaks.</li>
        </ul>
      </article>
    </div>
  );
}
