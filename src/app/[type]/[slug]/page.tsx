import { notFound } from 'next/navigation';
import { moduleRegistry } from '@/lib/moduleRegistry';
import type { Metadata, ResolvingMetadata } from 'next';
import React from 'react';

interface PageProps {
  params: Promise<{ type: string; slug: string }>;
}

export async function generateStaticParams() {
  const params: { type: string; slug: string }[] = [];
  
  for (const manifest of moduleRegistry) {
    if (manifest.renderers.detail && manifest.loader.getBySlug) {
      const items = await manifest.loader.listAll();
      for (const item of items) {
        params.push({ type: manifest.type, slug: item.slug });
      }
    }
  }
  
  return params;
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { type, slug } = await params;
  const manifest = moduleRegistry.find(m => m.type === type);
  
  if (!manifest || !manifest.loader.getBySlug) {
    return { title: 'Not Found | DevPantry' };
  }

  const item = await manifest.loader.getBySlug(slug);
  
  if (!item) {
    return { title: 'Not Found | DevPantry' };
  }

  if (manifest.generateMetadata) {
    return manifest.generateMetadata(item);
  }

  return {
    title: `${item.name || item.slug} | DevPantry`,
  };
}

export default async function GenericModuleDetailPage({ params }: PageProps) {
  const { type, slug } = await params;
  const manifest = moduleRegistry.find(m => m.type === type);

  if (!manifest || !manifest.loader.getBySlug || !manifest.renderers.detail) {
    notFound();
  }

  const item = await manifest.loader.getBySlug(slug);
  
  if (!item) {
    notFound();
  }

  const DetailView = manifest.renderers.detail;

  return <DetailView item={item} />;
}
