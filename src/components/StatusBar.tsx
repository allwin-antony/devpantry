'use client';

import React from 'react';
import { Terminal, ShieldCheck, Sparkles, Cpu } from 'lucide-react';
import { usePathname } from 'next/navigation';

export const StatusBar: React.FC = () => {
  const pathname = usePathname();

  const getRouteLabel = () => {
    if (pathname === '/') return 'command-hub';
    if (pathname.startsWith('/chaos-data')) return 'chaos-synthesizer';
    if (pathname.startsWith('/fonts/')) return 'font-detail-page';
    if (pathname.startsWith('/fonts')) return 'fonts-studio';
    if (pathname.startsWith('/icons/')) return 'icon-library-page';
    if (pathname.startsWith('/icons')) return 'vector-icons-browser';
    if (pathname.startsWith('/chaos-templates')) return 'chaos-templates';
    return 'playground';
  };

  return (
    <footer className="dev-statusbar w-full px-4 flex items-center justify-between select-none text-[var(--text-muted)] bg-[var(--bg-statusbar)] border-t border-[var(--border-dev)] shrink-0 transition-colors font-mono">
      {/* Left indicators */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Terminal className="w-3 h-3 text-[var(--text-muted)]" />
          <span>route: <span className="text-[var(--text-primary)] font-semibold">{getRouteLabel()}</span></span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-[10px]">
          <Sparkles className="w-3 h-3 text-rose-500" />
          <span>Zero Server Calls • Local Synthesis</span>
        </div>
      </div>

      {/* Right indicators */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-1 text-[10px]">
          <Cpu className="w-3 h-3 text-cyan-500" />
          <span>Next.js 16 SSG & Turbopack</span>
        </div>

        <div className="hidden sm:flex items-center gap-1 text-[10px]">
          <ShieldCheck className="w-3 h-3 text-emerald-500" />
          <span>Production Ready</span>
        </div>

        <div className="flex items-center gap-1.5 text-[10px]">
          <span className="bg-[var(--pill-bg)] px-1.5 py-0.5 rounded border border-[var(--border-dev)] text-[var(--text-secondary)] font-bold">
            Hotkey: [R] Re-roll
          </span>
        </div>
      </div>
    </footer>
  );
};
