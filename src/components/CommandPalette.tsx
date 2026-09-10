'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Terminal,
  Sparkles,
  Type,
  Box,
  Key,
  Flame,
  Radio,
  Sliders,
  Crop,
  FileArchive,
  ArrowRight,
  X
} from 'lucide-react';

interface PaletteItem {
  id: string;
  category: 'Tools' | 'Fonts' | 'Icons' | 'API Fixtures' | 'Actions';
  title: string;
  subtitle?: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  keywords?: string[];
}

const PALETTE_ITEMS: PaletteItem[] = [
  // Tools
  {
    id: 'tool-overview',
    category: 'Tools',
    title: 'Overview & Suite Dashboard',
    subtitle: 'High-level developer utility matrix and system health',
    href: '/',
    icon: Terminal,
    badge: 'Hub',
    keywords: ['home', 'dashboard', 'start', 'matrix']
  },
  {
    id: 'tool-bg-removal',
    category: 'Tools',
    title: 'Edge AI Background Remover',
    subtitle: 'Zero-latency, client-side WebAssembly neural segmentation',
    href: '/background-remover',
    icon: Sparkles,
    badge: 'Edge AI',
    keywords: ['remove', 'cutout', 'transparent', 'matte', 'bokeh', 'ai']
  },
  {
    id: 'tool-resizer',
    category: 'Tools',
    title: 'Image Resizer & Artboard Studio',
    subtitle: 'Dimension scaling, aspect ratio framing, artboard padding',
    href: '/image-resizer',
    icon: Crop,
    badge: 'Artboard',
    keywords: ['crop', 'scale', 'aspect ratio', 'dimensions', 'canvas']
  },
  {
    id: 'tool-compressor',
    category: 'Tools',
    title: 'Image Compressor & WebP Converter',
    subtitle: 'Target file-size budgeting (< 500 KB, < 1 MB) & WebP conversion',
    href: '/image-compressor',
    icon: FileArchive,
    badge: 'Budgeting',
    keywords: ['compress', 'webp', 'optimize', 'file size', 'shrink', 'quality']
  },
  {
    id: 'tool-fonts',
    category: 'Tools',
    title: 'Open Source Fonts Studio',
    subtitle: 'Explore & test 2,180+ typefaces from Fontshare, Fontsource & GitHub',
    href: '/fonts',
    icon: Type,
    badge: '2,180+',
    keywords: ['typography', 'type', 'google fonts', 'fontsource', 'fontshare', 'webfont']
  },
  {
    id: 'tool-icons',
    category: 'Tools',
    title: 'Vector Icons Studio',
    subtitle: 'Search 353,000+ vector icons across 238 open-source libraries',
    href: '/icons',
    icon: Box,
    badge: '353K+',
    keywords: ['svg', 'lucide', 'heroicons', 'tabler', 'symbols', 'react icons']
  },
  {
    id: 'tool-jwt',
    category: 'Tools',
    title: 'Client-Side JWT Inspector & Chaos Tamperer',
    subtitle: '100% in-memory token decoder, RFC claim hints & auth chaos simulation',
    href: '/jwt-decoder',
    icon: Key,
    badge: 'Zero Leak',
    keywords: ['jwt', 'oauth', 'token', 'decode', 'tamper', 'none', 'hs256', 'bearer']
  },
  {
    id: 'tool-chaos-data',
    category: 'Tools',
    title: 'Chaos Data Studio & Schema Builder',
    subtitle: 'High-entropy mock generator with 13+ types, BLNS & custom schemas',
    href: '/mock-data',
    icon: Flame,
    badge: 'GUI',
    keywords: ['mock', 'faker', 'blns', 'entropy', 'dirty data', 'sql', 'zod', 'csv']
  },
  {
    id: 'tool-chaos-templates',
    category: 'Tools',
    title: 'API Chaos Templates & Mock Vault',
    subtitle: 'Real-world response fixtures for Stripe, Supabase, Google SSO & GitHub',
    href: '/api-templates',
    icon: Radio,
    badge: '17 APIs',
    keywords: ['stripe', 'supabase', 'oauth', 'fixture', 'sso', 'mock response']
  },

  // Popular Typefaces
  {
    id: 'font-inter',
    category: 'Fonts',
    title: 'Inter',
    subtitle: 'Rasmus Andersson • Clean geometric sans-serif for UI design',
    href: '/fonts/inter',
    icon: Type,
    badge: 'Sans',
    keywords: ['inter', 'sans', 'popular']
  },
  {
    id: 'font-jetbrains-mono',
    category: 'Fonts',
    title: 'JetBrains Mono',
    subtitle: 'JetBrains • Typeface made for developers with code ligatures',
    href: '/fonts/jetbrains-mono',
    icon: Type,
    badge: 'Mono',
    keywords: ['jetbrains', 'code', 'monospace', 'ligatures']
  },
  {
    id: 'font-fira-code',
    category: 'Fonts',
    title: 'Fira Code',
    subtitle: 'Nikita Prokopov • Free monospaced font with programming ligatures',
    href: '/fonts/fira-code',
    icon: Type,
    badge: 'Mono',
    keywords: ['fira', 'code', 'ligatures']
  },
  {
    id: 'font-satoshi',
    category: 'Fonts',
    title: 'Satoshi',
    subtitle: 'Fontshare / ITF • Modern neo-grotesque sans-serif',
    href: '/fonts/satoshi',
    icon: Type,
    badge: 'Display',
    keywords: ['satoshi', 'fontshare', 'itf']
  },
  {
    id: 'font-clash-display',
    category: 'Fonts',
    title: 'Clash Display',
    subtitle: 'Fontshare / ITF • High-contrast headline display typeface',
    href: '/fonts/clash-display',
    icon: Type,
    badge: 'Display',
    keywords: ['clash', 'display', 'headline']
  },
  {
    id: 'font-outfit',
    category: 'Fonts',
    title: 'Outfit',
    subtitle: 'Outfit.io • Geometric display typeface inspired by brand system',
    href: '/fonts/outfit',
    icon: Type,
    badge: 'Geometric',
    keywords: ['outfit', 'geometric']
  },

  // Popular Icon Sets
  {
    id: 'icon-lucide',
    category: 'Icons',
    title: 'Lucide Icons',
    subtitle: 'Beautiful & consistent icon toolkit made by the community',
    href: '/icons/lucide',
    icon: Box,
    badge: '1,500+ SVGs',
    keywords: ['lucide', 'feather', 'icons']
  },
  {
    id: 'icon-tabler',
    category: 'Icons',
    title: 'Tabler Icons',
    subtitle: 'Over 5,200 pixel-perfect vector icons for modern web design',
    href: '/icons/tabler',
    icon: Box,
    badge: '5,200+ SVGs',
    keywords: ['tabler', 'stroke']
  },
  {
    id: 'icon-heroicons',
    category: 'Icons',
    title: 'Heroicons',
    subtitle: 'Tailwind Labs • Hand-crafted SVG icons in outline and solid',
    href: '/icons/heroicons',
    icon: Box,
    badge: 'Tailwind Labs',
    keywords: ['heroicons', 'tailwind']
  },
  {
    id: 'icon-ph',
    category: 'Icons',
    title: 'Phosphor Icons',
    subtitle: 'Flexible icon family for interfaces, diagrams, and presentations',
    href: '/icons/ph',
    icon: Box,
    badge: 'Phosphor',
    keywords: ['phosphor', 'ph']
  },

  // API Fixtures
  {
    id: 'api-stripe',
    category: 'API Fixtures',
    title: 'Stripe Billing & Subscription Fixture',
    subtitle: 'Customer invoice, subscription lifecycle, and charge payloads',
    href: '/api-templates/stripe-billing',
    icon: Radio,
    badge: 'E-Commerce',
    keywords: ['stripe', 'billing', 'payments', 'invoice', 'charge']
  },
  {
    id: 'api-supabase',
    category: 'API Fixtures',
    title: 'Supabase Auth & Session Schema',
    subtitle: 'JWT bearer tokens, session objects, and user metadata',
    href: '/api-templates/supabase-auth',
    icon: Radio,
    badge: 'Auth',
    keywords: ['supabase', 'session', 'jwt', 'auth']
  },
  {
    id: 'api-google-sso',
    category: 'API Fixtures',
    title: 'Google SSO & OpenID Connect',
    subtitle: 'OAuth2 token exchange, ID token claims, and user profile',
    href: '/api-templates/google-sso',
    icon: Radio,
    badge: 'SSO',
    keywords: ['google', 'sso', 'oauth', 'oidc']
  },
  {
    id: 'api-github-oauth',
    category: 'API Fixtures',
    title: 'GitHub OAuth & App Webhooks',
    subtitle: 'Installation tokens, commit events, and webhook deliveries',
    href: '/api-templates/github-oauth',
    icon: Radio,
    badge: 'Developer',
    keywords: ['github', 'oauth', 'webhook']
  },

  // Actions
  {
    id: 'act-jwt-expire',
    category: 'Actions',
    title: 'Simulate Expired JWT (-5m)',
    subtitle: 'Jump to JWT Inspector with active expiry test',
    href: '/jwt-decoder',
    icon: Sliders,
    badge: 'Tamper',
    keywords: ['expire', 'jwt', 'auth guard', '401']
  },
  {
    id: 'act-jwt-none',
    category: 'Actions',
    title: 'Simulate "alg": "none" Exploit',
    subtitle: 'Test backend signature verification against algorithm confusion',
    href: '/jwt-decoder',
    icon: Key,
    badge: 'Exploit',
    keywords: ['alg', 'none', 'cve', 'exploit', 'jwt']
  }
];

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const CommandPaletteModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input when opened
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Filter items
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PALETTE_ITEMS;

    return PALETTE_ITEMS.filter(item => {
      const inTitle = item.title.toLowerCase().includes(q);
      const inSub = item.subtitle?.toLowerCase().includes(q);
      const inCat = item.category.toLowerCase().includes(q);
      const inKeywords = item.keywords?.some(k => k.toLowerCase().includes(q));
      return inTitle || inSub || inCat || inKeywords;
    });
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % (filteredItems.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = filteredItems[selectedIndex];
        if (selected) {
          router.push(selected.href);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredItems, selectedIndex, router, onClose]);

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const activeEl = listRef.current.querySelector('[data-active="true"]');
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4 bg-black/60 backdrop-blur-xs animate-fade-in font-mono"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[var(--bg-panel)] border-2 border-[var(--border-dev)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--border-dev)] bg-[var(--bg-app)]">
          <Search className="w-5 h-5 text-rose-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder='Type a command or search (e.g. "jwt", "inter", "remove", "stripe")...'
            className="w-full bg-transparent text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-[var(--pill-bg)] text-[var(--text-muted)] border border-[var(--border-dev)]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto p-2 divide-y divide-[var(--border-dev)]/40 no-scrollbar"
        >
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-[var(--text-muted)]">
              No matching tools, typefaces, or API fixtures found for &quot;{query}&quot;.
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={item.id}
                  data-active={isSelected ? 'true' : 'false'}
                  onClick={() => {
                    router.push(item.href);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`px-3 py-2.5 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-rose-500/15 border border-rose-500/30 text-[var(--text-primary)]'
                      : 'hover:bg-[var(--pill-bg)] text-[var(--text-secondary)] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        isSelected
                          ? 'bg-rose-500 text-white shadow-xs'
                          : 'bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-[var(--text-muted)]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-[var(--text-primary)] truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-[var(--bg-sidebar)] text-[var(--text-muted)] border border-[var(--border-dev)]">
                          {item.category}
                        </span>
                        {item.badge && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold border border-rose-500/20">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {item.subtitle && (
                        <span className="text-[11px] text-[var(--text-muted)] truncate mt-0.5">
                          {item.subtitle}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 text-xs">
                    {isSelected && (
                      <span className="text-[10px] text-rose-500 font-bold flex items-center gap-1">
                        Jump <ArrowRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="px-4 py-2 bg-[var(--bg-app)] border-t border-[var(--border-dev)] flex items-center justify-between text-[10px] text-[var(--text-muted)]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--pill-bg)] border border-[var(--border-dev)]">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--pill-bg)] border border-[var(--border-dev)]">↓</kbd>
              <span>Navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--pill-bg)] border border-[var(--border-dev)]">↵</kbd>
              <span>Select</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--pill-bg)] border border-[var(--border-dev)]">ESC</kbd>
              <span>Close</span>
            </span>
          </div>
          <span className="font-semibold text-rose-500">DevPantry Global Search</span>
        </div>
      </div>
    </div>
  );
};

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return <CommandPaletteModal onClose={onClose} />;
};
