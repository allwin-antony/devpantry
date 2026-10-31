import { getSitemapEntries, SITEMAP_IDS } from '@/lib/sitemaps';

export function generateSitemaps() {
  return SITEMAP_IDS.map(id => ({ id }));
}

export default async function sitemap({ id }: { id: Promise<string> }) {
  return getSitemapEntries(await id);
}
