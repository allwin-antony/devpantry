/**
 * Cloudflare Pages Function — OG Metadata Relay
 *
 * Stateless edge function that fetches a URL on behalf of the client,
 * extracts Open Graph / Twitter Card / standard meta tags, and returns
 * them as JSON. Exists outside the Next.js static export to preserve
 * the "zero-backend Next.js app" architecture.
 *
 * Security:
 *   - Scheme restricted to http/https only.
 *   - Private/internal IP ranges are blocked before fetching.
 *   - Redirects are followed manually (max 5 hops) with re-validation per hop.
 *   - Response body capped at 100 KB (we only need <head>).
 *   - Short timeout (5 s).
 *   - Accepted residual risk: DNS rebinding TOCTOU on Workers (blast radius is
 *     limited to leaked <meta> text, no credential or write exposure).
 *
 * Caching: Successful responses are cached at the Cloudflare edge for 5 minutes.
 */

interface Env {}

interface OgResult {
  url: string;
  meta: Record<string, string>;
  title: string;
  favicon: string;
  canonical: string;
  imageDimensions: { width: number; height: number } | null;
  warnings: string[];
}

// ─── SSRF protection: block private/internal IP ranges ────────────────────────

const BLOCKED_IP_PATTERNS: RegExp[] = [
  /^127\./,                                     // 127.0.0.0/8
  /^10\./,                                      // 10.0.0.0/8
  /^172\.(1[6-9]|2\d|3[01])\./,                 // 172.16.0.0/12
  /^192\.168\./,                                // 192.168.0.0/16
  /^169\.254\./,                                // link-local
  /^0\./,                                       // 0.0.0.0/8
  /^100\.(6[4-9]|[7-9]\d|1[0-1]\d|12[0-7])\./, // CGNAT
  /^::1$/,                                      // IPv6 loopback
  /^fc/i, /^fd/i,                               // IPv6 ULA
  /^fe80/i,                                     // IPv6 link-local
];

const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  'metadata.google.internal',
  'metadata',
]);

function isBlockedHostname(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  if (BLOCKED_HOSTNAMES.has(lower)) return true;

  // Check numeric IPs against the blocked patterns
  for (const pattern of BLOCKED_IP_PATTERNS) {
    if (pattern.test(lower)) return true;
  }

  // Block the AWS/GCP metadata endpoint explicitly
  if (lower === '169.254.169.254') return true;

  return false;
}

function validateUrl(raw: string): URL {
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error('Invalid URL format');
  }

  // Scheme check
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error('Only http and https URLs are allowed');
  }

  // Hostname check
  if (isBlockedHostname(parsed.hostname)) {
    throw new Error('This hostname is not allowed');
  }

  return parsed;
}

// ─── Meta tag extraction via RegExp (zero dependencies) ───────────────────────

