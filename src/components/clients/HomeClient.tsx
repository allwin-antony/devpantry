'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  ShieldCheck,
  Sparkles,
  Maximize2,
  HardDrive,
  Key,
  Share2,
  Users
} from 'lucide-react';
import { IconRenderer, loadMultiPrefixIcons } from '@/lib/iconBatchLoader';

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
    { name: 'Playfair Display', slug: 'playfair-display', category: 'Serif', cdn: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap' },
    { name: 'JetBrains Mono', slug: 'jetbrains-mono', category: 'Monospace', cdn: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap' },
    { name: 'Clash Display', slug: 'clash-display', category: 'Display', cdn: 'https://api.fontshare.com/v2/css?f[]=clash-display@600,700&display=swap' },
    { name: 'Syne', slug: 'syne', category: 'Display', cdn: 'https://fonts.googleapis.com/css2?family=Syne:wght@400;700&display=swap' },
    { name: 'Orbitron', slug: 'orbitron', category: 'Display', cdn: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap' }
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
            const parsed = data.icons.slice(0, 8).map((item: string) => {
              const parts = item.split(':');
              return { fullKey: item, prefix: parts[0] || 'lucide', name: parts[1] || parts[0] };
            });
            setIconResults(parsed);
            loadMultiPrefixIcons(parsed);
          }
        })
        .catch(() => { })
        .finally(() => setIsLoadingIcons(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [iconQuery]);

  useEffect(() => {
    if (iconResults.length > 0) {
      loadMultiPrefixIcons(iconResults);
    }
  }, [iconResults]);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const tools = [
    {
      icon: HardDrive,
      title: 'Edge Image Compressor',
      desc: 'Compress unlimited images under target budgets (<500 KB, <1 MB) and convert between WebP, PNG, and JPEG.',
      href: '/image-compressor',
      badge: 'UTILITY',
    },
    {
      icon: Sparkles,
      title: 'Edge AI Background Removal',
      desc: 'Instant, private background removal powered entirely in your browser via WebGPU. Unlimited cutouts, no signup.',
      href: '/background-remover',
      badge: 'BETA',
    },
    {
      icon: Maximize2,
      title: 'Image Resizer',
      desc: 'Batch process image assets for responsive breakpoints with aggressive compression.',
      href: '/image-resizer',
      badge: 'UTILITY',
    },
    {
      icon: Key,
      title: 'JWT Inspector',
      desc: 'Local-only token decoder and validator for secure payload inspection during development.',
      href: '/jwt-decoder',
      badge: 'SECURITY',
    },
    {
      icon: Share2,
      title: 'Social Share Preview',
      desc: 'Preview and validate Open Graph & Twitter Cards across 6 platforms instantly. Zero cache lock-in.',
      href: '/social-preview',
      badge: 'SEO',
    },
    {
      icon: Box,
      title: 'Vector Icons',
      desc: 'High-density SVG icon repository with integrated styling controls and immediate copy hooks.',
      href: '/icons',
      badge: 'ASSETS',
    },
    {
      icon: Users,
      title: 'P2P Collab Editor',
      desc: 'Zero-knowledge, real-time collaborative text and code editor powered by WebRTC and Yjs.',
      href: '/collab',
      badge: 'NEW',
    },
    {
      icon: Type,
      title: 'Fonts Studio',
      desc: 'Variable font playground with granular axis controls and layout preview matrices.',
      href: '/fonts',
      badge: 'TYPOGRAPHY',
    },
    {
      icon: Flame,
      title: 'Chaos Data',
      desc: 'Generate malformed, extremely large, or edge-case JSON datasets for robust stress testing.',
      href: '/mock-data',
      badge: 'TESTING',
    },
    {
      icon: Radio,
      title: 'API Templates',
      desc: 'Scaffold standardized API route structures and middleware stacks for edge deployments.',
      href: '/api-templates',
      badge: 'SCAFFOLD',
    }
  ];

  const featuredTools = tools.slice(0, 2);
  const remainingTools = tools.slice(2);

  // Ambient Mouse Spotlight & Precision Dot
  const spotlightRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run on devices with a mouse / fine pointer
    if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let spotX = -100;
    let spotY = -100;
    let isVisible = false;
    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        if (cursorDotRef.current) cursorDotRef.current.style.opacity = '1';
        if (spotlightRef.current) spotlightRef.current.style.opacity = '1';
      }

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };

    const handleMouseLeave = () => {
      isVisible = false;
      if (cursorDotRef.current) cursorDotRef.current.style.opacity = '0';
      if (spotlightRef.current) spotlightRef.current.style.opacity = '0';
    };

    const animate = () => {
      // Smooth fluid trailing lerp for ambient spotlight shadow
      spotX += (mouseX - spotX) * 0.16;
      spotY += (mouseY - spotY) * 0.16;

      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate3d(${spotX - 130}px, ${spotY - 130}px, 0)`;
      }

      animId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="w-full bg-[var(--bg-app)] relative">
      {/* Ambient Mouse Spotlight / Shadow Glow */}
      <div
        ref={spotlightRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 w-[260px] h-[260px] rounded-full z-0 opacity-0 transition-opacity duration-500 will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.22) 0%, rgba(59, 130, 246, 0.08) 40%, transparent 70%)'
        }}
      />

      {/* Precision Cursor Dot */}
      <div
        ref={cursorDotRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 rounded-full bg-blue-500 dark:bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.9)] z-50 opacity-0 transition-opacity duration-300 will-change-transform"
      />

      <main className="flex-grow pt-12 pb-12 px-6 max-w-6xl mx-auto w-full">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center py-8 mb-8 animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl md:text-[3.5rem] font-bold tracking-tight text-[var(--text-primary)] font-sans mb-4 max-w-3xl leading-[1.1]">
            Developer assets &amp; chaos testing toolkit.
          </h1>
          <p className="text-base md:text-lg text-[var(--text-muted)] font-sans max-w-2xl">
            Made for developers who build resilient. A serious, high-performance edge application.
          </p>
        </section>

        {/* Featured Tools (Above the fold) */}
        <section className="mb-12 animate-fade-in-up-delay-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredTools.map(t => {
              const Icon = t.icon;
              return (
                <Link
                  key={t.title}
                  href={t.href}
                  className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-xl p-8 hover:border-[var(--border-focus)] hover:-translate-y-1 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none">
                    <Icon className="w-32 h-32 text-[var(--text-primary)]" />
                  </div>
                  <Icon className="w-8 h-8 text-[var(--accent-blue)] mb-6 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-xl font-bold text-[var(--text-primary)] font-sans mb-3 group-hover:text-[var(--accent-blue)] transition-colors">{t.title}</h3>
                  <p className="text-base text-[var(--text-muted)] font-sans mb-8 flex-grow pr-8 leading-relaxed">{t.desc}</p>
                  <div className="mt-auto flex justify-between items-center z-10">
                    <span className="text-[11px] font-mono font-bold tracking-wider uppercase bg-[var(--bg-app)] border border-[var(--border-dev)] px-2 py-1 rounded-sm text-[var(--text-muted)]">
                      {t.badge}
                    </span>
                    <ArrowRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--accent-blue)] group-hover:translate-x-2 transition-all duration-300" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Live Playground Section */}
        <section className="mb-12 animate-fade-in-up-delay-2">
          <div className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            {/* Playground Header / Tabs with Direct Navigation Link */}
            <div className="border-b border-[var(--border-dev)] px-4 sm:px-6 pt-3 bg-[var(--bg-app)] flex flex-wrap items-center justify-between gap-3">
              <div className="flex space-x-6">
                <button
                  onClick={() => setActiveTab('fonts')}
                  className={`text-base sm:text-lg pb-2 font-semibold font-sans transition-colors cursor-pointer flex items-center gap-2 ${
                    activeTab === 'fonts'
                      ? 'text-cyan-600 dark:text-cyan-400 border-b-2 border-cyan-500 font-bold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Type className="w-4 h-4" />
                  <span>Try Fonts</span>
                </button>
                <button
                  onClick={() => setActiveTab('icons')}
                  className={`text-base sm:text-lg pb-2 font-semibold font-sans transition-colors cursor-pointer flex items-center gap-2 ${
                    activeTab === 'icons'
                      ? 'text-cyan-600 dark:text-cyan-400 border-b-2 border-cyan-500 font-bold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Box className="w-4 h-4" />
                  <span>Try Icons</span>
                </button>
              </div>

              {/* Direct Full Page Link */}
              <Link
                href={activeTab === 'fonts' ? '/fonts' : '/icons'}
                className="mb-2 px-3 py-1.5 rounded-lg bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-xs font-mono font-semibold text-[var(--text-primary)] hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 flex items-center gap-1.5 transition-all shadow-xs group cursor-pointer"
              >
                <span>{activeTab === 'fonts' ? 'Explore Full Fonts Studio (2,180+)' : 'Open Vector Icons Studio (353K+)'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-500 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Playground Controls */}
            {activeTab === 'fonts' && (
              <div className="p-4 sm:p-6 border-b border-[var(--border-dev)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="relative flex-grow max-w-md">
                  <input
                    type="text"
                    value={fontSampleText}
                    onChange={(e) => setFontSampleText(e.target.value)}
                    className="w-full bg-[var(--bg-app)] border border-[var(--border-dev)] text-[var(--text-primary)] rounded-lg py-2 px-4 focus:outline-none focus:border-cyan-500 text-sm font-mono placeholder:text-[var(--text-muted)] transition-colors"
                    placeholder="Type to preview across fonts..."
                  />
                </div>
                <Link
                  href="/fonts"
                  className="px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold font-mono flex items-center justify-center gap-2 transition-colors shadow-xs shrink-0"
                >
                  <span>Open Fonts Library</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {activeTab === 'icons' && (
              <div className="p-4 sm:p-6 border-b border-[var(--border-dev)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="relative flex-grow max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    value={iconQuery}
                    onChange={(e) => setIconQuery(e.target.value)}
                    className="w-full bg-[var(--bg-app)] border border-[var(--border-dev)] text-[var(--text-primary)] rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-cyan-500 text-sm font-mono placeholder:text-[var(--text-muted)] transition-colors"
                    placeholder="Search 353,000+ icons..."
                  />
                </div>
                <div className="flex items-center gap-3 justify-between sm:justify-end">
                  {isLoadingIcons && <span className="text-xs text-cyan-500 animate-pulse shrink-0 font-mono">Searching...</span>}
                  <Link
                    href="/icons"
                    className="px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold font-mono flex items-center justify-center gap-2 transition-colors shadow-xs shrink-0"
                  >
                    <span>Open Icons Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* Playground Grid */}
            {activeTab === 'fonts' && (
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {heroFonts.map(f => (
                  <div key={f.slug} className="border border-[var(--border-dev)] rounded-lg p-4 hover:bg-[var(--table-hover)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer bg-[var(--bg-app)] group">
                    <div className="flex items-center justify-between mb-4">
                      <Link href={`/fonts/${f.slug}`} className="text-xs font-bold text-[var(--text-primary)] font-sans hover:text-cyan-500 transition-colors">
                        {f.name}
                      </Link>
                      <span className="text-[11px] font-mono text-[var(--text-muted)] bg-[var(--pill-bg)] px-1.5 py-0.5 rounded-sm">{f.category}</span>
                    </div>
                    <div
                      style={{ fontFamily: `'${f.name}', sans-serif` }}
                      className="text-3xl text-[var(--text-primary)] truncate font-semibold leading-snug min-h-[40px]"
                    >
                      {fontSampleText || 'Aa'}
                    </div>
                    <div className="mt-4 pt-2 border-t border-[var(--border-dev-subtle)] flex items-center justify-between text-[10px]">
                      <button
                        onClick={() => copyText(`@import url('${f.cdn}');\nfont-family: '${f.name}', sans-serif;`, `css-${f.slug}`)}
                        className="text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer font-bold"
                      >
                        {copiedId === `css-${f.slug}` ? <Check className="w-3 h-3 text-[var(--accent-emerald)]" /> : <Code2 className="w-3 h-3" />}
                        <span>{copiedId === `css-${f.slug}` ? 'Copied!' : 'Copy CSS'}</span>
                      </button>
                      <Link href={`/fonts/${f.slug}`} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center gap-1 transition-colors">
                        Specs <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'icons' && (
              <div className="p-6 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {iconResults.slice(0, 8).map(item => (
                  <button
                    key={item.fullKey}
                    onClick={() => copyText(`<Icon icon="${item.fullKey}" />`, `icon-${item.fullKey}`)}
                    title={`Copy <Icon icon="${item.fullKey}" />`}
                    className="border border-[var(--border-dev)] rounded-lg p-4 flex flex-col items-center justify-center gap-3 hover:border-cyan-500 hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-pointer bg-[var(--bg-app)] group"
                  >
                    <div className="w-8 h-8 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <IconRenderer
                        prefix={item.prefix}
                        name={item.name}
                        size={28}
                        className="pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-sm"
                      />
                    </div>
                    <span className={`text-[10px] font-mono truncate max-w-full text-center ${copiedId === `icon-${item.fullKey}` ? 'text-[var(--accent-emerald)] font-bold' : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors'}`}>
                      {copiedId === `icon-${item.fullKey}` ? 'Copied!' : item.name}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Playground Footer Navigation Bar */}
            <div className="p-3.5 bg-[var(--bg-app)] border-t border-[var(--border-dev)] flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <span className="text-[var(--text-muted)]">
                {activeTab === 'fonts'
                  ? 'Showing 6 featured developer fonts • 2,180+ total web typefaces available'
                  : 'Showing 8 preview vector icons • 353,000+ icons across 238 open-source libraries'
                }
              </span>
              <Link
                href={activeTab === 'fonts' ? '/fonts' : '/icons'}
                className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-bold flex items-center gap-1.5 transition-colors group"
              >
                <span>{activeTab === 'fonts' ? 'Browse all 2,180+ Fonts' : 'Browse all 353,000+ Icons'}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* Remaining Tools Grid Section */}
        <section className="animate-fade-in-up-delay-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {remainingTools.map(t => {
              const Icon = t.icon;
              return (
                <Link
                  key={t.title}
                  href={t.href}
                  className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-xl p-6 hover:border-[var(--border-focus)] hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col h-full group"
                >
                  <Icon className="w-6 h-6 text-[var(--text-muted)] mb-4 group-hover:text-[var(--accent-blue)] group-hover:scale-110 transition-all duration-300" />
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] font-sans mb-2 group-hover:text-[var(--accent-blue)] transition-colors">{t.title}</h3>
                  <p className="text-sm text-[var(--text-muted)] font-sans mb-6 flex-grow">{t.desc}</p>
                  <div className="mt-auto flex justify-between items-center">
                    <span className="text-[11px] font-mono font-bold tracking-wider uppercase bg-[var(--bg-app)] border border-[var(--border-dev)] px-2 py-1 rounded-sm text-[var(--text-muted)]">
                      {t.badge}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-blue)] group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
