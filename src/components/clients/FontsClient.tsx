'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { getAllFonts, getFontCdnStylesheet, type FontItem } from '@/lib/datasetLoader';
import { 
  Type, 
  Search, 
  Copy, 
  CheckCircle2, 
  ExternalLink, 
  Code2,
  Terminal,
  ArrowRight,
  Sparkles,
  Sliders,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export function FontsClient() {
  const allFonts = useMemo(() => getAllFonts(), []);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLicense, setSelectedLicense] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 48; // Fast, responsive grid with pagination

  // Interactive Typography Tester State
  const [activeFont, setActiveFont] = useState<FontItem>(() => allFonts[0]);
  const [sampleText, setSampleText] = useState<string>(
    'The quick brown fox jumps over the lazy dog 1234567890'
  );
  const [fontSize, setFontSize] = useState<number>(32);
  const [fontWeight, setFontWeight] = useState<number>(600);
  const [letterSpacing, setLetterSpacing] = useState<number>(0);
  const [lineHeight, setLineHeight] = useState<number>(1.3);
  const [textTransform, setTextTransform] = useState<'none' | 'uppercase' | 'lowercase' | 'capitalize'>('none');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Available categories
  const categories = ['All', 'Sans', 'Serif', 'Display', 'Monospace'];

  // Dynamically inject stylesheet for the active font so it actually loads in the browser
  useEffect(() => {
    if (!activeFont) return;
    const url = activeFont.cdn_stylesheet_url || getFontCdnStylesheet(activeFont);
    const existing = document.querySelector(`link[data-font-slug="${activeFont.slug}"]`);
    if (!existing) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      link.setAttribute('data-font-slug', activeFont.slug);
      document.head.appendChild(link);
    }
  }, [activeFont]);

  // Filtered fonts list
  const filteredFonts = useMemo(() => {
    return allFonts.filter(font => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        !q ||
        font.name.toLowerCase().includes(q) ||
        font.slug.includes(q) ||
        font.designers.some(d => d.toLowerCase().includes(q)) ||
        font.category.toLowerCase().includes(q);

      const matchesCat = 
        selectedCategory === 'All' || 
        font.category.toLowerCase() === selectedCategory.toLowerCase() ||
        (selectedCategory === 'Monospace' && (font.category.toLowerCase().includes('mono') || font.name.toLowerCase().includes('mono') || font.name.toLowerCase().includes('code')));

      const matchesLicense = 
        selectedLicense === 'All' || 
        (selectedLicense === 'OFL' && font.is_sil_ofl) ||
        (selectedLicense === 'ITF' && font.license_type.includes('ITF'));

      return matchesSearch && matchesCat && matchesLicense;
    });
  }, [allFonts, searchQuery, selectedCategory, selectedLicense]);

  // Reset page on search or filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedLicense]);

  // Pagination slice
  const totalPages = Math.ceil(filteredFonts.length / pageSize);
  const paginatedFonts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredFonts.slice(start, start + pageSize);
  }, [filteredFonts, currentPage, pageSize]);

  // Also dynamically load stylesheets for visible cards on current page (up to 48)
  useEffect(() => {
    paginatedFonts.slice(0, 16).forEach(f => {
      const url = f.cdn_stylesheet_url || getFontCdnStylesheet(f);
      if (!document.querySelector(`link[data-font-slug="${f.slug}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        link.setAttribute('data-font-slug', f.slug);
        document.head.appendChild(link);
      }
    });
  }, [paginatedFonts]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 1800);
  };

  // Generate snippets for active font
  const cssImportSnippet = `@import url('${activeFont.cdn_stylesheet_url || getFontCdnStylesheet(activeFont)}');

font-family: '${activeFont.name}', ${activeFont.category === 'Serif' ? 'serif' : (activeFont.category === 'Monospace' ? 'monospace' : 'sans-serif')};`;

  const npmSnippet = activeFont.npm_package 
    ? `npm install ${activeFont.npm_package}` 
    : `npm install @fontsource/${activeFont.slug}`;

  return (
    <div className="h-full flex flex-col p-3 overflow-hidden gap-3 font-mono">
      {/* Top Typography Interactive Tester */}
      <section className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-xl p-4 shrink-0 shadow-sm transition-colors flex flex-col gap-3">
        {/* Header & Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border-dev)]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-amber-500/20 text-amber-500 flex items-center justify-center">
              <Type className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[var(--text-primary)] font-sans">
                  Active Font: <span className="text-rose-500 font-mono">{activeFont.name}</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[var(--pill-bg)] text-[var(--text-muted)]">
                  {activeFont.category} • {activeFont.styles_count} styles • {activeFont.license_type}
                </span>
              </div>
            </div>
          </div>

          {/* Typography Adjusters */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Font Size Slider */}
            <div className="flex items-center gap-1.5 bg-[var(--bg-sidebar)] px-2 py-1 rounded border border-[var(--border-dev)]">
              <span className="text-[10px] text-[var(--text-muted)]">SIZE:</span>
              <input
                type="range"
                min="14"
                max="72"
                value={fontSize}
                onChange={e => setFontSize(Number(e.target.value))}
                className="w-16 accent-rose-500 cursor-pointer h-1"
              />
              <span className="text-[10px] font-bold text-[var(--text-primary)] w-7 text-right">{fontSize}px</span>
            </div>

            {/* Font Weight Selector */}
            <div className="flex items-center gap-1 bg-[var(--bg-sidebar)] p-0.5 rounded border border-[var(--border-dev)] text-xs">
              <span className="text-[var(--text-muted)] px-1 text-[10px]">WEIGHT:</span>
              {[300, 400, 600, 700, 800].map(w => (
                <button
                  key={w}
                  onClick={() => setFontWeight(w)}
                  className={`px-1.5 py-0.5 rounded text-[10px] transition-colors cursor-pointer ${
                    fontWeight === w
                      ? 'bg-rose-500 text-white font-bold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>

            {/* Letter Spacing */}
            <div className="flex items-center gap-1.5 bg-[var(--bg-sidebar)] px-2 py-1 rounded border border-[var(--border-dev)]">
              <span className="text-[10px] text-[var(--text-muted)]">TRACKING:</span>
              <input
                type="range"
                min="-2"
                max="8"
                value={letterSpacing}
                onChange={e => setLetterSpacing(Number(e.target.value))}
                className="w-14 accent-rose-500 cursor-pointer h-1"
              />
              <span className="text-[10px] font-bold text-[var(--text-primary)]">{letterSpacing}px</span>
            </div>

            {/* Text Transform Switcher */}
            <div className="flex items-center bg-[var(--bg-sidebar)] p-0.5 rounded border border-[var(--border-dev)] text-[10px]">
              {(['none', 'uppercase', 'lowercase'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTextTransform(t)}
                  className={`px-1.5 py-0.5 rounded uppercase transition-colors cursor-pointer ${
                    textTransform === t
                      ? 'bg-black/10 dark:bg-white/10 text-cyan-500 font-bold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {t === 'none' ? 'Aa' : t}
                </button>
              ))}
            </div>

            {/* Copy Snippets */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => copyToClipboard(cssImportSnippet, 'css')}
                title="Copy CSS @import snippet"
                className="px-2 py-1 text-xs font-semibold rounded bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-[var(--text-primary)] hover:border-rose-500/40 flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedCode === 'css' ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Code2 className="w-3 h-3 text-rose-500" />}
                <span>{copiedCode === 'css' ? 'Copied' : 'CSS'}</span>
              </button>

              <button
                onClick={() => copyToClipboard(npmSnippet, 'npm')}
                title="Copy npm install command"
                className="px-2 py-1 text-xs font-semibold rounded bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-[var(--text-primary)] hover:border-rose-500/40 flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedCode === 'npm' ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Terminal className="w-3 h-3 text-cyan-500" />}
                <span>{copiedCode === 'npm' ? 'Copied' : 'NPM'}</span>
              </button>

              <Link
                href={`/fonts/${activeFont.slug}`}
                title="Open Dedicated Font Page"
                className="px-2 py-1 text-xs font-semibold rounded bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-rose-500 hover:bg-rose-500 hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>Full Page</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Live Typography Canvas */}
        <div className="bg-[var(--bg-codebox)] border border-[var(--border-dev)] rounded-lg p-4 overflow-x-auto min-h-[85px] flex items-center transition-colors">
          <input
            type="text"
            value={sampleText}
            onChange={e => setSampleText(e.target.value)}
            style={{
              fontFamily: activeFont.css_font_family || `'${activeFont.name}', sans-serif`,
              fontSize: `${fontSize}px`,
              fontWeight: fontWeight,
              letterSpacing: `${letterSpacing}px`,
              lineHeight: lineHeight,
              textTransform: textTransform,
            }}
            className="w-full bg-transparent border-none outline-none text-[var(--text-code)] placeholder:text-[var(--text-muted)] selection:bg-rose-500 selection:text-white"
            placeholder="Type anything to test typography across all fonts..."
          />
        </div>
      </section>

      {/* Catalog Search & Category Filter */}
      <div className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-lg px-3 py-2 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-sm transition-colors">
        {/* Search Bar */}
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={`Search ${allFonts.length}+ fonts by name, designer, category...`}
            className="dev-input flex-1 px-2.5 py-1 rounded text-xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1 text-xs">
          <span className="text-[10px] text-[var(--text-muted)] mr-1">CATEGORY:</span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-rose-500 text-white font-bold shadow-sm'
                  : 'bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* License Filter & Pagination */}
        <div className="flex items-center gap-3 text-xs">
          <select
            value={selectedLicense}
            onChange={e => setSelectedLicense(e.target.value)}
            className="dev-input px-2 py-1 rounded text-xs bg-[var(--bg-sidebar)]"
          >
            <option value="All">All Licenses</option>
            <option value="OFL">SIL Open Font License (OFL)</option>
            <option value="ITF">ITF Free Font License</option>
          </select>

          <span className="text-[11px] text-[var(--text-muted)] font-mono">
            <strong>{filteredFonts.length}</strong> fonts
          </span>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1 bg-[var(--bg-sidebar)] p-0.5 rounded border border-[var(--border-dev)]">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] px-1 font-bold text-[var(--text-primary)]">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-30 cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Fonts Catalog Grid */}
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {paginatedFonts.map(font => {
            const isSelected = activeFont.slug === font.slug;
            return (
              <div
                key={font.slug}
                onClick={() => setActiveFont(font)}
                className={`bg-[var(--bg-panel)] border rounded-lg p-3.5 flex flex-col justify-between gap-3 cursor-pointer transition-all hover:shadow-md group ${
                  isSelected 
                    ? 'border-rose-500 ring-1 ring-rose-500 shadow-sm' 
                    : 'border-[var(--border-dev)] hover:border-rose-500/40'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-sm font-bold text-[var(--text-primary)] font-sans group-hover:text-rose-500 transition-colors">
                        {font.name}
                      </h3>
                      <div className="text-[10px] text-[var(--text-muted)] truncate max-w-[170px]">
                        {font.publisher}
                      </div>
                    </div>

                    <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-[var(--pill-bg)] border border-[var(--border-dev)] text-[var(--text-muted)] shrink-0">
                      {font.category}
                    </span>
                  </div>

                  {/* Font Specimen Preview - Shows current sampleText typed in tester! */}
                  <div 
                    style={{ fontFamily: font.css_font_family || `'${font.name}', sans-serif` }}
                    className="p-2.5 rounded bg-[var(--bg-panel-subtle)] border border-[var(--border-dev-subtle)] text-base text-[var(--text-primary)] truncate my-2 select-none leading-normal"
                  >
                    {sampleText || font.name}
                  </div>
                </div>

                <div className="pt-2 border-t border-[var(--border-dev-subtle)] flex items-center justify-between text-[10px] text-[var(--text-muted)]">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[var(--text-secondary)]">{font.styles_count} styles</span>
                    <span>•</span>
                    <span className="truncate max-w-[90px]">{font.license_type}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveFont(font);
                      }}
                      className="px-2 py-0.5 rounded bg-[var(--bg-sidebar)] border border-[var(--border-dev)] hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
                    >
                      Test
                    </button>
                    <Link
                      href={`/fonts/${font.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 rounded bg-[var(--bg-sidebar)] border border-[var(--border-dev)] hover:text-rose-500 transition-colors"
                      title={`View ${font.name} dedicated page`}
                    >
                      <ArrowRight className="w-3 h-3" />
                    </Link>
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
