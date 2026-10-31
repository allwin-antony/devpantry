export function canonicalRedirect(requestUrl: string): string | null {
  const url = new URL(requestUrl);
  if (url.hostname !== 'devpantry.com' && url.hostname !== 'www.devpantry.com') return null;
  if (url.protocol === 'https:' && url.hostname === 'devpantry.com') return null;
  url.protocol = 'https:';
  url.hostname = 'devpantry.com';
  url.port = '';
  return url.toString();
}
