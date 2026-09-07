import { JwtHeader, JwtPayload, ParsedJwt, ClaimDiagnostic, TokenStatus } from './types';

/**
 * Converts a Base64URL string to Uint8Array safely in browser environments.
 */
export function base64UrlToUint8Array(b64url: string): Uint8Array {
  try {
    let b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4 !== 0) {
      b64 += '=';
    }
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  } catch {
    return new Uint8Array(0);
  }
}

/**
 * Converts Uint8Array to Base64URL string safely.
 */
export function uint8ArrayToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const b64 = btoa(binary);
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Decodes a Base64URL string into a UTF-8 string.
 */
export function decodeBase64UrlString(b64url: string): string {
  const bytes = base64UrlToUint8Array(b64url);
  if (bytes.length === 0 && b64url.trim().length > 0) {
    throw new Error('Invalid base64url encoding');
  }
  return new TextDecoder().decode(bytes);
}

/**
 * Encodes a UTF-8 string into a Base64URL string.
 */
export function encodeBase64UrlString(text: string): string {
  const bytes = new TextEncoder().encode(text);
  return uint8ArrayToBase64Url(bytes);
}

/**
 * Encodes an object to Base64URL JSON.
 */
export function encodeJsonToBase64Url(obj: unknown): string {
  return encodeBase64UrlString(JSON.stringify(obj));
}

/**
 * Standard JWT Claim metadata dictionary.
 */
export const STANDARD_CLAIMS: Record<string, { label: string; description: string }> = {
  iss: { label: 'Issuer', description: 'Identifies the principal that issued the JWT' },
  sub: { label: 'Subject', description: 'Identifies the principal that is the subject of the JWT (user ID)' },
  aud: { label: 'Audience', description: 'Identifies the recipients that the JWT is intended for' },
  exp: { label: 'Expiration Time', description: 'Time after which the JWT MUST NOT be accepted for processing' },
  nbf: { label: 'Not Before', description: 'Time before which the JWT MUST NOT be accepted for processing' },
  iat: { label: 'Issued At', description: 'Time at which the JWT was issued' },
  jti: { label: 'JWT ID', description: 'Unique identifier for the JWT to prevent replay attacks' },
  azp: { label: 'Authorized Party', description: 'The party to which the ID token was issued (client ID)' },
  scope: { label: 'OAuth Scopes', description: 'Granted permissions or resource access scopes' },
  roles: { label: 'User Roles', description: 'RBAC user role assignments' },
  email: { label: 'User Email', description: 'Primary verified email address' },
  email_verified: { label: 'Email Verified', description: 'Whether the subject email address is verified' },
  name: { label: 'Display Name', description: 'Full name of the authenticated user' },
};

/**
 * Formats a UNIX timestamp (seconds) into human-readable date strings.
 */
export function formatTimestamp(sec: number): { formatted: string; relative: string } {
  try {
    const d = new Date(sec * 1000);
    const now = Date.now();
    const diffMs = d.getTime() - now;
    const diffSec = Math.round(diffMs / 1000);

    const formatted = `${d.toISOString().replace('T', ' ').replace(/\..+/, '')} UTC`;

    let relative: string;
    if (Math.abs(diffSec) < 60) {
      relative = diffSec >= 0 ? `in ${diffSec}s` : `${Math.abs(diffSec)}s ago`;
    } else if (Math.abs(diffSec) < 3600) {
      const min = Math.round(diffSec / 60);
      relative = min >= 0 ? `in ${min}m` : `${Math.abs(min)}m ago`;
    } else if (Math.abs(diffSec) < 86400) {
      const hours = Math.round(diffSec / 3600);
      relative = hours >= 0 ? `in ${hours}h` : `${Math.abs(hours)}h ago`;
    } else {
      const days = Math.round(diffSec / 86400);
      relative = days >= 0 ? `in ${days}d` : `${Math.abs(days)}d ago`;
    }

    return { formatted, relative };
  } catch {
    return { formatted: 'Invalid date', relative: '' };
  }
}

/**
 * Parses a raw JWT string into a fully inspected token structure.
 */
