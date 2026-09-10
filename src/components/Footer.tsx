import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full shrink-0 border-t border-[var(--border-dev)] py-3 px-4 md:px-6 font-mono text-[10px] text-[var(--text-muted)] flex items-center justify-between gap-3 select-none transition-colors">
      <div className="flex items-center gap-3 md:gap-5">
        <span className="text-[var(--text-secondary)]">© {new Date().getFullYear()} DevPantry</span>
        <nav className="flex items-center gap-3">
          <Link href="/about" className="hover:text-[var(--text-primary)] transition-colors">About</Link>
          <Link href="/privacy" className="hover:text-[var(--text-primary)] transition-colors">Privacy</Link>
          <Link href="/security" className="hover:text-[var(--text-primary)] transition-colors">Security</Link>
        </nav>
      </div>
      <span className="hidden sm:inline">100% Client-Side · Zero Data Leaks</span>
    </footer>
  );
};
