// Font Catalog Loader for OpenSourceDataset
import fontshareCatalogRaw from '../../data/opensource/Fonts/catalogs/fontshare_catalog.json';
import fontReposRaw from '../../data/opensource/Fonts/catalogs/github_repositories.json';
import fontsourceCatalogRaw from '../../data/opensource/Fonts/catalogs/fontsource_catalog.json';
import { getFontCdnStylesheet, getFontFallback, normalizeFontCategory } from '../fontPresentation';

export { getFontCdnStylesheet } from '../fontPresentation';

export interface FontItem {
  id: string;
  name: string;
  slug: string;
  version?: string;
  license_type: string;
  is_sil_ofl: boolean;
  category: string;
  styles_count: number;
  weights: number[];
  styles: string[];
  designers: string[];
  publisher: string;
  provider: 'google' | 'fontshare' | 'github' | 'fontsource';
  web_url?: string;
  download_url?: string;
  github_repo?: string;
  stars?: number;
  npm_package?: string;
  css_font_family: string;
  cdn_stylesheet_url?: string;
  subsets?: string[];
  variable?: boolean;
  cdn_provider?: 'google' | 'fontshare' | 'fontsource';
  fontsource_id?: string;
  cdn_style_ids?: number[];
}

export const FAMOUS_FONT_SLUGS = [
  'inter',
  'roboto',
  'satoshi',
  'jetbrains-mono',
  'fira-code',
  'clash-display',
  'general-sans',
  'cabinet-grotesk',
  'poppins',
  'montserrat',
  'plus-jakarta-sans',
  'manrope',
  'space-grotesk',
  'source-code-pro',
  'open-sans',
  'outfit',
  'fira-sans',
  'lato',
  'be-vietnam-pro',
  'dm-sans',
  'syne',
  'playfair-display',
  'merriweather',
  'hack',
  'cascadia-code',
  'orbitron',
  'cinzel'
];

export function isFontIndexable(font: FontItem): boolean {
  // A working family preview and documented source determine eligibility,
  // not popularity. Repository collections without a preview stay excluded.
  return Boolean(font.name && font.web_url && font.license_type &&
    font.weights.length && font.cdn_stylesheet_url);
}

// Memoized all fonts
let cachedFonts: FontItem[] | null = null;

