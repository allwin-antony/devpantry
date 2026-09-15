'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Terminal, ShieldCheck, Box, Code } from 'lucide-react';
import type { UIComponent } from '@/lib/loaders/componentLoader';

export default function ComponentsDetailView({ item }: { item: UIComponent }) {
  const isLib = item.type === 'library';

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link 
        href="/components"
        className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Components
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
              <p className="text-sm font-mono text-rose-500 mb-4">{item.category}</p>
            )}
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl leading-relaxed">
              {item.description}
            </p>
          </div>
          
          <div className="flex gap-3">
            {item.website && (
              <a 
                href={item.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-lg transition-colors"
              >
                Website <ExternalLink className="w-4 h-4" />
              </a>
            )}
            {(item.repository || item.repository_url) && (
              <a 
                href={item.repository || item.repository_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-app)] hover:bg-[var(--pill-bg)] text-[var(--text-primary)] border border-[var(--border-dev)] font-medium rounded-lg transition-colors"
              >
                <Code className="w-4 h-4" /> Repo
              </a>
            )}
            {item.source_url && !item.website && (
              <a 
                href={item.source_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-lg transition-colors"
              >
                View Source <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-[var(--border-dev)]">
          <div className="space-y-1">
            <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold">License</span>
            <div className="flex items-center gap-1.5 text-sm font-mono text-[var(--text-primary)]">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              {item.license || item.license_spdx || 'MIT'}
            </div>
          </div>
          
          <div className="space-y-1">
            <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold">Frameworks</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {item.frameworks_supported?.map((f: string) => (
                <span key={f} className="text-[10px] bg-[var(--bg-sidebar)] border border-[var(--border-dev)] px-2 py-0.5 rounded text-[var(--text-secondary)]">
                  {f}
                </span>
              ))}
              {item.frameworks?.map((f: string) => (
                <span key={f} className="text-[10px] bg-[var(--bg-sidebar)] border border-[var(--border-dev)] px-2 py-0.5 rounded text-[var(--text-secondary)]">
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold">
              {isLib ? 'Components' : 'Dependencies'}
            </span>
            <div className="text-sm font-medium text-[var(--text-primary)]">
              {isLib ? item.component_count || 'Multiple' : (item.dependencies?.length ? item.dependencies.join(', ') : 'None')}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold">Commercial Use</span>
            <div className="text-sm font-medium text-emerald-500 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" />
              {item.commercial_use_allowed ? 'Allowed' : 'Check License'}
            </div>
          </div>
        </div>
      </div>

      {item.cli_command && item.cli_command !== 'n/a (direct copy-paste / web export)' && item.cli_command !== 'n/a (web directory)' && (
        <div className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-2xl overflow-hidden mb-8">
          <div className="bg-[var(--bg-sidebar)] px-4 py-3 border-b border-[var(--border-dev)] flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[var(--text-muted)]" />
            <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Installation</span>
          </div>
          <div className="p-4 bg-[#0d1117] relative group">
            <code className="text-sm text-green-400 font-mono break-all block">
              {item.cli_command}
            </code>
            <button 
              onClick={() => navigator.clipboard.writeText(item.cli_command)}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-[var(--bg-sidebar)] hover:bg-[var(--pill-bg)] text-[var(--text-secondary)] border border-[var(--border-dev)] px-3 py-1.5 rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Copy
            </button>
          </div>
        </div>
      )}

      {item.license_notes && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5 mb-8">
          <h3 className="text-sm font-bold text-blue-500 mb-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Licensing Notes
          </h3>
          <p className="text-sm text-[var(--text-primary)] leading-relaxed">
            {item.license_notes}
          </p>
        </div>
      )}
    </div>
  );
}
