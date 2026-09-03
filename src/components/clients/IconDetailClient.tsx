'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { type IconCollectionItem } from '@/lib/datasetLoader';
import { 
  Box, 
  Search, 
  Copy, 
  CheckCircle2, 
  ExternalLink, 
  Code2, 
  SlidersHorizontal, 
  ArrowLeft, 
  Terminal, 
  Sparkles,
  ShieldCheck,
  Download
} from 'lucide-react';

export function IconDetailClient({ collection }: { collection: IconCollectionItem }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [iconSize, setIconSize] = useState<number>(32);
  const [strokeWidth, setStrokeWidth] = useState<number>(2);
  const [iconColor, setIconColor] = useState<string>('#06b6d4');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [loadedIcons, setLoadedIcons] = useState<string[]>([]);
  const [selectedIcon, setSelectedIcon] = useState<string>('');

  const colorPresets = [
    { name: 'Cyan', hex: '#06b6d4' },
    { name: 'Rose', hex: '#f43f5e' },
    { name: 'Emerald', hex: '#10b981' },
    { name: 'Amber', hex: '#f59e0b' },
    { name: 'Violet', hex: '#8b5cf6' },
    { name: 'White', hex: '#ffffff' }
  ];

  // Fetch full icon list from Iconify API
  useEffect(() => {
    let isCancelled = false;
    const initialSamples = collection.samples || ['home', 'user', 'settings', 'search', 'bell', 'check', 'mail'];
    setLoadedIcons(initialSamples);
    setSelectedIcon(initialSamples[0] || 'icon');

    fetch(`https://api.iconify.design/${collection.prefix}.json`)
      .then(res => res.json())
      .then(data => {
        if (!isCancelled && data) {
          let list: string[] = [];
          if (data.icons) list = Object.keys(data.icons);
          else if (data.uncategorized) list = data.uncategorized;
          if (list.length > 0) {
            setLoadedIcons(list);
            setSelectedIcon(list[0]);
          }
        }
      })
      .catch(() => {});

    return () => {
      isCancelled = true;
    };
  }, [collection]);

  const filteredIcons = useMemo(() => {
    if (!searchQuery.trim()) return loadedIcons;
    return loadedIcons.filter(name => name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [loadedIcons, searchQuery]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 1800);
  };

  const currentIcon = selectedIcon || (filteredIcons[0] || 'icon');
  const getSvgUrl = (iconName: string) => {
    const encodedColor = encodeURIComponent(iconColor === 'currentColor' ? '#ffffff' : iconColor);
    return `https://api.iconify.design/${collection.prefix}/${iconName}.svg?color=${encodedColor}`;
  };

  const reactSnippet = `import { Icon } from '@iconify/react';

export function Example() {
  return <Icon icon="${collection.prefix}:${currentIcon}" width="${iconSize}" height="${iconSize}" style={{ color: '${iconColor}' }} />;
}`;

  const npmSnippet = `npm install @iconify/react @iconify-json/${collection.prefix}`;

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 flex flex-col gap-6 max-w-6xl mx-auto w-full font-mono">
      {/* Back Bar */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/icons"
          className="inline-flex items-center gap-2 text-xs text-[var(--text-secondary)] hover:text-cyan-500 transition-colors font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to 238 Icon Libraries</span>
        </Link>

        <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)]">
          <span className="px-2 py-0.5 rounded bg-[var(--pill-bg)] border border-[var(--border-dev)] font-mono">
            prefix: {collection.prefix}
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold">
            {collection.license}
          </span>
        </div>
      </div>

      {/* Library Header Card */}
      <section className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-xl p-6 relative overflow-hidden shadow-sm transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] font-sans">
              {collection.name}
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30">
              {collection.total_icons.toLocaleString()} Vector Icons
            </span>
          </div>

          <p className="text-xs md:text-sm text-[var(--text-secondary)] font-sans">
            Created by <strong className="text-[var(--text-primary)]">{collection.author}</strong> • Category: {collection.category || 'Vector Icons'}
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-[var(--text-muted)]">
            <span className="text-emerald-500 font-bold">100% Free for Commercial Use</span>
            <span>•</span>
            <span>JSON & SVG APIs Ready</span>
          </div>
        </div>

        {/* Action Links */}
        <div className="flex flex-wrap items-center gap-2">
          {collection.author_url && (
            <a
              href={collection.author_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-lg bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-xs font-bold text-[var(--text-primary)] hover:border-cyan-500 flex items-center gap-1.5 transition-colors"
            >
              <span>Repository</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          <button
            onClick={() => copyToClipboard(npmSnippet, 'npm-install')}
            className="px-3.5 py-2 rounded-lg bg-cyan-500 text-white text-xs font-bold hover:bg-cyan-600 flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>{copiedCode === 'npm-install' ? 'Copied' : 'Install Package'}</span>
          </button>
        </div>
      </section>

      {/* Interactive Customizer & Active Icon Inspector */}
      <section className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-xl p-5 shadow-sm transition-colors flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[var(--border-dev)]">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-cyan-500" />
            <span className="text-xs font-bold text-[var(--text-primary)] font-sans">
              Active Icon: <span className="text-cyan-500 font-mono">{currentIcon}</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Size Slider */}
            <div className="flex items-center gap-1.5 bg-[var(--bg-sidebar)] px-2 py-1 rounded border border-[var(--border-dev)]">
              <span className="text-[10px] text-[var(--text-muted)]">SIZE:</span>
              <input
                type="range"
                min="16"
                max="64"
                value={iconSize}
                onChange={e => setIconSize(Number(e.target.value))}
                className="w-20 accent-cyan-500 cursor-pointer h-1"
              />
              <span className="text-[10px] font-bold text-[var(--text-primary)] w-8 text-right">{iconSize}px</span>
            </div>

            {/* Colors */}
            <div className="flex items-center gap-1 bg-[var(--bg-sidebar)] p-1 rounded border border-[var(--border-dev)]">
              {colorPresets.map(c => (
                <button
                  key={c.name}
                  onClick={() => setIconColor(c.hex)}
                  title={c.name}
                  style={{ backgroundColor: c.hex }}
                  className={`w-4 h-4 rounded-full border cursor-pointer transition-transform ${
                    iconColor === c.hex ? 'scale-125 border-white ring-1 ring-cyan-500' : 'border-black/30 hover:scale-110'
                  }`}
                />
              ))}
            </div>

            {/* Copy React */}
            <button
              onClick={() => copyToClipboard(reactSnippet, 'react-detail')}
              className="px-2.5 py-1 text-xs font-semibold rounded bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-[var(--text-primary)] hover:border-cyan-500 flex items-center gap-1 transition-colors cursor-pointer"
            >
              {copiedCode === 'react-detail' ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Code2 className="w-3 h-3 text-cyan-500" />}
              <span>{copiedCode === 'react-detail' ? 'Copied' : 'Copy React'}</span>
            </button>
          </div>
        </div>

        {/* Selected Icon Hero Display */}
        <div className="bg-[var(--bg-codebox)] border border-[var(--border-dev)] rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div 
              style={{ width: `${iconSize + 24}px`, height: `${iconSize + 24}px` }} 
              className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner"
            >
              <img
                src={getSvgUrl(currentIcon)}
                alt={currentIcon}
                width={iconSize}
                height={iconSize}
              />
            </div>

            <div>
              <div className="text-base font-bold text-[var(--text-primary)] font-mono">{currentIcon}</div>
              <div className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
                {collection.prefix}:{currentIcon}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => copyToClipboard(`<img src="${getSvgUrl(currentIcon)}" alt="${currentIcon}" />`, 'copy-img')}
              className="px-3 py-1.5 rounded bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-xs text-[var(--text-primary)] hover:border-cyan-500 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedCode === 'copy-img' ? 'Copied' : 'Copy HTML <img>'}</span>
            </button>
            <a
              href={getSvgUrl(currentIcon)}
              target="_blank"
              download={`${currentIcon}.svg`}
              className="px-3 py-1.5 rounded bg-cyan-500 text-white text-xs font-bold hover:bg-cyan-600 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download SVG</span>
            </a>
          </div>
        </div>
      </section>

      {/* Full Library Grid with Search */}
      <section className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-xl p-5 shadow-sm transition-colors flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[var(--border-dev)]">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={`Search all ${loadedIcons.length} icons in ${collection.name}...`}
              className="dev-input flex-1 px-2.5 py-1 rounded text-xs"
            />
          </div>

          <span className="text-xs text-[var(--text-muted)]">
            Showing <strong>{filteredIcons.length}</strong> icons
          </span>
        </div>

        {/* Icon Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 max-h-[500px] overflow-y-auto pr-1">
          {filteredIcons.map(name => {
            const isSelected = selectedIcon === name;
            return (
              <button
                key={name}
                onClick={() => {
                  setSelectedIcon(name);
                  copyToClipboard(`<Icon icon="${collection.prefix}:${name}" />`, `grid-${name}`);
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all cursor-pointer group ${
                  isSelected
                    ? 'bg-cyan-500/15 border-cyan-500 shadow-sm'
                    : 'bg-[var(--bg-panel-subtle)] border-[var(--border-dev-subtle)] hover:border-cyan-500/40 hover:bg-[var(--bg-sidebar)]'
                }`}
              >
                <div 
                  style={{ width: `${iconSize}px`, height: `${iconSize}px` }} 
                  className="flex items-center justify-center mb-2 group-hover:scale-110 transition-transform"
                >
                  <img
                    src={getSvgUrl(name)}
                    alt={name}
                    width={iconSize}
                    height={iconSize}
                    className="pointer-events-none"
                  />
                </div>

                <span className="text-[10px] text-[var(--text-muted)] group-hover:text-[var(--text-primary)] font-mono truncate max-w-full text-center">
                  {copiedCode === `grid-${name}` ? 'Copied!' : name}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
