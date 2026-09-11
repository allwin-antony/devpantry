'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Globe, AlertTriangle, CheckCircle, ExternalLink, Copy, Check,
  Loader2, Share2, Code, Eye, ChevronDown, Info, Image as ImageIcon,
  MessageSquare,
} from 'lucide-react';
import { IconRenderer } from '@/lib/iconBatchLoader';

// ─── Types ────────────────────────────────────────────────────────────────────

interface OgMeta {
  url: string;
  meta: Record<string, string>;
  title: string;
  favicon: string;
  canonical: string;
  imageDimensions: { width: number; height: number } | null;
  warnings: string[];
}

type Platform = 'twitter' | 'facebook' | 'linkedin' | 'discord' | 'slack' | 'whatsapp';
type InputMode = 'url' | 'source';

const PLATFORMS: { id: Platform; label: string; color: string; icon: string }[] = [
  { id: 'twitter', label: 'X / Twitter', color: 'var(--text-primary)', icon: 'x' },
  { id: 'facebook', label: 'Facebook', color: '#1877F2', icon: 'facebook' },
  { id: 'linkedin', label: 'LinkedIn', color: '#0A66C2', icon: 'linkedin' },
  { id: 'discord', label: 'Discord', color: '#5865F2', icon: 'discord' },
  { id: 'slack', label: 'Slack', color: '#E01E5A', icon: 'slack' },
  { id: 'whatsapp', label: 'WhatsApp', color: '#25D366', icon: 'whatsapp' },
];

// ─── Meta extraction from pasted HTML source ─────────────────────────────────

function extractMetaFromHtml(html: string): OgMeta {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const meta: Record<string, string> = {};

  doc.querySelectorAll('meta[property], meta[name]').forEach((el) => {
    const key = el.getAttribute('property') || el.getAttribute('name') || '';
    const content = el.getAttribute('content') || '';
    if (key) meta[key] = content;
  });

  const title = doc.querySelector('title')?.textContent?.trim() || '';

  let favicon = '';
  const link = doc.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
  if (link) favicon = link.getAttribute('href') || '';

  let canonical = '';
  const canonLink = doc.querySelector('link[rel="canonical"]');
  if (canonLink) canonical = canonLink.getAttribute('href') || '';

  const warnings: string[] = [];
  if (!meta['og:title'] && !title) warnings.push('Missing og:title and <title> — most platforms will show no title.');
  if (!meta['og:description'] && !meta['description']) warnings.push('Missing og:description — social cards will have no description text.');
  if (!meta['og:image']) warnings.push('Missing og:image — social cards will render without an image preview.');
  if (!meta['twitter:card']) warnings.push('Missing twitter:card — X/Twitter will use default card type.');

  const ogTitle = meta['og:title'] || title || '';
  const ogDesc = meta['og:description'] || meta['description'] || '';
  if (ogTitle.length > 90) warnings.push(`og:title is ${ogTitle.length} chars — may be truncated on some platforms (recommended < 90).`);
  if (ogDesc.length > 200) warnings.push(`og:description is ${ogDesc.length} chars — may be truncated (recommended < 200).`);

  const w = parseInt(meta['og:image:width'] || '', 10);
  const h = parseInt(meta['og:image:height'] || '', 10);

  return {
    url: canonical || meta['og:url'] || '',
    meta,
    title,
    favicon,
    canonical,
    imageDimensions: w > 0 && h > 0 ? { width: w, height: h } : null,
    warnings,
  };
}

// ─── Utility helpers ──────────────────────────────────────────────────────────

function getDomain(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url; }
}

function truncate(text: string, max: number): string {
  if (!text) return '';
  return text.length > max ? text.slice(0, max - 1) + '…' : text;
}

// ─── Platform Card Mockups ────────────────────────────────────────────────────

