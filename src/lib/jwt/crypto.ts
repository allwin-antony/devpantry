import { JwtHeader, JwtPayload } from './types';
import { encodeJsonToBase64Url, uint8ArrayToBase64Url, base64UrlToUint8Array } from './codec';

export type SupportedHmacAlg = 'HS256' | 'HS384' | 'HS512';

const HMAC_HASH_MAP: Record<SupportedHmacAlg, string> = {
  HS256: 'SHA-256',
  HS384: 'SHA-384',
  HS512: 'SHA-512',
};

/**
 * Signs a JWT header and payload using HMAC-SHA (HS256, HS384, HS512) via WebCrypto.
 */
export async function signHmac(
  header: JwtHeader,
  payload: JwtPayload,
  secret: string,
  algorithm: SupportedHmacAlg = 'HS256'
): Promise<{ compactToken: string; signatureB64: string }> {
  const enc = new TextEncoder();
  const headerB64 = encodeJsonToBase64Url({ ...header, alg: algorithm });
  const payloadB64 = encodeJsonToBase64Url(payload);
  const dataToSign = enc.encode(`${headerB64}.${payloadB64}`);

  const hashName = HMAC_HASH_MAP[algorithm] || 'SHA-256';
  const keyData = enc.encode(secret);

  const cryptoKey = await window.crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: { name: hashName } },
    false,
    ['sign']
  );

  const signatureBuffer = await window.crypto.subtle.sign('HMAC', cryptoKey, dataToSign);
  const signatureBytes = new Uint8Array(signatureBuffer);
  const signatureB64 = uint8ArrayToBase64Url(signatureBytes);

  return {
    compactToken: `${headerB64}.${payloadB64}.${signatureB64}`,
    signatureB64,
  };
}

/**
 * Verifies HMAC signature of a compact JWT using the provided secret.
 */
export async function verifyHmac(
  compactToken: string,
  secret: string,
  expectedAlgorithm?: SupportedHmacAlg
): Promise<{ isValid: boolean; message: string }> {
  try {
    const parts = compactToken.trim().split('.');
    if (parts.length !== 3) {
      return { isValid: false, message: 'Invalid JWT structure: must have 3 parts' };
    }

    const [headerB64, payloadB64, signatureB64] = parts;
    if (!signatureB64) {
      return { isValid: false, message: 'Token is unsigned (missing signature part)' };
    }

    let alg: SupportedHmacAlg = expectedAlgorithm || 'HS256';
    try {
      const header = JSON.parse(new TextDecoder().decode(base64UrlToUint8Array(headerB64)));
      if (header.alg && (header.alg === 'HS256' || header.alg === 'HS384' || header.alg === 'HS512')) {
        alg = header.alg as SupportedHmacAlg;
      }
    } catch {
      // fallback to default alg
    }

    const enc = new TextEncoder();
    const dataToVerify = enc.encode(`${headerB64}.${payloadB64}`);
    const hashName = HMAC_HASH_MAP[alg];

    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: { name: hashName } },
      false,
      ['verify']
    );

    const signatureBytes = base64UrlToUint8Array(signatureB64);
    const isValid = await window.crypto.subtle.verify(
      'HMAC',
      cryptoKey,
      signatureBytes as unknown as BufferSource,
      dataToVerify as unknown as BufferSource
    );

    return {
      isValid,
      message: isValid
        ? `✅ Signature verified successfully with ${alg}`
        : '❌ Signature verification failed: Secret mismatch or tampered payload',
    };
  } catch (err: unknown) {
    return {
      isValid: false,
      message: `Verification error: ${err instanceof Error ? err.message : 'Unknown cryptographic error'}`,
    };
  }
}

/**
 * Generates an ephemeral RSA-2048 key pair in the browser for testing RS256 signing.
 */
export async function generateTestRsaKeyPair(): Promise<{
  keyPair: CryptoKeyPair;
  publicKeyJwk: JsonWebKey;
  privateKeyJwk: JsonWebKey;
}> {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: 'RSASSA-PKCS1-v1_5',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: { name: 'SHA-256' },
    },
    true,
    ['sign', 'verify']
  );

  const publicKeyJwk = await window.crypto.subtle.exportKey('jwk', keyPair.publicKey);
  const privateKeyJwk = await window.crypto.subtle.exportKey('jwk', keyPair.privateKey);

  return { keyPair, publicKeyJwk, privateKeyJwk };
}

/**
 * Signs with an RSA private key (RS256) via WebCrypto.
 */
export async function signRsa(
  header: JwtHeader,
  payload: JwtPayload,
  privateKey: CryptoKey
): Promise<{ compactToken: string; signatureB64: string }> {
  const enc = new TextEncoder();
  const headerB64 = encodeJsonToBase64Url({ ...header, alg: 'RS256' });
  const payloadB64 = encodeJsonToBase64Url(payload);
  const dataToSign = enc.encode(`${headerB64}.${payloadB64}`);

  const signatureBuffer = await window.crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    privateKey,
    dataToSign
  );

  const signatureB64 = uint8ArrayToBase64Url(new Uint8Array(signatureBuffer));
  return {
    compactToken: `${headerB64}.${payloadB64}.${signatureB64}`,
    signatureB64,
  };
}