export function getAllFonts(): FontItem[] {
  if (cachedFonts) return cachedFonts;

  const seenSlugs = new Set<string>();
  const list: FontItem[] = [];

  // 1. Fontshare (high-grade display & sans fonts)
  for (const f of (fontshareCatalogRaw as any[])) {
    const slug = f.slug || f.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    if (seenSlugs.has(slug)) continue;
    seenSlugs.add(slug);

    const isOfl = f.is_sil_ofl || f.license_type?.includes('ofl');
    const licenseType = f.license_type === 'itf_ffl' ? 'ITF Free Font' : (isOfl ? 'SIL OFL 1.1' : 'Free Commercial');
    const cat = normalizeFontCategory(f.category || 'Sans');
    const source = fontsourceCatalogRaw.find(item => item.id === slug);
    const weights = f.weights || source?.weights || [400];

    list.push({
      id: slug,
      name: f.name,
      slug,
      version: f.version || '1.0',
      license_type: licenseType,
      is_sil_ofl: !!isOfl,
      category: cat,
      styles_count: f.styles_count || 1,
      weights,
      styles: f.styles || source?.styles || ['normal'],
      designers: f.designers || [f.publisher || 'Indian Type Foundry'],
      publisher: f.publisher || 'Fontshare / ITF',
      provider: 'fontshare',
      web_url: f.web_url || `https://www.fontshare.com/fonts/${slug}`,
      download_url: f.download_url,
      npm_package: source ? `@fontsource/${source.id}` : undefined,
      css_font_family: `'${f.name}', ${getFontFallback(cat)}`,
      cdn_style_ids: f.cdn_style_ids,
      variable: f.variable || false,
      cdn_stylesheet_url: getFontCdnStylesheet({ name: f.name, slug, provider: 'fontshare', weights, cdn_style_ids: f.cdn_style_ids }),
    });
  }

  // 2. GitHub Top Repos (Inter, JetBrains Mono, Fira Code, etc.)
  for (const r of (fontReposRaw as any[])) {
    const fontName = r.family || r.name || 'Untitled Font';
    const slug = fontName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    if (seenSlugs.has(slug)) continue;
    seenSlugs.add(slug);

    const source = fontsourceCatalogRaw.find(item => item.id === slug);
    const cat = normalizeFontCategory(source?.category || r.category || 'Sans');
    const weights = source?.weights || (slug === 'hack' ? [400, 700] : []);
    const styles = source?.styles || (slug === 'hack' ? ['normal', 'italic'] : []);
    const repositoryStylesheet = slug === 'hack' ? 'https://cdn.jsdelivr.net/npm/hack-font@3.3.0/build/web/hack.css' : undefined;
    const cdnProvider = source ? (source.type === 'google' ? 'google' : 'fontsource') : undefined;

    list.push({
      id: slug,
      name: fontName,
      slug,
      version: 'Latest',
      license_type: r.license || 'SIL OFL 1.1',
      is_sil_ofl: /OFL/i.test(r.license || ''),
      category: cat,
      styles_count: styles.length * weights.length,
      weights,
      styles,
      designers: [r.owner || 'Community'],
      publisher: r.owner || 'Open Source',
      provider: 'github',
      web_url: r.repository || r.github_url,
      github_repo: r.repository || r.github_url,
      download_url: r.direct_zip_url,
      npm_package: source ? `@fontsource/${source.id}` : slug === 'hack' ? 'hack-font' : undefined,
      fontsource_id: source?.id,
      cdn_provider: cdnProvider,
      css_font_family: `'${fontName}', ${getFontFallback(cat)}`,
      cdn_stylesheet_url: repositoryStylesheet || getFontCdnStylesheet({ name: fontName, slug, provider: 'github', cdn_provider: cdnProvider, weights, fontsource_id: source?.id }),
      variable: source?.variable || false,
      stars: r.stars,
    });
  }

  // 3. Fontsource Catalog (2,100+ Google and Open Source fonts)
  for (const fs of (fontsourceCatalogRaw as any[])) {
    const fontName = fs.family || fs.id;
    const slug = fs.id || fontName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    if (seenSlugs.has(slug)) continue;
    seenSlugs.add(slug);

    const cat = normalizeFontCategory(fs.category || 'Sans');

    const weights = Array.isArray(fs.weights) && fs.weights.length > 0 ? fs.weights : [400, 700];

    list.push({
      id: slug,
      name: fontName,
      slug,
      version: fs.lastModified || '1.0',
      license_type: fs.license || 'SIL OFL 1.1',
      is_sil_ofl: /OFL/i.test(fs.license || ''),
      category: cat,
      styles_count: (fs.styles?.length || 1) * weights.length,
      weights: weights,
      styles: fs.styles || ['normal'],
      designers: [fs.type === 'google' ? 'Google Fonts' : 'Open Source'],
      publisher: fs.type === 'google' ? 'Google Fonts' : 'Fontsource Community',
      provider: fs.type === 'google' ? 'google' : 'fontsource',
      web_url: `https://fontsource.org/fonts/${slug}`,
      npm_package: `@fontsource/${slug}`,
      css_font_family: `'${fontName}', ${cat === 'Serif' ? 'serif' : (cat === 'Monospace' ? 'monospace' : 'sans-serif')}`,
      fontsource_id: fs.id,
      cdn_stylesheet_url: getFontCdnStylesheet({ name: fontName, slug, provider: fs.type === 'google' ? 'google' : 'fontsource', weights, fontsource_id: fs.id }),
      subsets: fs.subsets,
      variable: !!fs.variable
    });
  }

  // Curated list of famous fonts prioritized at the top
  const famousFontMap = new Map(FAMOUS_FONT_SLUGS.map((slug, idx) => [slug, idx]));

  list.sort((a, b) => {
    const aFamous = famousFontMap.has(a.slug) ? famousFontMap.get(a.slug)! : 999999;
    const bFamous = famousFontMap.has(b.slug) ? famousFontMap.get(b.slug)! : 999999;
    if (aFamous !== bFamous) return aFamous - bFamous;
    return a.name.localeCompare(b.name);
  });

  cachedFonts = list;
  return list;
}

export function getFontBySlug(slug: string): FontItem | undefined {
  const fonts = getAllFonts();
  return fonts.find(f => f.slug === slug || f.id === slug);
}

export function getAllFontSlugs(): string[] {
  return getAllFonts().map(f => f.slug);
}

export interface FontPairing {
  slug: string;
  name: string;
  category: string;
  role: string;
  reason: string;
}

