import React from 'react';
import { Terminal, ShieldCheck, Sparkles } from 'lucide-react';

interface StatusBarProps {
  activeUtilityName: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  activeUtilityName
}) => {
  return (
    <footer className="dev-statusbar w-full px-4 flex items-center justify-between select-none text-[var(--text-muted)] bg-[var(--bg-statusbar)] border-t border-[var(--border-dev)] shrink-0 transition-colors">
      {/* Left indicators */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Terminal className="w-3 h-3 text-[var(--text-muted)]" />
          <span>mode: <span className="text-[var(--text-primary)] font-semibold">{activeUtilityName.toLowerCase().replace(/\s+/g, '-')}</span></span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-[10px]">
          <Sparkles className="w-3 h-3 text-rose-500" />
          <span>Local Synthesis • Zero Latency</span>
        </div>
      </div>

      {/* Right indicators */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-1 text-[10px]">
          <ShieldCheck className="w-3 h-3 text-emerald-500" />
          <span>Zero Server Calls</span>
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
