'use client';

import { useEffect, useMemo, useRef, useState, type ComponentType } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Braces, FileText, Flame, Globe, HardDrive, Image, ImageMinus, Key, Layers, Maximize2, Radio, Scissors, Search, Settings, Share2, Sparkles, Type, Users, Wrench, X, Blocks } from 'lucide-react';
import { getAllToolsForDisplay } from '@/lib/loaders/toolLoader';

const icons: Record<string, ComponentType<{ className?: string }>> = { Box, Braces, FileText, Flame, Globe, HardDrive, Image, ImageMinus, Key, Layers, Maximize: Maximize2, Radio, Scissors, Settings, Share2, Sparkles, Type, Users, Wrench, Blocks };
const items = [
  ...[...getAllToolsForDisplay()].sort((a, b) => Number(!!b.featured) - Number(!!a.featured)).map(tool => ({
    id: tool.slug, title: tool.name, description: tool.description, category: tool.category, href: `/tools/${tool.slug}`, icon: icons[tool.icon] || Wrench,
  })),
  { id: 'all-tools', title: 'All developer tools', description: 'Browse and filter every tool and workflow.', category: 'Tools', href: '/tools', icon: Wrench },
  { id: 'fonts', title: 'Free fonts studio', description: 'Preview fonts, compare weights, and copy CSS.', category: 'Design', href: '/fonts', icon: Type },
  { id: 'icons', title: 'SVG icons studio', description: 'Find icons and copy SVG or framework code.', category: 'Design', href: '/icons', icon: Box },
  ...['Inter', 'JetBrains Mono', 'Fira Code', 'Satoshi', 'Clash Display', 'Outfit'].map(name => ({ id: `font-${name}`, title: name, description: 'Open the live font preview and installation guide.', category: 'Fonts', href: `/fonts/${name.toLowerCase().replaceAll(' ', '-')}`, icon: Type })),
  ...[{ slug: 'lucide', name: 'Lucide' }, { slug: 'tabler', name: 'Tabler' }, { slug: 'heroicons', name: 'Heroicons' }, { slug: 'ph', name: 'Phosphor' }].map(icon => ({ id: `icon-${icon.slug}`, title: `${icon.name} icons`, description: 'Search and customize this icon collection.', category: 'Icons', href: `/icons/${icon.slug}`, icon: Box })),
  ...[{ slug: 'stripe-billing', name: 'Stripe billing' }, { slug: 'supabase-auth', name: 'Supabase auth' }, { slug: 'google-sso', name: 'Google SSO' }, { slug: 'github-oauth', name: 'GitHub OAuth' }].map(api => ({ id: `api-${api.slug}`, title: `${api.name} fixtures`, description: 'Inspect an API response template for testing.', category: 'API fixtures', href: `/tools/api-templates?template=${api.slug}`, icon: Radio })),
];

function CommandPaletteModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const results = useRef<HTMLDivElement>(null);
  const filtered = useMemo(() => {
    const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const titleScore = (title: string) => words.filter(word => title.toLowerCase().includes(word)).length;
    return items
      .filter(item => words.every(word => `${item.title} ${item.description} ${item.category} ${item.href}`.toLowerCase().includes(word)))
      .sort((a, b) => titleScore(b.title) - titleScore(a.title));
  }, [query]);

  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    input.current?.focus();
    return () => element?.close();
  }, []);

  useEffect(() => {
    results.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [selected]);

  const open = (href: string) => { router.push(href); onClose(); };

  return (
    <dialog ref={dialog} aria-labelledby="command-palette-title" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }} className="fixed m-auto w-[calc(100%-2rem)] max-w-2xl max-h-[80dvh] rounded-2xl border border-[var(--border-dev)] p-0 bg-[var(--bg-panel)] text-[var(--text-primary)] shadow-2xl backdrop:bg-black/60">
      <div className="flex flex-col max-h-[80dvh]">
        <h2 id="command-palette-title" className="sr-only">Search DevPantry tools and resources</h2>
        <div className="flex items-center gap-3 p-4 border-b border-[var(--border-dev)]">
          <Search className="w-5 h-5 shrink-0 text-[var(--accent-blue)]" />
          <input ref={input} role="combobox" aria-label="Search tools and resources" aria-expanded="true" aria-controls="command-results" aria-autocomplete="list" aria-activedescendant={filtered.length ? `command-result-${selected}` : undefined} value={query} onChange={event => { setQuery(event.target.value); setSelected(0); }} onKeyDown={event => {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
              event.preventDefault();
              setSelected(index => (index + (event.key === 'ArrowDown' ? 1 : -1) + Math.max(filtered.length, 1)) % Math.max(filtered.length, 1));
            }
            if (event.key === 'Enter' && filtered[selected]) { event.preventDefault(); open(filtered[selected].href); }
          }} placeholder="Search JWT, JSON, fonts, PDF…" className="min-w-0 w-full bg-transparent outline-none text-base" />
          <button onClick={onClose} aria-label="Close search" className="p-3 shrink-0 rounded-lg hover:bg-[var(--pill-bg)]"><X className="w-5 h-5" /></button>
        </div>
        <div ref={results} id="command-results" role="listbox" aria-label="Search results" className="overflow-y-auto p-2 min-h-0">
          {filtered.map((item, index) => {
            const Icon = item.icon;
            return <button key={item.id} id={`command-result-${index}`} role="option" aria-selected={index === selected} onMouseEnter={() => setSelected(index)} onClick={() => open(item.href)} className={`flex items-start text-left gap-3 w-full rounded-lg p-3 ${index === selected ? 'bg-blue-500/10' : 'hover:bg-[var(--pill-bg)]'}`}><Icon className="w-5 h-5 mt-1 text-[var(--accent-blue)] shrink-0" /><span className="min-w-0"><span className="block font-semibold text-sm">{item.title} <span className="font-normal text-xs text-[var(--text-muted)]">· {item.category}</span></span><span className="block text-xs text-[var(--text-secondary)] mt-1">{item.description}</span></span></button>;
          })}
          {!filtered.length && <p className="p-6 text-center text-sm text-[var(--text-secondary)]">No matches. Try a task such as “convert JSON” or “compress image”.</p>}
        </div>
        <p className="p-3 border-t border-[var(--border-dev)] text-xs text-[var(--text-muted)]">↑ ↓ to choose · Enter to open · Escape to close</p>
      </div>
    </dialog>
  );
}

export function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return isOpen ? <CommandPaletteModal onClose={onClose} /> : null;
}
