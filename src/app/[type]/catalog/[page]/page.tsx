import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCatalogPage, getCatalogPageCount, isCatalogType } from '@/lib/catalogPages';

type Props = { params: Promise<{ type: string; page: string }> };

export function generateStaticParams() {
  return (['fonts', 'icons'] as const).flatMap(type =>
    Array.from({ length: getCatalogPageCount(type) }, (_, index) => ({ type, page: String(index + 1) })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type, page } = await params;
  if (!isCatalogType(type) || !getCatalogPage(type, Number(page))) notFound();
  const title = `${type === 'fonts' ? 'Free Font' : 'SVG Icon Library'} Directory — Page ${page}`;
  const description = type === 'fonts'
    ? 'Browse font families alphabetically, check available weights and licenses, and open live previews with CSS installation code.'
    : 'Browse SVG icon libraries alphabetically, compare collection sizes and licenses, and open the icon customizer.';
  const url = `https://devpantry.com/${type}/catalog/${page}`;
  return { title, description, alternates: { canonical: url }, openGraph: { title, description, url }, twitter: { card: 'summary_large_image', title, description } };
}

export default async function CatalogPage({ params }: Props) {
  const { type, page: pageParam } = await params;
  if (!isCatalogType(type)) notFound();
  const page = Number(pageParam);
  const result = getCatalogPage(type, page);
  if (!result) notFound();
  const label = type === 'fonts' ? 'font families' : 'icon libraries';

  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
      <Link href={`/${type}`} className="text-sm text-[var(--accent-blue)] hover:underline">← Back to the {type} studio</Link>
      <h1 className="mt-5 text-3xl font-bold">{type === 'fonts' ? 'Free font' : 'SVG icon library'} directory</h1>
      <p className="mt-3 text-[var(--text-secondary)]">Browse {result.total.toLocaleString('en-US')} {label} alphabetically. Open a family to preview it and get integration code. Page {page} of {result.pageCount}.</p>
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 my-8">
        {result.entries.map(entry => (
          <li key={entry.slug}>
            <Link href={`/${type}/${entry.slug}`} prefetch={false} className="block h-full rounded-xl border border-[var(--border-dev)] bg-[var(--bg-panel)] p-4 hover:border-[var(--accent-blue)]">
              <span className="font-semibold break-words">{entry.name}</span>
              <span className="block text-sm text-[var(--text-secondary)] mt-2">{entry.description}</span>
            </Link>
          </li>
        ))}
      </ul>
      <nav aria-label={`${type} directory pages`} className="flex flex-wrap items-center gap-2">
        {page > 1 && <Link href={`/${type}/catalog/${page - 1}`} className="p-3 text-[var(--accent-blue)]">← Previous</Link>}
        {Array.from({ length: result.pageCount }, (_, index) => index + 1).map(number => (
          <Link key={number} href={`/${type}/catalog/${number}`} prefetch={false} aria-current={number === page ? 'page' : undefined} className={`min-w-11 p-3 text-center rounded-lg border border-[var(--border-dev)] ${number === page ? 'bg-[var(--accent-blue)] text-white' : 'bg-[var(--bg-panel)]'}`}>
            {number}
          </Link>
        ))}
        {page < result.pageCount && <Link href={`/${type}/catalog/${page + 1}`} className="p-3 text-[var(--accent-blue)]">Next →</Link>}
      </nav>
    </div>
  );
}
