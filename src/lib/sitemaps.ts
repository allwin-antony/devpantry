import type { MetadataRoute } from 'next';
import { getAllFonts, isFontIndexable } from './loaders/fontLoader';
import { getAllIconCollections, isIconIndexable } from './loaders/iconLoader';
import { getAllTools } from './loaders/toolLoader';
import { GUIDES_DATA } from './guidesData';
import { getCatalogPageCount, type CatalogType } from './catalogPages';

export const SITEMAP_IDS = ['core', 'tools', 'fonts', 'icons', 'templates', 'guides'] as const;
const BASE_URL = 'https://devpantry.com';

function catalogPages(type: CatalogType): MetadataRoute.Sitemap {
  return Array.from({ length: getCatalogPageCount(type) }, (_, index) => ({ url: `${BASE_URL}/${type}/catalog/${index + 1}` }));
}

export function getSitemapEntries(id: string): MetadataRoute.Sitemap {
  // Omit lastmod when a page's actual content-update date is unknown. A build
  // timestamp or a hard-coded site-wide date is not a content-update date.
  switch (id) {
    case 'core':
      return ['', '/tools', '/fonts', '/icons', '/guides', '/about', '/privacy', '/security', '/feedback'].map(path => ({ url: `${BASE_URL}${path}` }));
    case 'tools':
      return getAllTools().filter(tool => tool.slug !== 'api-templates').map(tool => ({ url: `${BASE_URL}/tools/${tool.slug}` }));
    case 'templates':
      return [{ url: `${BASE_URL}/tools/api-templates` }];
    case 'fonts':
      return [...getAllFonts().filter(isFontIndexable).map(font => ({ url: `${BASE_URL}/fonts/${font.slug}` })), ...catalogPages('fonts')];
    case 'icons':
      return [...getAllIconCollections().filter(isIconIndexable).map(icon => ({ url: `${BASE_URL}/icons/${icon.prefix}` })), ...catalogPages('icons')];
    case 'guides':
      return GUIDES_DATA.map(guide => ({ url: `${BASE_URL}/guides/${guide.slug}`, lastModified: new Date(guide.updatedDate) }));
    default:
      return [];
  }
}
