'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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
  Download,
  Loader2
} from 'lucide-react';

function IconSvgPreview({
  prefix,
  name,
  color,
  size,
  strokeWidth,
  className
}: {
  prefix: string;
  name: string;
  color: string;
  size: number;
  strokeWidth: number;
  className?: string;
}) {
  const [svgContent, setSvgContent] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;
    const encodedColor = encodeURIComponent(color === 'currentColor' ? '#ffffff' : color);
    fetch(`https://api.iconify.design/${prefix}/${name}.svg?color=${encodedColor}`)
      .then(res => res.text())
      .then(rawSvg => {
        if (!isCancelled && rawSvg && rawSvg.includes('<svg')) {
          setSvgContent(rawSvg);
        }
      })
      .catch(() => {});
    return () => {
      isCancelled = true;
    };
  }, [prefix, name, color]);

  const fallbackUrl = `https://api.iconify.design/${prefix}/${name}.svg?color=${encodeURIComponent(color === 'currentColor' ? '#ffffff' : color)}`;

  if (!svgContent) {
    return (
      <img
        src={fallbackUrl}
        alt={name}
        width={size}
        height={size}
        className={className}
      />
    );
  }

  let modifiedSvg = svgContent;
  if (modifiedSvg.includes('stroke-width')) {
    modifiedSvg = modifiedSvg.replace(/stroke-width="[^"]*"/g, `stroke-width="${strokeWidth}"`);
  } else {
    modifiedSvg = modifiedSvg.replace(/<path/g, `<path stroke-width="${strokeWidth}"`);
  }

  modifiedSvg = modifiedSvg
    .replace(/width="[^"]*"/, `width="${size}"`)
    .replace(/height="[^"]*"/, `height="${size}"`);

  return (
    <div
      style={{ width: `${size}px`, height: `${size}px`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
      className={className}
      dangerouslySetInnerHTML={{ __html: modifiedSvg }}
    />
  );
}

export function IconDetailClient({ collection }: { collection: IconCollectionItem }) {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [iconSize, setIconSize] = useState<number>(32);
  const [strokeWidth, setStrokeWidth] = useState<number>(2);
  const [iconColor, setIconColor] = useState<string>('#06b6d4');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [copiedToast, setCopiedToast] = useState<string | null>(null);

  const [loadedIcons, setLoadedIcons] = useState<string[]>([]);
  const [selectedIcon, setSelectedIcon] = useState<string>('');
  const [displayLimit, setDisplayLimit] = useState<number>(144);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSelectIcon = (name: string) => {
    setSelectedIcon(name);
    if (typeof window !== 'undefined') {
      const current = new URLSearchParams();
      current.set('icon', name);
      const search = current.toString();
      const hash = `#${collection.prefix}:${name}`;
      const newUrl = `${window.location.pathname}?${search}${hash}`;
      window.history.replaceState(null, '', newUrl);
    }
  };

  useEffect(() => {
    if (!mounted) return;
    const iconParam = searchParams?.get('icon');
    if (iconParam) {
      setSelectedIcon(iconParam);
    }
  }, [searchParams, mounted]);

  const colorPresets = [
    { name: 'Cyan', hex: '#06b6d4' },
    { name: 'Rose', hex: '#f43f5e' },
    { name: 'Emerald', hex: '#10b981' },
    { name: 'Amber', hex: '#f59e0b' },
    { name: 'Violet', hex: '#8b5cf6' },
    { name: 'White', hex: '#ffffff' }
  ];

  // Read initial hash on load/refresh
  const requestedHashRef = useRef<string | null>(null);

  useEffect(() => {
    const parseHash = () => {
      const hash = window.location.hash.replace(/^#/, '').trim();
      if (hash) {
        const iconName = hash.includes(':') ? hash.split(':')[1] : hash;
        if (iconName) {
          requestedHashRef.current = iconName;
          setSelectedIcon(iconName);
        }
      }
    };
    parseHash();
    window.addEventListener('hashchange', parseHash);
    return () => window.removeEventListener('hashchange', parseHash);
  }, []);

  // Fetch full icon list from Iconify Collection API
  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    setDisplayLimit(144);
    
    const reqIcon = requestedHashRef.current;
    if (reqIcon) {
      setLoadedIcons([reqIcon]);
      setSelectedIcon(reqIcon);
    } else {
      setLoadedIcons([]);
    }

    fetch(`https://api.iconify.design/collection?prefix=${collection.prefix}`)
      .then(res => res.json())
      .then(data => {
        if (!isCancelled && data) {
          const list: string[] = [];
          if (Array.isArray(data.uncategorized)) {
            list.push(...data.uncategorized);
          }
          if (data.categories && typeof data.categories === 'object') {
            for (const catIcons of Object.values(data.categories)) {
              if (Array.isArray(catIcons)) {
                list.push(...catIcons);
              }
            }
          }
          if (Array.isArray(data.hidden)) {
            list.push(...data.hidden);
          }
          if (list.length > 0) {
            let unique = Array.from(new Set(list));
            const req = requestedHashRef.current;
            if (req) {
              unique = [req, ...unique.filter(n => n !== req)];
              requestedHashRef.current = null;
            }
            setLoadedIcons(unique);
            if (!selectedIcon || selectedIcon === 'icon') {
              setSelectedIcon(unique[0] || 'icon');
            }
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [collection]);

  const allFilteredIcons = useMemo(() => {
    if (!searchQuery.trim()) return loadedIcons;
    const q = searchQuery.toLowerCase();
    return loadedIcons.filter(name => name.toLowerCase().includes(q));
  }, [loadedIcons, searchQuery]);

  const visibleIcons = useMemo(() => {
    return allFilteredIcons.slice(0, displayLimit);
  }, [allFilteredIcons, displayLimit]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && displayLimit < allFilteredIcons.length) {
          setDisplayLimit(prev => Math.min(prev + 96, allFilteredIcons.length));
        }
      },
      { rootMargin: '400px' }
    );

    const el = sentinelRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [displayLimit, allFilteredIcons.length]);

  const copyToClipboard = (text: string, id: string, toastLabel?: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setCopiedToast(toastLabel || text);
    setTimeout(() => {
      setCopiedCode(null);
      setCopiedToast(null);
    }, 2000);
  };

  const currentIcon = selectedIcon || (visibleIcons[0] || 'icon');
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
      <section className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-xl p-6 relative shadow-sm transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-2 pt-1">
            <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] font-sans leading-normal">
              {collection.name}
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30">
              {loadedIcons.length > collection.samples?.length ? loadedIcons.length.toLocaleString() : collection.total_icons.toLocaleString()} Vector Icons
            </span>
            {isLoading && (
              <span className="text-xs text-cyan-500 animate-pulse">Loading catalog...</span>
            )}
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

            {/* Stroke Width */}
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
        <div className="bg-[var(--bg-panel-subtle)] border border-[var(--border-dev)] rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-6">
            <div 
              style={{ width: `${iconSize + 24}px`, height: `${iconSize + 24}px` }} 
              className="p-3 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-dev)] flex items-center justify-center shadow-sm"
            >
              <IconSvgPreview
                prefix={collection.prefix}
                name={currentIcon}
                color={iconColor}
                size={iconSize}
                strokeWidth={strokeWidth}
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

      {/* Toast Notification for Copied Feedback */}
      {copiedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-lg shadow-xl shadow-emerald-500/20 flex items-center gap-2 text-xs font-bold font-sans animate-in fade-in slide-in-from-bottom-2 border border-emerald-400/40">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>Copied <code className="bg-emerald-700/60 px-1.5 py-0.5 rounded font-mono text-[11px] text-white">{copiedToast}</code> to clipboard!</span>
        </div>
      )}

      {/* Full Library Grid with Search & Infinite Scroll */}
      <section className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-xl p-5 shadow-sm transition-colors flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[var(--border-dev)]">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={`Search all ${allFilteredIcons.length} icons in ${collection.name}...`}
              className="dev-input flex-1 px-2.5 py-1 rounded text-xs"
            />
          </div>

          <span className="text-[11px] text-[var(--text-muted)] font-mono">
            Showing <strong>{allFilteredIcons.length.toLocaleString()}</strong> icons
          </span>
        </div>

        {/* Icon Grid */}
        {isLoading && visibleIcons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="w-6 h-6 text-cyan-500 animate-spin" />
            <span className="text-xs font-mono text-[var(--text-muted)] animate-pulse">
              Loading {collection.name} icons...
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 w-full mt-4 opacity-40 pointer-events-none">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="h-24 rounded-lg bg-[var(--bg-panel-subtle)] border border-[var(--border-dev-subtle)] animate-pulse" />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 max-h-[500px] overflow-y-auto pr-1">
            {visibleIcons.map(name => {
              const isSelected = selectedIcon === name;
              const isCopied = copiedCode === `grid-${name}`;
            return (
              <button
                key={name}
                onClick={() => {
                  handleSelectIcon(name);
                  copyToClipboard(`<Icon icon="${collection.prefix}:${name}" />`, `grid-${name}`, `${collection.prefix}:${name}`);
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all cursor-pointer group ${
                  isSelected
                    ? 'bg-cyan-500/15 border-cyan-500 shadow-sm ring-1 ring-cyan-500'
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
                    loading="lazy"
                    className="pointer-events-none"
                  />
                </div>

                <span 
                  className={`text-[10px] font-mono truncate max-w-full text-center px-1 py-0.5 rounded transition-colors ${
                    isCopied
                      ? 'bg-emerald-500 text-white font-bold shadow-sm'
                      : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'
                  }`}
                >
                  {isCopied ? 'Copied!' : name}
                </span>
              </button>
            );
          })}

          {/* Sentinel inside scroll container */}
          {visibleIcons.length < allFilteredIcons.length && (
            <div ref={sentinelRef} className="col-span-full py-4 text-center text-xs text-[var(--text-muted)] flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 text-cyan-500 animate-spin" />
              <span>Loading more icons...</span>
            </div>
          )}
        </div>
      )}
      </section>
    </div>
  );
}
