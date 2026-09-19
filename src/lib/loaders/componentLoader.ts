import fs from 'fs';
import path from 'path';

export interface UIComponent {
  slug: string;
  name: string;
  type: 'library' | 'component';
  description: string;
  frameworks?: string[];
  license?: string;
  category?: string;
  [key: string]: any;
}

const COMPONENTS_DIR = path.join(process.cwd(), 'src/lib/loaders/datasets/components');

let cachedComponents: UIComponent[] | null = null;

export function getAllComponents(): UIComponent[] {
  if (cachedComponents) return cachedComponents;

  const components: UIComponent[] = [];

  // Load Libraries
  try {
    const librariesPath = path.join(COMPONENTS_DIR, 'component_libraries.json');
    if (fs.existsSync(librariesPath)) {
      const libsData = JSON.parse(fs.readFileSync(librariesPath, 'utf8'));
      for (const lib of libsData) {
        components.push({
          ...lib,
          slug: lib.id,
          name: lib.name,
          type: 'library',
          description: lib.description || '',
          frameworks: lib.frameworks_supported || [],
          license: lib.license_spdx || lib.license || '',
          category: lib.category,
        });
      }
    }
  } catch (error) {
    console.error('Error loading component libraries:', error);
  }

  // Load Ingested Components
  try {
    const ingestedPath = path.join(COMPONENTS_DIR, 'ingested', 'all_ingested_components.json');
    if (fs.existsSync(ingestedPath)) {
      const componentsData = JSON.parse(fs.readFileSync(ingestedPath, 'utf8'));
      for (const comp of componentsData) {
        components.push({
          ...comp,
          slug: comp.id,
          name: comp.name,
          type: 'component',
          description: comp.description || '',
          frameworks: comp.frameworks || [],
          license: typeof comp.license === 'string' ? comp.license : (comp.license?.spdx || ''),
          category: comp.canonical_category,
        });
      }
    }
  } catch (error) {
    console.error('Error loading ingested components:', error);
  }

  cachedComponents = components;
  return components;
}

export function getComponentBySlug(slug: string): UIComponent | null {
  const components = getAllComponents();
  return components.find(c => c.slug === slug) || null;
}