export function getFontPairings(font: FontItem): FontPairing[] {
  const cat = (font.category || 'Sans').toLowerCase();
  const currentSlug = font.slug;

  const PAIRING_DATABASE: Record<string, FontPairing[]> = {
    inter: [
      { slug: 'jetbrains-mono', name: 'JetBrains Mono', category: 'Monospace', role: 'UI Body + Code Blocks', reason: 'Industry standard for developer consoles, docs, and SaaS dashboards.' },
      { slug: 'clash-display', name: 'Clash Display', category: 'Display', role: 'Display Header + Neutral UI', reason: 'Striking high-contrast editorial titles paired with clean, utilitarian body copy.' },
      { slug: 'fira-code', name: 'Fira Code', category: 'Monospace', role: 'Body + Syntax Highlighting', reason: 'Programmer-friendly ligatures alongside crisp variable sans.' },
      { slug: 'playfair-display', name: 'Playfair Display', category: 'Serif', role: 'Editorial Headline + Sans Subtext', reason: 'Classic editorial sophistication balanced by modern digital neutrality.' }
    ],
    'jetbrains-mono': [
      { slug: 'inter', name: 'Inter', category: 'Sans', role: 'Code Editor + Interface Chrome', reason: 'The premier combination for IDEs and developer documentation.' },
      { slug: 'satoshi', name: 'Satoshi', category: 'Sans', role: 'Monospace Code + Modernist Sans', reason: 'Clean modernist geometry for headings over precise fixed-width code.' },
      { slug: 'space-grotesk', name: 'Space Grotesk', category: 'Display', role: 'Tech Display + Code Body', reason: 'High-tech brand identity paired with terminal monospaced typography.' }
    ],
    satoshi: [
      { slug: 'jetbrains-mono', name: 'JetBrains Mono', category: 'Monospace', role: 'Modernist Body + Code Blocks', reason: 'Sharp, clean developer-focused balance.' },
      { slug: 'cabinet-grotesk', name: 'Cabinet Grotesk', category: 'Display', role: 'Display Header + Sans Body', reason: 'Pairing two distinct Indian Type Foundry masterworks.' },
      { slug: 'fira-code', name: 'Fira Code', category: 'Monospace', role: 'Geometric UI + Monospace', reason: 'Balanced tracking and high terminal legibility.' }
    ],
    'clash-display': [
      { slug: 'inter', name: 'Inter', category: 'Sans', role: 'Display Title + Clean Body', reason: 'Wildly expressive headline font grounded by hyper-legible UI body text.' },
      { slug: 'general-sans', name: 'General Sans', category: 'Sans', role: 'Editorial Header + Neutral Body', reason: 'Contemporary French modernist pairing for premium landing pages.' },
      { slug: 'jetbrains-mono', name: 'JetBrains Mono', category: 'Monospace', role: 'Bold Headline + Technical Metadata', reason: 'High-contrast typography for technical documentation and changelogs.' }
    ],
    'fira-code': [
      { slug: 'inter', name: 'Inter', category: 'Sans', role: 'Ligature Code + UI Shell', reason: 'Standard pairing for programming tutorials, blogs, and code viewports.' },
      { slug: 'satoshi', name: 'Satoshi', category: 'Sans', role: 'Monospace + Geometric Heading', reason: 'Sleek contemporary look for developer tools and CLI landing pages.' }
    ]
  };

  if (PAIRING_DATABASE[currentSlug]) {
    return PAIRING_DATABASE[currentSlug];
  }

  // Fallback by category
  if (cat.includes('mono')) {
    return [
      { slug: 'inter', name: 'Inter', category: 'Sans', role: 'Code Accent + Neutral UI', reason: 'Balances monospaced syntax with hyper-legible interface text.' },
      { slug: 'satoshi', name: 'Satoshi', category: 'Sans', role: 'Fixed-Width + Modernist Sans', reason: 'Clean modernist geometry for headings and navigation.' },
      { slug: 'space-grotesk', name: 'Space Grotesk', category: 'Display', role: 'Code Body + Tech Display', reason: 'Future-forward tech aesthetic for developer platforms.' }
    ].filter(p => p.slug !== currentSlug);
  }

  if (cat.includes('serif')) {
    return [
      { slug: 'inter', name: 'Inter', category: 'Sans', role: 'Serif Headline + Modern UI Body', reason: 'Grounds classic editorial serifs with crisp digital legibility.' },
      { slug: 'general-sans', name: 'General Sans', category: 'Sans', role: 'Serif Titles + Clean Sans Subtext', reason: 'Warm editorial balance across marketing pages.' },
      { slug: 'jetbrains-mono', name: 'JetBrains Mono', category: 'Monospace', role: 'Serif Copy + Code Accents', reason: 'Contrasting literary prose with precision technical monospacing.' }
    ].filter(p => p.slug !== currentSlug);
  }

  if (cat.includes('display')) {
    return [
      { slug: 'inter', name: 'Inter', category: 'Sans', role: 'Expressive Headline + Neutral Body', reason: 'Prevents display personality from overwhelming long-form reading.' },
      { slug: 'satoshi', name: 'Satoshi', category: 'Sans', role: 'Display Header + Geometric Sans', reason: 'Sharp, modern visual hierarchy for SaaS products.' },
      { slug: 'jetbrains-mono', name: 'JetBrains Mono', category: 'Monospace', role: 'Hero Title + Technical Specs', reason: 'High-impact contrast for engineering launch sites.' }
    ].filter(p => p.slug !== currentSlug);
  }

  // Default Sans pairings
  return [
    { slug: 'jetbrains-mono', name: 'JetBrains Mono', category: 'Monospace', role: 'Sans Interface + Code Monospace', reason: 'The quintessential developer stack typography pairing.' },
    { slug: 'clash-display', name: 'Clash Display', category: 'Display', role: 'Body Copy + High-Impact Headline', reason: 'Injects strong typographic identity into clean interfaces.' },
    { slug: 'fira-code', name: 'Fira Code', category: 'Monospace', role: 'UI Sans + Ligature Monospace', reason: 'Harmonious stroke weights between body prose and code snippets.' }
  ].filter(p => p.slug !== currentSlug);
}
