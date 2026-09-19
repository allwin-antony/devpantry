'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Wrench } from 'lucide-react';
import type { ToolItem } from '@/lib/loaders/toolLoader';

export default function ToolsListView({ items }: { items: ToolItem[] }) {
  const [search, setSearch] = useState('');

  const filtered = items.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase()) || 
    i.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Developer Tools</h1>
          <p className="text-[var(--text-secondary)]">
            A collection of free utility applications for developers and designers.
          </p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-blue-500/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(tool => (
          <Link 
            key={tool.slug} 
            href={`/tools/${tool.slug}`}
            className="group flex flex-col bg-[var(--bg-panel)] rounded-xl border border-[var(--border-dev)] p-5 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-semibold tracking-wider uppercase text-[var(--text-muted)] px-2 py-1 bg-[var(--bg-sidebar)] rounded">
                {tool.category}
              </span>
            </div>

            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 group-hover:text-blue-500 transition-colors">
              {tool.name}
            </h3>
            
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {tool.description}
            </p>
          </Link>
        ))}
      </div>
      
      {filtered.length === 0 && (
        <div className="text-center py-12 text-[var(--text-muted)] border-2 border-dashed border-[var(--border-dev)] rounded-xl">
          No tools found matching your search.
        </div>
      )}
    </div>
  );
}
