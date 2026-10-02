'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search, Wrench, Sparkles, FileText, HardDrive, Maximize, Key, Globe, Share2,
  Flame, Layers, Radio, Users, Settings, Scissors, ArrowRight, X
} from 'lucide-react';
import type { ToolItem } from '@/lib/loaders/toolLoader';
import { TOOL_CATEGORIES } from '@/lib/loaders/toolLoader';

// Map string icon names to components
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles, FileText, HardDrive, Maximize, Key, Globe, Share2,
  Flame, Layers, Radio, Users, Settings, Scissors, Wrench,
};

function ToolIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICON_MAP[name] ?? Wrench;
  return <Icon className={className} />;
}

// Category accent colors
const CATEGORY_COLOR: Record<string, { pill: string; icon: string; border: string; activePill: string }> = {
  Developer: {
    pill: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
    icon: 'text-cyan-500',
    border: 'hover:border-cyan-500/50 hover:shadow-cyan-500/5',
    activePill: 'bg-cyan-500 text-white border-cyan-500',
  },
  Media: {
    pill: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    icon: 'text-rose-500',
    border: 'hover:border-rose-500/50 hover:shadow-rose-500/5',
    activePill: 'bg-rose-500 text-white border-rose-500',
  },
  Mocking: {
    pill: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
    icon: 'text-violet-500',
    border: 'hover:border-violet-500/50 hover:shadow-violet-500/5',
    activePill: 'bg-violet-500 text-white border-violet-500',
  },
  Collaboration: {
    pill: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    icon: 'text-emerald-500',
    border: 'hover:border-emerald-500/50 hover:shadow-emerald-500/5',
    activePill: 'bg-emerald-500 text-white border-emerald-500',
  },
};

function HeroToolCard({ tool }: { tool: ToolItem }) {
  const colors = CATEGORY_COLOR[tool.category];
  const href = tool.slug.includes('#')
    ? `/tools/${tool.slug.split('#')[0]}`
    : `/tools/${tool.slug}`;

  return (
    <Link
      href={href}
      className={`group relative flex flex-col bg-[var(--bg-panel)] rounded-2xl border border-[var(--border-dev)] p-7 overflow-hidden
        hover:-translate-y-1 hover:shadow-xl ${colors.border} transition-all duration-300`}
    >
      {/* Subtle watermark icon */}
      <div className="absolute top-0 right-0 p-6 opacity-[0.04] group-hover:opacity-[0.07] pointer-events-none transition-opacity duration-300">
        <ToolIcon name={tool.icon} className="w-28 h-28 text-[var(--text-primary)]" />
      </div>

      {/* Category + Badge row */}
      <div className="flex items-center gap-2 mb-5">
        <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded border ${colors.pill}`}>
          {tool.category}
        </span>
        {tool.badge && (
          <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded border border-[var(--border-dev)] bg-[var(--bg-sidebar)] text-[var(--text-muted)]">
            {tool.badge}
          </span>
        )}
      </div>

      <ToolIcon name={tool.icon} className={`w-8 h-8 mb-4 ${colors.icon} group-hover:scale-110 transition-transform duration-300`} />

      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-blue)] transition-colors leading-snug pr-8">
        {tool.name}
      </h3>

      {tool.heroTagline && (
        <p className="text-sm font-medium text-[var(--text-secondary)] mb-3 leading-relaxed">
          {tool.heroTagline}
        </p>
      )}

      <p className="text-sm text-[var(--text-muted)] leading-relaxed flex-grow">
        {tool.description}
      </p>

      <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)] group-hover:text-[var(--accent-blue)] transition-colors">
        <span>Open Tool</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
      </div>
    </Link>
  );
}

function ToolCard({ tool }: { tool: ToolItem }) {
  const colors = CATEGORY_COLOR[tool.category];
  const href = tool.slug.includes('#')
    ? `/tools/${tool.slug.split('#')[0]}`
    : `/tools/${tool.slug}`;

  return (
    <Link
      href={href}
      className={`group flex flex-col bg-[var(--bg-panel)] rounded-xl border border-[var(--border-dev)] p-5
        hover:-translate-y-0.5 hover:shadow-lg ${colors.border} transition-all duration-200`}
    >
      <div className="flex items-start justify-between mb-4 gap-2">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0
          bg-[var(--bg-sidebar)] border border-[var(--border-dev)]
          group-hover:scale-105 transition-transform duration-200`}
        >
          <ToolIcon name={tool.icon} className={`w-4.5 h-4.5 ${colors.icon}`} />
        </div>
        {tool.badge && (
          <span className={`text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded border ${colors.pill} shrink-0`}>
            {tool.badge}
          </span>
        )}
      </div>

      <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1.5 group-hover:text-[var(--accent-blue)] transition-colors leading-snug">
        {tool.name}
      </h3>

      <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2 flex-grow">
        {tool.description}
      </p>

      <div className="mt-4 flex items-center gap-1 text-[10px] font-semibold text-[var(--text-muted)] group-hover:text-[var(--accent-blue)] transition-colors">
        <span>Open</span>
        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </Link>
  );
}

