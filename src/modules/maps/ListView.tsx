'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Map, Layers, ExternalLink } from 'lucide-react';
import type { MapComponent } from '@/lib/loaders/mapLoader';

export default function MapsListView({ items }: { items: MapComponent[] }) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'engine' | 'plugin'>('all');

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
        i.description.toLowerCase().includes(q)
      );
    }
    return res;
  }, [items, search, filterType]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Open-Source Maps & Geo-UI</h1>
        <p className="text-[var(--text-secondary)] mb-6">
          Explore map engines, frameworks, and geospatial plugins like MapLibre and Leaflet.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center bg-[var(--bg-panel)] p-4 rounded-xl border border-[var(--border-dev)]">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search engines or plugins (e.g. 'leaflet', 'cluster')..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[var(--bg-app)] border border-[var(--border-dev)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div className="flex bg-[var(--bg-app)] rounded-lg p-1 border border-[var(--border-dev)]">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${filterType === 'all' ? 'bg-emerald-500 text-white shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('engine')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${filterType === 'engine' ? 'bg-emerald-500 text-white shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            >
              Engines
            </button>
            <button
              onClick={() => setFilterType('plugin')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${filterType === 'plugin' ? 'bg-emerald-500 text-white shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            >
              Plugins
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(mapItem => (
          <Link 
            key={mapItem.slug} 
            href={`/maps/${mapItem.slug}`}
            className="group flex flex-col bg-[var(--bg-panel)] rounded-xl border border-[var(--border-dev)] p-5 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/5 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded text-xs font-semibold">
                {mapItem.type === 'engine' ? <Map className="w-3 h-3" /> : <Layers className="w-3 h-3" />}
                <span className="capitalize">{mapItem.type}</span>
              </div>
              {mapItem.license && (
                <span className="text-[10px] bg-[var(--bg-sidebar)] text-[var(--text-muted)] px-2 py-1 rounded font-mono">
                  {mapItem.license}
                </span>
              )}
            </div>

            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1 group-hover:text-emerald-500 transition-colors line-clamp-1">
              {mapItem.name}
            </h3>
            
            <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-4 flex-1">
              {mapItem.description}
            </p>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--border-dev)]/50">
              <span className="text-xs font-mono text-[var(--text-muted)]">{mapItem.category || 'misc'}</span>
              <ExternalLink className="w-4 h-4 text-[var(--text-muted)] group-hover:text-emerald-500 transition-colors" />
            </div>
          </Link>
        ))}
      </div>
      
      {filtered.length === 0 && (
        <div className="text-center py-12 text-[var(--text-muted)] border-2 border-dashed border-[var(--border-dev)] rounded-xl">
          No map components found matching your search.
        </div>
      )}
    </div>
  );
}