function TwitterCard({ data }: { data: OgMeta }) {
  const cardType = data.meta['twitter:card'] || 'summary_large_image';
  const title = data.meta['twitter:title'] || data.meta['og:title'] || data.title;
  const description = data.meta['twitter:description'] || data.meta['og:description'] || data.meta['description'] || '';
  const image = data.meta['twitter:image'] || data.meta['og:image'] || '';
  const domain = getDomain(data.url);

  if (cardType === 'summary') {
    return (
      <div className="rounded-2xl border border-[var(--border-dev)] overflow-hidden bg-[var(--bg-panel)] flex hover:bg-[var(--bg-panel-hover)] transition-colors">
        {image && (
          <div className="w-[125px] h-[125px] shrink-0 border-r border-[var(--border-dev)] bg-[var(--bg-panel-subtle)]">
            <img src={image} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </div>
        )}
        <div className="p-3 flex flex-col justify-center gap-0.5 min-w-0">
          <span className="text-[11px] text-[var(--text-muted)]">{domain}</span>
          <span className="text-[13px] font-semibold text-[var(--text-primary)] line-clamp-1">{truncate(title, 70)}</span>
          <span className="text-[12px] text-[var(--text-secondary)] line-clamp-2">{truncate(description, 150)}</span>
        </div>
      </div>
    );
  }

  // summary_large_image
  return (
    <div className="rounded-2xl border border-[var(--border-dev)] overflow-hidden bg-[var(--bg-panel)] hover:bg-[var(--bg-panel-hover)] transition-colors">
      {image && (
        <div className="w-full aspect-[2/1] bg-[var(--bg-panel-subtle)] overflow-hidden">
          <img src={image} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </div>
      )}
      <div className="p-3 flex flex-col gap-0.5">
        <span className="text-[11px] text-[var(--text-muted)]">{domain}</span>
        <span className="text-[13px] font-semibold text-[var(--text-primary)] line-clamp-2">{truncate(title, 70)}</span>
        <span className="text-[12px] text-[var(--text-secondary)] line-clamp-2">{truncate(description, 150)}</span>
      </div>
    </div>
  );
}

function FacebookCard({ data }: { data: OgMeta }) {
  const title = data.meta['og:title'] || data.title;
  const description = data.meta['og:description'] || data.meta['description'] || '';
  const image = data.meta['og:image'] || '';
  const domain = getDomain(data.url).toUpperCase();

  return (
    <div className="border border-[var(--border-dev)] overflow-hidden bg-[var(--bg-panel)]">
      {image && (
        <div className="w-full aspect-[1.91/1] bg-[var(--bg-panel-subtle)] overflow-hidden">
          <img src={image} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </div>
      )}
      <div className="px-3 py-2.5 border-t border-[var(--border-dev)] bg-[var(--bg-panel-subtle)]">
        <span className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider">{domain}</span>
        <div className="text-[14px] font-bold text-[var(--text-primary)] line-clamp-2 mt-0.5 leading-tight">{truncate(title, 80)}</div>
        <div className="text-[12px] text-[var(--text-secondary)] line-clamp-1 mt-0.5">{truncate(description, 160)}</div>
      </div>
    </div>
  );
}

function LinkedInCard({ data }: { data: OgMeta }) {
  const title = data.meta['og:title'] || data.title;
  const description = data.meta['og:description'] || data.meta['description'] || '';
  const image = data.meta['og:image'] || '';
  const domain = getDomain(data.url);

  return (
    <div className="rounded-lg border border-[var(--border-dev)] overflow-hidden bg-[var(--bg-panel)]">
      {image && (
        <div className="w-full aspect-[1.91/1] bg-[var(--bg-panel-subtle)] overflow-hidden">
          <img src={image} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </div>
      )}
      <div className="px-3 py-2.5">
        <div className="text-[14px] font-semibold text-[var(--text-primary)] line-clamp-2 leading-tight">{truncate(title, 80)}</div>
        <div className="text-[12px] text-[var(--text-secondary)] line-clamp-2 mt-0.5">{truncate(description, 160)}</div>
        <span className="text-[11px] text-[var(--text-muted)] mt-1 block">{domain}</span>
      </div>
    </div>
  );
}

function DiscordCard({ data }: { data: OgMeta }) {
  const title = data.meta['og:title'] || data.title;
  const description = data.meta['og:description'] || data.meta['description'] || '';
  const image = data.meta['og:image'] || '';
  const siteName = data.meta['og:site_name'] || getDomain(data.url);

  return (
    <div className="rounded-sm overflow-hidden bg-[#2f3136] border-l-4 border-l-[#5865F2] max-w-[432px]">
      <div className="p-3">
        <div className="text-[12px] font-semibold text-[#00b0f4] mb-1">{siteName}</div>
        <div className="text-[14px] font-bold text-white line-clamp-2 leading-snug hover:underline cursor-pointer">{truncate(title, 80)}</div>
        {description && (
          <div className="text-[13px] text-[#dcddde] line-clamp-3 mt-1 leading-relaxed">{truncate(description, 350)}</div>
        )}
        {image && (
          <div className="mt-3 rounded overflow-hidden max-w-[400px]">
            <img src={image} alt="" className="w-full max-h-[300px] object-cover rounded" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </div>
        )}
      </div>
    </div>
  );
}

