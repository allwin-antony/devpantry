import { getAllFonts, getFontBySlug } from '@/lib/loaders/fontLoader';
import { Summary, Detail } from '@/lib/moduleRegistry';

export const loader = {
  listAll: (): Summary[] => {
    return getAllFonts().map(font => ({
      ...font,
      slug: font.slug,
    }));
  },
  getBySlug: (slug: string): Detail | null => {
    const font = getFontBySlug(slug);
    if (!font) return null;
    return {
      ...font,
      slug: font.slug,
    };
  }
};