type Category = 'All' | typeof TOOL_CATEGORIES[number];

export default function ToolsListView({ items }: { items: ToolItem[] }) {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [search, setSearch] = useState('');

  const heroTools = useMemo(() => items.filter(t => t.featured), [items]);

  const filteredNonHero = useMemo(() => {
    let pool = items.filter(t => !t.featured);
    if (activeCategory !== 'All') {
      pool = pool.filter(t => t.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      pool = pool.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.badge?.toLowerCase().includes(q)
      );
    }
    return pool;
  }, [items, activeCategory, search]);

  // Also filter hero tools when searching
  const filteredHero = useMemo(() => {
    if (!search.trim() && activeCategory === 'All') return heroTools;
    const q = search.toLowerCase();
    return heroTools.filter(t => {
      const matchesSearch = !search.trim() ||
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.badge?.toLowerCase().includes(q);
      const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [heroTools, search, activeCategory]);

  const allFiltered = [...filteredHero, ...filteredNonHero];
  const showHeroSection = filteredHero.length > 0 && search.trim() === '' && activeCategory === 'All';

  const countByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    TOOL_CATEGORIES.forEach(cat => {
      counts[cat] = items.filter(t => t.category === cat).length;
    });
    return counts;
  }, [items]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-bold text-rose-500 uppercase tracking-widest mb-3">
          <Wrench className="w-3.5 h-3.5" />
          <span>All Tools</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-1.5 leading-tight">
              Developer Tools & Utilities
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              {items.length} free tools — 100% client-side, zero uploads, zero tracking.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search tools…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-lg
                text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
                focus:outline-none focus:border-rose-500/50 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Category Filter Tabs ─────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 flex-wrap mb-8 pb-4 border-b border-[var(--border-dev)]">
        {(['All', ...TOOL_CATEGORIES] as Category[]).map(cat => {
          const isActive = activeCategory === cat;
          const count = cat === 'All' ? items.length : countByCategory[cat];
          const colors = cat !== 'All' ? CATEGORY_COLOR[cat] : null;

          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 cursor-pointer
                ${isActive
                  ? colors
                    ? `${colors.activePill} border-transparent shadow-sm`
                    : 'bg-[var(--text-primary)] text-[var(--bg-app)] border-transparent shadow-sm'
                  : 'bg-[var(--bg-panel)] border-[var(--border-dev)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)]'
                }`}
            >
              <span>{cat}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold
                ${isActive
                  ? 'bg-white/20 text-inherit'
                  : 'bg-[var(--bg-sidebar)] text-[var(--text-muted)]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Hero Tools Grid (only when no filter/search active) ───────────── */}
      {showHeroSection && (
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Featured</span>
            <div className="flex-1 h-px bg-[var(--border-dev)]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {heroTools.map(tool => (
              <HeroToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* ── All / Filtered Tools Grid ────────────────────────────────────── */}
      {(showHeroSection || (!showHeroSection && allFiltered.length > 0)) && (
        <section>
          {showHeroSection && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                All Tools
              </span>
              <div className="flex-1 h-px bg-[var(--border-dev)]" />
            </div>
          )}

          {!showHeroSection && allFiltered.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {allFiltered.map(tool => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          )}

          {showHeroSection && filteredNonHero.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredNonHero.map(tool => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── Empty State ──────────────────────────────────────────────────── */}
      {allFiltered.length === 0 && (
        <div className="text-center py-16 border-2 border-dashed border-[var(--border-dev)] rounded-2xl">
          <Search className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-3 opacity-40" />
          <p className="text-sm font-semibold text-[var(--text-muted)]">
            No tools found for &quot;{search}&quot;
          </p>
          <button
            onClick={() => { setSearch(''); setActiveCategory('All'); }}
            className="mt-3 text-xs text-rose-500 hover:underline cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
