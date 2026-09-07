// Icon Catalog Loader for OpenSourceDataset
import iconLibrariesRaw from '../../data/opensource/Icons/catalogs/featured_libraries.json';
import iconCollectionsRaw from '../../data/opensource/Icons/catalogs/icon_collections.json';
import iconPackagesRaw from '../../data/opensource/Icons/catalogs/npm_packages.json';

export interface IconLibraryItem {
  id: string;
  name: string;
  tagline: string;
  total_icons: string;
  license: string;
  license_note: string;
  website: string;
  github: string;
  releases_url?: string;
  npm_packages: Record<string, string>;
  cdn_svg_template?: string;
  api_prefix?: string;
  primary_package?: string;
}

export interface IconCollectionItem {
  prefix: string;
  name: string;
  total_icons: number;
  version?: string | null;
  author: string;
  author_url?: string;
  license: string;
  license_spdx?: string;
  license_url?: string;
  category: string;
  samples: string[];
  svg_endpoint: string;
  json_endpoint: string;
}

export const FAMOUS_ICON_PREFIXES = [
  'lucide',
  'tabler',
  'material-symbols',
  'material-symbols-light',
  'heroicons',
  'ph',
  'simple-icons',
  'bi',
  'ri',
  'feather',
  'radix-icons',
  'carbon',
  'octicon',
  'mingcute',
  'iconoir'
];

export function getAllIconLibraries(): IconLibraryItem[] {
  return (iconLibrariesRaw as any[]).map(lib => ({
    ...lib,
    primary_package: lib.npm_packages?.react || lib.npm_packages?.vanilla || Object.values(lib.npm_packages || {})[0] || ''
  }));
}

let cachedCollections: IconCollectionItem[] | null = null;

export function getAllIconCollections(): IconCollectionItem[] {
  if (cachedCollections) return cachedCollections;

  const collections = [...(iconCollectionsRaw as IconCollectionItem[])];
  const famousIconMap = new Map(FAMOUS_ICON_PREFIXES.map((prefix, idx) => [prefix, idx]));

  collections.sort((a, b) => {
    const aFamous = famousIconMap.has(a.prefix) ? famousIconMap.get(a.prefix)! : 999999;
    const bFamous = famousIconMap.has(b.prefix) ? famousIconMap.get(b.prefix)! : 999999;
    if (aFamous !== bFamous) return aFamous - bFamous;
    return a.name.localeCompare(b.name);
  });

  cachedCollections = collections;
  return collections;
}

export function getIconCollectionByPrefix(prefix: string): IconCollectionItem | undefined {
  return getAllIconCollections().find(c => c.prefix === prefix);
}

export function getAllIconPrefixes(): string[] {
  return getAllIconCollections().map(c => c.prefix);
}

export function getIconNpmPackages(): any {
  return iconPackagesRaw;
}
