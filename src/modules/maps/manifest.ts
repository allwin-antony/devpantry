import type { ModuleManifest } from '@/lib/moduleRegistry';
import { getAllMaps, getMapBySlug } from '@/lib/loaders/mapLoader';
import MapsListView from './ListView';
import MapsDetailView from './DetailView';

const mapsManifest: ModuleManifest = {
  type: 'maps',
  label: 'Maps & Geo-UI',
  route: '/maps',
  navSection: 'catalog',
  metadata: {
    title: 'Open-Source Maps & Geo-UI Plugins',
    description: 'Explore verified open-source, commercially safe map engines, framework wrappers, and geospatial plugins like MapLibre and Leaflet.',
  },
  generateMetadata: (item: any) => ({
    title: `${item.name} — Open-Source Map Component`,
    description: item.description,
    openGraph: {
      title: `${item.name} | DevPantry Maps`,
      description: item.description,
    },
    alternates: {
      canonical: `https://devpantry.com/maps/${item.slug}`,
    },
  }),
  loader: {
    listAll: getAllMaps,
    getBySlug: getMapBySlug,
  },
  renderers: {
    list: MapsListView,
    detail: MapsDetailView,
  },
};

export default mapsManifest;
