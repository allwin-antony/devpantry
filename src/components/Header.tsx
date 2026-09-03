import React from 'react';
import { Flame, Layers, Sun, Moon, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  theme,
  onToggleTheme
}) => {
  return (
    <header className="w-full h-11 bg-[var(--bg-panel)] border-b border-[var(--border-dev)] px-4 flex items-center justify-between gap-4 select-none shrink-0 z-30 transition-colors shadow-sm">
      {/* Left: Brand */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow shadow-rose-500/30">
            <Flame className="w-3 h-3 text-white" />
          </div>
          <span className="font-bold text-xs tracking-tight text-[var(--text-primary)] font-mono">
            FAILSTATE<span className="text-rose-500">.DEV</span>
          </span>
        </div>
      </div>

      {/* Center: Core Studio Tabs */}
      <div className="flex items-center bg-[var(--bg-sidebar)] p-0.5 rounded-lg border border-[var(--border-dev)] font-mono text-xs">
        <button
          onClick={() => onSelectTab('chaos-data')}
          className={`px-3 py-1 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'chaos-data'
              ? 'bg-rose-500 text-white font-bold shadow-sm'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Domain Presets</span>
        </button>

        <button
          onClick={() => onSelectTab('schema-builder')}
          className={`px-3 py-1 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'schema-builder'
              ? 'bg-rose-500 text-white font-bold shadow-sm'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Custom Schema Builder</span>
          <span className={`text-[9px] px-1 py-0.2 rounded font-bold ${
            activeTab === 'schema-builder' ? 'bg-black/20 text-white' : 'bg-rose-500/20 text-rose-500 dark:text-rose-300'
          }`}>
            NEW
          </span>
        </button>
      </div>

      {/* Right: Privacy Badge & Theme Switcher */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-[var(--text-muted)] bg-[var(--bg-sidebar)] px-2 py-0.5 rounded border border-[var(--border-dev)]">
          <ShieldCheck className="w-3 h-3 text-emerald-500" />
          <span>100% Client-Side</span>
        </div>

        {/* Light / Dark Mode Toggle */}
        <button
          onClick={onToggleTheme}
          title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="p-1.5 rounded bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-rose-500/40 transition-colors cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
        </button>
      </div>
    </header>
  );
};
