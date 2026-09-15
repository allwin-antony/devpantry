'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ExternalLink, Package, Code } from 'lucide-react';
import type { UIComponent } from '@/lib/loaders/componentLoader';

export default function ComponentsListView({ items }: { items: UIComponent[] }) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'library' | 'component'>('all');

  const filtered = useMemo(() => {
    let res = items;
    if (filterType !== 'all') {
      res = res.filter(i => i.type === filterType);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      res = res.filter(i => 
        i.name.toLowerCase().includes(q) || 
        i.slug.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        (i.frameworks && i.frameworks.some((f: string) => f.toLowerCase().includes(q)))
      );
    }
    return res;
  }, [items, search, filterType]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Open-Source UI Components</h1>
        <p className="text-[var(--text-secondary)] mb-6">
          Explore {items.length.toLocaleString()} framework libraries, Figma kits, and offline-ready code snippets.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center bg-[var(--bg-panel)] p-4 rounded-xl border border-[var(--border-dev)]">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search components or libraries (e.g. 'shadcn', 'modal')..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[var(--bg-app)] border border-[var(--border-dev)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-rose-500/50"
            />
          </div>

          <div className="flex bg-[var(--bg-app)] rounded-lg p-1 border border-[var(--border-dev)]">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${filterType === 'all' ? 'bg-rose-500 text-white shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('library')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${filterType === 'library' ? 'bg-rose-500 text-white shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            >
              Libraries
            </button>
            <button
              onClick={() => setFilterType('component')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${filterType === 'component' ? 'bg-rose-500 text-white shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            >
              Components
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(comp => (
          <Link 
            key={comp.slug} 
            href={`/components/${comp.slug}`}
            className="group flex flex-col bg-[var(--bg-panel)] rounded-xl border border-[var(--border-dev)] p-5 hover:border-rose-500/50 hover:shadow-lg hover:shadow-rose-500/5 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2 text-rose-500 bg-rose-500/10 px-2 py-1 rounded text-xs font-semibold">
                {comp.type === 'library' ? <Package className="w-3 h-3" /> : <Code className="w-3 h-3" />}
                <span className="capitalize">{comp.type}</span>
              </div>
              {comp.license && (
                <span className="text-[10px] bg-[var(--bg-sidebar)] text-[var(--text-muted)] px-2 py-1 rounded font-mono">
                  {comp.license}
                </span>
              )}
            </div>

            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1 group-hover:text-rose-500 transition-colors line-clamp-1">
              {comp.name}
            </h3>
            
            <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-4 flex-1">
              {comp.description}
            </p>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--border-dev)]/50">
              <div className="flex flex-wrap gap-1.5">
                {comp.frameworks?.slice(0, 3).map((f: string) => (
                  <span key={f} className="text-[10px] bg-[var(--pill-bg)] border border-[var(--border-dev)] px-1.5 py-0.5 rounded text-[var(--text-secondary)]">
                    {f}
                  </span>
                ))}
                {comp.frameworks && comp.frameworks.length > 3 && (
                  <span className="text-[10px] text-[var(--text-muted)]">+{comp.frameworks.length - 3}</span>
                )}
              </div>
              <ExternalLink className="w-4 h-4 text-[var(--text-muted)] group-hover:text-rose-500 transition-colors" />
            </div>
          </Link>
        ))}
      </div>
      
      {filtered.length === 0 && (
        <div className="text-center py-12 text-[var(--text-muted)] border-2 border-dashed border-[var(--border-dev)] rounded-xl">
          No components found matching your search.
        </div>
      )}
    </div>
  );
}
