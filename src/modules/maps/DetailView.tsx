'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, ShieldCheck, Map, Code } from 'lucide-react';
import type { MapComponent } from '@/lib/loaders/mapLoader';

export default function MapsDetailView({ item }: { item: MapComponent }) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link 
        href="/maps"
        className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Maps
      </Link>

      <div className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-2xl p-8 mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                {item.name}
              </h1>
              <span className="text-xs font-semibold px-2 py-1 bg-[var(--pill-bg)] text-[var(--text-secondary)] rounded-md capitalize border border-[var(--border-dev)]">
                {item.type}
              </span>
            </div>
            {item.category && (
              <p className="text-sm font-mono text-emerald-500 mb-4">{item.category}</p>
            )}
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl leading-relaxed">
              {item.description}
            </p>
          </div>
          
          <div className="flex gap-3">
            {(item.repo || item.repository_url) && (
              <a 
                href={item.repo || item.repository_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
              >
                <Code className="w-4 h-4" /> Repository
              </a>
            )}
            {item.source_url && (
              <a 
                href={item.source_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-app)] hover:bg-[var(--pill-bg)] text-[var(--text-primary)] border border-[var(--border-dev)] font-medium rounded-lg transition-colors"
              >
                Homepage <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[var(--border-dev)]">
          <div className="space-y-1">
            <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold">License</span>
            <div className="flex items-center gap-1.5 text-sm font-mono text-[var(--text-primary)]">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              {item.license || 'Check Repository'}
            </div>
          </div>
          
          <div className="space-y-1">
            <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold">Map Core Engine</span>
            <div className="text-sm font-medium text-[var(--text-primary)] capitalize">
              {item.core_engine || (item.type === 'engine' ? 'Self' : 'N/A')}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold">NPM Package</span>
            <div className="text-sm font-mono text-[var(--text-primary)]">
              {item.npm_package || 'N/A'}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