function extractMeta(html: string): { meta: Record<string, string>; title: string; favicon: string; canonical: string } {
  // Only scan up to </head> or first 50 KB, whichever comes first
  const headEnd = html.indexOf('</head>');
  const head = html.slice(0, headEnd > 0 ? headEnd + 7 : 50000);

  const meta: Record<string, string> = {};

  // Match <meta property="..." content="..."> and <meta name="..." content="...">
  // Handle both attribute orderings (property/name before or after content)
  const re1 = /<meta[^>]+(?:property|name)=["']([^"']+)["'][^>]+content=["']([^"']*)["']/gi;
  const re2 = /<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']([^"']+)["']/gi;

  let m: RegExpExecArray | null;
  while ((m = re1.exec(head))) meta[m[1]] = m[2];
  while ((m = re2.exec(head))) {
    const key = m[2];
    if (!meta[key]) meta[key] = m[1]; // Don't overwrite first-match
  }

  // Extract <title>
  const titleMatch = head.match(/<title[^>]*>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';

  // Extract favicon
  let favicon = '';
  const faviconMatch = head.match(/<link[^>]+rel=["'](?:icon|shortcut icon)["'][^>]+href=["']([^"']+)["']/i);
  const faviconMatch2 = head.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["'](?:icon|shortcut icon)["']/i);
  if (faviconMatch) favicon = faviconMatch[1];
  else if (faviconMatch2) favicon = faviconMatch2[1];

  // Extract canonical URL
  let canonical = '';
  const canonicalMatch = head.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  const canonicalMatch2 = head.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
  if (canonicalMatch) canonical = canonicalMatch[1];
  else if (canonicalMatch2) canonical = canonicalMatch2[1];

  return { meta, title, favicon, canonical };
}

// ─── Image dimension reading from raw bytes ───────────────────────────────────

async function getImageDimensions(
  imageUrl: string,
  baseUrl: string
): Promise<{ width: number; height: number } | null> {
  try {
    // Resolve relative URLs
    const resolved = new URL(imageUrl, baseUrl).href;
    const parsed = new URL(resolved);

    // Same SSRF checks
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
    if (isBlockedHostname(parsed.hostname)) return null;

    const response = await fetch(resolved, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Twitterbot/1.0)' },
      signal: AbortSignal.timeout(3000),
      redirect: 'follow',
    });

    if (!response.ok || !response.body) return null;

    // Read only the first 512 bytes — enough for PNG/JPEG/GIF/WebP headers
    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let totalBytes = 0;
    const MAX_BYTES = 512;

    while (totalBytes < MAX_BYTES) {
      const { done, value } = await reader.read();
      if (done || !value) break;
      chunks.push(value);
      totalBytes += value.length;
    }
    reader.cancel();

    const bytes = new Uint8Array(totalBytes);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.length;
    }

    return parseDimensions(bytes);
  } catch {
    return null;
  }
}

function parseDimensions(bytes: Uint8Array): { width: number; height: number } | null {
  if (bytes.length < 24) return null;

  // PNG: 8-byte signature + IHDR chunk
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    const width = (bytes[16] << 24) | (bytes[17] << 16) | (bytes[18] << 8) | bytes[19];
    const height = (bytes[20] << 24) | (bytes[21] << 16) | (bytes[22] << 8) | bytes[23];
    return { width, height };
  }

  // JPEG: find SOF0/SOF2 marker
  if (bytes[0] === 0xff && bytes[1] === 0xd8) {
    let i = 2;
    while (i < bytes.length - 9) {
      if (bytes[i] !== 0xff) { i++; continue; }
      const marker = bytes[i + 1];
      // SOF0 (0xC0), SOF1 (0xC1), SOF2 (0xC2)
      if (marker >= 0xc0 && marker <= 0xc2) {
        const height = (bytes[i + 5] << 8) | bytes[i + 6];
        const width = (bytes[i + 7] << 8) | bytes[i + 8];
        return { width, height };
      }
      const segLen = (bytes[i + 2] << 8) | bytes[i + 3];
      i += 2 + segLen;
    }
  }

  // GIF
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) {
    const width = bytes[6] | (bytes[7] << 8);
    const height = bytes[8] | (bytes[9] << 8);
    return { width, height };
  }

  // WebP (RIFF...WEBP)
  if (
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) {
    // VP8 lossy
    if (bytes[12] === 0x56 && bytes[13] === 0x50 && bytes[14] === 0x38 && bytes[15] === 0x20) {
      if (bytes.length >= 30) {
        const width = ((bytes[26]) | (bytes[27] << 8)) & 0x3fff;
        const height = ((bytes[28]) | (bytes[29] << 8)) & 0x3fff;
        return { width, height };
      }
    }
    // VP8L lossless
    if (bytes[12] === 0x56 && bytes[13] === 0x50 && bytes[14] === 0x38 && bytes[15] === 0x4c) {
      if (bytes.length >= 25) {
        const bits = bytes[21] | (bytes[22] << 8) | (bytes[23] << 16) | (bytes[24] << 24);
        const width = (bits & 0x3fff) + 1;
        const height = ((bits >> 14) & 0x3fff) + 1;
        return { width, height };
      }
    }
  }

  return null;
}

// ─── Main handler ─────────────────────────────────────────────────────────────

const MAX_RESPONSE_BYTES = 100_000; // 100 KB
const MAX_REDIRECTS = 5;
const FETCH_TIMEOUT_MS = 5000;
const CACHE_TTL_SECONDS = 300; // 5 min

