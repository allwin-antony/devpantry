'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  Zap,
  Loader2,
  Globe,
  Filter,
  Check
} from 'lucide-react';

interface ParsedIconItem {
  fullKey: string;
  prefix: string;
  name: string;
}

export function IconsClient() {
  const allCollections = useMemo(() => getAllIconCollections(), []);
  const featuredLibs = useMemo(() => getAllIconLibraries(), []);

  const [selectedPrefix, setSelectedPrefix] = useState<string>('lucide');
  const [collectionSearch, setCollectionSearch] = useState<string>('');
  const [iconSearch, setIconSearch] = useState<string>('');
  const [searchScope, setSearchScope] = useState<'global' | 'collection'>('global');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // SVG Customizer State
  const [iconSize, setIconSize] = useState<number>(28);
  const [strokeWidth, setStrokeWidth] = useState<number>(2);
  const [iconColor, setIconColor] = useState<string>('#f43f5e');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [copiedToast, setCopiedToast] = useState<string | null>(null);

  // Loaded icon list for selected collection
  const [loadedIcons, setLoadedIcons] = useState<string[]>([]);
  const [globalResults, setGlobalResults] = useState<ParsedIconItem[]>([]);
  const [isLoadingIcons, setIsLoadingIcons] = useState<boolean>(false);
  const [displayLimit, setDisplayLimit] = useState<number>(144);
  const [selectedIconItem, setSelectedIconItem] = useState<ParsedIconItem | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

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

  // Fetch complete icon list for single collection
  useEffect(() => {
    if (searchScope === 'global' && iconSearch.trim().length > 1) return;

    let isCancelled = false;
    setIsLoadingIcons(true);
    setDisplayLimit(144);

    const initialSamples = activeCollection.samples || ['home', 'user', 'settings', 'search', 'bell', 'check', 'mail'];
    setLoadedIcons(initialSamples);
    setSelectedIconItem({
      fullKey: `${activeCollection.prefix}:${initialSamples[0] || 'icon'}`,
      prefix: activeCollection.prefix,
      name: initialSamples[0] || 'icon'
    });

    fetch(`https://api.iconify.design/collection?prefix=${activeCollection.prefix}`)
      .then(res => res.json())
      .then(data => {
        if (!isCancelled && data) {
          const list: string[] = [];
          if (Array.isArray(data.uncategorized)) list.push(...data.uncategorized);
          if (data.categories && typeof data.categories === 'object') {
            for (const catIcons of Object.values(data.categories)) {
              if (Array.isArray(catIcons)) list.push(...catIcons);
            }
          }
          if (Array.isArray(data.hidden)) list.push(...data.hidden);

          if (list.length > 0) {
            const unique = Array.from(new Set(list));
            setLoadedIcons(unique);
            if (unique.length > 0) {
              setSelectedIconItem({
                fullKey: `${activeCollection.prefix}:${unique[0]}`,
                prefix: activeCollection.prefix,
                name: unique[0]
              });
            }
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!isCancelled) setIsLoadingIcons(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [activeCollection, searchScope, iconSearch]);

  // Global Master Search across ALL 353,000+ icons
  useEffect(() => {
    if (searchScope !== 'global' || !iconSearch.trim() || iconSearch.trim().length < 2) {
      setGlobalResults([]);
      return;
    }

    let isCancelled = false;
    setIsLoadingIcons(true);
    const timeout = setTimeout(() => {
      fetch(`https://api.iconify.design/search?query=${encodeURIComponent(iconSearch.trim())}&limit=160`)
        .then(res => res.json())
        .then(data => {
          if (!isCancelled && data && Array.isArray(data.icons)) {
            const parsed: ParsedIconItem[] = data.icons.map((item: string) => {
              const parts = item.split(':');
              return {
                fullKey: item,
                prefix: parts[0] || activeCollection.prefix,
                name: parts[1] || parts[0]
              };
            });
            setGlobalResults(parsed);
            if (parsed.length > 0) setSelectedIconItem(parsed[0]);
          }
        })
        .catch(() => {})
        .finally(() => {
          if (!isCancelled) setIsLoadingIcons(false);
        });
    }, 250);

    return () => {
      isCancelled = true;
      clearTimeout(timeout);
    };
  }, [iconSearch, searchScope, activeCollection.prefix]);

  // Compute displayed icons
  const displayedItems: ParsedIconItem[] = useMemo(() => {
    if (searchScope === 'global' && iconSearch.trim().length >= 2) {
      return globalResults.slice(0, displayLimit);
    }
    const q = iconSearch.toLowerCase();
    const filtered = q ? loadedIcons.filter(name => name.toLowerCase().includes(q)) : loadedIcons;
    return filtered.slice(0, displayLimit).map(name => ({
      fullKey: `${activeCollection.prefix}:${name}`,
      prefix: activeCollection.prefix,
      name
    }));
  }, [searchScope, iconSearch, globalResults, loadedIcons, activeCollection.prefix, displayLimit]);

  const totalCount = useMemo(() => {
    if (searchScope === 'global' && iconSearch.trim().length >= 2) {
      return globalResults.length;
    }
    const q = iconSearch.toLowerCase();
    return q ? loadedIcons.filter(name => name.toLowerCase().includes(q)).length : loadedIcons.length;
  }, [searchScope, iconSearch, globalResults, loadedIcons]);

  // Infinite scroll intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && displayLimit < totalCount) {
          setDisplayLimit(prev => Math.min(prev + 96, totalCount));
        }
      },
      { rootMargin: '400px' }
    );

    const el = sentinelRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [displayLimit, totalCount]);

  const copyToClipboard = (text: string, id: string, toastLabel?: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setCopiedToast(toastLabel || text);
    setTimeout(() => {
      setCopiedCode(null);
      setCopiedToast(null);
    }, 2000);
  };

  const getSvgUrl = (prefix: string, iconName: string) => {
    const encodedColor = encodeURIComponent(iconColor === 'currentColor' ? '#ffffff' : iconColor);
    return `https://api.iconify.design/${prefix}/${iconName}.svg?color=${encodedColor}`;
  };

  const activeIcon = selectedIconItem || displayedItems[0] || {
    fullKey: `${activeCollection.prefix}:icon`,
    prefix: activeCollection.prefix,
    name: 'icon'
  };

  const reactSnippet = `import { Icon } from '@iconify/react';

export function MyComponent() {
  return (
    <Icon 
      icon="${activeIcon.fullKey}" 
      width="${iconSize}" 
      height="${iconSize}" 
      style={{ color: '${iconColor}' }} 
    />
  );
}`;

  const svgSnippet = `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="${strokeWidth}">
  <!-- Icon: ${activeIcon.fullKey} -->
  <use href="https://api.iconify.design/${activeIcon.prefix}/${activeIcon.name}.svg" />
</svg>`;

  return (
    <div className="h-full flex flex-col md:flex-row p-3 overflow-hidden gap-3 font-mono relative">
      {/* Toast Notification for Copied Feedback (Crystal Clear in Light & Dark Mode) */}
      {copiedToast && (
        <div className="absolute bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-lg shadow-xl shadow-emerald-500/20 flex items-center gap-2 text-xs font-bold font-sans animate-in fade-in slide-in-from-bottom-2 border border-emerald-400/40">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>Copied <code className="bg-emerald-700/60 px-1.5 py-0.5 rounded font-mono text-[11px] text-white">{copiedToast}</code> to clipboard!</span>
        </div>
      )}

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
              placeholder="Search collections (Lucide, Tabler...)"
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
            const isSelected = col.prefix === selectedPrefix && searchScope === 'collection';
            return (
              <button
                key={col.prefix}
                onClick={() => {
                  setSelectedPrefix(col.prefix);
                  setSearchScope('collection');
                  setIconSearch('');
                }}
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
          Showing <strong>{filteredCollections.length.toLocaleString()}</strong> libraries
        </div>
      </div>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col gap-3 min-w-0 overflow-hidden">
        {/* 1. TOP PROMINENT MASTER SEARCH BAR */}
        <div className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-xl p-3 shrink-0 shadow-sm transition-colors flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-1 max-w-xl">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
              <Globe className="w-4 h-4" />
            </div>
            <div className="flex-1 relative">
              <input
                type="text"
                value={iconSearch}
                onChange={e => setIconSearch(e.target.value)}
                placeholder={
                  searchScope === 'global'
                    ? 'Global Master Search (e.g. cart, user, lock, github across 353K+ icons)...'
                    : `Search inside ${activeCollection.name}...`
                }
                className="dev-input w-full pl-8 pr-3 py-1.5 rounded-lg text-xs"
              />
              <Search className="w-3.5 h-3.5 text-cyan-500 absolute left-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Scope Switcher */}
            <div className="flex items-center gap-1 bg-[var(--bg-sidebar)] p-0.5 rounded-lg border border-[var(--border-dev)] text-xs">
              <button
                onClick={() => setSearchScope('global')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  searchScope === 'global'
                    ? 'bg-cyan-500 text-white shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Master Search (All 353K+)</span>
              </button>

              <button
                onClick={() => setSearchScope('collection')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  searchScope === 'collection'
                    ? 'bg-cyan-500 text-white shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <span>{activeCollection.name}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. Top Controls & Active Icon Info Card */}
        <div className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-xl p-4 shrink-0 shadow-sm transition-colors flex flex-col gap-3">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border-dev)]">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-base font-bold text-[var(--text-primary)] font-sans">
                  {searchScope === 'global' && iconSearch.trim().length >= 2 ? (
                    <span className="text-cyan-500 flex items-center gap-1.5">
                      <span>Search results for &ldquo;{iconSearch}&rdquo;</span>
                    </span>
                  ) : (
                    activeCollection.name
                  )}
                </h2>

                <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30">
                  {searchScope === 'global' && iconSearch.trim().length >= 2 
                    ? `${totalCount.toLocaleString()} matches across 238 libs` 
                    : `${loadedIcons.length.toLocaleString()} icons`}
                </span>

                <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
                  {activeCollection.license}
                </span>

                {isLoadingIcons && (
                  <span className="text-[10px] text-cyan-500 animate-pulse flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Searching...</span>
                  </span>
                )}
              </div>

              <div className="text-xs text-[var(--text-secondary)] font-sans mt-0.5">
                Active Icon: <code className="text-rose-500 font-mono font-bold">{activeIcon.fullKey}</code>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(`npm install @iconify/react @iconify-json/${activeIcon.prefix}`, 'install-cmd', `npm install @iconify/react @iconify-json/${activeIcon.prefix}`)}
                className="px-2.5 py-1 text-xs font-semibold rounded bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-[var(--text-primary)] hover:border-cyan-500 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5 text-cyan-500" />
                <span className={copiedCode === 'install-cmd' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}>
                  {copiedCode === 'install-cmd' ? 'Copied!' : 'Install'}
                </span>
              </button>

              <Link
                href={`/icons/${activeIcon.prefix}`}
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
                onClick={() => copyToClipboard(reactSnippet, 'react-copy', `<Icon icon="${activeIcon.fullKey}" />`)}
                title="Copy React snippet"
                className="px-2 py-1 text-xs font-semibold rounded bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-[var(--text-primary)] hover:border-cyan-500 flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedCode === 'react-copy' ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Code2 className="w-3 h-3 text-cyan-500" />}
                <span className={copiedCode === 'react-copy' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}>
                  {copiedCode === 'react-copy' ? 'Copied!' : 'React'}
                </span>
              </button>

              <button
                onClick={() => copyToClipboard(svgSnippet, 'svg-copy', 'SVG markup')}
                title="Copy SVG markup"
                className="px-2 py-1 text-xs font-semibold rounded bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-[var(--text-primary)] hover:border-cyan-500 flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedCode === 'svg-copy' ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Box className="w-3 h-3 text-rose-500" />}
                <span className={copiedCode === 'svg-copy' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}>
                  {copiedCode === 'svg-copy' ? 'Copied!' : 'SVG'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* 3. Icons Grid Card */}
        <div className="flex-1 bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-xl overflow-hidden flex flex-col shadow-sm">
          <div className="px-4 py-2 border-b border-[var(--border-dev)] flex items-center justify-between text-xs bg-[var(--bg-panel-subtle)] shrink-0">
            <div className="text-[11px] text-[var(--text-secondary)] font-sans">
              Click any icon to <strong>copy component</strong> and inspect
            </div>
            <div className="text-[11px] text-[var(--text-muted)] font-mono">
              Showing <strong>{displayedItems.length.toLocaleString()}</strong> of <strong>{totalCount.toLocaleString()}</strong> icons
            </div>
          </div>

          {/* Actual SVG Icon Grid */}
          <div className="flex-1 overflow-y-auto p-4 bg-[var(--bg-codebox)]">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {displayedItems.map(item => {
                const isSelected = activeIcon.fullKey === item.fullKey;
                const isCopied = copiedCode === `icon-${item.fullKey}`;

                return (
                  <button
                    key={item.fullKey}
                    onClick={() => {
                      setSelectedIconItem(item);
                      copyToClipboard(`<Icon icon="${item.fullKey}" />`, `icon-${item.fullKey}`, item.fullKey);
                    }}
                    title={`Click to copy <Icon icon="${item.fullKey}" />`}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all cursor-pointer group ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-500 shadow-sm ring-1 ring-cyan-500'
                        : 'bg-[var(--bg-panel)] border-[var(--border-dev)] hover:border-cyan-500/40 hover:bg-[var(--bg-sidebar)]'
                    }`}
                  >
                    {/* Live SVG fetched from CDN */}
                    <div 
                      style={{ width: `${iconSize}px`, height: `${iconSize}px` }} 
                      className="flex items-center justify-center mb-2 group-hover:scale-110 transition-transform"
                    >
                      <img
                        src={getSvgUrl(item.prefix, item.name)}
                        alt={item.name}
                        width={iconSize}
                        height={iconSize}
                        loading="lazy"
                        className="pointer-events-none"
                      />
                    </div>

                    {/* Copied Badge with High Contrast in Both Modes */}
                    <span 
                      className={`text-[10px] font-mono truncate max-w-full text-center px-1 py-0.5 rounded transition-colors ${
                        isCopied 
                          ? 'bg-emerald-500 text-white font-bold shadow-sm' 
                          : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {isCopied ? 'Copied!' : item.name}
                    </span>

                    {/* Source Library Tag in Master Search */}
                    {searchScope === 'global' && (
                      <span className="text-[8px] mt-0.5 px-1 rounded bg-[var(--pill-bg)] text-cyan-600 dark:text-cyan-400 font-mono font-bold truncate max-w-full opacity-80">
                        {item.prefix}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Infinite Scroll Sentinel */}
            {displayedItems.length < totalCount && (
              <div ref={sentinelRef} className="py-6 text-center text-xs text-[var(--text-muted)] flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 text-cyan-500 animate-spin" />
                <span>Loading more vector icons...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
