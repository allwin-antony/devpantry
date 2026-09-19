import React from 'react';

export interface Summary {
  slug: string;
  [key: string]: any; // Allows specific modules to add extra summary fields
}

export interface Detail {
  slug: string;
  [key: string]: any; // Allows specific modules to add extra detail fields
}

export interface ModuleManifest {
  type: string;
  label: string;
  route: string;
  navSection: string;
  metadata?: {
    title: string;
    description: string;
  };
  generateMetadata?: (item: Detail) => any;
  loader: {
    listAll(): Promise<Summary[]> | Summary[];
    getBySlug?(slug: string): Promise<Detail | null> | Detail | null;
  };
  renderers: {
    list?: React.ComponentType<{ items: any[] }>;
    detail?: React.ComponentType<{ item: any }>;
  };
}

import { fontsManifest } from '../modules/fonts/manifest';
import { iconsManifest } from '../modules/icons/manifest';

import toolsManifest from '@/modules/tools/manifest';

export const moduleRegistry: ModuleManifest[] = [
  fontsManifest,
  iconsManifest,
  toolsManifest
];
