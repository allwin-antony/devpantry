export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-WYTNMC3H2B';
const SITE_ORIGIN = 'https://devpantry.com';

export function isAnalyticsHost(hostname: string) {
  return hostname === 'devpantry.com' || hostname === 'www.devpantry.com';
}

export function analyticsPageLocation(path: string) {
  const url = new URL(path, SITE_ORIGIN);
  // Share links can contain JSON, room identifiers, or other tool input.
  // Only the route belongs in analytics; never send its query or fragment.
  return `${SITE_ORIGIN}${url.pathname}`;
}

export function analyticsReferrer(referrer: string) {
  try {
    const url = new URL(referrer);
    return /^https?:$/.test(url.protocol) ? url.origin : '';
  } catch {
    return '';
  }
}

export function completionAction(source = '') {
  if (source.includes('download') || source.includes('export')) return 'download';
  if (source.includes('share')) return 'share';
  if (source.includes('copy')) return 'copy';
  return 'process';
}
