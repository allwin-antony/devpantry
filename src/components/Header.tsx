'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Flame, Type, Box, Radio, Sun, Moon, ShieldCheck, Terminal, Sparkles } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { href: '/', label: 'Overview', icon: Terminal },
    { href: '/background-removal', label: 'AI BG & Resizing', icon: Sparkles, badge: 'Edge AI' },
    { href: '/fonts', label: 'Fonts Studio', icon: Type, badge: '2,180+' },
    { href: '/icons', label: 'Vector Icons', icon: Box, badge: '353K+' },
    { href: '/chaos-data', label: 'Chaos Data', icon: Flame, badge: 'Schema GUI' },
    { href: '/chaos-templates', label: 'Chaos Templates', icon: Radio, badge: '17 APIs' },
  ];

  return (
    <header className="w-full h-12 bg-[var(--bg-panel)] border-b border-[var(--border-dev)] px-4 flex items-center justify-between gap-4 select-none shrink-0 z-30 transition-colors shadow-sm font-mono">
      {/* Left: Brand */}
      <div className="flex items-center gap-4 shrink-0">
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="w-6 h-6 rounded bg-gradient-to-tr from-rose-600 via-amber-500 to-rose-500 flex items-center justify-center shadow shadow-rose-500/30 group-hover:scale-105 transition-transform">
            <Flame className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-xs tracking-tight text-[var(--text-primary)] font-mono">
            DEVPLAYGROUND<span className="text-rose-500">.IO</span>
          </span>
        </Link>
      </div>

      {/* Center: Top Navigation Tabs */}
      <nav className="hidden md:flex items-center bg-[var(--bg-sidebar)] p-1 rounded-lg border border-[var(--border-dev)] text-xs gap-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = item.href === '/'
            ? pathname === '/'
            : item.href === '/background-removal'
            ? (pathname === '/background-removal' || pathname === '/image-resizer' || pathname === '/image-compressor')
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1 rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
                isActive
                  ? 'bg-rose-500 text-white font-bold shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--pill-bg)]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
              {item.badge && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold transition-colors ${
                  isActive 
                    ? 'bg-black/30 text-white shadow-inner' 
                    : 'bg-black/5 dark:bg-white/10 text-[var(--text-primary)] border border-black/10 dark:border-white/15'
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Right: Theme Switcher */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Dark / Light Mode Switcher */}
        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-1.5 rounded-lg bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-rose-500/40 transition-colors cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
        </button>
      </div>
    </header>
  );
};
