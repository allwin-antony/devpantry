import type { UtilityDefinition, CategoryInfo, UtilityCategory } from '../types/utility';
import { ChaosDataUtility } from '../utilities/chaos-data/ChaosDataUtility';
import { SchemaBuilderUtility } from '../utilities/schema-builder/SchemaBuilderUtility';

export const UTILITY_CATEGORIES: CategoryInfo[] = [
  {
    id: 'presets',
    name: 'Standard Presets',
    description: 'Battle-tested dirty mock datasets (E-Commerce, B2B Users, Invoicing, BLNS)',
    badgeColor: 'crimson'
  },
  {
    id: 'custom',
    name: 'Custom Schema Builder',
    description: 'Visual field composer to design custom dirty schemas without code',
    badgeColor: 'violet'
  }
];

export const REGISTERED_UTILITIES: UtilityDefinition[] = [
  {
    id: 'chaos-data',
    name: 'Domain Presets Synthesizer',
    tagline: 'Curated high-entropy datasets: E-Commerce, Users, Invoicing, BLNS',
    category: 'presets',
    description: 'Generate dirty test records across curated real-world domains with one-click multi-format exports.',
    iconName: 'Flame',
    badge: 'Curated Presets',
    badgeType: 'crimson',
    keywords: ['presets', 'ecommerce', 'users', 'invoices', 'blns', 'mock data', 'json', 'csv'],
    component: ChaosDataUtility,
    featured: true
  },
  {
    id: 'schema-builder',
    name: 'Custom Schema Builder',
    tagline: 'Visually compose custom dirty data schemas with 13+ field types & per-column chaos',
    category: 'custom',
    description: 'Design custom schemas through an intuitive visual editor, select field types, tune chaos sliders, and export instantly.',
    iconName: 'Layers',
    badge: 'Visual Builder',
    badgeType: 'violet',
    keywords: ['custom schema', 'field builder', 'uuid', 'email', 'custom mock data', 'visual builder'],
    component: SchemaBuilderUtility,
    featured: true
  }
];

export function getUtilityById(id: string): UtilityDefinition | undefined {
  return REGISTERED_UTILITIES.find(u => u.id === id);
}

export function getUtilitiesByCategory(category: UtilityCategory | 'all'): UtilityDefinition[] {
  if (category === 'all') return REGISTERED_UTILITIES;
  return REGISTERED_UTILITIES.filter(u => u.category === category);
}
