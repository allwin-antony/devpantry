'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Flame, Type, Box, Radio, Sun, Moon, Terminal, Sparkles, Key, Search } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { CommandPalette } from './CommandPalette';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  // Global hotkey: Cmd + K or Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    { href: '/', label: 'Overview', icon: Terminal },
    { href: '/background-removal', label: 'AI Studio', icon: Sparkles, badge: 'Edge AI' },
    { href: '/fonts', label: 'Fonts', icon: Type, badge: '2,180+' },
    { href: '/icons', label: 'Icons', icon: Box, badge: '353K+' },
    { href: '/jwt-inspector', label: 'JWT Inspector', icon: Key, badge: 'Zero Leak' },
    { href: '/chaos-data', label: 'Chaos Data', icon: Flame, badge: 'GUI' },
    { href: '/chaos-templates', label: 'API Mocks', icon: Radio, badge: '17' },
  ];

  return (
    <>
      <header className="w-full h-12 bg-[var(--bg-panel)] border-b border-[var(--border-dev)] px-3 sm:px-4 flex items-center justify-between gap-3 select-none shrink-0 z-30 transition-colors shadow-xs font-mono">
        {/* Left: Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-rose-600 via-amber-500 to-rose-500 flex items-center justify-center shadow shadow-rose-500/20 group-hover:scale-105 transition-transform">
              <Flame className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-xs tracking-tight text-[var(--text-primary)] font-mono">
              DEVPANTRY<span className="text-rose-500">.DEV</span>
            </span>
          </Link>
        </div>

        {/* Center: Top Navigation Tabs (Horizontally scrollable if tight, never wraps) */}
        <nav className="hidden md:flex items-center bg-[var(--bg-sidebar)] p-1 rounded-lg border border-[var(--border-dev)] text-xs gap-1 max-w-[calc(100vw-360px)] overflow-x-auto no-scrollbar">
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
                className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0 text-xs ${
                  isActive
                    ? 'bg-rose-500/10 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-semibold shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--pill-bg)] border border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{item.label}</span>
                {item.badge && !isActive && (
                  <span className="hidden xl:inline-flex text-[9px] px-1.5 py-0.2 rounded font-mono font-medium bg-[var(--pill-bg)] text-[var(--text-muted)] border border-[var(--border-dev)]">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Quick Search (Cmd + K) & Theme Switcher */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Cmd + K Command Palette Trigger */}
          <button
            onClick={() => setIsPaletteOpen(true)}
            aria-label="Open Command Palette (Cmd + K)"
            title="Search tools, typefaces, icons, and API mocks (Cmd + K)"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-rose-500/40 transition-all cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden sm:inline text-[11px] text-[var(--text-muted)]">Search...</span>
            <kbd className="text-[10px] px-1.5 py-0.2 rounded bg-[var(--pill-bg)] border border-[var(--border-dev)] font-semibold text-[var(--text-muted)]">
              ⌘K
            </kbd>
          </button>

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

      {/* Global Command Palette Modal */}
      <CommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />
    </>
  );
};
