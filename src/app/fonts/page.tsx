import type { Metadata } from 'next';
import { FontsClient } from '@/components/clients/FontsClient';

export const metadata: Metadata = {
  title: 'Open Source Fonts Studio & Typography Playground',
  description: 'Explore, test, and integrate 2,180+ open-source typefaces from Fontshare, Fontsource, and GitHub. Live interactive type tester with size, weight, and tracking sliders, plus one-click CSS and npm snippets.',
  keywords: [
    'open source fonts',
    'free commercial fonts',
    'fontshare fonts',
    'sil ofl fonts',
    'typography playground',
    'web font tester',
    'satoshi font',
    'clash display font',
    'jetbrains mono font',
    'fira code font',
    'tailwind font family generator'
  ],
  openGraph: {
    title: 'Open Source Fonts Studio & Typography Playground | DevPantry',
    description: 'Explore, test, and integrate 2,180+ open-source typefaces with live typing playground, weight controls, and CSS @import snippets.',
  }
};

export default function FontsPage() {
  return <FontsClient />;
}
