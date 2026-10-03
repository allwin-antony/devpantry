import { MetadataRoute } from 'next';

export async function generateSitemaps() {
  return [
    { id: 'core' },
    { id: 'tools' },
    { id: 'fonts' },
    { id: 'icons' },
    { id: 'templates' },
    { id: 'guides' },
  ];
}

export default async function sitemap(props: { id: Promise<string> }): Promise<MetadataRoute.Sitemap> {
  const id = await props.id;
  const baseUrl = 'https://devpantry.com';
  const staticDate = new Date('2026-09-20');

  if (id === 'core') {
    return [
      { url: baseUrl, lastModified: staticDate, changeFrequency: 'daily', priority: 1.0 },
      { url: `${baseUrl}/tools`, lastModified: staticDate, changeFrequency: 'weekly', priority: 0.95 },
      { url: `${baseUrl}/fonts`, lastModified: staticDate, changeFrequency: 'weekly', priority: 0.95 },
      { url: `${baseUrl}/icons`, lastModified: staticDate, changeFrequency: 'weekly', priority: 0.95 },
      { url: `${baseUrl}/guides`, lastModified: staticDate, changeFrequency: 'daily', priority: 0.95 },
      { url: `${baseUrl}/about`, lastModified: staticDate, changeFrequency: 'monthly', priority: 0.7 },
      { url: `${baseUrl}/privacy`, lastModified: staticDate, changeFrequency: 'monthly', priority: 0.3 },
      { url: `${baseUrl}/security`, lastModified: staticDate, changeFrequency: 'monthly', priority: 0.3 },
      { url: `${baseUrl}/feedback`, lastModified: staticDate, changeFrequency: 'monthly', priority: 0.6 },
    ];
  }

  if (id === 'guides') {
    const { GUIDES_DATA } = await import('@/lib/guidesData');
    return GUIDES_DATA.map((g) => ({
      url: `${baseUrl}/guides/${g.slug}`,
      lastModified: staticDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));
  }

  if (id === 'tools') {
    const { moduleRegistry } = await import('@/lib/moduleRegistry');
    const toolsModule = moduleRegistry.find(m => m.type === 'tools');
    if (!toolsModule) return [];

    const allTools = await toolsModule.loader.listAll();
    return allTools.map((t: any) => ({
      url: `${baseUrl}/tools/${t.slug}`,
      lastModified: staticDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));
  }

  if (id === 'fonts') {
    const { moduleRegistry } = await import('@/lib/moduleRegistry');
    const fontsModule = moduleRegistry.find(m => m.type === 'fonts');
    if (!fontsModule) return [];

    const allFonts = await fontsModule.loader.listAll();
    const { isFontIndexable } = await import('@/lib/loaders/fontLoader');
    
    const indexableFonts = allFonts.filter((f: any) => isFontIndexable(f));

    return indexableFonts.map((f: any) => ({
      url: `${baseUrl}/fonts/${f.slug}`,
      lastModified: staticDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    }));
  }

  if (id === 'icons') {
    const { moduleRegistry } = await import('@/lib/moduleRegistry');
    const iconsModule = moduleRegistry.find(m => m.type === 'icons');
    if (!iconsModule) return [];

    const allIcons = await iconsModule.loader.listAll();
    const { isIconIndexable } = await import('@/lib/loaders/iconLoader');

    const indexableIcons = allIcons.filter((i: any) => isIconIndexable(i));

    return indexableIcons.map((i: any) => ({
      url: `${baseUrl}/icons/${i.slug}`,
      lastModified: staticDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    }));
  }

  if (id === 'templates') {
    return [
      {
        url: `${baseUrl}/tools/api-templates`,
        lastModified: staticDate,
        changeFrequency: 'weekly',
        priority: 0.9,
      }
    ];
  }

  return [];
}