export function parseJwt(rawToken: string): ParsedJwt {
  const trimmed = rawToken.trim();

  const emptyResult: ParsedJwt = {
    raw: trimmed,
    headerB64: '',
    payloadB64: '',
    signatureB64: '',
    header: { alg: 'HS256', typ: 'JWT' },
    payload: {},
    status: 'malformed',
    statusMessage: 'Paste or select a JWT to inspect',
    diagnostics: [],
    secondsRemaining: null,
    totalDuration: null,
    percentRemaining: null,
    hasSignature: false,
    isValidStructure: false,
  };

  if (!trimmed) {
    return emptyResult;
  }

  const parts = trimmed.split('.');
  if (parts.length < 2 || parts.length > 3) {
    return {
      ...emptyResult,
      error: `Invalid JWT structure. Expected 2 or 3 dot-separated parts, received ${parts.length}.`,
      statusMessage: 'Malformed token: Incorrect dot separation',
    };
  }

  const [headerB64, payloadB64, signatureB64 = ''] = parts;

  let header: JwtHeader;
  let payload: JwtPayload;

  try {
    const decodedHeader = decodeBase64UrlString(headerB64);
    header = JSON.parse(decodedHeader);
  } catch (err: unknown) {
    return {
      ...emptyResult,
      headerB64,
      payloadB64,
      signatureB64,
      error: `Failed to decode JWT Header: ${err instanceof Error ? err.message : 'Invalid JSON'}`,
      statusMessage: 'Malformed Header JSON',
    };
  }

  try {
    const decodedPayload = decodeBase64UrlString(payloadB64);
    payload = JSON.parse(decodedPayload);
  } catch (err: unknown) {
    return {
      ...emptyResult,
      headerB64,
      payloadB64,
      signatureB64,
      header,
      error: `Failed to decode JWT Payload: ${err instanceof Error ? err.message : 'Invalid JSON'}`,
      statusMessage: 'Malformed Payload JSON',
    };
  }

  const nowSec = Math.floor(Date.now() / 1000);
  let status: TokenStatus = 'valid';
  let statusMessage = 'Token active and format valid';

  const isAlgNone = header.alg?.toLowerCase() === 'none';

  if (isAlgNone) {
    status = 'alg_none';
    statusMessage = '⚠️ alg: none detected (Vulnerable / Insecure State)';
  } else if (payload.nbf && payload.nbf > nowSec) {
    status = 'premature';
    const diff = payload.nbf - nowSec;
    statusMessage = `⏳ Not valid yet (nbf is ${diff}s in the future)`;
  } else if (payload.exp && payload.exp <= nowSec) {
    status = 'expired';
    const diff = nowSec - payload.exp;
    statusMessage = `⏱️ Expired ${diff}s ago`;
  }

  // Calculate remaining time and progress bar
  let secondsRemaining: number | null = null;
  let totalDuration: number | null = null;
  let percentRemaining: number | null = null;

  if (payload.exp) {
    secondsRemaining = payload.exp - nowSec;
    if (payload.iat && payload.exp > payload.iat) {
      totalDuration = payload.exp - payload.iat;
      const elapsed = nowSec - payload.iat;
      const pct = Math.max(0, Math.min(100, 100 - (elapsed / totalDuration) * 100));
      percentRemaining = Math.round(pct);
    } else {
      percentRemaining = secondsRemaining > 0 ? 100 : 0;
    }
  }

  // Build diagnostics
  const diagnostics: ClaimDiagnostic[] = [];
  for (const [key, value] of Object.entries(payload)) {
    const standard = STANDARD_CLAIMS[key];
    const isStandard = Boolean(standard);
    const label = standard?.label || key;
    const description = standard?.description || 'Custom application claim';

    let statusType: ClaimDiagnostic['status'] = 'normal';
    let formattedTime: string | undefined;
    let relativeTime: string | undefined;

    if (typeof value === 'number' && (key === 'exp' || key === 'iat' || key === 'nbf' || key === 'auth_time')) {
      const timeInfo = formatTimestamp(value);
      formattedTime = timeInfo.formatted;
      relativeTime = timeInfo.relative;

      if (key === 'exp') {
        statusType = value <= nowSec ? 'expired' : 'normal';
      } else if (key === 'nbf') {
        statusType = value > nowSec ? 'future' : 'normal';
      }
    }

    diagnostics.push({
      key,
      value,
      label,
      description,
      isStandard,
      status: statusType,
      formattedTime,
      relativeTime,
    });
  }

  return {
    raw: trimmed,
    headerB64,
    payloadB64,
    signatureB64,
    header,
    payload,
    status,
    statusMessage,
    diagnostics,
    secondsRemaining,
    totalDuration,
    percentRemaining,
    hasSignature: Boolean(signatureB64),
    isValidStructure: true,
  };
}

/**
 * Re-assembles a compact JWT from header, payload, and optional signature.
 */
export function buildCompactJwt(header: JwtHeader, payload: JwtPayload, signatureB64: string = ''): string {
  const h = encodeJsonToBase64Url(header);
  const p = encodeJsonToBase64Url(payload);
  return `${h}.${p}.${signatureB64}`;
}
