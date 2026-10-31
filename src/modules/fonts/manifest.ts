import { ModuleManifest } from '@/lib/moduleRegistry';
import { loader } from './loader';
import FontsListView from './ListView';
import FontsDetailView from './DetailView';
import { isFontIndexable } from '@/lib/loaders/fontLoader';

export const fontsManifest: ModuleManifest = {
  type: 'fonts',
  label: 'Fonts',
  route: '/fonts',
  navSection: 'core',
  metadata: {
    title: 'Free Fonts — Live Previews, CSS & Font Pairings',
    description: 'Find a font for your next interface. Compare 2,100+ free typefaces, test supported weights, check licenses, and copy CSS or available npm installation code.',
  },
  generateMetadata: (font: any) => {
    const indexable = isFontIndexable(font);
    return {
      title: `${font.name} Font — Preview, CSS & ${font.category} Pairings`,
      description: `Preview ${font.name} by ${font.designers.join(', ')}. Compare supported weights, check its ${font.license_type} license, and get CSS and Tailwind integration code.`,
      openGraph: {
        title: `${font.name} Font — Preview & Integration | DevPantry`,
        description: `Live interactive tester, weight specimens, and copy-paste code snippets for ${font.name}.`,
        url: `https://devpantry.com/fonts/${font.slug}`,
      },
      twitter: {
        card: 'summary_large_image',
        title: `${font.name} Font — Preview & Integration`,
        description: `Test ${font.name}, compare weights, and copy CSS for your project.`,
      },
      alternates: {
        canonical: `https://devpantry.com/fonts/${font.slug}`,
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
    list: FontsListView,
    detail: FontsDetailView,
  }
};
