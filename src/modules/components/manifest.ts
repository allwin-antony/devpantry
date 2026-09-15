import type { ModuleManifest } from '@/lib/moduleRegistry';
import { getAllComponents, getComponentBySlug } from '@/lib/loaders/componentLoader';
import ComponentsListView from './ListView';
import ComponentsDetailView from './DetailView';

const componentsManifest: ModuleManifest = {
  type: 'components',
  label: 'UI Components',
  route: '/components',
  navSection: 'catalog',
  metadata: {
    title: 'Open-Source UI Components & Libraries',
    description: 'Explore verified 100% open-source, commercially safe UI components, modern framework libraries, and visual design kits.',
  },
  generateMetadata: (item: any) => ({
    title: `${item.name} — Free Open Source UI Component`,
    description: item.description,
    openGraph: {
      title: `${item.name} | DevPantry`,
      description: item.description,
    },
    alternates: {
      canonical: `https://devpantry.com/components/${item.slug}`,
    },
  }),
  loader: {
    listAll: getAllComponents,
    getBySlug: getComponentBySlug,
  },
  renderers: {
    list: ComponentsListView,
    detail: ComponentsDetailView,
  },
};

export default componentsManifest;
