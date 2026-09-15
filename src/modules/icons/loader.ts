import { getAllIconCollections, getIconCollectionByPrefix } from '@/lib/loaders/iconLoader';
import { Summary, Detail } from '@/lib/moduleRegistry';

export const loader = {
  listAll: (): Summary[] => {
    return getAllIconCollections().map(c => ({
      ...c,
      slug: c.prefix,
    }));
  },
  getBySlug: (slug: string): Detail | null => {
    const collection = getIconCollectionByPrefix(slug);
    if (!collection) return null;
    return {
      ...collection,
      slug: collection.prefix,
    };
  }
};
