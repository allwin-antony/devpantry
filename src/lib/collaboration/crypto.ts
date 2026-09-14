// Uses Web Crypto API for Zero-Knowledge Document transport

// 256-bit AES-GCM
const ALGORITHM = 'AES-GCM';
const PBKDF2_ITERATIONS = 100000;
const SALT_SIZE = 16;
const IV_SIZE = 12;

export class PayloadDecryptionError extends Error {
  constructor() {
    super('Failed to decrypt room payload. Password or room ID may be incorrect.');
    this.name = 'PayloadDecryptionError';
    // Fix prototype chain for instanceof to work after transpilation
    Object.setPrototypeOf(this, PayloadDecryptionError.prototype);
  }
}

/**
 * Derives an AES-GCM CryptoKey from a password and salt.
 * The salt should be unique per room but does not need to be secret.
 */
export async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt.buffer as BufferSource,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    passwordKey,
    { name: ALGORITHM, length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts a Uint8Array payload (Yjs update).
 * Prepends the 12-byte IV to the ciphertext.
 */
export async function encryptPayload(data: Uint8Array, key: CryptoKey): Promise<Uint8Array> {
  const iv = crypto.getRandomValues(new Uint8Array(IV_SIZE));
  const ciphertextBuffer = await crypto.subtle.encrypt(
    {
      name: ALGORITHM,
      iv,
    },
    key,
    data as unknown as BufferSource
  );
  
  const ciphertext = new Uint8Array(ciphertextBuffer);
  const result = new Uint8Array(iv.length + ciphertext.length);
  result.set(iv, 0);
  result.set(ciphertext, iv.length);
  return result;
}

/**
 * Decrypts a payload previously encrypted with encryptPayload.
 */
export async function decryptPayload(encryptedData: Uint8Array, key: CryptoKey): Promise<Uint8Array> {
  if (encryptedData.length < IV_SIZE) {
    throw new Error(`Invalid encrypted data (too short to contain IV). Length: ${encryptedData.length}`);
  }
  
  const iv = encryptedData.slice(0, IV_SIZE);
  const ciphertext = encryptedData.slice(IV_SIZE);
  
  try {
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: ALGORITHM,
        iv,
      },
      key,
      ciphertext
    );
    return new Uint8Array(decryptedBuffer);
  } catch (e: any) {
    throw new PayloadDecryptionError();
  }
}

/**
 * Generates a random salt for new rooms.
 */
export function generateSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(SALT_SIZE));
}
