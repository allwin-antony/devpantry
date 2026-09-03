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
  X,
  Share2,
  Image as ImageIcon
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
  
  // Two distinct search queries
  const [masterSearchQuery, setMasterSearchQuery] = useState<string>('');
  const [librarySearchQuery, setLibrarySearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // SVG Customizer State
  const [iconSize, setIconSize] = useState<number>(32);
  const [strokeWidth, setStrokeWidth] = useState<number>(2);
  const [iconColor, setIconColor] = useState<string>('#f43f5e');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [copiedToast, setCopiedToast] = useState<string | null>(null);

  // Loaded icon list for selected collection
  const [loadedIcons, setLoadedIcons] = useState<string[]>([]);
  const [globalResults, setGlobalResults] = useState<ParsedIconItem[]>([]);
  const [isLoadingLibrary, setIsLoadingLibrary] = useState<boolean>(false);
  const [isLoadingMaster, setIsLoadingMaster] = useState<boolean>(false);
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

  // Filter collections in sidebar
  const filteredCollections = useMemo(() => {
    return allCollections.filter(c => {
      const q = collectionSearch.toLowerCase();
      const matchesSearch = !q || c.name.toLowerCase().includes(q) || c.prefix.toLowerCase().includes(q);
      const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [allCollections, collectionSearch, selectedCategory]);

  // ── URL Hash Tracking on Load/Refresh (e.g. #lucide:a-arrow-down) ──
  const requestedHashIconRef = useRef<{ prefix: string; name: string; fullKey: string } | null>(null);

  useEffect(() => {
    const parseUrlHash = () => {
      const hash = window.location.hash.replace(/^#/, '').trim();
      if (hash && hash.includes(':')) {
        const parts = hash.split(':');
        const prefix = parts[0];
        const name = parts.slice(1).join(':');
        if (prefix && name) {
          requestedHashIconRef.current = { prefix, name, fullKey: hash };
          setSelectedPrefix(prefix);
          setSelectedIconItem({
            fullKey: hash,
            prefix,
            name
          });
        }
      }
    };

    parseUrlHash();
    window.addEventListener('hashchange', parseUrlHash);
    return () => window.removeEventListener('hashchange', parseUrlHash);
  }, []);

  // 1. Fetch complete icon list for active single collection
  useEffect(() => {
    let isCancelled = false;
    setIsLoadingLibrary(true);
    setDisplayLimit(144);

    const initialSamples = activeCollection.samples || ['home', 'user', 'settings', 'search', 'bell', 'check', 'mail'];
    
    // Check if an initial URL hash was requested for this collection on load/refresh
    const requested = requestedHashIconRef.current;
    if (requested && requested.prefix === activeCollection.prefix) {
      const reorderedSamples = [requested.name, ...initialSamples.filter(s => s !== requested.name)];
      setLoadedIcons(reorderedSamples);
      setSelectedIconItem(requested);
    } else {
      setLoadedIcons(initialSamples);
      if (!selectedIconItem || selectedIconItem.prefix !== activeCollection.prefix) {
        setSelectedIconItem({
          fullKey: `${activeCollection.prefix}:${initialSamples[0] || 'icon'}`,
          prefix: activeCollection.prefix,
          name: initialSamples[0] || 'icon'
        });
      }
    }

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
            let unique = Array.from(new Set(list));
            // Prioritize the requested icon at index 0 on load/refresh
            const req = requestedHashIconRef.current;
            if (req && req.prefix === activeCollection.prefix) {
              unique = [req.name, ...unique.filter(n => n !== req.name)];
              // Consume the ref so subsequent in-page interactions won't reorder again
              requestedHashIconRef.current = null;
            }
            setLoadedIcons(unique);
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!isCancelled) setIsLoadingLibrary(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [activeCollection]);

  // 2. Global Master Search across ALL 353,000+ icons
  useEffect(() => {
    if (!masterSearchQuery.trim() || masterSearchQuery.trim().length < 2) {
      setGlobalResults([]);
      setIsLoadingMaster(false);
      return;
    }

    let isCancelled = false;
    setIsLoadingMaster(true);
    setDisplayLimit(144);

    const timeout = setTimeout(() => {
      fetch(`https://api.iconify.design/search?query=${encodeURIComponent(masterSearchQuery.trim())}&limit=160`)
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
            if (parsed.length > 0) {
              handleSelectIcon(parsed[0]);
            }
          }
        })
        .catch(() => {})
        .finally(() => {
          if (!isCancelled) setIsLoadingMaster(false);
        });
    }, 250);

    return () => {
      isCancelled = true;
      clearTimeout(timeout);
    };
  }, [masterSearchQuery, activeCollection.prefix]);

  const isMasterSearchActive = masterSearchQuery.trim().length >= 2;

  // Compute displayed icons
  const displayedItems: ParsedIconItem[] = useMemo(() => {
    if (isMasterSearchActive) {
      return globalResults.slice(0, displayLimit);
    }
    const q = librarySearchQuery.toLowerCase();
    const filtered = q ? loadedIcons.filter(name => name.toLowerCase().includes(q)) : loadedIcons;
    return filtered.slice(0, displayLimit).map(name => ({
      fullKey: `${activeCollection.prefix}:${name}`,
      prefix: activeCollection.prefix,
      name
    }));
  }, [isMasterSearchActive, globalResults, librarySearchQuery, loadedIcons, activeCollection.prefix, displayLimit]);

  const totalCount = useMemo(() => {
    if (isMasterSearchActive) {
      return globalResults.length;
    }
    const q = librarySearchQuery.toLowerCase();
    return q ? loadedIcons.filter(name => name.toLowerCase().includes(q)).length : loadedIcons.length;
  }, [isMasterSearchActive, globalResults, librarySearchQuery, loadedIcons]);

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

  const handleSelectIcon = (item: ParsedIconItem) => {
    setSelectedIconItem(item);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${item.fullKey}`);
    }
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

  const activeIconCollection = useMemo(() => {
    return allCollections.find(c => c.prefix === activeIcon.prefix) || activeCollection;
  }, [allCollections, activeIcon.prefix, activeCollection]);

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

  const htmlImgSnippet = `<img src="${getSvgUrl(activeIcon.prefix, activeIcon.name)}" width="${iconSize}" height="${iconSize}" alt="${activeIcon.name}" />`;

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/icons#${activeIcon.fullKey}` 
    : `https://devplayground.io/icons#${activeIcon.fullKey}`;

  return (
    <div className="h-full flex flex-col md:flex-row p-3 overflow-hidden gap-3 font-mono relative">
      {/* Toast Notification for Copied Feedback (Crystal Clear in Light & Dark Mode) */}
      {copiedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-lg shadow-xl shadow-emerald-500/20 flex items-center gap-2 text-xs font-bold font-sans animate-in fade-in slide-in-from-bottom-2 border border-emerald-400/40">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>Copied <code className="bg-emerald-700/60 px-1.5 py-0.5 rounded font-mono text-[11px] text-white">{copiedToast}</code> to clipboard!</span>
        </div>
      )}

      {/* Left Sidebar: 238 Collections Directory */}
      <div className="w-full md:w-80 bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-xl flex flex-col overflow-hidden shrink-0 shadow-sm transition-colors">
        {/* Header & Collections Search */}
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
            const isSelected = col.prefix === selectedPrefix && !isMasterSearchActive;
            return (
              <button
                key={col.prefix}
                onClick={() => {
                  setSelectedPrefix(col.prefix);
                  setMasterSearchQuery('');
                  setLibrarySearchQuery('');
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
        {/* ── 1. TOP DEDICATED MASTER SEARCH BAR ── */}
        <div className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-xl p-3 shrink-0 shadow-sm transition-colors flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-1 max-w-2xl">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
              <Globe className="w-4 h-4" />
            </div>
            <div className="flex-1 relative">
              <input
                type="text"
                value={masterSearchQuery}
                onChange={e => setMasterSearchQuery(e.target.value)}
                placeholder="Global Master Search (type 'cart', 'user', 'shield', 'github' across all 353K+ icons)..."
                className="dev-input w-full pl-8 pr-8 py-1.5 rounded-lg text-xs"
              />
              <Search className="w-3.5 h-3.5 text-cyan-500 absolute left-2.5 top-2.5 pointer-events-none" />
              {masterSearchQuery && (
                <button
                  onClick={() => setMasterSearchQuery('')}
                  className="absolute right-2.5 top-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                  title="Clear Master Search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2 py-1 rounded bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-cyan-600 dark:text-cyan-400">
              {isMasterSearchActive ? `${totalCount} Master Matches` : 'Master Search: 353K+ SVGs'}
            </span>
          </div>
        </div>

        {/* ── 2. ACTIVE ICON HERO & CUSTOMIZER BENCH ── */}
        <div className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-xl p-4 shrink-0 shadow-sm transition-colors flex flex-col gap-3">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 border-b border-[var(--border-dev)]">
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-bold text-[var(--text-primary)] font-sans">
                {isMasterSearchActive ? (
                  <span className="text-cyan-500 flex items-center gap-1.5">
                    <span>Global Results: &ldquo;{masterSearchQuery}&rdquo;</span>
                  </span>
                ) : (
                  activeCollection.name
                )}
              </h2>

              <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30">
                {isMasterSearchActive
                  ? `${totalCount.toLocaleString()} matches across 238 libs` 
                  : `${loadedIcons.length.toLocaleString()} icons`}
              </span>

              <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
                {activeCollection.license}
              </span>

              {(isLoadingLibrary || isLoadingMaster) && (
                <span className="text-[10px] text-cyan-500 animate-pulse flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Searching...</span>
                </span>
              )}
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

          {/* 🌟 SELECTED ICON HERO DETAILS BENCH (Visual Preview + Full Metadata) 🌟 */}
          <div className="bg-[var(--bg-panel-subtle)] border border-[var(--border-dev)] rounded-lg p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors shadow-sm">
            {/* Left: Live Visual SVG Canvas & Details */}
            <div className="flex items-center gap-3.5">
              {/* Live Preview Box */}
              <div 
                style={{ width: `${Math.max(iconSize + 20, 52)}px`, height: `${Math.max(iconSize + 20, 52)}px` }}
                className="p-2 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-dev)] flex items-center justify-center shadow-sm shrink-0"
              >
                <img
                  src={getSvgUrl(activeIcon.prefix, activeIcon.name)}
                  alt={activeIcon.name}
                  width={iconSize}
                  height={iconSize}
                  className="pointer-events-none drop-shadow-sm"
                />
              </div>

              {/* Text Specs */}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[var(--text-primary)] font-mono">
                    {activeIcon.name}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30">
                    {activeIcon.prefix}
                  </span>
                </div>

                <div className="text-[11px] text-[var(--text-secondary)] font-mono mt-0.5 flex flex-wrap items-center gap-2">
                  <span className="text-rose-500 font-bold">&lt;Icon icon=&quot;{activeIcon.fullKey}&quot; /&gt;</span>
                  <span>•</span>
                  <span>{activeIconCollection.name}</span>
                  <span>•</span>
                  <span className="text-emerald-500 font-semibold">{activeIconCollection.license}</span>
                </div>
              </div>
            </div>

            {/* Right: Quick Action Copy Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs shrink-0">
              <button
                onClick={() => copyToClipboard(reactSnippet, 'hero-react', `<Icon icon="${activeIcon.fullKey}" />`)}
                title="Copy React JSX"
                className="px-2.5 py-1 text-xs font-semibold rounded bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-[var(--text-primary)] hover:border-cyan-500 flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedCode === 'hero-react' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Code2 className="w-3.5 h-3.5 text-cyan-500" />}
                <span className={copiedCode === 'hero-react' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}>
                  {copiedCode === 'hero-react' ? 'Copied!' : 'React'}
                </span>
              </button>

              <button
                onClick={() => copyToClipboard(svgSnippet, 'hero-svg', 'SVG markup')}
                title="Copy Raw SVG"
                className="px-2.5 py-1 text-xs font-semibold rounded bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-[var(--text-primary)] hover:border-cyan-500 flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedCode === 'hero-svg' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Box className="w-3.5 h-3.5 text-rose-500" />}
                <span className={copiedCode === 'hero-svg' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}>
                  {copiedCode === 'hero-svg' ? 'Copied!' : 'SVG'}
                </span>
              </button>

              <button
                onClick={() => copyToClipboard(htmlImgSnippet, 'hero-img', `<img> tag`)}
                title="Copy HTML <img> tag"
                className="px-2.5 py-1 text-xs font-semibold rounded bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-[var(--text-primary)] hover:border-cyan-500 flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedCode === 'hero-img' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <ImageIcon className="w-3.5 h-3.5 text-amber-500" />}
                <span className={copiedCode === 'hero-img' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}>
                  {copiedCode === 'hero-img' ? 'Copied!' : 'HTML'}
                </span>
              </button>

              <button
                onClick={() => copyToClipboard(shareUrl, 'hero-share', shareUrl)}
                title="Copy direct link to this icon"
                className="px-2.5 py-1 text-xs font-semibold rounded bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-[var(--text-primary)] hover:border-cyan-500 flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedCode === 'hero-share' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5 text-violet-500" />}
                <span className={copiedCode === 'hero-share' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}>
                  {copiedCode === 'hero-share' ? 'Copied!' : 'Link'}
                </span>
              </button>

              <a
                href={getSvgUrl(activeIcon.prefix, activeIcon.name)}
                target="_blank"
                download={`${activeIcon.name}.svg`}
                className="px-2.5 py-1 rounded bg-cyan-500 text-white text-xs font-bold hover:bg-cyan-600 flex items-center gap-1 transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>SVG</span>
              </a>
            </div>
          </div>

          {/* SVG Canvas Sliders & Style Adjusters */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
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

            <div className="text-[10px] text-[var(--text-muted)] font-mono">
              Direct Link: <code className="text-cyan-500 font-bold">/icons#{activeIcon.fullKey}</code>
            </div>
          </div>
        </div>

        {/* ── 3. Icons Grid Card WITH 2ND SEARCH BAR (LIBRARY SEARCH) ── */}
        <div className="flex-1 bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-xl overflow-hidden flex flex-col shadow-sm">
          {/* Second Search Bar: Library-Based Search */}
          <div className="px-4 py-2 border-b border-[var(--border-dev)] flex flex-wrap items-center justify-between text-xs bg-[var(--bg-panel-subtle)] shrink-0 gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              <input
                type="text"
                value={librarySearchQuery}
                onChange={e => {
                  setLibrarySearchQuery(e.target.value);
                  if (masterSearchQuery) setMasterSearchQuery(''); // clear master if searching within library
                }}
                placeholder={`Search inside ${activeCollection.name} (${loadedIcons.length} icons)...`}
                className="dev-input flex-1 px-2.5 py-1 rounded text-xs"
              />
              {librarySearchQuery && (
                <button
                  onClick={() => setLibrarySearchQuery('')}
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] text-[var(--text-muted)] font-mono">
                Showing <strong>{displayedItems.length.toLocaleString()}</strong> of <strong>{totalCount.toLocaleString()}</strong> icons
              </span>
            </div>
          </div>

          {/* Actual SVG Icon Grid */}
          <div className="flex-1 overflow-y-auto p-4 bg-[var(--bg-panel-subtle)]">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {displayedItems.map(item => {
                const isSelected = activeIcon.fullKey === item.fullKey;
                const isCopied = copiedCode === `icon-${item.fullKey}`;

                return (
                  <button
                    key={item.fullKey}
                    onClick={() => {
                      handleSelectIcon(item);
                      copyToClipboard(`<Icon icon="${item.fullKey}" />`, `icon-${item.fullKey}`, item.fullKey);
                    }}
                    title={`Click to inspect & copy <Icon icon="${item.fullKey}" />`}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all cursor-pointer group ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-500 shadow-sm ring-2 ring-cyan-500'
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
                          : (isSelected ? 'text-cyan-500 font-bold' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]')
                      }`}
                    >
                      {isCopied ? 'Copied!' : item.name}
                    </span>

                    {/* Source Library Tag in Master Search */}
                    {isMasterSearchActive && (
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
