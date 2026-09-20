import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { GUIDES_DATA } from '@/lib/guidesData';
import { BookOpen, Sparkles, ArrowRight, Code, ShieldCheck, Zap, Layers, Terminal } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Engineering Guides & Architecture Deep Dives | DevPantry',
  description: 'In-depth engineering guides, technical breakdowns, and architecture deep dives on building real-time WebRTC tools, client-side AI, zero-leak security, and WebAssembly in browser.',
  openGraph: {
    title: 'Engineering Guides & Architecture Deep Dives | DevPantry',
    description: 'Technical breakdowns on building WebRTC collaboration, client-side AI background removal, zero-leak JWT decoders, and browser performance.',
    url: 'https://devpantry.com/guides',
  }
};

export default function GuidesHubPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-8 font-mono">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 border-b border-[var(--border-dev)] pb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-rose-500 uppercase tracking-widest">
          <BookOpen className="w-4 h-4" />
          <span>Engineering Knowledge Base</span>
        </div>
        
        <h1 className="text-2xl sm:text-4xl font-bold text-[var(--text-primary)] tracking-tight">
          DevPantry <span className="text-rose-500">Engineering Guides</span>
        </h1>

        <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-3xl leading-relaxed font-sans">
          Deep-dive technical articles, system architecture breakdowns, and implementation guides explaining how DevPantry builds zero-latency, client-side, and edge-first developer tools.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
          <span className="px-2.5 py-1 rounded-md bg-[var(--bg-panel)] border border-[var(--border-dev)] text-[var(--text-primary)] flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" /> WebRTC &amp; P2P
          </span>
          <span className="px-2.5 py-1 rounded-md bg-[var(--bg-panel)] border border-[var(--border-dev)] text-[var(--text-primary)] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" /> WebGPU &amp; Client AI
          </span>
          <span className="px-2.5 py-1 rounded-md bg-[var(--bg-panel)] border border-[var(--border-dev)] text-[var(--text-primary)] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Zero-Leak Security
          </span>
          <span className="px-2.5 py-1 rounded-md bg-[var(--bg-panel)] border border-[var(--border-dev)] text-[var(--text-primary)] flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-cyan-500" /> Cloudflare Durable Objects
          </span>
        </div>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {GUIDES_DATA.map((guide) => (
          <article
            key={guide.slug}
            className="flex flex-col justify-between p-6 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-dev)] hover:border-rose-500/50 transition-all shadow-sm group"
          >
            <div className="flex flex-col gap-4">
              {/* Category & Read Time */}
              <div className="flex items-center justify-between text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-500 font-semibold border border-rose-500/20">
                  {guide.category}
                </span>
                <span className="text-[var(--text-muted)]">{guide.readingTime}</span>
              </div>

              {/* Title & Description */}
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-rose-500 transition-colors leading-snug">
                  <Link href={`/guides/${guide.slug}`}>
                    {guide.title}
                  </Link>
                </h2>
                <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed line-clamp-3">
                  {guide.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {guide.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded bg-[var(--bg-app)] border border-[var(--border-dev)] text-[var(--text-muted)]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-[var(--border-dev)] mt-6 text-xs">
              <Link
                href={`/guides/${guide.slug}`}
                className="font-bold text-rose-500 hover:text-rose-400 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform"
              >
                <span>Read Full Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href={guide.matchingToolUrl}
                className="text-[11px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline flex items-center gap-1"
              >
                <Code className="w-3.5 h-3.5 text-cyan-500" />
                <span>Try {guide.matchingToolName} →</span>
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Community Banner */}
      <div className="p-6 sm:p-8 rounded-xl bg-gradient-to-r from-rose-950/20 via-[var(--bg-panel)] to-cyan-950/20 border border-[var(--border-dev)] flex flex-col sm:flex-row items-center justify-between gap-6 mt-4">
        <div className="flex flex-col gap-2 text-center sm:text-left">
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            Want to see how another tool was built?
          </h3>
          <p className="text-xs text-[var(--text-secondary)] font-sans max-w-xl">
            DevPantry's codebase is fully open and client-side focused. Suggest a new engineering guide topic or inspect our open-source repositories.
          </p>
        </div>

        <Link
          href="/tools"
          className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors shrink-0 flex items-center gap-2"
        >
          <span>Explore All Live Tools</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
