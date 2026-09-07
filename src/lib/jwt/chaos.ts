import { ParsedJwt, JwtHeader, JwtPayload } from './types';
import { buildCompactJwt } from './codec';
import { NAUGHTY_STRINGS } from '@/utilities/chaos-data/chaosDataEngine';

/**
 * Creates an updated compact JWT after applying a transformation.
 */
export function applyJwtMutation(
  jwt: ParsedJwt,
  mutator: (header: JwtHeader, payload: JwtPayload) => {
    header: JwtHeader;
    payload: JwtPayload;
    signatureB64?: string;
  }
): string {
  const clonedHeader = JSON.parse(JSON.stringify(jwt.header));
  const clonedPayload = JSON.parse(JSON.stringify(jwt.payload));
  const res = mutator(clonedHeader, clonedPayload);
  const sig = res.signatureB64 !== undefined ? res.signatureB64 : jwt.signatureB64;
  return buildCompactJwt(res.header, res.payload, sig);
}

/**
 * Chaos: Expire the token immediately (exp set to seconds in the past).
 */
export function expireTokenNow(jwt: ParsedJwt, secondsAgo = 300): string {
  const now = Math.floor(Date.now() / 1000);
  return applyJwtMutation(jwt, (header, payload) => {
    payload.exp = now - secondsAgo;
    if (payload.iat && payload.iat > payload.exp) {
      payload.iat = payload.exp - 3600;
    }
    return { header, payload };
  });
}

/**
 * Chaos: Expire token soon (e.g. in 10 seconds, to test near-expiry race conditions).
 */
export function expireTokenSoon(jwt: ParsedJwt, secondsInFuture = 10): string {
  const now = Math.floor(Date.now() / 1000);
  return applyJwtMutation(jwt, (header, payload) => {
    payload.exp = now + secondsInFuture;
    return { header, payload };
  });
}

/**
 * Chaos: Inject future clock skew (nbf and iat set 5 minutes into the future).
 */
export function injectClockSkewFuture(jwt: ParsedJwt, secondsInFuture = 300): string {
  const now = Math.floor(Date.now() / 1000);
  return applyJwtMutation(jwt, (header, payload) => {
    payload.nbf = now + secondsInFuture;
    payload.iat = now + secondsInFuture;
    if (payload.exp && payload.exp <= payload.nbf) {
      payload.exp = payload.nbf + 3600;
    }
    return { header, payload };
  });
}

/**
 * Chaos: Simulate the notorious `alg: none` vulnerability (CVE-2015-9235).
 * Rewrites the header alg to 'none' and drops the signature part.
 */
export function simulateAlgNone(jwt: ParsedJwt): string {
  return applyJwtMutation(jwt, (header, payload) => {
    header.alg = 'none';
    return { header, payload, signatureB64: '' };
  });
}

/**
 * Chaos: Corrupt signature characters to trigger 401 Unauthorized handling.
 */
export function corruptSignature(jwt: ParsedJwt): string {
  if (!jwt.signatureB64) {
    return applyJwtMutation(jwt, (header, payload) => ({
      header,
      payload,
      signatureB64: 'INVALID_SIGNATURE_TAMPERED',
    }));
  }

  // Flip first 3 characters and last 3 characters
  const sig = jwt.signatureB64;
  const flipped = sig
    .split('')
    .map((c, i) => (i % 5 === 0 ? (c === 'A' ? 'B' : 'A') : c))
    .join('');

  return applyJwtMutation(jwt, (header, payload) => ({
    header,
    payload,
    signatureB64: flipped,
  }));
}

/**
 * Chaos: Strip critical identity or security claims to test null guards.
 */
export function stripClaim(jwt: ParsedJwt, claimKey: string): string {
  return applyJwtMutation(jwt, (header, payload) => {
    delete payload[claimKey];
    return { header, payload };
  });
}

/**
 * Chaos: Inject high-entropy naughty strings into user identity claims.
 */
export function injectBlnsClaim(jwt: ParsedJwt, key: string = 'name'): string {
  const sample = NAUGHTY_STRINGS[Math.floor(Math.random() * NAUGHTY_STRINGS.length)];
  return applyJwtMutation(jwt, (header, payload) => {
    payload[key] = sample;
    return { header, payload };
  });
}

/**
 * Chaos: Swap algorithm from RS256 to HS256 (simulate Public Key Confusion Attack).
 */
export function swapAlgorithmToHs256(jwt: ParsedJwt): string {
  return applyJwtMutation(jwt, (header, payload) => {
    header.alg = 'HS256';
    return { header, payload };
  });
}
