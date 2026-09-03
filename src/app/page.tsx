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
  Lock
} from 'lucide-react';

export default function HomePage() {
  const playgrounds = [
    {
      id: 'chaos-data',
      title: 'Chaos Mock Data & Schema Studio',
      badge: 'Dirty Data Generator',
      badgeColor: 'rose',
      description: 'Generate battle-tested, high-entropy mock records across E-Commerce, B2B Users, Billing, and 100+ Naughty Strings. Compose custom schemas with 13+ field types and per-column chaos sliders.',
      icon: Flame,
      href: '/chaos-data',
      stats: '100+ BLNS Strings • 13 Field Types • 5 Export Formats',
      highlights: [
        'Curated presets: E-Commerce, B2B Users, Invoicing & BLNS',
        'Custom Schema Builder with per-field chaos levels',
        'Export to JSON, CSV, TypeScript Interfaces, Zod & SQL',
        'Simulate precision traps (0.1+0.2), Y2038, and RTL overrides'
      ],
      quickSnippet: 'ORD-99-🚨 • user+tag@corp.co.uk • 0.30000000000000004'
    },
    {
      id: 'fonts',
      title: 'Open Source Fonts Studio',
      badge: 'Typography Playground',
      badgeColor: 'amber',
      description: 'Explore, test, and integrate 120+ open-source typefaces from Fontshare, Fontsource, and GitHub. Live interactive typing tester with weight, size, letter spacing, and line-height controls.',
      icon: Type,
      href: '/fonts',
      stats: '120+ Typefaces • 4 Categories • OFL & Free Commercial Licenses',
      highlights: [
        'Live typing tester with interactive sliders & font pairings',
        'Curated Fontshare (Indian Type Foundry) & GitHub open fonts',
        'One-click CSS @import, HTML <link>, and Tailwind config copy',
        'Category filters: Sans-Serif, Serif, Display, Monospace'
      ],
      quickSnippet: 'Satoshi • Clash Display • Cabinet Grotesk • Inter'
    },
    {
      id: 'icons',
      title: 'Vector Icons Studio & SVG Explorer',
      badge: 'Icon Libraries',
      badgeColor: 'cyan',
      description: 'Search, preview, and customize icons from top open-source libraries: Lucide, Tabler, Heroicons, Phosphor, Simple Icons, and Radix. Interactive canvas to adjust stroke, size, and copy React/SVG code.',
      icon: Box,
      href: '/icons',
      stats: '25,000+ Icons • 7 Popular Libraries • Copy React / SVG / Vue',
      highlights: [
        'Live SVG Playground: customize stroke width, size, and colors',
        'One-click copy for React JSX, Vue template, and raw SVG',
        'Library comparison: license, bundle weight, and package names',
        'Comprehensive Web integration & licensing cheat-sheet'
      ],
      quickSnippet: '<Lucide.Flame size={24} strokeWidth={2} />'
    },
    {
      id: 'api-vault',
      title: 'Real-World API & SSO Responses Vault',
      badge: 'Production Fixtures',
      badgeColor: 'emerald',
      description: 'Actual production API response payloads for Google SSO, GitHub OAuth, Apple Sign-in, Stripe Billing, Supabase, Resend, and Twilio. Inspect schemas, generate TypeScript interfaces, and test error handling.',
      icon: Radio,
      href: '/api-vault',
      stats: '17 Real Services • Auth & SSO • E-Commerce • Cloud Webhooks',
      highlights: [
        'Complete payload inspection with JSON syntax highlighting',
        'Automatic TypeScript interface generation from responses',
        'Production cURL command copy with realistic auth headers',
        'Standard error response simulator (400, 401, 429, 500)'
      ],
      quickSnippet: 'POST /token → access_token: "gho_16C7e42F..."'
    }
  ];

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 flex flex-col gap-6 max-w-7xl mx-auto w-full font-mono">
      {/* Hero Command Banner */}
      <section className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-xl p-6 md:p-8 relative overflow-hidden shadow-sm transition-colors">
        {/* Decorative background glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-gradient-to-br from-rose-500/10 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-300 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next.js 16 Developer Suite • 100% Client-Side</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[var(--text-primary)] font-sans mb-3">
              The All-In-One Developer Playground & Asset Studio
            </h1>

            <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed font-sans max-w-2xl">
              High-entropy mock data synthesis, 120+ open-source typefaces, vector icon customizer, and real-world API & SSO response vault. Built for developers who build resilient frontends and reliable backends.
            </p>

            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-[var(--border-dev-subtle)] text-xs text-[var(--text-muted)]">
              <span className="flex items-center gap-1">
                <strong className="text-[var(--text-primary)]">100+</strong> Naughty Strings
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <strong className="text-[var(--text-primary)]">120+</strong> Open Fonts
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <strong className="text-[var(--text-primary)]">25,000+</strong> Icons
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <strong className="text-[var(--text-primary)]">17</strong> API Fixtures
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-500 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" /> Zero Server Telemetry
              </span>
            </div>
          </div>

          {/* Quick Launch Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0">
            <Link
              href="/chaos-data"
              className="px-4 py-2.5 rounded-lg bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-rose-600 transition-all shadow-md shadow-rose-500/20 cursor-pointer"
            >
              <Flame className="w-4 h-4" />
              <span>Launch Chaos Synthesizer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/fonts"
              className="px-4 py-2 rounded-lg bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-[var(--text-primary)] font-bold text-xs flex items-center justify-center gap-2 hover:border-rose-500/40 transition-colors cursor-pointer"
            >
              <Type className="w-4 h-4 text-amber-500" />
              <span>Explore Fonts Studio</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Grid of 4 Interactive Playgrounds */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        {playgrounds.map(tool => {
          const Icon = tool.icon;
          return (
            <article
              key={tool.id}
              className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-xl p-5 flex flex-col justify-between hover:border-rose-500/40 hover:shadow-md transition-all group relative overflow-hidden"
            >
              {/* Header */}
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

                {/* Highlights */}
                <div className="space-y-1.5 mb-4">
                  {tool.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px] text-[var(--text-muted)]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer and Launch Link */}
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
            <strong className="text-[var(--text-primary)]">100% Client-Side Privacy:</strong> No custom schemas, queries, or mock payloads are ever sent to an external server.
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span>MIT Licensed Assets</span>
          <span>•</span>
          <span>SIL Open Font License</span>
          <span>•</span>
          <span>Production Ready</span>
        </div>
      </footer>
    </div>
  );
}
