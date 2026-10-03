import { ModuleManifest } from '@/lib/moduleRegistry';
import { loader } from './loader';
import IconsListView from './ListView';
import IconsDetailView from './DetailView';
import { isIconIndexable } from '@/lib/loaders/iconLoader';

export const iconsManifest: ModuleManifest = {
  type: 'icons',
  label: 'Icons',
  route: '/icons',
  navSection: 'core',
  metadata: {
    title: '353,000+ Free SVG Icons — Browse, Customize & Copy Code',
    description: 'Search, preview, and customize 353,000+ free svg icons from 238 open-source libraries. Interactive canvas to adjust stroke, size, and copy React, SVG, and Vue code.',
  },
  generateMetadata: (collection: any) => {
    const indexable = isIconIndexable(collection);
    return {
      title: `${collection.name} (${collection.total_icons.toLocaleString()} Icons) — Free Open Source SVGs`,
      description: `Browse, search, and copy ${collection.total_icons.toLocaleString()} free ${collection.license} vector icons from ${collection.name} by ${collection.author}. Includes live SVG customizer, React JSX, and Vue snippets.`,
      openGraph: {
        title: `${collection.name} (${collection.total_icons.toLocaleString()} Icons) | DevPantry`,
        description: `Live SVG customizer, React JSX generator, and searchable icon library for ${collection.name}.`,
      },
      alternates: {
        canonical: `https://devpantry.com/icons/${collection.prefix}`,
      },
      robots: indexable
        ? {
            index: true,
            follow: true,
            googleBot: {
              index: true,
              follow: true,
              'max-image-preview': 'large' as const,
              'max-snippet': -1,
            },
          }
        : { index: false, follow: true },
    };
  },
  loader,
  renderers: {
    list: IconsListView,
    detail: IconsDetailView,
  }
};
