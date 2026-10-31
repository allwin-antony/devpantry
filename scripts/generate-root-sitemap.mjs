import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = 'https://devpantry.com';
const SITEMAP_IDS = ['core', 'tools', 'fonts', 'icons', 'templates', 'guides'];

const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${SITEMAP_IDS.map(id => `  <sitemap>
    <loc>${BASE_URL}/sitemap/${id}.xml</loc>
  </sitemap>`).join('\n')}
</sitemapindex>
`;

// Write to public/ for next dev/build copy
const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
const publicPath = path.resolve(publicDir, 'sitemap.xml');
fs.writeFileSync(publicPath, sitemapIndexXml, 'utf-8');
console.log(`[sitemap] Wrote root sitemap index to ${publicPath}`);

// Also write directly to out/ if out/ exists after next build
const outDir = path.resolve('out');
if (fs.existsSync(outDir)) {
  const outPath = path.resolve(outDir, 'sitemap.xml');
  fs.writeFileSync(outPath, sitemapIndexXml, 'utf-8');
  console.log(`[sitemap] Wrote root sitemap index to ${outPath}`);
}
