'use client';

import React, { useState, useMemo } from 'react';
import { getAllIconLibraries, type IconLibraryItem } from '@/lib/datasetLoader';
import { 
  Box, 
  Search, 
  Copy, 
  CheckCircle2, 
  ExternalLink, 
  Code2, 
  Flame,
  ShieldCheck,
  Radio,
  Type,
  Database,
  Layers,
  Cpu,
  Zap,
  Globe,
  Lock
} from 'lucide-react';

export function IconsClient() {
  const iconLibraries = useMemo(() => getAllIconLibraries(), []);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLibrary, setSelectedLibrary] = useState<IconLibraryItem>(iconLibraries[0]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // SVG Playground Customizer State
  const [iconSize, setIconSize] = useState<number>(28);
  const [strokeWidth, setStrokeWidth] = useState<number>(2);
  const [iconColor, setIconColor] = useState<string>('#f43f5e');

  const colorPresets = [
    { name: 'Rose', hex: '#f43f5e' },
    { name: 'Cyan', hex: '#06b6d4' },
    { name: 'Emerald', hex: '#10b981' },
    { name: 'Amber', hex: '#f59e0b' },
    { name: 'Violet', hex: '#8b5cf6' },
    { name: 'Current', hex: 'currentColor' }
  ];

  // Sample icons to render in interactive playground
  const sampleIcons = [
    { name: 'Flame', component: Flame },
    { name: 'ShieldCheck', component: ShieldCheck },
    { name: 'Radio', component: Radio },
    { name: 'Type', component: Type },
    { name: 'Database', component: Database },
    { name: 'Layers', component: Layers },
    { name: 'Cpu', component: Cpu },
    { name: 'Zap', component: Zap },
    { name: 'Globe', component: Globe },
    { name: 'Lock', component: Lock },
  ];

  const filteredLibraries = useMemo(() => {
    if (!searchQuery.trim()) return iconLibraries;
    const q = searchQuery.toLowerCase();
    return iconLibraries.filter(lib => 
      lib.name.toLowerCase().includes(q) ||
      lib.tagline.toLowerCase().includes(q) ||
      lib.license.toLowerCase().includes(q)
    );
  }, [iconLibraries, searchQuery]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 1800);
  };

  const reactSnippet = `<${sampleIcons[0].name} 
  size={${iconSize}} 
  strokeWidth={${strokeWidth}} 
  color="${iconColor}" 
/>`;

  const svgSnippet = `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">
  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
</svg>`;

  return (
    <div className="h-full flex flex-col p-3 overflow-hidden gap-3 font-mono">
      {/* Top SVG Playground & Customizer */}
      <section className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-xl p-4 shrink-0 shadow-sm transition-colors flex flex-col gap-3">
        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border-dev)]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-cyan-500/20 text-cyan-500 flex items-center justify-center">
              <Box className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[var(--text-primary)] font-sans">
                  Interactive SVG Studio
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[var(--pill-bg)] text-[var(--text-muted)]">
                  Live Vector Attributes
                </span>
              </div>
            </div>
          </div>

          {/* Playground Sliders */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Size Slider */}
            <div className="flex items-center gap-1.5 bg-[var(--bg-sidebar)] px-2 py-1 rounded border border-[var(--border-dev)]">
              <span className="text-[10px] text-[var(--text-muted)]">SIZE:</span>
              <input
                type="range"
                min="16"
                max="48"
                value={iconSize}
                onChange={e => setIconSize(Number(e.target.value))}
                className="w-16 accent-rose-500 cursor-pointer h-1"
              />
              <span className="text-[10px] font-bold text-[var(--text-primary)] w-7 text-right">{iconSize}px</span>
            </div>

            {/* Stroke Width Selector */}
            <div className="flex items-center gap-1 bg-[var(--bg-sidebar)] p-0.5 rounded border border-[var(--border-dev)] text-xs">
              <span className="text-[var(--text-muted)] px-1 text-[10px]">STROKE:</span>
              {[1, 1.5, 2, 2.5, 3].map(w => (
                <button
                  key={w}
                  onClick={() => setStrokeWidth(w)}
                  className={`px-1.5 py-0.5 rounded text-[10px] transition-colors cursor-pointer ${
                    strokeWidth === w
                      ? 'bg-rose-500 text-white font-bold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {w}px
                </button>
              ))}
            </div>

            {/* Color Presets */}
            <div className="flex items-center gap-1 bg-[var(--bg-sidebar)] p-1 rounded border border-[var(--border-dev)]">
              {colorPresets.map(c => (
                <button
                  key={c.name}
                  onClick={() => setIconColor(c.hex)}
                  title={c.name}
                  style={{ backgroundColor: c.hex === 'currentColor' ? '#ffffff' : c.hex }}
                  className={`w-4 h-4 rounded-full border cursor-pointer transition-transform ${
                    iconColor === c.hex ? 'scale-125 border-white ring-1 ring-rose-500' : 'border-black/30 hover:scale-110'
                  }`}
                />
              ))}
            </div>

            {/* Copy Snippets */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => copyToClipboard(reactSnippet, 'react')}
                title="Copy React JSX snippet"
                className="px-2 py-1 text-xs font-semibold rounded bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-[var(--text-primary)] hover:border-rose-500/40 flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedCode === 'react' ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Code2 className="w-3 h-3 text-rose-500" />}
                <span>{copiedCode === 'react' ? 'Copied' : 'React'}</span>
              </button>

              <button
                onClick={() => copyToClipboard(svgSnippet, 'svg')}
                title="Copy raw SVG string"
                className="px-2 py-1 text-xs font-semibold rounded bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-[var(--text-primary)] hover:border-rose-500/40 flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedCode === 'svg' ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Box className="w-3 h-3 text-cyan-500" />}
                <span>{copiedCode === 'svg' ? 'Copied' : 'SVG'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Rendering Canvas Grid */}
        <div className="bg-[var(--bg-codebox)] border border-[var(--border-dev)] rounded-lg p-3 overflow-x-auto flex items-center justify-around gap-4 min-h-[70px] transition-colors">
          {sampleIcons.map(item => {
            const IconComponent = item.component;
            return (
              <div 
                key={item.name} 
                className="flex flex-col items-center gap-1.5 p-2 rounded hover:bg-white/5 transition-colors cursor-pointer group"
                onClick={() => copyToClipboard(
                  `<${item.name} size={${iconSize}} strokeWidth={${strokeWidth}} color="${iconColor}" />`,
                  item.name
                )}
                title={`Click to copy <${item.name} />`}
              >
                <div style={{ color: iconColor }}>
                  <IconComponent size={iconSize} strokeWidth={strokeWidth} />
                </div>
                <span className="text-[10px] text-[var(--text-muted)] group-hover:text-[var(--text-primary)] font-mono">
                  {copiedCode === item.name ? 'Copied!' : item.name}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Libraries Directory & Search */}
      <div className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-lg px-3 py-2 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-sm transition-colors">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search icon libraries (Lucide, Tabler, Heroicons...)"
            className="dev-input flex-1 px-2.5 py-1 rounded text-xs"
          />
        </div>

        <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
          <span><strong>{filteredLibraries.length}</strong> top open-source icon toolkits</span>
          <span>•</span>
          <span className="text-emerald-500 font-bold">100% Free for Commercial Use</span>
        </div>
      </div>

      {/* Icon Libraries Grid */}
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredLibraries.map(lib => {
            const isSelected = selectedLibrary.id === lib.id;
            const primaryPkg = lib.npm_packages?.react || Object.values(lib.npm_packages || {})[0] || '';

            return (
              <div
                key={lib.id}
                onClick={() => setSelectedLibrary(lib)}
                className={`bg-[var(--bg-panel)] border rounded-xl p-4 flex flex-col justify-between gap-3 cursor-pointer transition-all hover:shadow-md group ${
                  isSelected 
                    ? 'border-cyan-500 ring-1 ring-cyan-500 shadow-sm' 
                    : 'border-[var(--border-dev)] hover:border-cyan-500/40'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-[var(--text-primary)] font-sans group-hover:text-cyan-500 transition-colors">
                          {lib.name}
                        </h3>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[var(--pill-bg)] border border-[var(--border-dev)] text-[var(--text-primary)]">
                          {lib.total_icons} icons
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] font-sans mt-1 line-clamp-2">
                        {lib.tagline}
                      </p>
                    </div>

                    <span className="text-[9px] px-2 py-0.5 rounded font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 shrink-0">
                      {lib.license}
                    </span>
                  </div>

                  {/* NPM Packages List */}
                  <div className="bg-[var(--bg-panel-subtle)] border border-[var(--border-dev-subtle)] rounded-lg p-2.5 my-2 flex flex-col gap-1.5 text-[11px]">
                    <div className="text-[10px] text-[var(--text-muted)] uppercase font-bold">Install Commands:</div>
                    <div className="flex items-center justify-between gap-2 bg-[var(--bg-sidebar)] px-2 py-1 rounded border border-[var(--border-dev)] font-mono text-[11px]">
                      <span className="truncate text-cyan-500 font-semibold">npm i {primaryPkg}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(`npm install ${primaryPkg}`, `pkg-${lib.id}`);
                        }}
                        className="text-[var(--text-muted)] hover:text-white transition-colors cursor-pointer"
                        title="Copy command"
                      >
                        {copiedCode === `pkg-${lib.id}` ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer Links */}
                <div className="pt-2.5 border-t border-[var(--border-dev-subtle)] flex items-center justify-between text-xs text-[var(--text-muted)]">
                  <span className="text-[10px] truncate max-w-[180px]">{lib.license_note}</span>

                  <div className="flex items-center gap-2">
                    {lib.github && (
                      <a
                        href={lib.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1 rounded hover:bg-[var(--bg-sidebar)] transition-colors"
                        title="GitHub Repository"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {lib.website && (
                      <a
                        href={lib.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-2 py-0.5 rounded bg-[var(--bg-sidebar)] border border-[var(--border-dev)] hover:bg-rose-500 hover:text-white transition-colors"
                      >
                        Docs
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
