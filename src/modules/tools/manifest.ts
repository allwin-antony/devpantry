import type { ModuleManifest } from '@/lib/moduleRegistry';
import { getAllTools, getToolBySlug } from '@/lib/loaders/toolLoader';
import ToolsListView from './ListView';
import ToolsDetailView from './DetailView';

const toolsManifest: ModuleManifest = {
  type: 'tools',
  label: 'Developer Tools',
  route: '/tools',
  navSection: 'catalog',
  metadata: {
    title: 'Developer Tools & Utilities',
    description: 'A suite of free online developer utilities: JWT decoders, image compressors, mock data generators, and more.',
  },
  generateMetadata: (item: any) => ({
    title: `${item.name} — DevPantry Tools`,
    description: item.description,
    openGraph: {
      title: `${item.name} | DevPantry`,
      description: item.description,
    },
    alternates: {
      canonical: `https://devpantry.com/tools/${item.slug}`,
    },
  }),
  loader: {
    listAll: getAllTools,
    getBySlug: getToolBySlug,
  },
  renderers: {
    list: ToolsListView,
    detail: ToolsDetailView,
  },
};

export default toolsManifest;
