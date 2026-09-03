'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getFontCdnStylesheet, type FontItem } from '@/lib/datasetLoader';
import { 
  Type, 
  Copy, 
  CheckCircle2, 
  ExternalLink, 
  Download, 
  Code2, 
  Terminal, 
  ArrowLeft, 
  Sparkles,
  ShieldCheck,
  Layers
} from 'lucide-react';

export function FontDetailClient({ font }: { font: FontItem }) {
  const [sampleText, setSampleText] = useState<string>(
    'The quick brown fox jumps over the lazy dog 1234567890 & $ # @ !'
  );
  const [fontSize, setFontSize] = useState<number>(36);
  const [fontWeight, setFontWeight] = useState<number>(font.weights[0] || 400);
  const [letterSpacing, setLetterSpacing] = useState<number>(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Dynamically inject stylesheet for this font
  useEffect(() => {
    const url = font.cdn_stylesheet_url || getFontCdnStylesheet(font);
    const existing = document.querySelector(`link[data-font-slug="${font.slug}"]`);
    if (!existing) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      link.setAttribute('data-font-slug', font.slug);
      document.head.appendChild(link);
    }
  }, [font]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 1800);
  };

  const cdnUrl = font.cdn_stylesheet_url || getFontCdnStylesheet(font);

  const cssImportSnippet = `@import url('${cdnUrl}');

body {
  font-family: ${font.css_font_family};
}`;

  const htmlLinkSnippet = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${cdnUrl}" rel="stylesheet">`;

  const tailwindSnippet = `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        '${font.slug}': [${font.css_font_family}],
      },
    },
  },
};`;

  const npmSnippet = font.npm_package 
    ? `npm install ${font.npm_package}` 
    : `npm install @fontsource/${font.slug}`;

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 flex flex-col gap-6 max-w-6xl mx-auto w-full font-mono">
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/fonts"
          className="inline-flex items-center gap-2 text-xs text-[var(--text-secondary)] hover:text-rose-500 transition-colors font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to 2,100+ Open Fonts</span>
        </Link>

        <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)]">
          <span className="px-2 py-0.5 rounded bg-[var(--pill-bg)] border border-[var(--border-dev)]">
            {font.provider.toUpperCase()}
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold">
            {font.license_type}
          </span>
        </div>
      </div>

      {/* Font Header Banner */}
      <section className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-xl p-6 relative shadow-sm transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-2 pt-1">
            <h1 
              style={{ fontFamily: font.css_font_family }}
              className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] leading-normal tracking-tight"
            >
              {font.name}
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[var(--pill-bg)] border border-[var(--border-dev)] text-[var(--text-muted)]">
              {font.category}
            </span>
          </div>

          <p className="text-xs md:text-sm text-[var(--text-secondary)] font-sans">
            By <strong className="text-[var(--text-primary)]">{font.designers.join(', ')}</strong> • Publisher: {font.publisher}
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-[var(--text-muted)]">
            <span><strong>{font.styles_count}</strong> styles available</span>
            <span>•</span>
            <span>Weights: <strong>{font.weights.join(', ')}</strong></span>
            {font.variable && (
              <>
                <span>•</span>
                <span className="text-cyan-500 font-bold">Variable Font Support</span>
              </>
            )}
          </div>
        </div>

        {/* Quick Action Links */}
        <div className="flex flex-wrap items-center gap-2">
          {font.web_url && (
            <a
              href={font.web_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-lg bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-xs font-bold text-[var(--text-primary)] hover:border-rose-500 flex items-center gap-1.5 transition-colors"
            >
              <span>Official Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          {font.download_url && (
            <a
              href={font.download_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-lg bg-rose-500 text-white text-xs font-bold hover:bg-rose-600 flex items-center gap-1.5 transition-colors shadow-sm shadow-rose-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Files</span>
            </a>
          )}
        </div>
      </section>

      {/* Interactive Typography Canvas */}
      <section className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-xl p-5 shadow-sm transition-colors flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[var(--border-dev)]">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-bold text-[var(--text-primary)] font-sans">Live Type Tester</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Size Slider */}
            <div className="flex items-center gap-1.5 bg-[var(--bg-sidebar)] px-2 py-1 rounded border border-[var(--border-dev)]">
              <span className="text-[10px] text-[var(--text-muted)]">SIZE:</span>
              <input
                type="range"
                min="16"
                max="80"
                value={fontSize}
                onChange={e => setFontSize(Number(e.target.value))}
                className="w-20 accent-rose-500 cursor-pointer h-1"
              />
              <span className="text-[10px] font-bold text-[var(--text-primary)] w-8 text-right">{fontSize}px</span>
            </div>

            {/* Weights */}
            <div className="flex items-center gap-1 bg-[var(--bg-sidebar)] p-0.5 rounded border border-[var(--border-dev)] text-xs">
              <span className="text-[var(--text-muted)] px-1 text-[10px]">WEIGHT:</span>
              {font.weights.map(w => (
                <button
                  key={w}
                  onClick={() => setFontWeight(w)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                    fontWeight === w
                      ? 'bg-rose-500 text-white'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>

            {/* Tracking Slider */}
            <div className="flex items-center gap-1.5 bg-[var(--bg-sidebar)] px-2 py-1 rounded border border-[var(--border-dev)]">
              <span className="text-[10px] text-[var(--text-muted)]">TRACKING:</span>
              <input
                type="range"
                min="-2"
                max="10"
                value={letterSpacing}
                onChange={e => setLetterSpacing(Number(e.target.value))}
                className="w-16 accent-rose-500 cursor-pointer h-1"
              />
              <span className="text-[10px] font-bold text-[var(--text-primary)]">{letterSpacing}px</span>
            </div>
          </div>
        </div>

        {/* Input box */}
        <div className="bg-[var(--bg-codebox)] border border-[var(--border-dev)] rounded-lg p-5 overflow-x-auto min-h-[120px] flex items-center">
          <input
            type="text"
            value={sampleText}
            onChange={e => setSampleText(e.target.value)}
            style={{
              fontFamily: font.css_font_family,
              fontSize: `${fontSize}px`,
              fontWeight: fontWeight,
              letterSpacing: `${letterSpacing}px`,
            }}
            className="w-full bg-transparent border-none outline-none text-[var(--text-code)] placeholder:text-[var(--text-muted)] selection:bg-rose-500 selection:text-white"
            placeholder="Type anything to test glyphs..."
          />
        </div>
      </section>

      {/* Weight Specimens Grid */}
      <section className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-xl p-5 shadow-sm transition-colors flex flex-col gap-3">
        <h2 className="text-sm font-bold text-[var(--text-primary)] font-sans flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-500" />
          <span>Styles & Weights Specimen</span>
        </h2>

        <div className="flex flex-col gap-3">
          {font.weights.map(w => (
            <div 
              key={w}
              className="p-3.5 rounded-lg bg-[var(--bg-panel-subtle)] border border-[var(--border-dev-subtle)] flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
            >
              <span className="text-xs font-bold text-[var(--text-muted)] w-24 shrink-0 font-mono">
                Weight {w}
              </span>
              <div 
                style={{ fontFamily: font.css_font_family, fontWeight: w }}
                className="text-lg md:text-xl text-[var(--text-primary)] truncate flex-1"
              >
                ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Code Integration Panel */}
      <section className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-xl p-5 shadow-sm transition-colors flex flex-col gap-4">
        <h2 className="text-sm font-bold text-[var(--text-primary)] font-sans flex items-center gap-2">
          <Code2 className="w-4 h-4 text-amber-500" />
          <span>Quick Integration Snippets</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* CSS @import */}
          <div className="bg-[var(--bg-codebox)] border border-[var(--border-dev)] rounded-lg p-3 flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] pb-2 border-b border-[var(--border-dev-subtle)]">
              <span>CSS @import</span>
              <button
                onClick={() => copyToClipboard(cssImportSnippet, 'css')}
                className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
              >
                {copiedCode === 'css' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode === 'css' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="text-xs text-[var(--text-code)] overflow-x-auto m-0">
              <code>{cssImportSnippet}</code>
            </pre>
          </div>

          {/* NPM Install */}
          <div className="bg-[var(--bg-codebox)] border border-[var(--border-dev)] rounded-lg p-3 flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] pb-2 border-b border-[var(--border-dev-subtle)]">
              <span>NPM Package</span>
              <button
                onClick={() => copyToClipboard(npmSnippet, 'npm')}
                className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
              >
                {copiedCode === 'npm' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode === 'npm' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="text-xs text-cyan-400 overflow-x-auto m-0">
              <code>{npmSnippet}</code>
            </pre>
          </div>

          {/* HTML Link */}
          <div className="bg-[var(--bg-codebox)] border border-[var(--border-dev)] rounded-lg p-3 flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] pb-2 border-b border-[var(--border-dev-subtle)]">
              <span>HTML &lt;link&gt; tag</span>
              <button
                onClick={() => copyToClipboard(htmlLinkSnippet, 'html')}
                className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
              >
                {copiedCode === 'html' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode === 'html' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="text-xs text-rose-300 overflow-x-auto m-0">
              <code>{htmlLinkSnippet}</code>
            </pre>
          </div>

          {/* Tailwind Config */}
          <div className="bg-[var(--bg-codebox)] border border-[var(--border-dev)] rounded-lg p-3 flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] pb-2 border-b border-[var(--border-dev-subtle)]">
              <span>Tailwind CSS Config</span>
              <button
                onClick={() => copyToClipboard(tailwindSnippet, 'tailwind')}
                className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
              >
                {copiedCode === 'tailwind' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode === 'tailwind' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="text-xs text-emerald-400 overflow-x-auto m-0">
              <code>{tailwindSnippet}</code>
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
}
