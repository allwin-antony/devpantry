'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Flame, Type, Box, Radio, Sun, Moon, Terminal, Sparkles, Key, Search, Menu, X, Share2 } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { CommandPalette } from './CommandPalette';
import { DevPantryLogo } from './DevPantryLogo';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile dropdown on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

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
    { href: '/', label: 'Overview', shortLabel: 'Overview', icon: Terminal },
    { href: '/background-remover', label: 'AI Studio', shortLabel: 'AI Studio', icon: Sparkles },
    { href: '/fonts', label: 'Fonts', shortLabel: 'Fonts', icon: Type },
    { href: '/icons', label: 'Icons', shortLabel: 'Icons', icon: Box },
    { href: '/jwt-decoder', label: 'JWT Decoder', shortLabel: 'JWT', icon: Key },
    { href: '/mock-data', label: 'Mock Data', shortLabel: 'Mock', icon: Flame },
    { href: '/social-preview', label: 'Social Preview', shortLabel: 'Social', icon: Share2 },
    { href: '/api-templates', label: 'API Mocks', shortLabel: 'Mocks', icon: Radio },
  ];

  return (
    <>
      <header className="w-full h-12 bg-[var(--bg-panel)] border-b border-[var(--border-dev)] px-3 sm:px-4 flex items-center justify-between gap-3 select-none shrink-0 z-30 transition-colors shadow-xs font-mono relative">
        {/* Left: Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-6 h-6 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
              <DevPantryLogo size={24} className="w-6 h-6 drop-shadow-sm" />
            </div>
            <span className="font-bold text-xs tracking-tight text-[var(--text-primary)] font-mono">
              DEVPANTRY<span className="text-blue-500 dark:text-blue-400">.COM</span>
            </span>
          </Link>
        </div>

        {/* Center: Top Navigation Tabs (Exact h-8 height, zero-scroll & clutter-free across laptops and desktops) */}
        <nav className="hidden md:flex items-center h-8 bg-[var(--bg-sidebar)] p-0.5 rounded-lg border border-[var(--border-dev)] text-xs gap-0.5 shrink-0">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = item.href === '/'
              ? pathname === '/'
              : item.href === '/background-remover'
              ? (pathname === '/background-remover' || pathname === '/image-resizer' || pathname === '/image-compressor')
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`h-7 px-2 lg:px-2.5 rounded-md flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0 text-xs ${
                  isActive
                    ? 'bg-rose-500/10 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-semibold shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--pill-bg)] border border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden xl:inline">{item.label}</span>
                <span className="xl:hidden">{item.shortLabel}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Quick Search (Cmd + K), Theme Switcher, and Mobile Menu Toggle (All synchronized at h-8) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Cmd + K Command Palette Trigger */}
          <button
            onClick={() => setIsPaletteOpen(true)}
            aria-label="Open Command Palette (Cmd + K)"
            title="Search tools, typefaces, icons, and API mocks (Cmd + K)"
            className="h-8 flex items-center gap-2 px-2.5 rounded-lg bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-rose-500/40 transition-all cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden sm:inline text-[11px] text-[var(--text-muted)]">Search...</span>
            <kbd className="text-[10px] px-1.5 py-0.4 rounded bg-[var(--pill-bg)] border border-[var(--border-dev)] font-semibold text-[var(--text-muted)] tracking-widest">
              ⌘K
            </kbd>
          </button>

          {/* Dark / Light Mode Switcher */}
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="h-8 w-8 flex items-center justify-center rounded-lg bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-rose-500/40 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
          </button>

          {/* Mobile Menu Toggle (Only on <md) */}
          <button
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            className="h-8 w-8 flex md:hidden items-center justify-center rounded-lg bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-rose-500/40 transition-colors cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Dropdown (<md) */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-12 left-0 right-0 z-40 bg-[var(--bg-panel)] border-b border-[var(--border-dev)] shadow-xl p-3 flex flex-col gap-1 font-mono animate-in fade-in slide-in-from-top-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = item.href === '/'
              ? pathname === '/'
              : item.href === '/background-remover'
              ? (pathname === '/background-remover' || pathname === '/image-resizer' || pathname === '/image-compressor')
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`h-9 px-3 rounded-lg flex items-center gap-2.5 text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold border border-rose-500/30'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--pill-bg)]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}

      {/* Global Command Palette Modal */}
      <CommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />
    </>
  );
};