export const onRequest = async (context: any) => {
  const { request } = context;

  // CORS headers for the static Next export on the same domain
  const corsHeaders: Record<string, string> = {
    'Access-Control-Allow-Origin': new URL(request.url).origin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json; charset=utf-8',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== 'GET') {
    return Response.json({ error: 'Method not allowed' }, { status: 405, headers: corsHeaders });
  }

  const reqUrl = new URL(request.url);
  const targetUrlRaw = reqUrl.searchParams.get('url');

  if (!targetUrlRaw) {
    return Response.json({ error: 'Missing ?url= parameter' }, { status: 400, headers: corsHeaders });
  }

  // ── Check edge cache first ──────────────────────────────────────────────────
  const cacheKey = new Request(request.url, { method: 'GET' });
  const cache = (caches as any).default;
  const cachedResponse = await cache.match(cacheKey);
  if (cachedResponse) {
    // Re-apply CORS headers (cached responses may not have them)
    const headers = new Headers(cachedResponse.headers);
    for (const [k, v] of Object.entries(corsHeaders)) headers.set(k, v);
    return new Response(cachedResponse.body, { status: cachedResponse.status, headers });
  }

  try {
    let currentUrl: URL = validateUrl(targetUrlRaw);
    let html = '';
    let finalUrl = currentUrl.href;
    let redirectCount = 0;

    // Manual redirect following with re-validation per hop
    while (redirectCount <= MAX_REDIRECTS) {
      const response = await fetch(currentUrl.href, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Twitterbot/1.0)',
          'Accept': 'text/html,application/xhtml+xml',
        },
        redirect: 'manual',
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      });

      // Handle redirects
      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get('Location');
        if (!location) throw new Error('Redirect without Location header');

        redirectCount++;
        if (redirectCount > MAX_REDIRECTS) throw new Error('Too many redirects');

        // Re-validate the redirect target
        currentUrl = validateUrl(new URL(location, currentUrl.href).href);
        continue;
      }

      if (!response.ok) {
        throw new Error(`Upstream returned HTTP ${response.status}`);
      }

      // Read body with byte cap
      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let totalBytes = 0;

        while (totalBytes < MAX_RESPONSE_BYTES) {
          const { done, value } = await reader.read();
          if (done) break;
          totalBytes += value.length;
          html += decoder.decode(value, { stream: true });
        }
        reader.cancel();
        html += decoder.decode(); // flush
      }

      finalUrl = currentUrl.href;
      break;
    }

    const { meta, title, favicon, canonical } = extractMeta(html);

    // Generate warnings
    const warnings: string[] = [];
    if (!meta['og:title'] && !title) warnings.push('Missing og:title and <title> — most platforms will show no title.');
    if (!meta['og:description'] && !meta['description']) warnings.push('Missing og:description — social cards will have no description text.');
    if (!meta['og:image']) warnings.push('Missing og:image — social cards will render without an image preview.');
    if (!meta['twitter:card']) warnings.push('Missing twitter:card — X/Twitter will use default card type. Add twitter:card for explicit control.');

    const ogTitle = meta['og:title'] || title || '';
    const ogDesc = meta['og:description'] || meta['description'] || '';
    if (ogTitle.length > 90) warnings.push(`og:title is ${ogTitle.length} chars — may be truncated on some platforms (recommended < 90).`);
    if (ogDesc.length > 200) warnings.push(`og:description is ${ogDesc.length} chars — may be truncated (recommended < 200).`);

    // Resolve the favicon URL relative to the page
    let resolvedFavicon = favicon;
    if (favicon && !favicon.startsWith('http')) {
      try { resolvedFavicon = new URL(favicon, finalUrl).href; } catch { /* keep as-is */ }
    }

    // Resolve og:image URL relative to the page
    const ogImage = meta['og:image'] || '';
    let resolvedOgImage = ogImage;
    if (ogImage && !ogImage.startsWith('http')) {
      try { resolvedOgImage = new URL(ogImage, finalUrl).href; } catch { /* keep as-is */ }
    }

    // Image dimensions: prefer meta tags, fall back to byte-header reading
    let imageDimensions: { width: number; height: number } | null = null;
    const metaWidth = parseInt(meta['og:image:width'] || '', 10);
    const metaHeight = parseInt(meta['og:image:height'] || '', 10);

    if (metaWidth > 0 && metaHeight > 0) {
      imageDimensions = { width: metaWidth, height: metaHeight };
    } else if (resolvedOgImage) {
      imageDimensions = await getImageDimensions(resolvedOgImage, finalUrl);
    }

    if (imageDimensions) {
      if (imageDimensions.width < 200 || imageDimensions.height < 200) {
        warnings.push(`og:image is ${imageDimensions.width}×${imageDimensions.height}px — most platforms recommend at least 200×200. Facebook/LinkedIn recommend 1200×630.`);
      }
    }

    // Update meta with resolved URLs
    if (resolvedOgImage) meta['og:image'] = resolvedOgImage;

    const result: OgResult = {
      url: finalUrl,
      meta,
      title,
      favicon: resolvedFavicon,
      canonical,
      imageDimensions,
      warnings,
    };

    const body = JSON.stringify(result);
    const response = new Response(body, { status: 200, headers: corsHeaders });

    // Store in edge cache
    const cachedResp = new Response(body, {
      status: 200,
      headers: { ...corsHeaders, 'Cache-Control': `s-maxage=${CACHE_TTL_SECONDS}` },
    });
    context.waitUntil(cache.put(cacheKey, cachedResp));

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return Response.json({ error: message }, { status: 422, headers: corsHeaders });
  }
};
