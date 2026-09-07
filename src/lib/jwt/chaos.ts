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
 * Reset / Renew token to be valid for 1 hour from now.
 */
export function renewTokenValid(jwt: ParsedJwt, validForSeconds = 3600): string {
  const now = Math.floor(Date.now() / 1000);
  return applyJwtMutation(jwt, (header, payload) => {
    payload.iat = now;
    payload.exp = now + validForSeconds;
    if (payload.nbf && payload.nbf > now) {
      payload.nbf = now;
    }
    return { header, payload };
  });
}

/**
 * Set or update an arbitrary custom claim.
 */
export function setCustomClaim(jwt: ParsedJwt, key: string, value: unknown): string {
  return applyJwtMutation(jwt, (header, payload) => {
    payload[key] = value;
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

export interface ChaosExploitHint {
  id: string;
  title: string;
  badge: string;
  badgeColor: string;
  mutation: string;
  securityImpact: string;
  howToTest: string;
}

export const CHAOS_EXPLOIT_HINTS: Record<string, ChaosExploitHint> = {
  expire_now: {
    id: 'expire_now',
    title: 'Expired Token State (-5m)',
    badge: 'Session Expiry',
    badgeColor: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/30',
    mutation: 'Set exp = Math.floor(Date.now() / 1000) - 300 (expired 5 minutes ago).',
    securityImpact: 'JWTs MUST NOT be accepted by API gateways or backend servers after their expiration timestamp (RFC 7519 § 4.1.4).',
    howToTest: 'Send an API request with this token in Authorization: Bearer. Your backend MUST return HTTP 401 Unauthorized. Ensure your frontend auth interceptor catches the 401 and attempts token refresh without entering an infinite loop.',
  },
  race_expire: {
    id: 'race_expire',
    title: 'Near-Expiry Race Condition (10s)',
    badge: 'Concurrency Race',
    badgeColor: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30',
    mutation: 'Set exp = Math.floor(Date.now() / 1000) + 10 (expires in 10 seconds).',
    securityImpact: 'Tests proactive client-side token refresh. If a token expires while an API request is in-flight, uncoordinated requests can fail.',
    howToTest: 'Fire multiple concurrent API calls. Verify that your frontend proactively refreshes the token before the 10-second countdown runs out, preventing mid-session network drops.',
  },
  clock_skew: {
    id: 'clock_skew',
    title: 'Clock Drift / Future Token (+5m)',
    badge: 'Clock Skew',
    badgeColor: 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    mutation: 'Set nbf (Not Before) and iat = Math.floor(Date.now() / 1000) + 300.',
    securityImpact: 'Distributed cloud servers frequently experience slight NTP clock drift. Strict servers without a leeway window will reject valid tokens.',
    howToTest: 'Verify if your backend validator sets a clock skew leeway (recommended ±60 seconds). If your server rejects this 5-minute future token, it is correctly enforcing nbf bounds.',
  },
  renew: {
    id: 'renew',
    title: 'Fresh Token Renewal (+1h)',
    badge: 'Baseline Valid',
    badgeColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    mutation: 'Reset iat = now and exp = now + 3600 seconds.',
    securityImpact: 'Restores a clean, fresh, cryptographically valid token state.',
    howToTest: 'Use this as your control token to verify that protected routes successfully respond with HTTP 200 before running negative test cases.',
  },
  alg_none: {
    id: 'alg_none',
    title: 'Signature Bypass: alg: none (CVE-2015-9235)',
    badge: 'Critical Exploit Simulation',
    badgeColor: 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/30',
    mutation: 'Header set to {"alg":"none","typ":"JWT"} and signature completely stripped.',
    securityImpact: 'Flawed JWT libraries check the header "alg" and skip cryptographic verification when it equals "none". An attacker can forge any admin claim without the secret key!',
    howToTest: 'Pass this unsigned token to your API. If your API returns HTTP 200, YOUR BACKEND IS CRITICALLY VULNERABLE! Secure servers must enforce an algorithm allow-list and explicitly forbid alg: none.',
  },
  corrupt_sig: {
    id: 'corrupt_sig',
    title: 'Corrupted Cryptographic Signature',
    badge: 'Signature Rejection',
    badgeColor: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/30',
    mutation: 'Inverted characters in the cryptographic signature segment.',
    securityImpact: 'Simulates an adversary tampering with payload claims or passing a forged signature.',
    howToTest: 'Verify that your backend immediately drops the request with HTTP 401 and logs a security event without leaking stack traces.',
  },
  swap_hs256: {
    id: 'swap_hs256',
    title: 'Algorithm Confusion Attack (RS256 ➔ HS256)',
    badge: 'Key Confusion',
    badgeColor: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30',
    mutation: 'Changed header alg from RS256 to HS256.',
    securityImpact: 'If a server expecting an RSA public key verifies the token using HMAC instead, an attacker can sign the token using the public key (which is publicly visible) as the HMAC secret.',
    howToTest: 'Ensure your server verification function hardcodes the expected algorithm (e.g. algorithms: ["RS256"]) rather than deriving it from the incoming unverified header.',
  },
  inject_blns: {
    id: 'inject_blns',
    title: 'BLNS High-Entropy Naughty String Injection',
    badge: 'Input Sanitization',
    badgeColor: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
    mutation: 'Injected Unicode, RTL direction overrides, and Zalgo strings from the Big List of Naughty Strings into user claims.',
    securityImpact: 'Checks if frontend layout bounds break, crash with unescaped characters, or reflect raw script injection payloads into the DOM.',
    howToTest: 'Inspect how user greeting labels, profile cards, and audit logs render these characters. Ensure no XSS is executed and layouts do not overflow.',
  },
};
