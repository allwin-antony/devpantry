import { notFound } from 'next/navigation';
import { moduleRegistry } from '@/lib/moduleRegistry';
import type { Metadata, ResolvingMetadata } from 'next';
import React from 'react';
import { getAllToolsForDisplay } from '@/lib/loaders/toolLoader';

interface PageProps {
  params: Promise<{ type: string }>;
}

export async function generateStaticParams() {
  return moduleRegistry.map(m => ({ type: m.type }));
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { type } = await params;
  const manifest = moduleRegistry.find(m => m.type === type);
  
  if (!manifest || !manifest.metadata) {
    return {
      title: 'Not Found | DevPantry',
    };
  }

  return {
    title: manifest.metadata.title,
    description: manifest.metadata.description,
    openGraph: {
      title: manifest.metadata.title,
      description: manifest.metadata.description,
      url: `https://devpantry.com/${type}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: manifest.metadata.title,
      description: manifest.metadata.description,
    },
    alternates: {
      canonical: `https://devpantry.com/${manifest.route.replace(/^\//, '')}`,
    },
  };
}

export default async function GenericModulePage({ params }: PageProps) {
  const { type } = await params;
  const manifest = moduleRegistry.find(m => m.type === type);

  if (!manifest) {
    notFound();
  }

  const ListView = manifest.renderers.list;
  
  if (!ListView) {
    return <div className="p-4">This module does not have a list view.</div>;
  }

  const items = type === 'tools' ? getAllToolsForDisplay() : await manifest.loader.listAll();

  return <ListView items={items} />;
}