function SlackCard({ data }: { data: OgMeta }) {
  const title = data.meta['og:title'] || data.title;
  const description = data.meta['og:description'] || data.meta['description'] || '';
  const image = data.meta['og:image'] || '';
  const siteName = data.meta['og:site_name'] || getDomain(data.url);
  const favicon = data.favicon;

  return (
    <div className="border-l-4 border-l-[#CCCCCC] pl-3 py-1 max-w-[500px]">
      <div className="flex items-center gap-1.5 mb-1">
        {favicon && <img src={favicon} alt="" className="w-4 h-4 rounded" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
        <span className="text-[13px] font-bold text-[var(--text-primary)]">{siteName}</span>
      </div>
      <div className="text-[14px] font-bold text-[#1264A3] hover:underline cursor-pointer line-clamp-1">{truncate(title, 80)}</div>
      {description && (
        <div className="text-[13px] text-[var(--text-secondary)] line-clamp-2 mt-0.5">{truncate(description, 200)}</div>
      )}
      {image && (
        <div className="mt-2 rounded overflow-hidden max-w-[360px]">
          <img src={image} alt="" className="max-h-[200px] rounded object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </div>
      )}
    </div>
  );
}

function WhatsAppCard({ data }: { data: OgMeta }) {
  const title = data.meta['og:title'] || data.title;
  const description = data.meta['og:description'] || data.meta['description'] || '';
  const image = data.meta['og:image'] || '';
  const domain = getDomain(data.url).toUpperCase();

  return (
    <div className="rounded-xl overflow-hidden bg-[#005c4b] max-w-[350px] shadow-sm border border-[var(--border-dev)]">
      {image && (
        <div className="w-full aspect-[1.91/1] bg-[#075E54] overflow-hidden">
          <img src={image} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </div>
      )}
      <div className="px-3.5 py-3 bg-[#005c4b]">
        <span className="text-[11px] text-[#A8D8CF] tracking-wide block mb-1">{domain}</span>
        <div className="text-[14px] font-bold text-white line-clamp-1 leading-tight">{truncate(title, 60)}</div>
        {description && (
          <div className="text-[13px] text-[#8696a0] line-clamp-2 mt-0.5 leading-snug">{truncate(description, 120)}</div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface SocialPreviewClientProps {
  initialPlatform?: Platform;
  children?: React.ReactNode;
}

export function SocialPreviewClient({ initialPlatform, children }: SocialPreviewClientProps) {
  const [inputMode, setInputMode] = useState<InputMode>('url');
  const [urlInput, setUrlInput] = useState('');
  const [sourceInput, setSourceInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [ogData, setOgData] = useState<OgMeta | null>(null);
  const [activePlatform, setActivePlatform] = useState<Platform>(initialPlatform || 'twitter');
  const [copied, setCopied] = useState(false);
  const [showRawMeta, setShowRawMeta] = useState(false);

  // Sync hash state for shareable URLs
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (hash.startsWith('#url=')) {
      const decoded = decodeURIComponent(hash.slice(5));
      setUrlInput(decoded);
      fetchUrl(decoded);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUrl = useCallback(async (url: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setOgData(null);

    try {
      const response = await fetch(`/api/og-fetch?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to fetch (HTTP ${response.status})`);
      }

      setOgData(data as OgMeta);

      // Update hash for shareability
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', `#url=${encodeURIComponent(url)}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setErrorMessage(`Couldn't fetch this URL: ${msg}. The site might be blocking bots. Try the "Paste Source" mode below.`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleUrlSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = urlInput.trim();
    if (!trimmed) return;

    // Auto-prefix https:// if missing
    let url = trimmed;
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
    setUrlInput(url);
    fetchUrl(url);
  }, [urlInput, fetchUrl]);

  const handleSourceSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = sourceInput.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setErrorMessage(null);
    setOgData(null);

    // Short delay to show loading animation
    setTimeout(() => {
      try {
        const result = extractMetaFromHtml(trimmed);
        setOgData(result);
      } catch {
        setErrorMessage('Failed to parse the HTML source. Ensure you pasted valid HTML.');
      } finally {
        setIsLoading(false);
      }
    }, 150);
  }, [sourceInput]);

  const handleCopyLink = useCallback(() => {
    if (typeof window === 'undefined') return;
    const shareUrl = `${window.location.origin}${window.location.pathname}#url=${encodeURIComponent(urlInput)}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [urlInput]);

  // Sorted meta keys for the raw inspector
  const sortedMetaKeys = useMemo(() => {
    if (!ogData) return [];
    return Object.keys(ogData.meta).sort((a, b) => {
      const order = ['og:', 'twitter:', 'description', 'author'];
      const aIdx = order.findIndex(p => a.startsWith(p));
      const bIdx = order.findIndex(p => b.startsWith(p));
      if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
      if (aIdx !== -1) return -1;
      if (bIdx !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [ogData]);

  const renderPlatformCard = useCallback(() => {
    if (!ogData) return null;
    switch (activePlatform) {
      case 'twitter': return <TwitterCard data={ogData} />;
      case 'facebook': return <FacebookCard data={ogData} />;
      case 'linkedin': return <LinkedInCard data={ogData} />;
      case 'discord': return <DiscordCard data={ogData} />;
      case 'slack': return <SlackCard data={ogData} />;
      case 'whatsapp': return <WhatsAppCard data={ogData} />;
    }
  }, [ogData, activePlatform]);

  return (
    <div className="flex-1 flex flex-col w-full">
      {/* ── Header Bar ─────────────────────────────────────────────────────── */}
      <div className="w-full border-b border-[var(--border-dev)] bg-[var(--bg-panel)] px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-md">
            <Share2 className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-[var(--text-primary)] tracking-tight">SOCIAL SHARE PREVIEW</h2>
            <p className="text-[10px] text-[var(--text-muted)]">Open Graph & Twitter Card Inspector</p>
          </div>
        </div>

        {/* Input mode toggle */}
        <div className="flex items-center h-7 bg-[var(--bg-sidebar)] p-0.5 rounded-lg border border-[var(--border-dev)] text-[11px] gap-0.5 ml-auto">
          <button
            onClick={() => setInputMode('url')}
            className={`h-6 px-2.5 rounded-md flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              inputMode === 'url'
                ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 font-semibold shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--pill-bg)] border border-transparent'
            }`}
          >
            <Globe className="w-3 h-3" />
            Fetch URL
          </button>
          <button
            onClick={() => setInputMode('source')}
            className={`h-6 px-2.5 rounded-md flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              inputMode === 'source'
                ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 font-semibold shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--pill-bg)] border border-transparent'
            }`}
          >
            <Code className="w-3 h-3" />
            Paste Source
          </button>
        </div>
      </div>

      {/* ── Input Area ─────────────────────────────────────────────────────── */}
      <div className="w-full px-4 sm:px-6 py-4 border-b border-[var(--border-dev)] bg-[var(--bg-panel-subtle)]">
        {inputMode === 'url' ? (
          <form onSubmit={handleUrlSubmit} className="flex gap-2 items-center">
            <div className="relative flex-1">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)]" />
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com — paste any public URL"
                className="dev-input w-full h-9 pl-9 pr-3 rounded-lg text-xs"
                spellCheck={false}
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !urlInput.trim()}
              className="h-9 px-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold flex items-center gap-1.5 hover:opacity-90 transition-opacity disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed shrink-0 shadow-md"
            >
              {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5" />}
              {isLoading ? 'Fetching...' : 'Preview'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSourceSubmit} className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
              <Info className="w-3 h-3 text-cyan-500 shrink-0" />
              <span>Paste HTML source (view-source or document.documentElement.outerHTML) — ideal for localhost / staging URLs.</span>
            </div>
            <textarea
              value={sourceInput}
              onChange={(e) => setSourceInput(e.target.value)}
              placeholder="<!DOCTYPE html><html>..."
              className="dev-input w-full h-28 p-3 rounded-lg text-xs resize-y font-mono leading-relaxed"
              spellCheck={false}
            />
            <button
              type="submit"
              disabled={isLoading || !sourceInput.trim()}
              className="self-end h-8 px-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold flex items-center gap-1.5 hover:opacity-90 transition-opacity disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed shadow-md"
            >
              {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5" />}
              Parse & Preview
            </button>
          </form>
        )}

        {inputMode === 'url' && (
          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[var(--text-muted)]">
            <Info className="w-3 h-3 text-cyan-500/60 shrink-0" />
            <span>Uses a stateless edge relay (nothing is logged). For localhost/staging, switch to <button onClick={() => setInputMode('source')} className="text-cyan-500 dark:text-cyan-400 hover:underline cursor-pointer font-medium">Paste Source</button> mode.</span>
          </div>
        )}
      </div>

      {/* ── Error State ────────────────────────────────────────────────────── */}
      {errorMessage && (
        <div className="mx-4 sm:mx-6 mt-4 px-4 py-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-500 dark:text-rose-400 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* ── Results ────────────────────────────────────────────────────────── */}
      {ogData && (
        <div className="flex-1 flex flex-col lg:flex-row gap-0 overflow-hidden animate-fade-in-up">
          {/* Left: Platform Selection Sidebar */}
          <div className="w-full lg:w-[220px] flex-shrink-0 flex lg:flex-col gap-1.5 px-4 sm:px-6 lg:px-5 py-3 lg:py-6 border-b lg:border-b-0 border-[var(--border-dev)] bg-transparent overflow-x-auto lg:overflow-y-auto no-scrollbar">
            <div className="text-[10px] font-bold text-[var(--text-muted)] tracking-wider mb-2 hidden lg:block px-3">PLATFORM</div>
            {PLATFORMS.map(p => (
              <button
                key={p.id}
                onClick={() => setActivePlatform(p.id)}
                className={`flex-shrink-0 h-9 px-3 rounded-lg flex items-center gap-3 text-[13px] transition-all cursor-pointer whitespace-nowrap ${
                  activePlatform === p.id
                    ? 'bg-[var(--bg-panel)] text-[var(--text-primary)] border border-[var(--border-dev)] font-semibold shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--pill-bg)] border border-transparent'
                }`}
              >
                <IconRenderer 
                  prefix="simple-icons" 
                  name={p.icon} 
                  size={14} 
                  color={activePlatform === p.id && !p.color.startsWith('var') ? p.color : 'currentColor'} 
                />
                <span className="mt-0.5">{p.label}</span>
              </button>
            ))}
          </div>

          {/* Center: Card Preview */}
          <div className="flex-1 flex flex-col min-w-0 border-r border-[var(--border-dev)] bg-transparent">
            <div className="flex-1 p-6 lg:p-8 overflow-y-auto flex flex-col items-center justify-center">
              <div className="w-full max-w-[520px]">
                {renderPlatformCard()}
              </div>

              {/* Share link */}
              {inputMode === 'url' && urlInput && (
                <div className="mt-6 flex items-center gap-2 justify-center">
                  <button
                    onClick={handleCopyLink}
                    className="h-8 px-4 rounded-lg bg-[var(--bg-panel)] border border-[var(--border-dev)] text-[12px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-focus)] flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied!' : 'Copy shareable link'}
                  </button>
                  {ogData.url && (
                    <a
                      href={ogData.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-8 px-4 rounded-lg bg-[var(--bg-panel)] border border-[var(--border-dev)] text-[12px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-focus)] flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Visit page
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: Metadata Inspector + Warnings */}
          <div className="w-full lg:w-[380px] xl:w-[420px] flex flex-col shrink-0 overflow-y-auto border-t lg:border-t-0 border-[var(--border-dev)] bg-[var(--bg-panel-subtle)]">
            {/* Warnings */}
            {ogData.warnings.length > 0 && (
              <div className="px-4 py-3 border-b border-[var(--border-dev)] bg-amber-500/5">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-600 dark:text-amber-400 mb-2">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  VALIDATION WARNINGS ({ogData.warnings.length})
                </div>
                <div className="flex flex-col gap-1.5">
                  {ogData.warnings.map((w, i) => (
                    <div key={i} className="text-[11px] text-amber-700 dark:text-amber-300/80 leading-relaxed pl-5 relative">
                      <span className="absolute left-0 top-0 text-amber-500">▸</span>
                      {w}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="px-4 py-3 border-b border-[var(--border-dev)]">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--text-primary)] mb-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                EXTRACTED METADATA
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
                <div className="text-[var(--text-muted)]">og:title</div>
                <div className="text-[var(--text-primary)] truncate font-medium">{ogData.meta['og:title'] || ogData.title || '—'}</div>

                <div className="text-[var(--text-muted)]">og:description</div>
                <div className="text-[var(--text-primary)] truncate">{ogData.meta['og:description'] || ogData.meta['description'] || '—'}</div>

                <div className="text-[var(--text-muted)]">og:image</div>
                <div className="text-[var(--text-primary)] truncate">{ogData.meta['og:image'] ? '✓ present' : '✗ missing'}</div>

                <div className="text-[var(--text-muted)]">twitter:card</div>
                <div className="text-[var(--text-primary)] truncate">{ogData.meta['twitter:card'] || '—'}</div>

                {ogData.imageDimensions && (
                  <>
                    <div className="text-[var(--text-muted)]">Image size</div>
                    <div className="text-[var(--text-primary)] truncate">{ogData.imageDimensions.width}×{ogData.imageDimensions.height}px</div>
                  </>
                )}

                {ogData.canonical && (
                  <>
                    <div className="text-[var(--text-muted)]">canonical</div>
                    <div className="text-[var(--text-primary)] truncate">{ogData.canonical}</div>
                  </>
                )}
              </div>
            </div>

            {/* Raw Meta Tags (collapsible) */}
            <div className="px-4 py-3">
              <button
                onClick={() => setShowRawMeta(!showRawMeta)}
                className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--text-primary)] w-full cursor-pointer"
              >
                <Code className="w-3.5 h-3.5 text-cyan-500" />
                ALL META TAGS ({sortedMetaKeys.length})
                <ChevronDown className={`w-3 h-3 ml-auto text-[var(--text-muted)] transition-transform ${showRawMeta ? 'rotate-180' : ''}`} />
              </button>
              {showRawMeta && (
                <div className="mt-3 bg-[var(--bg-codebox)] rounded-lg border border-[var(--border-dev)] p-4 max-h-[350px] overflow-y-auto shadow-inner">
                  <table className="w-full text-[11px] font-mono">
                    <tbody>
                      {sortedMetaKeys.map(key => (
                        <tr key={key} className="border-b border-[var(--border-dev-subtle)] last:border-0">
                          <td className="py-1 pr-3 text-cyan-500 dark:text-cyan-400 whitespace-nowrap align-top font-medium">{key}</td>
                          <td className="py-1 text-[var(--text-code)] break-all">{ogData.meta[key]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Empty State ────────────────────────────────────────────────────── */}
      {!ogData && !isLoading && !errorMessage && (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/20 flex items-center justify-center">
            <MessageSquare className="w-7 h-7 text-cyan-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">Preview Social Share Cards</h3>
            <p className="text-xs text-[var(--text-muted)] max-w-md leading-relaxed">
              Paste a URL to see exactly how your page will appear when shared on Twitter/X, LinkedIn, Facebook, Discord, Slack, and WhatsApp. No cache, no ownership verification needed.
            </p>
          </div>
          <div className="flex items-center gap-3 mt-2">
            {[
              { prefix: 'simple-icons', name: 'x', title: 'X' },
              { prefix: 'simple-icons', name: 'linkedin', title: 'LinkedIn' },
              { prefix: 'simple-icons', name: 'facebook', title: 'Facebook' },
              { prefix: 'simple-icons', name: 'discord', title: 'Discord' },
              { prefix: 'simple-icons', name: 'slack', title: 'Slack' },
              { prefix: 'simple-icons', name: 'whatsapp', title: 'WhatsApp' }
            ].map((icon, i) => (
              <div
                key={i}
                title={icon.title}
                className="w-8 h-8 rounded-lg bg-[var(--pill-bg)] border border-[var(--border-dev)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-focus)] transition-all"
              >
                <IconRenderer prefix={icon.prefix} name={icon.name} size={14} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Loading State ──────────────────────────────────────────────────── */}
      {isLoading && (
        <div className="flex-1 flex items-center justify-center gap-3 py-16">
          <Loader2 className="w-5 h-5 text-cyan-500 animate-spin" />
          <span className="text-xs text-[var(--text-muted)] font-mono">Fetching metadata...</span>
        </div>
      )}

      {/* ── SEO Content (children) ─────────────────────────────────────────── */}
      {children}
    </div>
  );
}
