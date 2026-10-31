import type { FontItem } from './loaders/fontLoader';

export function normalizeFontCategory(category: string): string {
  const value = category.toLowerCase();
  if (value.includes('mono')) return 'Monospace';
  if (value.includes('sans')) return 'Sans';
  if (value.includes('serif') && !value.includes('blackletter')) return 'Serif';
  if (/display|handwriting|blackletter|experimental|collection/.test(value)) return 'Display';
  return 'Sans';
}

export function getFontFallback(category: string): string {
  return category === 'Monospace' ? 'monospace' : category === 'Serif' ? 'serif' : 'sans-serif';
}

export function getFontStylesheetUrls(font: Pick<FontItem, 'name' | 'slug' | 'provider' | 'weights' | 'cdn_provider' | 'fontsource_id' | 'cdn_style_ids' | 'cdn_stylesheet_url'>): string[] {
  const provider = font.cdn_provider || font.provider;
  const weights = [...new Set(font.weights)].sort((a, b) => a - b);
  if (!weights.length) return [];

  if (provider === 'fontshare') {
    const styles = font.cdn_style_ids?.length ? font.cdn_style_ids : weights;
    return [`https://api.fontshare.com/v2/css?f[]=${font.slug}@${styles.join(',')}&display=swap`];
  }
  if (provider === 'fontsource') {
    return weights.map(weight => `https://cdn.jsdelivr.net/npm/@fontsource/${font.fontsource_id || font.slug}/${weight}.css`);
  }
  if (provider === 'google') {
    return [`https://fonts.googleapis.com/css2?family=${encodeURIComponent(font.name)}:wght@${weights.join(';')}&display=swap`];
  }
  if (provider === 'github' && font.cdn_stylesheet_url) return [font.cdn_stylesheet_url];
  return [];
}

export function getFontCdnStylesheet(font: Parameters<typeof getFontStylesheetUrls>[0]): string {
  return getFontStylesheetUrls(font)[0] || '';
}

export function getFontSnippets(font: FontItem) {
  const urls = getFontStylesheetUrls(font);
  const families = [font.name, getFontFallback(font.category)];
  return {
    css: urls.length ? `${urls.map(url => `@import url('${url}');`).join('\n')}\n\nbody {\n  font-family: ${font.css_font_family};\n}` : '',
    html: urls.map(url => `<link href="${url}" rel="stylesheet">`).join('\n'),
    npm: font.npm_package ? `npm install ${font.npm_package}` : '',
    tailwind: `// Tailwind CSS v3: tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      fontFamily: {\n        ${JSON.stringify(font.slug)}: ${JSON.stringify(families)},\n      },\n    },\n  },\n};`,
    tailwindV4: `/* Tailwind CSS v4: add after your font stylesheet imports */\n@theme {\n  --font-${font.slug}: ${font.css_font_family};\n}`,
  };
}
