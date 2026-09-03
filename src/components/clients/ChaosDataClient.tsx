'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChaosDataUtility } from '@/utilities/chaos-data/ChaosDataUtility';
import { SchemaBuilderUtility } from '@/utilities/schema-builder/SchemaBuilderUtility';
import { Flame, Layers, Sparkles } from 'lucide-react';

export function ChaosDataClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const tabParam = searchParams?.get('tab');
    if (tabParam === 'custom') {
      setActiveTab('custom');
    } else if (tabParam === 'presets') {
      setActiveTab('presets');
    }
  }, [searchParams, mounted]);

  const handleTabChange = (newTab: 'presets' | 'custom') => {
    setActiveTab(newTab);
    if (typeof window !== 'undefined') {
      const current = new URLSearchParams();
      current.set('tab', newTab);
      const search = current.toString();
      const newUrl = `${window.location.pathname}?${search}`;
      window.history.pushState(null, '', newUrl);
    }
  };

  return (
    <div className="h-full flex flex-col p-3 overflow-hidden gap-2">
      {/* Subheader with Mode Switcher */}
      <div className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-lg px-3 py-1.5 flex items-center justify-between gap-3 shrink-0 shadow-sm transition-colors font-mono">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
            <span className="text-[var(--text-primary)] font-bold uppercase tracking-wider">Chaos Studio:</span>
          </div>

          <div className="flex items-center bg-[var(--bg-sidebar)] p-0.5 rounded border border-[var(--border-dev)] text-xs">
            <button
              onClick={() => handleTabChange('presets')}
              className={`px-3 py-1 rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'presets'
                  ? 'bg-rose-500 text-white font-bold shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Domain Presets</span>
            </button>

            <button
              onClick={() => handleTabChange('custom')}
              className={`px-3 py-1 rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'custom'
                  ? 'bg-rose-500 text-white font-bold shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Custom Schema Builder</span>
              <span className={`text-[9px] px-1 py-0.2 rounded font-bold ${
                activeTab === 'custom' ? 'bg-black/20 text-white' : 'bg-rose-500/20 text-rose-500 dark:text-rose-300'
              }`}>
                Visual GUI
              </span>
            </button>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-[11px] text-[var(--text-muted)]">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-rose-500" />
            <span>100+ BLNS Strings • Multi-Currency • Floating-Point Traps</span>
          </span>
        </div>
      </div>

      {/* Main Utility Viewport */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {activeTab === 'presets' ? (
          <ChaosDataUtility />
        ) : (
          <SchemaBuilderUtility />
        )}
      </div>
    </div>
  );
}
