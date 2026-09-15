import { ModuleManifest } from '@/lib/moduleRegistry';
import { loader } from './loader';
import FontsListView from './ListView';
import FontsDetailView from './DetailView';

export const fontsManifest: ModuleManifest = {
  type: 'fonts',
  label: 'Fonts',
  route: '/fonts',
  navSection: 'core',
  metadata: {
    title: '2,180+ Free Open Source Fonts — Preview, Test & Get Code',
    description: 'Explore, test, and integrate 2,180+ open-source typefaces from Fontshare, Fontsource, and GitHub. Live interactive type tester with size, weight, and tracking sliders, plus one-click CSS and npm snippets.',
  },
  generateMetadata: (font: any) => ({
    title: `${font.name} Font — Free Open Source ${font.category} Typography`,
    description: `Test, preview, and download ${font.name}, a free ${font.category} font by ${font.designers.join(', ')} (${font.publisher}). Includes CSS @import, HTML link, Tailwind config, and npm install snippet.`,
    openGraph: {
      title: `${font.name} Font — Free Open-Source Typography | DevPantry`,
      description: `Live interactive tester, weight specimens, and copy-paste code snippets for ${font.name}.`,
    },
    alternates: {
      canonical: `https://devpantry.com/fonts/${font.slug}`,
    },
  }),
  loader,
  renderers: {
    list: FontsListView,
    detail: FontsDetailView,
  }
};
