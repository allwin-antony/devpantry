import fs from 'fs';
import path from 'path';

export interface MapComponent {
  slug: string;
  name: string;
  type: 'engine' | 'plugin';
  description: string;
  license?: string;
  category?: string;
  [key: string]: any;
}

const MAPS_DIR = path.join(process.cwd(), 'src/lib/loaders/datasets/maps');

let cachedMaps: MapComponent[] | null = null;

export function getAllMaps(): MapComponent[] {
  if (cachedMaps) return cachedMaps;

  const maps: MapComponent[] = [];

  // Load Map Libraries/Engines
  try {
    const librariesPath = path.join(MAPS_DIR, 'map_libraries.json');
    if (fs.existsSync(librariesPath)) {
      const libsData = JSON.parse(fs.readFileSync(librariesPath, 'utf8'));
      // The JSON has `{ "libraries": [ ... ] }` based on my 'head' command earlier!
      const libraries = Array.isArray(libsData) ? libsData : libsData.libraries || [];
      for (const lib of libraries) {
        maps.push({
          ...lib,
          slug: lib.id,
          name: lib.name,
          type: 'engine',
          description: lib.description || '',
          license: typeof lib.license === 'string' ? lib.license : lib.license?.spdx || '',
          category: lib.category,
        });
      }
    }
  } catch (error) {
    console.error('Error loading map libraries:', error);
  }

  // Load Ingested Map Plugins
  try {
    const ingestedPath = path.join(MAPS_DIR, 'ingested', 'all_ingested_map_components.json');
    if (fs.existsSync(ingestedPath)) {
      const pluginsData = JSON.parse(fs.readFileSync(ingestedPath, 'utf8'));
      const plugins = Array.isArray(pluginsData) ? pluginsData : pluginsData.plugins || [];
      for (const plugin of plugins) {
        maps.push({
          ...plugin,
          slug: plugin.id || plugin.name,
          name: plugin.name,
          type: 'plugin',
          description: plugin.description || '',
          license: typeof plugin.license === 'string' ? plugin.license : (plugin.license?.spdx || ''),
          category: plugin.category || plugin.canonical_category,
        });
      }
    }
  } catch (error) {
    console.error('Error loading ingested map plugins:', error);
  }

  cachedMaps = maps;
  return maps;
}

export function getMapBySlug(slug: string): MapComponent | null {
  const maps = getAllMaps();
  return maps.find(m => m.slug === slug) || null;
}
