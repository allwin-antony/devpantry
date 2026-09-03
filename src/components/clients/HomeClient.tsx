'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Flame,
  Type,
  Box,
  Radio,
  ArrowRight,
  Code2,
  Search,
  Zap,
  Check,
  ShieldCheck
} from 'lucide-react';

export function HomeClient() {
  const [activeTab, setActiveTab] = useState<'fonts' | 'icons'>('fonts');
  const [fontSampleText, setFontSampleText] = useState('The quick brown fox jumps over the lazy dog.');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [iconQuery, setIconQuery] = useState('arrow');
  const [iconResults, setIconResults] = useState<{ fullKey: string; prefix: string; name: string }[]>([
    { fullKey: 'lucide:arrow-right', prefix: 'lucide', name: 'arrow-right' },
    { fullKey: 'tabler:arrow-up', prefix: 'tabler', name: 'arrow-up' },
    { fullKey: 'ph:arrow-circle-down-bold', prefix: 'ph', name: 'arrow-circle-down-bold' },
    { fullKey: 'ri:arrow-left-line', prefix: 'ri', name: 'arrow-left-line' },
    { fullKey: 'material-symbols:arrow-forward', prefix: 'material-symbols', name: 'arrow-forward' },
    { fullKey: 'heroicons:arrow-path', prefix: 'heroicons', name: 'arrow-path' },
    { fullKey: 'bi:arrow-repeat', prefix: 'bi', name: 'arrow-repeat' },
    { fullKey: 'solar:arrow-to-top-right-bold', prefix: 'solar', name: 'arrow-to-top-right-bold' }
  ]);
  const [isLoadingIcons, setIsLoadingIcons] = useState(false);

  const heroFonts = [
    { name: 'Inter', slug: 'inter', category: 'Sans Serif', cdn: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap' },
    { name: 'Satoshi', slug: 'satoshi', category: 'Sans Serif', cdn: 'https://api.fontshare.com/v2/css?f[]=satoshi@400,700&display=swap' },
    { name: 'JetBrains Mono', slug: 'jetbrains-mono', category: 'Monospace', cdn: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap' },
    { name: 'Clash Display', slug: 'clash-display', category: 'Display', cdn: 'https://api.fontshare.com/v2/css?f[]=clash-display@600,700&display=swap' },
    { name: 'Fira Code', slug: 'fira-code', category: 'Monospace', cdn: 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;700&display=swap' },
    { name: 'Cabinet Grotesk', slug: 'cabinet-grotesk', category: 'Display', cdn: 'https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@700,800&display=swap' }
  ];

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

  useEffect(() => {
    if (!iconQuery.trim() || iconQuery.trim().length < 2) return;
    setIsLoadingIcons(true);
    const timer = setTimeout(() => {
      fetch(`https://api.iconify.design/search?query=${encodeURIComponent(iconQuery.trim())}&limit=12`)
        .then(res => res.json())
        .then(data => {
          if (data && Array.isArray(data.icons) && data.icons.length > 0) {
            setIconResults(data.icons.slice(0, 8).map((item: string) => {
              const parts = item.split(':');
              return { fullKey: item, prefix: parts[0] || 'icon', name: parts[1] || parts[0] };
            }));
          }
        })
        .catch(() => { })
        .finally(() => setIsLoadingIcons(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [iconQuery]);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const tools = [
    {
      icon: Type,
      iconColor: 'text-amber-500',
      title: 'Open Source Fonts Studio',
      desc: 'Browse, test, and integrate 2,180+ typefaces from Google Fonts, Fontsource, Fontshare, and GitHub with live CDN injection & CSS copy.',
      href: '/fonts',
      badge: '2,180+ Fonts',
      badgeColor: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      icon: Box,
      iconColor: 'text-cyan-500',
      title: 'Vector Icons Studio',
      desc: 'Search 353,000+ vector icons across 238 libraries. Master search, live SVG customizer, deep-link hash navigation, and one-click React copy.',
      href: '/icons',
      badge: '353K+ Icons',
      badgeColor: 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
    {
      icon: Flame,
      iconColor: 'text-rose-500',
      title: 'Chaos Data Studio',
      desc: 'Generate high-entropy test datasets with 13+ field types, BLNS attack payloads, and per-column chaos sliders. Export to JSON, CSV, Zod & SQL.',
      href: '/chaos-data',
      badge: 'Schema GUI',
      badgeColor: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20',
    },
    {
      icon: Radio,
      iconColor: 'text-violet-500',
      title: 'API Chaos Templates',
      desc: 'Real-world API schemas for Stripe, Google SSO, GitHub OAuth, Supabase Auth, Resend, and Twilio — injected with dirty mock payloads.',
      href: '/chaos-templates',
      badge: '17 APIs',
      badgeColor: 'text-violet-600 dark:text-violet-400 bg-violet-500/10 border-violet-500/20',
    }
  ];

  return (
    <div className="h-full overflow-y-auto">
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* HERO                                                              */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-rose-500/8 via-cyan-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-12 flex flex-col items-start gap-6">
          {/* Version pill */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[var(--bg-panel)] border border-[var(--border-dev)] text-[11px] font-mono shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
            </span>
            <span className="text-[var(--text-secondary)] font-semibold">v1.0.0</span>
            {/* <span className="text-[var(--border-dev)]">·</span>
            <span className="text-rose-600 dark:text-rose-400 font-bold">Next.js 16</span> */}
            {/* <ArrowRight className="w-3 h-3 text-[var(--text-muted)]" /> */}
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-[3.5rem] lg:text-[4rem] font-black tracking-tight leading-[1.08] text-[var(--text-primary)] font-sans max-w-3xl">
            <span className="text-rose-500">Developer assets</span> &<br />
            chaos testing toolkit.
          </h1>

          {/* Tagline */}
          <p className="text-base sm:text-lg text-[var(--text-muted)] font-sans max-w-xl leading-relaxed">
            Made for developers who build resilient.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <Link
              href="/fonts"
              className="px-5 py-2.5 rounded-lg bg-rose-500 text-white font-bold text-sm flex items-center gap-2 hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20 cursor-pointer"
            >
              Browse All Fonts
            </Link>
            <Link
              href="/icons"
              className="px-5 py-2.5 rounded-lg bg-[var(--bg-panel)] border border-[var(--border-dev)] text-[var(--text-primary)] font-bold text-sm flex items-center gap-2 hover:border-[var(--text-muted)] transition-colors cursor-pointer"
            >
              Search Icons
            </Link>
            <Link
              href="/chaos-data"
              className="px-5 py-2.5 rounded-lg bg-[var(--bg-panel)] border border-[var(--border-dev)] text-[var(--text-primary)] font-bold text-sm flex items-center gap-2 hover:border-[var(--text-muted)] transition-colors cursor-pointer"
            >
              Chaos Data
            </Link>
          </div>

          {/* Metrics bar */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--text-muted)] mt-4 font-mono">
            <span>2,180+ fonts</span>
            <span className="text-[var(--border-dev)]">·</span>
            <span>353K+ vector icons</span>
            <span className="text-[var(--border-dev)]">·</span>
            <span>238 icon packs</span>
            <span className="text-[var(--border-dev)]">·</span>
            <span>19 API schemas</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* LIVE PLAYGROUND                                                    */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-6 pb-10">
        <div className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-2xl shadow-sm overflow-hidden">
          {/* Tab bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border-dev)]">
            <div className="flex items-center gap-1 bg-[var(--bg-sidebar)] p-0.5 rounded-lg border border-[var(--border-dev)] text-xs">
              <button
                onClick={() => setActiveTab('fonts')}
                className={`px-3 py-1.5 rounded-md text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${activeTab === 'fonts'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
              >
                <Type className="w-3.5 h-3.5" />
                Try Fonts
              </button>
              <button
                onClick={() => setActiveTab('icons')}
                className={`px-3 py-1.5 rounded-md text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${activeTab === 'icons'
                    ? 'bg-cyan-500 text-white shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
              >
                <Box className="w-3.5 h-3.5" />
                Try Icons
              </button>
            </div>

            <Link
              href={activeTab === 'fonts' ? '/fonts' : '/icons'}
              className="text-[11px] font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Font playground */}
          {activeTab === 'fonts' && (
            <div className="p-5 flex flex-col gap-4">
              <input
                type="text"
                value={fontSampleText}
                onChange={e => setFontSampleText(e.target.value)}
                placeholder="Type to preview across fonts..."
                className="dev-input w-full px-4 py-2.5 rounded-lg text-sm"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {heroFonts.map(f => (
                  <div
                    key={f.slug}
                    className="bg-[var(--bg-panel-subtle)] border border-[var(--border-dev)] rounded-xl p-4 flex flex-col gap-2.5 hover:border-rose-500/40 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/fonts/${f.slug}`}
                        className="text-xs font-bold text-[var(--text-primary)] font-sans hover:text-rose-500 transition-colors"
                      >
                        {f.name}
                      </Link>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--pill-bg)] text-[var(--text-muted)] font-mono">
                        {f.category}
                      </span>
                    </div>

                    <div
                      style={{ fontFamily: `'${f.name}', sans-serif` }}
                      className="text-lg text-[var(--text-primary)] truncate font-semibold leading-snug min-h-[28px]"
                    >
                      {fontSampleText || f.name}
                    </div>

                    <div className="pt-2 border-t border-[var(--border-dev-subtle)] flex items-center justify-between text-[10px]">
                      <button
                        onClick={() => copyText(`@import url('${f.cdn}');\nfont-family: '${f.name}', sans-serif;`, `css-${f.slug}`)}
                        className="text-rose-500 hover:underline flex items-center gap-1 cursor-pointer font-bold"
                      >
                        {copiedId === `css-${f.slug}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Code2 className="w-3 h-3" />}
                        <span>{copiedId === `css-${f.slug}` ? 'Copied!' : 'Copy CSS'}</span>
                      </button>
                      <Link
                        href={`/fonts/${f.slug}`}
                        className="text-[var(--text-muted)] hover:text-rose-500 flex items-center gap-1 transition-colors"
                      >
                        Specs <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Icon playground */}
          {activeTab === 'icons' && (
            <div className="p-5 flex flex-col gap-4">
              <div className="flex items-center gap-2 bg-[var(--bg-panel-subtle)] border border-[var(--border-dev)] rounded-lg px-4 py-2.5">
                <Search className="w-4 h-4 text-cyan-500 shrink-0" />
                <input
                  type="text"
                  value={iconQuery}
                  onChange={e => setIconQuery(e.target.value)}
                  placeholder="Search 353,000+ icons..."
                  className="dev-input flex-1 px-2 py-0.5 rounded text-sm border-none bg-transparent"
                />
                {isLoadingIcons && <span className="text-[10px] text-cyan-500 animate-pulse shrink-0">Searching...</span>}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
                {iconResults.slice(0, 8).map(item => (
                  <button
                    key={item.fullKey}
                    onClick={() => copyText(`<Icon icon="${item.fullKey}" />`, `icon-${item.fullKey}`)}
                    title={`Copy <Icon icon="${item.fullKey}" />`}
                    className="bg-[var(--bg-panel-subtle)] border border-[var(--border-dev)] rounded-xl p-3 flex flex-col items-center justify-center gap-2 hover:border-cyan-500 transition-all cursor-pointer group"
                  >
                    <div className="w-7 h-7 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <img
                        src={`https://api.iconify.design/${item.prefix}/${item.name}.svg?color=%2306b6d4`}
                        alt={item.name}
                        width={24}
                        height={24}
                        className="pointer-events-none"
                      />
                    </div>
                    <span className={`text-[10px] font-mono truncate max-w-full text-center ${copiedId === `icon-${item.fullKey}`
                        ? 'text-emerald-500 font-bold'
                        : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)]'
                      }`}>
                      {copiedId === `icon-${item.fullKey}` ? 'Copied!' : item.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TOOLS GRID                                                        */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tools.map(t => {
            const Icon = t.icon;
            return (
              <Link
                key={t.title}
                href={t.href}
                className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-2xl p-6 flex flex-col gap-4 shadow-sm hover:border-rose-500/40 transition-all group cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[var(--bg-panel-subtle)] border border-[var(--border-dev)] flex items-center justify-center">
                    <Icon className={`w-5 h-5 ${t.iconColor}`} />
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${t.badgeColor}`}>
                    {t.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] font-sans mb-1 group-hover:text-rose-500 transition-colors">
                    {t.title}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed font-sans">
                    {t.desc}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--text-muted)] group-hover:text-rose-500 transition-colors mt-auto">
                  <span>Open</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
