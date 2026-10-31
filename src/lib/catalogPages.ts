import { getAllFonts, isFontIndexable } from './loaders/fontLoader';
import { getAllIconCollections, isIconIndexable } from './loaders/iconLoader';

export type CatalogType = 'fonts' | 'icons';
export const CATALOG_PAGE_SIZE = 100;

export function isCatalogType(type: string): type is CatalogType {
  return type === 'fonts' || type === 'icons';
}

export function getCatalogEntries(type: CatalogType) {
  const entries = type === 'fonts'
    ? getAllFonts().filter(isFontIndexable).map(font => ({
      slug: font.slug,
      name: font.name,
      description: `${font.category} · ${font.weights.length} weights · ${font.license_type}`,
    }))
    : getAllIconCollections().filter(isIconIndexable).map(icon => ({
      slug: icon.prefix,
      name: icon.name,
      description: `${icon.total_icons.toLocaleString('en-US')} icons · ${icon.category} · ${icon.license}`,
    }));
  return entries.sort((a, b) => a.name.localeCompare(b.name, 'en'));
}

export function getCatalogPageCount(type: CatalogType) {
  return Math.ceil(getCatalogEntries(type).length / CATALOG_PAGE_SIZE);
}

export function getCatalogPage(type: CatalogType, page: number) {
  const entries = getCatalogEntries(type);
  const pageCount = Math.ceil(entries.length / CATALOG_PAGE_SIZE);
  if (!Number.isInteger(page) || page < 1 || page > pageCount) return null;
  return {
    entries: entries.slice((page - 1) * CATALOG_PAGE_SIZE, page * CATALOG_PAGE_SIZE),
    pageCount,
    total: entries.length,
  };
}
