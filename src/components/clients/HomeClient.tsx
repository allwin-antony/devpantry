'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Braces, Check, Code2, FileText, Flame, Key, Search, ShieldCheck, Type, Wrench, X } from 'lucide-react';
import { getAllToolsForDisplay } from '@/lib/loaders/toolLoader';
import { triggerFeedbackNudge } from '@/lib/feedbackNudge';

const tools = getAllToolsForDisplay();
const featuredSlugs = ['jwt-decoder', 'mock-data', 'json-to-ts-zod'];
const featuredIcons = { 'jwt-decoder': Key, 'mock-data': Flame, 'json-to-ts-zod': Braces };
const previewFonts = [
  { name: 'Inter', slug: 'inter', category: 'Sans serif', family: "'Inter', sans-serif", cdn: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap' },
  { name: 'JetBrains Mono', slug: 'jetbrains-mono', category: 'Monospace', family: "'JetBrains Mono', monospace", cdn: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap' },
  { name: 'Playfair Display', slug: 'playfair-display', category: 'Serif', family: "'Playfair Display', serif", cdn: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap' },
];

export function HomeClient() {
  const [query, setQuery] = useState('');
  const [sample, setSample] = useState('Build something reliable.');
  const [copied, setCopied] = useState<string | null>(null);
  const [copyError, setCopyError] = useState(false);
  const fontPreview = useRef<HTMLElement>(null);
  const matchingTools = useMemo(() => {
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return featuredSlugs.map(slug => tools.find(tool => tool.slug === slug)!);
    const titleScore = (name: string) => words.filter(word => name.toLowerCase().includes(word)).length;
    return tools
      .filter(tool => words.every(word => `${tool.name} ${tool.slug} ${tool.description} ${tool.category}`.toLowerCase().includes(word)))
      .sort((a, b) => titleScore(b.name) - titleScore(a.name));
  }, [query]);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      previewFonts.forEach(font => {
        if (document.querySelector(`link[href="${font.cdn}"]`)) return;
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = font.cdn;
        document.head.appendChild(link);
      });
      observer.disconnect();
    }, { rootMargin: '100px' });
    if (fontPreview.current) observer.observe(fontPreview.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(null), 1800);
    return () => clearTimeout(timer);
  }, [copied]);

  const copyFont = async (font: typeof previewFonts[number]) => {
    try {
      await navigator.clipboard.writeText(`@import url('${font.cdn}');\n\nfont-family: ${font.family};`);
      setCopied(font.slug);
      setCopyError(false);
      triggerFeedbackNudge('font-css-copy');
    } catch {
      setCopyError(true);
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
      <section aria-labelledby="home-title" className="max-w-3xl mx-auto text-center">
        <p className="text-sm font-semibold text-[var(--accent-blue)] mb-3">Made for frontend developers</p>
        <h1 id="home-title" className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">Free browser tools for building and testing web apps.</h1>
        <p className="mt-4 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">Inspect JWTs, generate edge-case test data, and turn JSON into TypeScript and Zod. Your tool inputs are processed on your device.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-[var(--text-secondary)]">
          <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500" /> No account required</span>
          <a href="https://github.com/allwin-antony/devpantry" className="inline-flex items-center gap-1.5 hover:underline"><Code2 className="w-4 h-4" /> Open-source tools</a>
        </div>
      </section>

      <section aria-labelledby="find-tool-title" className="mt-7 sm:mt-9">
        <h2 id="find-tool-title" className="sr-only">Find a developer tool</h2>
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
          <input type="search" aria-label="Find a tool" aria-controls="tool-results" value={query} onChange={event => setQuery(event.target.value)} placeholder="Find a tool: JWT, JSON, mock data, PDF…" className="w-full rounded-xl border border-[var(--border-dev)] bg-[var(--bg-panel)] py-4 pl-12 pr-12 text-base outline-none focus:border-[var(--accent-blue)] focus:ring-2 focus:ring-blue-500/20" />
          {query && <button onClick={() => setQuery('')} aria-label="Clear tool search" className="absolute right-2 top-1/2 -translate-y-1/2 p-3"><X className="w-4 h-4" /></button>}
        </div>
        <div className="flex items-center justify-between gap-3 mt-7 mb-3">
          <h2 className="font-semibold" aria-live="polite">{query.trim() ? `${matchingTools.length} matching tools` : 'Start with a development task'}</h2>
          <Link href="/tools" className="text-sm text-[var(--accent-blue)] hover:underline shrink-0">All tools →</Link>
        </div>
        <div id="tool-results" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {matchingTools.map(tool => {
            const Icon = featuredIcons[tool.slug as keyof typeof featuredIcons] || Wrench;
            return (
              <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group flex flex-col rounded-xl border border-[var(--border-dev)] bg-[var(--bg-panel)] p-5 hover:border-[var(--accent-blue)] transition-colors">
                <Icon className="w-6 h-6 text-[var(--accent-blue)] mb-3" />
                <h3 className="font-bold text-lg">{tool.name}</h3>
                <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed flex-1">{tool.description}</p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-blue)] mt-4">Open tool <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
              </Link>
            );
          })}
        </div>
        {!matchingTools.length && <p className="p-6 text-center text-[var(--text-secondary)]">Try a task such as “compress image” or “convert JSON”, or <Link href="/tools" className="text-[var(--accent-blue)] underline">browse every tool</Link>.</p>}
      </section>

      <section aria-labelledby="assets-title" className="mt-10">
        <h2 id="assets-title" className="text-xl font-bold">Prepare the assets for your interface</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          {[
            { href: '/fonts', title: 'Find a font', text: 'Live previews, weights & CSS' },
            { href: '/icons', title: 'Find an SVG icon', text: 'Search, customize & copy' },
            { href: '/tools/image-compressor', title: 'Compress an image', text: 'Target a KB budget' },
            { href: '/tools/background-remover', title: 'Remove a background', text: 'On-device AI processing' },
          ].map(item => <Link key={item.href} href={item.href} className="rounded-xl border border-[var(--border-dev)] p-4 bg-[var(--bg-panel)] hover:border-[var(--accent-blue)]"><h3 className="font-semibold">{item.title}</h3><p className="text-sm text-[var(--text-secondary)] mt-2">{item.text}</p></Link>)}
        </div>
      </section>

      <section ref={fontPreview} aria-labelledby="font-preview-title" className="mt-10 rounded-xl border border-[var(--border-dev)] bg-[var(--bg-panel)] p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="font-preview-title" className="text-xl font-bold flex items-center gap-2"><Type className="w-5 h-5" /> Try a font on your own text</h2>
          <Link href="/fonts" className="text-sm text-[var(--accent-blue)] hover:underline">Open font studio →</Link>
        </div>
        <label htmlFor="font-preview-text" className="block text-sm mt-4 mb-2">Preview text</label>
        <input id="font-preview-text" value={sample} onChange={event => setSample(event.target.value)} className="w-full rounded-lg p-3 border border-[var(--border-dev)] bg-[var(--bg-app)]" />
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          {previewFonts.map(font => <div key={font.slug} className="rounded-lg border border-[var(--border-dev)] p-4 min-w-0">
            <Link href={`/fonts/${font.slug}`} className="text-sm font-semibold hover:underline">{font.name}</Link>
            <p className="text-xs text-[var(--text-muted)] mt-1">{font.category}</p>
            <p className="text-2xl my-4 break-words" style={{ fontFamily: font.family }}>{sample || 'Aa'}</p>
            <button onClick={() => copyFont(font)} className="text-sm text-[var(--accent-blue)] inline-flex items-center gap-1.5 py-2">{copied === font.slug ? <Check className="w-4 h-4" /> : <Code2 className="w-4 h-4" />}{copied === font.slug ? 'Copied' : 'Copy CSS'}</button>
          </div>)}
        </div>
        {copyError && <p role="status" className="text-sm mt-3 text-[var(--text-secondary)]">Clipboard access was unavailable. Open the font page to select and copy its installation code.</p>}
        <div className="flex flex-wrap gap-x-6 gap-y-3 mt-5 text-sm text-[var(--accent-blue)]"><Link href="/fonts/catalog/1" className="hover:underline">Browse all font families →</Link><Link href="/icons/catalog/1" className="hover:underline">Browse all icon libraries →</Link></div>
      </section>

      <section aria-labelledby="workflow-title" className="mt-10">
        <h2 id="workflow-title" className="text-xl font-bold">Useful workflows, from input to output</h2>
        <div className="grid md:grid-cols-3 gap-5 mt-4 text-sm leading-relaxed">
          <div><h3 className="font-semibold">Test an API integration</h3><p className="text-[var(--text-secondary)] mt-2">Start with an <Link href="/tools/api-templates" className="text-[var(--accent-blue)] underline">API response fixture</Link>, generate a schema, then use messy mock records to exercise validation and error states.</p></div>
          <div><h3 className="font-semibold">Prepare an image for the web</h3><p className="text-[var(--text-secondary)] mt-2">Resize to your layout, <Link href="/tools/png-to-webp" className="text-[var(--accent-blue)] underline">convert to WebP</Link>, and inspect the final file size before downloading.</p></div>
          <div><h3 className="font-semibold">Share a document</h3><p className="text-[var(--text-secondary)] mt-2">Combine images with the <Link href="/tools/image-to-pdf" className="text-[var(--accent-blue)] underline">image-to-PDF converter</Link>, or merge existing PDFs locally.</p></div>
        </div>
      </section>

      <section className="mt-10 flex flex-col sm:flex-row gap-4 justify-between rounded-xl border border-[var(--border-dev)] p-5">
        <div><h2 className="font-semibold flex items-center gap-2"><FileText className="w-5 h-5" /> Understand how the tools work</h2><p className="text-sm text-[var(--text-secondary)] mt-2">Read the implementation guides, inspect the source, and see which features use a network connection.</p></div>
        <div className="flex items-center gap-5 text-sm shrink-0 text-[var(--accent-blue)]"><Link href="/guides" className="hover:underline">Read guides</Link><Link href="/privacy" className="hover:underline">Privacy details</Link></div>
      </section>
    </div>
  );
}
