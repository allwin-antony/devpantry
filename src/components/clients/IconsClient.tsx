'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { getAllIconCollections, getAllIconLibraries, type IconCollectionItem } from '@/lib/datasetLoader';
import { 
  Box, 
  Search, 
  Copy, 
  CheckCircle2, 
  ExternalLink, 
  Code2, 
  SlidersHorizontal,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight,
  Download,
  Terminal,
  Grid,
  Zap
} from 'lucide-react';

export function IconsClient() {
  const allCollections = useMemo(() => getAllIconCollections(), []);
  const featuredLibs = useMemo(() => getAllIconLibraries(), []);

  const [selectedPrefix, setSelectedPrefix] = useState<string>('lucide');
  const [collectionSearch, setCollectionSearch] = useState<string>('');
  const [iconSearch, setIconSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // SVG Customizer State
  const [iconSize, setIconSize] = useState<number>(28);
  const [strokeWidth, setStrokeWidth] = useState<number>(2);
  const [iconColor, setIconColor] = useState<string>('#f43f5e');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Loaded icon list for selected collection
  const [loadedIcons, setLoadedIcons] = useState<string[]>([]);
  const [isLoadingIcons, setIsLoadingIcons] = useState<boolean>(false);
  const [selectedIconName, setSelectedIconName] = useState<string | null>(null);
  const [rawSvgData, setRawSvgData] = useState<string>('');

  const colorPresets = [
    { name: 'Rose', hex: '#f43f5e' },
    { name: 'Cyan', hex: '#06b6d4' },
    { name: 'Emerald', hex: '#10b981' },
    { name: 'Amber', hex: '#f59e0b' },
    { name: 'Violet', hex: '#8b5cf6' },
    { name: 'White', hex: '#ffffff' },
    { name: 'Current', hex: 'currentColor' }
  ];

  const activeCollection = useMemo(() => {
    return allCollections.find(c => c.prefix === selectedPrefix) || allCollections[0];
  }, [allCollections, selectedPrefix]);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    allCollections.forEach(c => {
      if (c.category) set.add(c.category);
    });
    return ['All', ...Array.from(set).slice(0, 8)];
  }, [allCollections]);

  // Filter collections
  const filteredCollections = useMemo(() => {
    return allCollections.filter(c => {
      const q = collectionSearch.toLowerCase();
      const matchesSearch = !q || c.name.toLowerCase().includes(q) || c.prefix.toLowerCase().includes(q);
      const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [allCollections, collectionSearch, selectedCategory]);

  // Fetch icon names from Iconify when activeCollection changes
  useEffect(() => {
    let isCancelled = false;
    setIsLoadingIcons(true);

    // Initial samples from catalog
    const initialSamples = activeCollection.samples || ['home', 'user', 'settings', 'search', 'bell', 'check', 'mail', 'heart', 'star', 'calendar'];
    setLoadedIcons(initialSamples);
    setSelectedIconName(initialSamples[0] || 'icon');

    // Try fetching the full/extended icon list from Iconify JSON endpoint
    fetch(`https://api.iconify.design/${activeCollection.prefix}.json`)
      .then(res => res.json())
      .then(data => {
        if (!isCancelled && data && (data.icons || data.uncategorized || data.categories)) {
          let iconsList: string[] = [];
          if (data.icons) {
            iconsList = Object.keys(data.icons);
          } else if (data.uncategorized) {
            iconsList = data.uncategorized;
          }
          if (iconsList.length > 0) {
            setLoadedIcons(iconsList.slice(0, 150)); // Fast preview grid
            if (iconsList.length > 0) setSelectedIconName(iconsList[0]);
          }
        }
      })
      .catch(() => {
        // Fallback to sample icons
      })
      .finally(() => {
        if (!isCancelled) setIsLoadingIcons(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [activeCollection]);

  // Filter icons within collection
  const visibleIcons = useMemo(() => {
    if (!iconSearch.trim()) return loadedIcons;
    return loadedIcons.filter(name => name.toLowerCase().includes(iconSearch.toLowerCase()));
  }, [loadedIcons, iconSearch]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 1800);
  };

  const getSvgUrl = (iconName: string) => {
    const encodedColor = encodeURIComponent(iconColor === 'currentColor' ? '#ffffff' : iconColor);
    return `https://api.iconify.design/${activeCollection.prefix}/${iconName}.svg?color=${encodedColor}`;
  };

  const currentIconName = selectedIconName || (visibleIcons[0] || 'icon');

  const reactSnippet = `import { Icon } from '@iconify/react';

export function MyComponent() {
  return (
    <Icon 
      icon="${activeCollection.prefix}:${currentIconName}" 
      width="${iconSize}" 
      height="${iconSize}" 
      style={{ color: '${iconColor}' }} 
    />
  );
}`;

  const svgSnippet = `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="${strokeWidth}">
  <!-- Icon: ${activeCollection.prefix}:${currentIconName} -->
  <use href="https://api.iconify.design/${activeCollection.prefix}/${currentIconName}.svg" />
</svg>`;

  return (
    <div className="h-full flex flex-col md:flex-row p-3 overflow-hidden gap-3 font-mono">
      {/* Left Sidebar: 238 Collections Directory */}
      <div className="w-full md:w-80 bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-xl flex flex-col overflow-hidden shrink-0 shadow-sm transition-colors">
        {/* Header & Search */}
        <div className="p-3 border-b border-[var(--border-dev)] flex flex-col gap-2 bg-[var(--bg-panel-subtle)] shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Box className="w-4 h-4 text-cyan-500" />
              <span className="text-xs font-bold text-[var(--text-primary)] font-sans uppercase">238 Icon Libraries</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[var(--pill-bg)] text-emerald-500 font-bold">
              353K+ SVGs
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            <input
              type="text"
              value={collectionSearch}
              onChange={e => setCollectionSearch(e.target.value)}
              placeholder="Search collections (Lucide, Tabler, Material...)"
              className="dev-input flex-1 px-2 py-1 rounded text-xs"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="dev-input px-2 py-1 rounded text-xs bg-[var(--bg-sidebar)]"
          >
            {categories.map(c => (
              <option key={c} value={c}>{c === 'All' ? 'All Icon Categories' : c}</option>
            ))}
          </select>
        </div>

        {/* Collections Scroll List */}
        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
          {filteredCollections.map(col => {
            const isSelected = col.prefix === selectedPrefix;
            return (
              <button
                key={col.prefix}
                onClick={() => setSelectedPrefix(col.prefix)}
                className={`w-full text-left p-2.5 rounded-lg border transition-all flex flex-col gap-1 cursor-pointer ${
                  isSelected 
                    ? 'bg-[var(--bg-sidebar)] border-cyan-500 shadow-sm' 
                    : 'border-transparent hover:bg-[var(--bg-sidebar)]/60 text-[var(--text-secondary)]'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-xs font-bold font-sans truncate ${isSelected ? 'text-cyan-500' : 'text-[var(--text-primary)]'}`}>
                    {col.name}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[var(--pill-bg)] text-[var(--text-muted)] shrink-0">
                    {col.total_icons.toLocaleString()}
                  </span>
                </div>
                <div className="text-[10px] text-[var(--text-muted)] truncate flex items-center justify-between">
                  <span>by {col.author}</span>
                  <span className="text-emerald-500 font-semibold">{col.license}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-2 border-t border-[var(--border-dev)] text-[10px] text-[var(--text-muted)] text-center bg-[var(--bg-panel-subtle)]">
          Showing <strong>{filteredCollections.length}</strong> of {allCollections.length} libraries
        </div>
      </div>

      {/* Main Panel: Interactive SVG Canvas & Icon Browser */}
      <div className="flex-1 flex flex-col gap-3 min-w-0 overflow-hidden">
        {/* Top Controls Card */}
        <div className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-xl p-4 shrink-0 shadow-sm transition-colors flex flex-col gap-3">
          {/* Collection Title and Links */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border-dev)]">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-base font-bold text-[var(--text-primary)] font-sans">
                  {activeCollection.name}
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30">
                  {activeCollection.total_icons.toLocaleString()} icons
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
                  {activeCollection.license}
                </span>
              </div>
              <div className="text-xs text-[var(--text-secondary)] font-sans mt-0.5">
                Author: {activeCollection.author} • Prefix: <code className="text-rose-500 font-mono">{activeCollection.prefix}</code>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(`npm install @iconify/react @iconify-json/${activeCollection.prefix}`, 'install-cmd')}
                className="px-2.5 py-1 text-xs font-semibold rounded bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-[var(--text-primary)] hover:border-cyan-500 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5 text-cyan-500" />
                <span>{copiedCode === 'install-cmd' ? 'Copied' : 'Install'}</span>
              </button>

              <Link
                href={`/icons/${activeCollection.prefix}`}
                className="px-2.5 py-1 text-xs font-semibold rounded bg-cyan-500 text-white hover:bg-cyan-600 flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <span>Full Page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* SVG Canvas Sliders */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              {/* Size Slider */}
              <div className="flex items-center gap-1.5 bg-[var(--bg-sidebar)] px-2 py-1 rounded border border-[var(--border-dev)]">
                <span className="text-[10px] text-[var(--text-muted)]">SIZE:</span>
                <input
                  type="range"
                  min="16"
                  max="56"
                  value={iconSize}
                  onChange={e => setIconSize(Number(e.target.value))}
                  className="w-16 accent-cyan-500 cursor-pointer h-1"
                />
                <span className="text-[10px] font-bold text-[var(--text-primary)] w-7 text-right">{iconSize}px</span>
              </div>

              {/* Stroke */}
              <div className="flex items-center gap-1 bg-[var(--bg-sidebar)] p-0.5 rounded border border-[var(--border-dev)] text-xs">
                <span className="text-[var(--text-muted)] px-1 text-[10px]">STROKE:</span>
                {[1, 1.5, 2, 2.5, 3].map(w => (
                  <button
                    key={w}
                    onClick={() => setStrokeWidth(w)}
                    className={`px-1.5 py-0.5 rounded text-[10px] transition-colors cursor-pointer ${
                      strokeWidth === w ? 'bg-cyan-500 text-white font-bold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {w}px
                  </button>
                ))}
              </div>

              {/* Color Presets */}
              <div className="flex items-center gap-1 bg-[var(--bg-sidebar)] p-1 rounded border border-[var(--border-dev)]">
                {colorPresets.map(c => (
                  <button
                    key={c.name}
                    onClick={() => setIconColor(c.hex)}
                    title={c.name}
                    style={{ backgroundColor: c.hex === 'currentColor' ? '#ffffff' : c.hex }}
                    className={`w-4 h-4 rounded-full border cursor-pointer transition-transform ${
                      iconColor === c.hex ? 'scale-125 border-white ring-1 ring-cyan-500' : 'border-black/30 hover:scale-110'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Quick Copy Snippets */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => copyToClipboard(reactSnippet, 'react-copy')}
                title="Copy React snippet"
                className="px-2 py-1 text-xs font-semibold rounded bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-[var(--text-primary)] hover:border-cyan-500 flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedCode === 'react-copy' ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Code2 className="w-3 h-3 text-cyan-500" />}
                <span>{copiedCode === 'react-copy' ? 'Copied' : 'React'}</span>
              </button>

              <button
                onClick={() => copyToClipboard(svgSnippet, 'svg-copy')}
                title="Copy SVG markup"
                className="px-2 py-1 text-xs font-semibold rounded bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-[var(--text-primary)] hover:border-cyan-500 flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedCode === 'svg-copy' ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Box className="w-3 h-3 text-rose-500" />}
                <span>{copiedCode === 'svg-copy' ? 'Copied' : 'SVG'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Icons Grid with Search */}
        <div className="flex-1 bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-xl overflow-hidden flex flex-col shadow-sm">
          {/* Search bar inside collection */}
          <div className="px-4 py-2 border-b border-[var(--border-dev)] flex items-center justify-between text-xs bg-[var(--bg-panel-subtle)] shrink-0 gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-xs">
              <Search className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              <input
                type="text"
                value={iconSearch}
                onChange={e => setIconSearch(e.target.value)}
                placeholder={`Search inside ${activeCollection.name}...`}
                className="dev-input flex-1 px-2 py-0.5 rounded text-xs"
              />
            </div>

            <div className="text-[11px] text-[var(--text-muted)]">
              Showing <strong>{visibleIcons.length}</strong> icons • Click any icon to inspect & copy
            </div>
          </div>

          {/* Actual SVG Icon Grid */}
          <div className="flex-1 overflow-y-auto p-4 bg-[var(--bg-codebox)]">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {visibleIcons.map(name => {
                const isSelected = selectedIconName === name;
                return (
                  <button
                    key={name}
                    onClick={() => {
                      setSelectedIconName(name);
                      copyToClipboard(`<Icon icon="${activeCollection.prefix}:${name}" />`, `icon-${name}`);
                    }}
                    title={`Click to copy ${activeCollection.prefix}:${name}`}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all cursor-pointer group ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-500 shadow-sm'
                        : 'bg-[var(--bg-panel)] border-[var(--border-dev)] hover:border-cyan-500/40 hover:bg-[var(--bg-sidebar)]'
                    }`}
                  >
                    {/* Live SVG fetched from CDN */}
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
                      {copiedCode === `icon-${name}` ? 'Copied!' : name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
