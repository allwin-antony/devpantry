'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';

export interface IconData {
  body: string;
  width?: number;
  height?: number;
  left?: number;
  top?: number;
}

// Global In-Memory Cache for loaded icon definitions
const iconCache = new Map<string, IconData>();

// Active in-flight batch requests to prevent duplicate requests
const inFlightRequests = new Map<string, Promise<void>>();

// Global listeners for external store subscription
const listeners = new Set<() => void>();

function notifyListeners() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getCachedIcon(prefix: string, name: string): IconData | null {
  if (!prefix || !name) return null;
  return iconCache.get(`${prefix}:${name}`) || null;
}

/**
 * Batch-loads icon data for a specific prefix using Iconify's official batch JSON endpoint.
 * Batches requests into chunks of up to 60 icons per HTTP request.
 */
export async function loadIconsBatch(prefix: string, names: string[]): Promise<void> {
  if (!prefix || !names || names.length === 0) return;

  // Filter out icons that are already cached
  const missingNames = names.filter(name => !iconCache.has(`${prefix}:${name}`));
  if (missingNames.length === 0) return;

  // Maximum safe URL length (Iconify components enforce a strict 500-character URL limit)
  const MAX_URL_LENGTH = 480;
  const baseUrl = `https://api.iconify.design/${encodeURIComponent(prefix)}.json?icons=`;
  const baseLen = baseUrl.length;

  // Dynamically split icons into chunks that strictly stay under MAX_URL_LENGTH (500 chars)
  const chunks: string[][] = [];
  let currentChunk: string[] = [];
  let currentLen = baseLen;

  for (const name of missingNames) {
    const encoded = encodeURIComponent(name);
    // Added length: comma (1 char) if not first item + encoded name length
    const addedLen = (currentChunk.length > 0 ? 1 : 0) + encoded.length;

    if (currentChunk.length > 0 && currentLen + addedLen > MAX_URL_LENGTH) {
      chunks.push(currentChunk);
      currentChunk = [name];
      currentLen = baseLen + encoded.length;
    } else {
      currentChunk.push(name);
      currentLen += addedLen;
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  const batchPromises = chunks.map(async chunk => {
    const chunkKey = `${prefix}:${chunk.sort().join(',')}`;
    
    // Deduplicate in-flight requests for the same chunk
    if (inFlightRequests.has(chunkKey)) {
      return inFlightRequests.get(chunkKey)!;
    }

    const promise = (async () => {
      try {
        const queryIcons = chunk.map(n => encodeURIComponent(n)).join(',');
        const res = await fetch(`https://api.iconify.design/${encodeURIComponent(prefix)}.json?icons=${queryIcons}`, {
          cache: 'force-cache'
        });

        if (!res.ok) {
          return;
        }

        const data = await res.json();
        if (!data) return;

        const defaultWidth = data.width || 24;
        const defaultHeight = data.height || 24;

        // 1. Process regular icons
        if (data.icons && typeof data.icons === 'object') {
          for (const [iconName, iconObj] of Object.entries<any>(data.icons)) {
            if (iconObj && typeof iconObj.body === 'string') {
              iconCache.set(`${prefix}:${iconName}`, {
                body: iconObj.body,
                width: iconObj.width || defaultWidth,
                height: iconObj.height || defaultHeight,
                left: iconObj.left || 0,
                top: iconObj.top || 0
              });
            }
          }
        }

        // 2. Process aliases (e.g. "home" pointing to parent "house")
        if (data.aliases && typeof data.aliases === 'object') {
          for (const [aliasName, aliasObj] of Object.entries<any>(data.aliases)) {
            const parentName = aliasObj?.parent;
            if (parentName && iconCache.has(`${prefix}:${parentName}`)) {
              const parentData = iconCache.get(`${prefix}:${parentName}`)!;
              iconCache.set(`${prefix}:${aliasName}`, {
                ...parentData,
                body: aliasObj.body || parentData.body,
                width: aliasObj.width || parentData.width,
                height: aliasObj.height || parentData.height
              });
            }
          }
        }

        // Notify all UI subscribers to update rendered icons
        notifyListeners();
      } catch (err) {
        console.warn(`[DevPantry IconBatch] Failed to batch load ${prefix} icons:`, err);
      } finally {
        inFlightRequests.delete(chunkKey);
      }
    })();

    inFlightRequests.set(chunkKey, promise);
    return promise;
  });

  await Promise.all(batchPromises);
}

/**
 * Batch-loads icons across multiple prefixes (used in Master Search).
 * Automatically groups icons by prefix to minimize total HTTP connections.
 */
export async function loadMultiPrefixIcons(items: { prefix: string; name: string }[]): Promise<void> {
  if (!items || items.length === 0) return;

  const grouped = new Map<string, Set<string>>();
  for (const item of items) {
    if (!item.prefix || !item.name) continue;
    if (iconCache.has(`${item.prefix}:${item.name}`)) continue;

    if (!grouped.has(item.prefix)) {
      grouped.set(item.prefix, new Set());
    }
    grouped.get(item.prefix)!.add(item.name);
  }

  if (grouped.size === 0) return;

  const promises: Promise<void>[] = [];
  for (const [prefix, nameSet] of grouped.entries()) {
    promises.push(loadIconsBatch(prefix, Array.from(nameSet)));
  }

  await Promise.all(promises);
}

/**
 * Hook to read an icon from the in-memory cache and auto-trigger loading if missing.
 */
export function useIcon(prefix: string, name: string) {
  const iconData = useSyncExternalStore(
    subscribe,
    () => getCachedIcon(prefix, name),
    () => null
  );

  useEffect(() => {
    if (!iconData && prefix && name && name !== 'icon') {
      loadIconsBatch(prefix, [name]);
    }
  }, [prefix, name, iconData]);

  return {
    icon: iconData,
    isLoading: !iconData
  };
}

/**
 * Helper to adjust stroke-width inside SVG inner markup.
 */
export function processIconBody(body: string, strokeWidth?: number): string {
  if (!body) return '';
  if (strokeWidth && strokeWidth !== 2) {
    if (body.includes('stroke-width="')) {
      return body.replace(/stroke-width="[^"]*"/g, `stroke-width="${strokeWidth}"`);
    } else if (body.includes('stroke="')) {
      return body.replace(/<path/g, `<path stroke-width="${strokeWidth}"`);
    }
  }
  return body;
}

/**
 * Build clean, standalone SVG markup for export or copying.
 */
export function buildStandaloneSvg(
  iconData: IconData | null,
  prefix: string,
  name: string,
  color: string = 'currentColor',
  strokeWidth: number = 2,
  size: number = 24
): string {
  if (!iconData) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${strokeWidth}">\n  <!-- ${prefix}:${name} -->\n</svg>`;
  }

  const left = iconData.left || 0;
  const top = iconData.top || 0;
  const width = iconData.width || 24;
  const height = iconData.height || 24;
  const body = processIconBody(iconData.body, strokeWidth);
  const resolvedColor = color === 'currentColor' ? 'currentColor' : color;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${left} ${top} ${width} ${height}" fill="none" stroke="${resolvedColor}">
  <!-- DevPantry Icon: ${prefix}:${name} -->
  ${body}
</svg>`;
}

/**
 * Client-side file downloader for SVG icons without hitting any remote CDN.
 */
export function downloadSvgFile(
  iconData: IconData | null,
  prefix: string,
  name: string,
  color: string = '#000000',
  strokeWidth: number = 2,
  size: number = 24
) {
  const content = buildStandaloneSvg(iconData, prefix, name, color, strokeWidth, size);
  const blob = new Blob([content], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${name}.svg`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * Developer-grade Icon Placeholder
 * - Minimalist geometry inspired by Figma / Illustrator bounding box & crosshair glyphs
 * - Theme-adaptive for dark & light mode with subtle animated light sweep
 */
export function IconPlaceholder({
  size = 24,
  className = '',
  label = 'Loading icon...'
}: {
  size?: number;
  className?: string;
  label?: string;
}) {
  return (
    <div
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`relative flex items-center justify-center rounded-lg bg-[var(--bg-panel-subtle)] border border-[var(--border-dev)]/70 overflow-hidden shadow-xs shrink-0 select-none ${className}`}
      aria-label={label}
    >
      {/* Light shimmer sweep reflection */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/15 dark:via-cyan-400/15 to-transparent animate-icon-shimmer pointer-events-none" />

      {/* Vector Geometry Blueprint Glyph */}
      <svg
        width={Math.max(size * 0.55, 12)}
        height={Math.max(size * 0.55, 12)}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-[var(--text-muted)] opacity-40 shrink-0"
      >
        <rect width="18" height="18" x="3" y="3" rx="4" strokeDasharray="3 3" />
        <circle cx="12" cy="12" r="3.5" />
      </svg>
    </div>
  );
}

/**
 * Premium Vector Icon Renderer
 * - Zero 429 rate limit risk via dynamic batch loading (<500 char safe URLs)
 * - Instant CSS currentColor reactivity (0 network calls on color change)
 * - Sleek, professional glass/shimmer placeholder compliant with dark & light modes
 */
export function IconRenderer({
  prefix,
  name,
  size = 24,
  color = 'currentColor',
  strokeWidth = 2,
  className = '',
  style
}: {
  prefix: string;
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  // Support temporary demo mode for inspecting the new placeholder
  const isDemo = name === 'temp-placeholder-demo' || name.startsWith('placeholder-demo');
  const { icon, isLoading } = useIcon(prefix, isDemo ? '' : name);

  if (isDemo || isLoading || !icon) {
    return (
      <IconPlaceholder 
        size={size} 
        className={className} 
        label={isDemo ? 'Placeholder Preview Demo' : `Loading ${name}...`} 
      />
    );
  }

  const processedBody = processIconBody(icon.body, strokeWidth);
  const viewBox = `${icon.left || 0} ${icon.top || 0} ${icon.width || 24} ${icon.height || 24}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      width={size}
      height={size}
      className={`inline-block shrink-0 transition-opacity duration-200 ${className}`}
      style={{
        color: color === 'currentColor' ? 'inherit' : color,
        display: 'inline-block',
        verticalAlign: 'middle',
        ...style
      }}
      dangerouslySetInnerHTML={{ __html: processedBody }}
    />
  );
}
