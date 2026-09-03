'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  Flame, 
  Type, 
  Box, 
  Radio, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Code2, 
  Layers, 
  Terminal, 
  CheckCircle2, 
  Copy,
  Search,
  Zap,
  Globe,
  RefreshCw,
  Cpu,
  Download,
  Check
} from 'lucide-react';
import { getAllFonts, getFontCdnStylesheet } from '@/lib/datasetLoader';
import { generateNaughtyString, generateFloatPrecisionTrap, generatePunycodeEmail, generateChaosDate } from '@/utilities/chaos-data/dirtyDataPools';

export function HomeClient() {
  const [activeTab, setActiveTab] = useState<'fonts' | 'icons' | 'chaos'>('fonts');
  
  // Font widget state
  const [fontSampleText, setFontSampleText] = useState('Build fast. Break nothing.');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Icon widget state
  const [iconQuery, setIconQuery] = useState('cart');
  const [iconResults, setIconResults] = useState<{ fullKey: string; prefix: string; name: string }[]>([
    { fullKey: 'lucide:shopping-cart', prefix: 'lucide', name: 'shopping-cart' },
    { fullKey: 'tabler:shopping-cart', prefix: 'tabler', name: 'shopping-cart' },
    { fullKey: 'solar:cart-bold', prefix: 'solar', name: 'cart-bold' },
    { fullKey: 'ph:shopping-cart-bold', prefix: 'ph', name: 'shopping-cart-bold' },
    { fullKey: 'bi:cart-check-fill', prefix: 'bi', name: 'cart-check-fill' },
    { fullKey: 'ri:shopping-cart-2-line', prefix: 'ri', name: 'shopping-cart-2-line' },
    { fullKey: 'material-symbols:shopping-bag', prefix: 'material-symbols', name: 'shopping-bag' },
    { fullKey: 'heroicons:shopping-bag-solid', prefix: 'heroicons', name: 'shopping-bag-solid' }
  ]);
  const [isLoadingIcons, setIsLoadingIcons] = useState(false);

  // Chaos widget state
  const [generatedChaos, setGeneratedChaos] = useState<{ title: string; value: string; type: string }>({
    title: 'BiDi & Zero-Width Trap',
    value: 'test\u202E\u0000\uFEFF@ex\u0430mple.com',
    type: 'Punycode Email'
  });

  // Hero Quick Specimen Fonts
  const heroFonts = [
    { name: 'Inter', slug: 'inter', category: 'Sans', cdn: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap' },
    { name: 'Satoshi', slug: 'satoshi', category: 'Sans', cdn: 'https://api.fontshare.com/v2/css?f[]=satoshi@400,700&display=swap' },
    { name: 'JetBrains Mono', slug: 'jetbrains-mono', category: 'Mono', cdn: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap' },
    { name: 'Clash Display', slug: 'clash-display', category: 'Display', cdn: 'https://api.fontshare.com/v2/css?f[]=clash-display@600,700&display=swap' },
    { name: 'Fira Code', slug: 'fira-code', category: 'Mono', cdn: 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;700&display=swap' },
    { name: 'Cabinet Grotesk', slug: 'cabinet-grotesk', category: 'Display', cdn: 'https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@700,800&display=swap' }
  ];

  // Load hero font stylesheets
  useEffect(() => {
    heroFonts.forEach(f => {
      if (!document.querySelector(`link[data-font-slug="${f.slug}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = f.cdn;
        link.setAttribute('data-font-slug', f.slug);
        document.head.appendChild(link);
      }
    });
  }, []);

  // Icon search on type
  useEffect(() => {
    if (!iconQuery.trim() || iconQuery.trim().length < 2) return;
    setIsLoadingIcons(true);
    const timer = setTimeout(() => {
      fetch(`https://api.iconify.design/search?query=${encodeURIComponent(iconQuery.trim())}&limit=12`)
        .then(res => res.json())
        .then(data => {
          if (data && Array.isArray(data.icons) && data.icons.length > 0) {
            const parsed = data.icons.map((item: string) => {
              const parts = item.split(':');
              return {
                fullKey: item,
                prefix: parts[0] || 'icon',
                name: parts[1] || parts[0]
              };
            });
            setIconResults(parsed);
          }
        })
        .catch(() => {})
        .finally(() => setIsLoadingIcons(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [iconQuery]);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const generateNewChaos = (type: 'blns' | 'punycode' | 'float' | 'date') => {
    if (type === 'blns') {
      const val = generateNaughtyString(1.0);
      setGeneratedChaos({ title: 'Big List of Naughty Strings (BLNS)', value: val, type: 'Security / Boundary Attack' });
    } else if (type === 'punycode') {
      const val = generatePunycodeEmail();
      setGeneratedChaos({ title: 'Punycode & Homoglyph Collision', value: val, type: 'Punycode Unicode Email' });
    } else if (type === 'float') {
      const val = String(generateFloatPrecisionTrap());
      setGeneratedChaos({ title: 'IEEE 754 Floating Precision Trap', value: val, type: 'Floating Point Anomaly' });
    } else {
      const val = generateChaosDate();
      setGeneratedChaos({ title: 'Epoch Edge Date / Y2038 Overflow', value: val, type: 'Timestamp Anomaly' });
    }
  };

  const coreStudios = [
    {
      id: 'chaos-data',
      title: 'Chaos Mock Data & Schema Studio',
      badge: 'Synthetic Engine',
      badgeColor: 'text-rose-600 dark:text-rose-400 bg-rose-500/15 border-rose-500/30',
      description: 'Generate dirty, high-entropy test datasets across E-Commerce, B2B Users, Invoicing, and 100+ BLNS attack payloads. Compose custom tables with 13+ field types and per-column entropy sliders.',
      icon: Flame,
      iconColor: 'text-rose-500',
      href: '/chaos-data',
      stats: '100+ BLNS Strings • 13 Types • JSON / CSV / Zod / SQL',
      cta: 'Launch Data Studio'
    },
    {
      id: 'fonts',
      title: 'Open Source Fonts Studio',
      badge: '2,180+ Fonts',
      badgeColor: 'text-amber-600 dark:text-amber-400 bg-amber-500/15 border-amber-500/30',
      description: 'Search, test, and integrate 2,180+ open-source typefaces from Fontsource, Google Fonts, Fontshare, and GitHub. Live typography tester with interactive sizing, weights, tracking, and CSS @import generation.',
      icon: Type,
      iconColor: 'text-amber-500',
      href: '/fonts',
      stats: '2,180+ Typefaces • OFL & Commercial Free • CDN Injection',
      cta: 'Explore Fonts Studio'
    },
    {
      id: 'icons',
      title: 'Vector Icons Studio & Master Search',
      badge: '353K+ SVGs',
      badgeColor: 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/15 border-cyan-500/30',
      description: 'Search and inspect 353,000+ vector icons across 238 icon packs: Lucide, Tabler, Google Material Symbols, Heroicons, Phosphor, and Simple Icons. Master search, live SVG customizer, and one-click React JSX copy.',
      icon: Box,
      iconColor: 'text-cyan-500',
      href: '/icons',
      stats: '353,000+ SVGs • 238 Libraries • Live Master Search',
      cta: 'Open Icon Browser'
    },
    {
      id: 'chaos-templates',
      title: 'API Chaos Templates & Blueprints',
      badge: '17 Real APIs',
      badgeColor: 'text-violet-600 dark:text-violet-400 bg-violet-500/15 border-violet-500/30',
      description: 'Production API response schemas for Stripe Billing, Google SSO, GitHub OAuth, Supabase Auth, Resend, and Twilio — injected with chaotic mock payloads. Build custom JSON chaos blueprints and export TypeScript fixtures.',
      icon: Radio,
      iconColor: 'text-violet-500',
      href: '/chaos-templates',
      stats: '17 Production Schemas • Custom JSON Builder • TypeScript SDK',
      cta: 'Test API Schemas'
    }
  ];

  const popularFonts = [
    { name: 'Inter', slug: 'inter', category: 'Sans' },
    { name: 'Satoshi', slug: 'satoshi', category: 'Sans' },
    { name: 'JetBrains Mono', slug: 'jetbrains-mono', category: 'Mono' },
    { name: 'Fira Code', slug: 'fira-code', category: 'Mono' },
    { name: 'Clash Display', slug: 'clash-display', category: 'Display' },
    { name: 'Cabinet Grotesk', slug: 'cabinet-grotesk', category: 'Display' },
    { name: 'Poppins', slug: 'poppins', category: 'Sans' },
    { name: 'Roboto', slug: 'roboto', category: 'Sans' }
  ];

  const popularIconLibs = [
    { name: 'Lucide Icons', prefix: 'lucide', count: '1,866' },
    { name: 'Tabler Icons', prefix: 'tabler', count: '6,184' },
    { name: 'Material Symbols', prefix: 'material-symbols', count: '15,611' },
    { name: 'Heroicons', prefix: 'heroicons', count: '1,200' },
    { name: 'Phosphor', prefix: 'ph', count: '7,488' },
    { name: 'Simple Icons', prefix: 'simple-icons', count: '3,275' }
  ];

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 flex flex-col gap-6 max-w-7xl mx-auto w-full font-mono">
      {/* ── 1. HERO COMMAND BANNER ── */}
      <section className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-sm transition-colors">
        <div className="absolute -right-16 -top-16 w-96 h-96 bg-gradient-to-br from-rose-500/15 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-300 text-xs font-bold mb-3 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span>Next.js 16 Developer Asset Engine & Chaos Sandbox</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--text-primary)] font-sans mb-3 leading-tight">
              The Open-Source Developer Engine for <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-amber-500 to-cyan-500">Typography, Vector Icons & API Chaos</span>
            </h1>

            <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed font-sans max-w-2xl">
              Consolidating <strong>2,180+ typefaces</strong> with live font CDN injection, <strong>353,000+ vector icons</strong> across 238 libraries with global master search, and high-entropy <strong>dirty synthetic data engines</strong> for frontend resilience.
            </p>

            {/* Quick Stats Badges */}
            <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-[var(--border-dev-subtle)] text-xs text-[var(--text-secondary)]">
              <span className="px-2.5 py-1 rounded-md bg-[var(--bg-panel-subtle)] border border-[var(--border-dev)] font-mono">
                🔤 <strong className="text-[var(--text-primary)]">2,180+</strong> Fonts
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[var(--bg-panel-subtle)] border border-[var(--border-dev)] font-mono">
                🎨 <strong className="text-[var(--text-primary)]">353,000+</strong> Icons (238 Libs)
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[var(--bg-panel-subtle)] border border-[var(--border-dev)] font-mono">
                ⚡ <strong className="text-[var(--text-primary)]">17</strong> API Schemas
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[var(--bg-panel-subtle)] border border-[var(--border-dev)] font-mono">
                🧪 <strong className="text-[var(--text-primary)]">100+</strong> BLNS Naughty Strings
              </span>
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Client-Side Privacy
              </span>
            </div>
          </div>

          {/* Direct CTA Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full sm:w-auto shrink-0">
            <Link
              href="/fonts"
              className="px-4 py-2.5 rounded-xl bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-rose-600 transition-all shadow-md shadow-rose-500/20 cursor-pointer"
            >
              <Type className="w-4 h-4" />
              <span>Explore 2,180+ Fonts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/icons"
              className="px-4 py-2.5 rounded-xl bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-cyan-600 transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
            >
              <Box className="w-4 h-4" />
              <span>Search 353K+ Icons</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/chaos-data"
              className="px-4 py-2 rounded-xl bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-[var(--text-primary)] font-bold text-xs flex items-center justify-center gap-2 hover:border-rose-500/50 transition-colors"
            >
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span>Chaos Data Studio</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. INTERACTIVE LIVE QUICK-WORKBENCH WIDGET ── */}
      <section className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-2xl p-5 shadow-sm transition-colors flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border-dev)]">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-[var(--text-primary)] font-sans uppercase">
              Instant Interactive Quick-Playground
            </span>
          </div>

          {/* Playground Tabs */}
          <div className="flex items-center gap-1 bg-[var(--bg-sidebar)] p-1 rounded-lg border border-[var(--border-dev)] text-xs">
            <button
              onClick={() => setActiveTab('fonts')}
              className={`px-3 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'fonts'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Instant Fonts</span>
            </button>

            <button
              onClick={() => setActiveTab('icons')}
              className={`px-3 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'icons'
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>Instant Icons</span>
            </button>

            <button
              onClick={() => setActiveTab('chaos')}
              className={`px-3 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'chaos'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Instant Chaos Data</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Instant Fonts Live Tester */}
        {activeTab === 'fonts' && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 bg-[var(--bg-panel-subtle)] border border-[var(--border-dev)] rounded-lg px-3 py-2">
              <span className="text-[10px] text-[var(--text-muted)] font-bold">TYPE TO TEST:</span>
              <input
                type="text"
                value={fontSampleText}
                onChange={e => setFontSampleText(e.target.value)}
                placeholder="Type anything to test across all fonts simultaneously..."
                className="dev-input flex-1 px-2.5 py-1 rounded text-xs"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {heroFonts.map(f => (
                <div
                  key={f.slug}
                  className="bg-[var(--bg-panel-subtle)] border border-[var(--border-dev)] rounded-xl p-3.5 flex flex-col justify-between gap-2 hover:border-rose-500/40 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/fonts/${f.slug}`}
                      className="text-xs font-bold text-[var(--text-primary)] font-sans hover:text-rose-500 transition-colors"
                    >
                      {f.name}
                    </Link>
                    <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-[var(--pill-bg)] text-[var(--text-muted)]">
                      {f.category}
                    </span>
                  </div>

                  <div
                    style={{ fontFamily: `'${f.name}', sans-serif` }}
                    className="text-lg text-[var(--text-primary)] truncate py-1 font-semibold"
                  >
                    {fontSampleText || f.name}
                  </div>

                  <div className="pt-2 border-t border-[var(--border-dev-subtle)] flex items-center justify-between text-[10px]">
                    <button
                      onClick={() => copyText(`@import url('${f.cdn}');\nfont-family: '${f.name}', sans-serif;`, `css-${f.slug}`)}
                      className="text-rose-500 hover:underline flex items-center gap-1 cursor-pointer font-bold"
                    >
                      {copiedId === `css-${f.slug}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Code2 className="w-3 h-3" />}
                      <span>{copiedId === `css-${f.slug}` ? 'Copied CSS' : 'Copy CSS'}</span>
                    </button>

                    <Link
                      href={`/fonts/${f.slug}`}
                      className="text-[var(--text-secondary)] hover:text-rose-500 flex items-center gap-1"
                    >
                      <span>Full Specs</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Instant Icons Live Search & Copy */}
        {activeTab === 'icons' && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 bg-[var(--bg-panel-subtle)] border border-[var(--border-dev)] rounded-lg px-3 py-2">
              <Search className="w-3.5 h-3.5 text-cyan-500" />
              <input
                type="text"
                value={iconQuery}
                onChange={e => setIconQuery(e.target.value)}
                placeholder="Search across 353K+ icons (cart, user, lock, github, shield, star)..."
                className="dev-input flex-1 px-2.5 py-1 rounded text-xs"
              />
              {isLoadingIcons && <span className="text-[10px] text-cyan-500 animate-pulse">Searching...</span>}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
              {iconResults.slice(0, 8).map(item => (
                <button
                  key={item.fullKey}
                  onClick={() => copyText(`<Icon icon="${item.fullKey}" />`, `icon-${item.fullKey}`)}
                  title={`Click to copy <Icon icon="${item.fullKey}" />`}
                  className="bg-[var(--bg-panel-subtle)] border border-[var(--border-dev)] rounded-xl p-3 flex flex-col items-center justify-center gap-1.5 hover:border-cyan-500 hover:bg-[var(--bg-sidebar)] transition-all cursor-pointer group"
                >
                  <div className="w-8 h-8 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <img
                      src={`https://api.iconify.design/${item.prefix}/${item.name}.svg?color=%2306b6d4`}
                      alt={item.name}
                      width={28}
                      height={28}
                      className="pointer-events-none"
                    />
                  </div>

                  <span className={`text-[10px] font-mono truncate max-w-full text-center px-1 rounded ${
                    copiedId === `icon-${item.fullKey}`
                      ? 'bg-emerald-500 text-white font-bold'
                      : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'
                  }`}>
                    {copiedId === `icon-${item.fullKey}` ? 'Copied!' : item.name}
                  </span>

                  <span className="text-[8px] px-1 rounded bg-[var(--pill-bg)] text-cyan-600 dark:text-cyan-400 font-mono font-bold truncate max-w-full">
                    {item.prefix}
                  </span>
                </button>
              ))}
            </div>

            <div className="text-center pt-1">
              <Link
                href={`/icons#${iconResults[0]?.fullKey || 'lucide:shopping-cart'}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-500 hover:underline"
              >
                <span>Open Full Vector Icon Browser with 353K+ SVGs & Customizer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Tab 3: Instant Chaos Data Generator */}
        {activeTab === 'chaos' && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] text-[var(--text-muted)] font-bold mr-1">SYNTHESIZE:</span>
              <button
                onClick={() => generateNewChaos('punycode')}
                className="px-2.5 py-1 rounded bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-xs font-bold text-[var(--text-primary)] hover:border-emerald-500 transition-colors cursor-pointer"
              >
                Punycode Email
              </button>
              <button
                onClick={() => generateNewChaos('blns')}
                className="px-2.5 py-1 rounded bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-xs font-bold text-[var(--text-primary)] hover:border-emerald-500 transition-colors cursor-pointer"
              >
                BLNS Naughty String
              </button>
              <button
                onClick={() => generateNewChaos('float')}
                className="px-2.5 py-1 rounded bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-xs font-bold text-[var(--text-primary)] hover:border-emerald-500 transition-colors cursor-pointer"
              >
                Float Precision (0.1+0.2)
              </button>
              <button
                onClick={() => generateNewChaos('date')}
                className="px-2.5 py-1 rounded bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-xs font-bold text-[var(--text-primary)] hover:border-emerald-500 transition-colors cursor-pointer"
              >
                Y2038 / Epoch Timestamp
              </button>
            </div>

            <div className="bg-[var(--bg-panel-subtle)] border border-[var(--border-dev)] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-[var(--text-primary)] font-sans">{generatedChaos.title}</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    {generatedChaos.type}
                  </span>
                </div>
                <code className="text-xs text-rose-500 font-mono break-all font-bold select-all">
                  {generatedChaos.value}
                </code>
              </div>

              <button
                onClick={() => copyText(generatedChaos.value, 'chaos-val')}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer shrink-0"
              >
                {copiedId === 'chaos-val' ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'chaos-val' ? 'Copied!' : 'Copy Value'}</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ── 3. BENTO GRID: 4 CORE STUDIOS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {coreStudios.map(s => {
          const IconComp = s.icon;
          return (
            <div
              key={s.id}
              className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-2xl p-6 flex flex-col justify-between gap-4 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--bg-panel-subtle)] border border-[var(--border-dev)] flex items-center justify-center shadow-sm">
                      <IconComp className={`w-5 h-5 ${s.iconColor}`} />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-[var(--text-primary)] font-sans group-hover:text-rose-500 transition-colors">
                        {s.title}
                      </h2>
                      <span className="text-[10px] text-[var(--text-muted)] font-mono">{s.stats}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border shrink-0 ${s.badgeColor}`}>
                    {s.badge}
                  </span>
                </div>

                <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans">
                  {s.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--border-dev-subtle)] flex items-center justify-between">
                <span className="text-[10px] text-[var(--text-muted)] font-mono">100% Free & Open-Source</span>

                <Link
                  href={s.href}
                  className="px-3.5 py-1.5 rounded-lg bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-xs font-bold text-[var(--text-primary)] hover:border-rose-500 hover:text-rose-500 flex items-center gap-1.5 transition-colors"
                >
                  <span>{s.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 4. POPULAR FONTS & ICON DIRECTORY QUICK-TAGS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Popular Fonts Quick Links */}
        <div className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-[var(--border-dev-subtle)]">
            <span className="font-bold text-[var(--text-primary)] flex items-center gap-1.5 font-sans">
              <Type className="w-3.5 h-3.5 text-amber-500" />
              <span>Trending Developer & Design Fonts</span>
            </span>
            <Link href="/fonts" className="text-[11px] text-rose-500 hover:underline flex items-center gap-1 font-bold">
              <span>View All 2,180+</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {popularFonts.map(f => (
              <Link
                key={f.slug}
                href={`/fonts/${f.slug}`}
                className="px-2.5 py-1 rounded-lg bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-rose-500/50 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <span className="font-bold">{f.name}</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-[var(--pill-bg)] text-[var(--text-muted)] font-mono">
                  {f.category}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Popular Icon Libraries Quick Links */}
        <div className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-[var(--border-dev-subtle)]">
            <span className="font-bold text-[var(--text-primary)] flex items-center gap-1.5 font-sans">
              <Box className="w-3.5 h-3.5 text-cyan-500" />
              <span>Popular Icon Packages (353K+ SVGs)</span>
            </span>
            <Link href="/icons" className="text-[11px] text-cyan-500 hover:underline flex items-center gap-1 font-bold">
              <span>View All 238 Libs</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {popularIconLibs.map(l => (
              <Link
                key={l.prefix}
                href={`/icons/${l.prefix}`}
                className="px-2.5 py-1 rounded-lg bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-cyan-500/50 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <span className="font-bold">{l.name}</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-[var(--pill-bg)] text-cyan-600 dark:text-cyan-400 font-mono font-bold">
                  {l.count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
