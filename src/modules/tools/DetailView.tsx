'use client';

import React from 'react';
import type { ToolItem } from '@/lib/loaders/toolLoader';

// We will dynamically import the actual app component based on the slug.
// This allows us to have standard Next.js code splitting.
import dynamic from 'next/dynamic';

const componentMap: Record<string, React.ComponentType> = {
  'jwt-decoder': dynamic(() => import('./components/JwtDecoder')),
  'image-compressor': dynamic(() => import('./components/ImageCompressor')),
  'image-resizer': dynamic(() => import('./components/ImageResizer')),
  'background-remover': dynamic(() => import('./components/BackgroundRemover')),
  'mock-data': dynamic(() => import('./components/MockDataGenerator')),
  'social-preview': dynamic(() => import('./components/SocialPreview')),
  'api-templates': dynamic(() => import('./components/ApiTemplates')),
  'collab': dynamic(() => import('./components/Collab')),
};

export default function ToolsDetailView({ item }: { item: ToolItem }) {
  const Component = componentMap[item.slug];

  if (!Component) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-[var(--text-primary)]">
        <h1 className="text-2xl font-bold mb-4">Tool Not Found</h1>
        <p className="text-[var(--text-secondary)]">The tool component for "{item.name}" could not be loaded.</p>
      </div>
    );
  }

  // The DetailView for tools simply delegates completely to the standalone React Component.
  // This is because tools are interactive full-page experiences, unlike data catalogs.
  return <Component />;
}
