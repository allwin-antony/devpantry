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
  Database,
  CheckCircle2,
  Lock,
  ExternalLink
} from 'lucide-react';

export default function HomePage() {
  const playgrounds = [
    {
      id: 'chaos-data',
      title: 'Chaos Mock Data & Schema Studio',
      badge: 'Dirty Data Engine',
      description: 'Generate battle-tested, high-entropy test datasets across E-Commerce, B2B Users, Invoicing, and 100+ Naughty Strings. Compose custom schemas with 13+ field types and per-column chaos sliders.',
      icon: Flame,
      href: '/chaos-data',
      stats: '100+ BLNS Strings • 13 Field Types • 5 Export Formats',
      highlights: [
        'Curated presets: E-Commerce, B2B Users, Invoicing & BLNS',
        'Custom Schema Builder with per-field chaos levels',
        'Export to JSON, CSV, TypeScript Interfaces, Zod & SQL',
        'Simulate precision traps (0.1+0.2), Y2038, and RTL overrides'
      ]
    },
    {
      id: 'fonts',
      title: 'Open Source Fonts Studio',
      badge: '2,100+ Fonts',
      description: 'Explore, test, and integrate 2,100+ open-source typefaces from Fontsource, Google Fonts, Fontshare, and GitHub. Live interactive typing tester with weight, size, letter spacing, and line-height controls.',
      icon: Type,
      href: '/fonts',
      stats: '2,100+ Typefaces • Dedicated Pages • OFL & Free Commercial Licenses',
      highlights: [
        'Live typing tester dynamically loads CDN stylesheets on the fly',
        'Typed text updates previews across all 2,100+ font cards',
        'Individual pages (/fonts/[slug]) with weight specimens & code snippets',
        'One-click CSS @import, HTML <link>, and Tailwind config copy'
      ]
    },
    {
      id: 'icons',
      title: 'Vector Icons Studio & Live SVG Browser',
      badge: '353K+ Icons',
      description: 'Search, preview, and customize 353,000+ vector icons across 238 open-source libraries: Lucide, Tabler, Material Symbols, Heroicons, Phosphor, and Simple Icons. Interactive canvas to adjust stroke, size, and copy React/SVG code.',
      icon: Box,
      href: '/icons',
      stats: '353,000+ Icons • 238 Libraries • Live Iconify SVG API',
      highlights: [
        'Search across 238 complete icon collections in real-time',
        'Live SVG Playground: customize stroke width, size, and colors',
        'One-click copy for React JSX, Vue template, and raw SVG',
        'Individual library landing pages (/icons/[prefix]) for deep indexing'
      ]
    },
    {
      id: 'chaos-templates',
      title: 'API Chaos Templates & Payloads',
      badge: '17 Real Services',
      description: 'Real-world API response schemas for Google SSO, GitHub OAuth, Apple Sign-in, Stripe Billing, Supabase, Resend, and Twilio — injected with high-entropy dirty mock data to test your frontend resilience.',
      icon: Radio,
      href: '/chaos-templates',
      stats: '17 Real Services • Injected Chaos • TypeScript Generators',
      highlights: [
        'Clean Schema vs Chaos-Injected Payload side-by-side comparison',
        'Injected dirty emails, punycode, Unicode attacks & precision traps',
        'Automatic TypeScript interface generation from chaos payloads',
        'HTTP status code simulator (200 OK, 400 Bad Request, 429, 500)'
      ]
    }
  ];

  const popularFonts = [
    { name: 'Inter', slug: 'inter', category: 'Sans' },
    { name: 'Satoshi', slug: 'satoshi', category: 'Sans' },
    { name: 'JetBrains Mono', slug: 'jetbrains-mono', category: 'Mono' },
    { name: 'Fira Code', slug: 'fira-code', category: 'Mono' },
    { name: 'Clash Display', slug: 'clash-display', category: 'Display' },
    { name: 'Cabinet Grotesk', slug: 'cabinet-grotesk', category: 'Display' },
    { name: 'Roboto', slug: 'roboto', category: 'Sans' },
    { name: 'General Sans', slug: 'general-sans', category: 'Sans' }
  ];

  const popularIconLibs = [
    { name: 'Lucide Icons', prefix: 'lucide', count: '1,800+' },
    { name: 'Tabler Icons', prefix: 'tabler', count: '6,100+' },
    { name: 'Material Symbols', prefix: 'material-symbols', count: '15,600+' },
    { name: 'Heroicons', prefix: 'heroicons', count: '1,200+' },
    { name: 'Phosphor', prefix: 'ph', count: '7,000+' },
    { name: 'Simple Icons', prefix: 'simple-icons', count: '3,200+' }
  ];

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 flex flex-col gap-6 max-w-7xl mx-auto w-full font-mono">
      {/* Hero Command Banner */}
      <section className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-xl p-6 md:p-8 relative overflow-hidden shadow-sm transition-colors">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-gradient-to-br from-rose-500/10 via-cyan-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-300 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next.js 16 Developer Suite • 100% Client-Side Sandbox</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[var(--text-primary)] font-sans mb-3">
              The Developer Asset Playground & Edge-Case Studio
            </h1>

            <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed font-sans max-w-2xl">
              Consolidating 2,100+ open-source typefaces with live typing previews, 353,000+ vector icons across 238 libraries, custom chaos data synthesis, and real-world API response templates.
            </p>

            {/* Metrics Counter */}
            <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-[var(--border-dev-subtle)] text-xs text-[var(--text-muted)]">
              <span className="flex items-center gap-1">
                <strong className="text-[var(--text-primary)]">2,100+</strong> Fonts
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <strong className="text-[var(--text-primary)]">353,000+</strong> Icons (238 Libs)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <strong className="text-[var(--text-primary)]">17</strong> API Chaos Templates
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <strong className="text-[var(--text-primary)]">100+</strong> Naughty Strings
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-500 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" /> Zero Telemetry
              </span>
            </div>
          </div>

          {/* Quick Launch Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0">
            <Link
              href="/fonts"
              className="px-4 py-2.5 rounded-lg bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-rose-600 transition-all shadow-md shadow-rose-500/20 cursor-pointer"
            >
              <Type className="w-4 h-4" />
              <span>Explore 2,100+ Fonts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/icons"
              className="px-4 py-2 rounded-lg bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-[var(--text-primary)] font-bold text-xs flex items-center justify-center gap-2 hover:border-cyan-500 transition-colors cursor-pointer"
            >
              <Box className="w-4 h-4 text-cyan-500" />
              <span>Browse 353K+ Icons</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Access Rows: Popular Fonts & Popular Icon Libraries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Popular Fonts Row */}
        <div className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-xl p-4 flex flex-col gap-2.5 shadow-sm">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-[var(--border-dev-subtle)]">
            <span className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-amber-500" />
              <span>Popular Open-Source Fonts</span>
            </span>
            <Link href="/fonts" className="text-[11px] text-rose-500 hover:underline flex items-center gap-1">
              <span>View All 2,100+</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {popularFonts.map(f => (
              <Link
                key={f.slug}
                href={`/fonts/${f.slug}`}
                className="px-2.5 py-1 rounded bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-rose-500/50 transition-colors flex items-center gap-1.5"
              >
                <span>{f.name}</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-[var(--pill-bg)] text-[var(--text-muted)] font-mono">
                  {f.category}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Popular Icon Libraries Row */}
        <div className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-xl p-4 flex flex-col gap-2.5 shadow-sm">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-[var(--border-dev-subtle)]">
            <span className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
              <Box className="w-3.5 h-3.5 text-cyan-500" />
              <span>Top Vector Icon Libraries</span>
            </span>
            <Link href="/icons" className="text-[11px] text-cyan-500 hover:underline flex items-center gap-1">
              <span>View All 238</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {popularIconLibs.map(l => (
              <Link
                key={l.prefix}
                href={`/icons/${l.prefix}`}
                className="px-2.5 py-1 rounded bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-cyan-500/50 transition-colors flex items-center gap-1.5"
              >
                <span>{l.name}</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-[var(--pill-bg)] text-cyan-500 font-mono font-bold">
                  {l.count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of 4 Interactive Playgrounds */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        {playgrounds.map(tool => {
          const Icon = tool.icon;
          return (
            <article
              key={tool.id}
              className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-xl p-5 flex flex-col justify-between hover:border-rose-500/40 hover:shadow-md transition-all group relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[var(--bg-sidebar)] border border-[var(--border-dev)] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-4 h-4 text-rose-500" />
                    </div>
                    <h2 className="text-base font-bold text-[var(--text-primary)] font-sans">
                      {tool.title}
                    </h2>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--pill-bg)] border border-[var(--border-dev)] text-[var(--text-muted)] uppercase">
                    {tool.badge}
                  </span>
                </div>

                <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed mb-4">
                  {tool.description}
                </p>

                <div className="space-y-1.5 mb-4">
                  {tool.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px] text-[var(--text-muted)]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--border-dev-subtle)] flex items-center justify-between gap-3 mt-2">
                <div className="text-[10px] text-[var(--text-muted)] truncate">
                  {tool.stats}
                </div>

                <Link
                  href={tool.href}
                  className="px-3 py-1.5 rounded-md bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-xs font-bold text-[var(--text-primary)] hover:bg-rose-500 hover:text-white hover:border-rose-500 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <span>Open Tool</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          );
        })}
      </section>

      {/* Zero Tracking & Security Guarantee Bar */}
      <footer className="bg-[var(--bg-panel-subtle)] border border-[var(--border-dev)] rounded-lg p-3.5 flex flex-wrap items-center justify-between gap-4 text-xs text-[var(--text-muted)] shrink-0">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-500" />
          <span>
            <strong className="text-[var(--text-primary)]">100% Client-Side Privacy:</strong> No queries, font selections, custom schemas, or generated mock payloads are ever sent to an external server.
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span>MIT & OFL Licenses</span>
          <span>•</span>
          <span>Next.js 16 SSG</span>
          <span>•</span>
          <span>Production Ready</span>
        </div>
      </footer>
    </div>
  );
}
