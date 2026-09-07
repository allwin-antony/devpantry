// Font Catalog Loader for OpenSourceDataset
import fontshareCatalogRaw from '../../data/opensource/Fonts/catalogs/fontshare_catalog.json';
import fontReposRaw from '../../data/opensource/Fonts/catalogs/github_repositories.json';
import fontsourceCatalogRaw from '../../data/opensource/Fonts/catalogs/fontsource_catalog.json';

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

export function getFontCdnStylesheet(font: { name: string; slug: string; provider: string; weights?: number[] }): string {
  if (font.provider === 'fontshare') {
    return `https://api.fontshare.com/v2/css?f[]=${font.slug}@400,500,600,700&display=swap`;
  }
  const weightStr = (font.weights && font.weights.length > 0) ? font.weights.join(';') : '400;600;700';
  const familyEscaped = encodeURIComponent(font.name);
  return `https://fonts.googleapis.com/css2?family=${familyEscaped}:wght@${weightStr}&display=swap`;
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
    const cat = f.category || 'Sans';

    list.push({
      id: slug,
      name: f.name,
      slug,
      version: f.version || '1.0',
      license_type: licenseType,
      is_sil_ofl: !!isOfl,
      category: cat.charAt(0).toUpperCase() + cat.slice(1),
      styles_count: f.styles_count || 1,
      weights: [400, 600, 700],
      styles: ['normal'],
      designers: f.designers || [f.publisher || 'Indian Type Foundry'],
      publisher: f.publisher || 'Fontshare / ITF',
      provider: 'fontshare',
      web_url: f.web_url || `https://www.fontshare.com/fonts/${slug}`,
      download_url: f.download_url,
      npm_package: `@fontsource/${slug}`,
      css_font_family: `'${f.name}', ${cat.toLowerCase() === 'serif' ? 'serif' : (cat.toLowerCase().includes('mono') ? 'monospace' : 'sans-serif')}`,
      cdn_stylesheet_url: `https://api.fontshare.com/v2/css?f[]=${slug}@400,600,700&display=swap`
    });
  }

  // 2. GitHub Top Repos (Inter, JetBrains Mono, Fira Code, etc.)
  for (const r of (fontReposRaw as any[])) {
    const fontName = r.family || r.name || 'Untitled Font';
    const slug = fontName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    if (seenSlugs.has(slug)) continue;
    seenSlugs.add(slug);

    const isMono = (r.category || '').toLowerCase().includes('mono');
    const isSerif = (r.category || '').toLowerCase().includes('serif') && !isMono;
    const cat = isMono ? 'Monospace' : (isSerif ? 'Serif' : 'Sans');

    list.push({
      id: slug,
      name: fontName,
      slug,
      version: 'Latest',
      license_type: r.license || 'SIL OFL 1.1',
      is_sil_ofl: true,
      category: cat,
      styles_count: r.variable ? 9 : 4,
      weights: [300, 400, 500, 600, 700, 800],
      styles: ['normal'],
      designers: [r.owner || 'Community'],
      publisher: r.owner || 'Open Source',
      provider: 'github',
      web_url: r.repository || r.github_url,
      github_repo: r.repository || r.github_url,
      download_url: r.direct_zip_url,
      npm_package: `@fontsource/${slug}`,
      css_font_family: `'${fontName}', ${isMono ? 'monospace' : 'sans-serif'}`,
      cdn_stylesheet_url: `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;600;700&display=swap`,
      variable: !!r.variable
    });
  }

  // 3. Fontsource Catalog (2,100+ Google and Open Source fonts)
  for (const fs of (fontsourceCatalogRaw as any[])) {
    const fontName = fs.family || fs.id;
    const slug = fs.id || fontName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    if (seenSlugs.has(slug)) continue;
    seenSlugs.add(slug);

    let cat = 'Sans';
    const rawCat = (fs.category || '').toLowerCase();
    if (rawCat.includes('mono')) cat = 'Monospace';
    else if (rawCat.includes('serif') && !rawCat.includes('sans')) cat = 'Serif';
    else if (rawCat.includes('display') || rawCat.includes('handwriting')) cat = 'Display';

    const weights = Array.isArray(fs.weights) && fs.weights.length > 0 ? fs.weights : [400, 700];

    list.push({
      id: slug,
      name: fontName,
      slug,
      version: fs.lastModified || '1.0',
      license_type: fs.license || 'SIL OFL 1.1',
      is_sil_ofl: (fs.license || '').includes('OFL') || true,
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
      cdn_stylesheet_url: `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@${weights.filter((w: number) => [300, 400, 600, 700, 800].includes(w)).join(';') || '400;700'}&display=swap`,
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
