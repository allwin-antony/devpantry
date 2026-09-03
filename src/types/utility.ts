import React from 'react';

export type UtilityCategory = 'presets' | 'custom';

export interface CategoryInfo {
  id: UtilityCategory;
  name: string;
  description: string;
  badgeColor?: 'crimson' | 'violet' | 'cyan' | 'emerald';
}

export interface UtilityDefinition {
  id: string;
  name: string;
  tagline: string;
  category: UtilityCategory;
  description: string;
  iconName: string;
  badge?: string;
  badgeType?: 'crimson' | 'violet' | 'cyan' | 'emerald';
  keywords: string[];
  component: React.ComponentType;
  featured?: boolean;
}

export type ExportFormat = 'json' | 'csv' | 'typescript' | 'zod' | 'sql';

export interface ChaosPreset {
  id: string;
  name: string;
  description: string;
  generate: (count: number, entropyLevel: number) => any[];
}
