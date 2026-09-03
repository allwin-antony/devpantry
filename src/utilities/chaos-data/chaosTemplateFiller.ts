// Chaos Template Filler - Generates dirty, edge-case mock payloads from real-world API schemas

import { 
  DIRTY_NAMES, 
  DIRTY_EMAILS, 
  DIRTY_ADDRESSES, 
  DIRTY_PHONES, 
  DIRTY_URLS, 
  NAUGHTY_STRINGS 
} from './chaosDataEngine';

export function fillChaosPayload(originalPayload: any, entropy: number = 65): any {
  if (originalPayload === null || originalPayload === undefined) {
    return Math.random() * 100 < entropy ? 'null' : null;
  }

  // Handle arrays
  if (Array.isArray(originalPayload)) {
    if (originalPayload.length === 0) {
      return Math.random() * 100 < entropy ? [NAUGHTY_STRINGS[0]] : [];
    }
    return originalPayload.map((item, index) => {
      return fillChaosPayload(item, entropy);
    });
  }

  // Handle primitives
  if (typeof originalPayload !== 'object') {
    return fillPrimitiveValue('value', originalPayload, entropy);
  }

  // Handle objects recursively
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(originalPayload)) {
    const isDirty = Math.random() * 100 < entropy;
    
    if (value !== null && typeof value === 'object') {
      result[key] = fillChaosPayload(value, entropy);
    } else {
      result[key] = isDirty ? fillPrimitiveValue(key, value, entropy) : value;
    }
  }

  return result;
}

function fillPrimitiveValue(key: string, cleanValue: any, entropy: number): any {
  const k = key.toLowerCase();

  // 1. Email fields
  if (k.includes('email') || k.includes('mail')) {
    return DIRTY_EMAILS[Math.floor(Math.random() * DIRTY_EMAILS.length)];
  }

  // 2. Name fields
  if (k.includes('name') || k.includes('author') || k.includes('login') || k.includes('user') || k.includes('pusher') || k.includes('sender')) {
    return DIRTY_NAMES[Math.floor(Math.random() * DIRTY_NAMES.length)];
  }

  // 3. URL / Picture / Avatar / Link fields
  if (k.includes('url') || k.includes('avatar') || k.includes('picture') || k.includes('image') || k.includes('icon') || k.includes('href') || k.includes('link')) {
    return DIRTY_URLS[Math.floor(Math.random() * DIRTY_URLS.length)];
  }

  // 4. Phone fields
  if (k.includes('phone') || k.includes('mobile') || k.includes('tel')) {
    return DIRTY_PHONES[Math.floor(Math.random() * DIRTY_PHONES.length)];
  }

  // 5. Address / Location fields
  if (k.includes('address') || k.includes('street') || k.includes('city') || k.includes('zip') || k.includes('country') || k.includes('location')) {
    return DIRTY_ADDRESSES[Math.floor(Math.random() * DIRTY_ADDRESSES.length)];
  }

  // 6. Timestamps / Dates
  if (k.includes('time') || k.includes('date') || k.includes('at') || k.includes('iat') || k.includes('exp')) {
    const roll = Math.random();
    if (roll < 0.25) return '2038-01-19T03:14:07Z'; // Y2038 Unix epoch overflow
    if (roll < 0.5) return '9999-12-31T23:59:59.999Z'; // Max ISO date
    if (roll < 0.75) return 0; // Epoch 0
    return '1970-01-01T00:00:00.000Z';
  }

  // 7. Boolean flags
  if (typeof cleanValue === 'boolean' || k.includes('verified') || k.includes('active') || k.includes('livemode') || k.includes('admin') || k.includes('enabled')) {
    const roll = Math.random();
    if (roll < 0.3) return 'true'; // String instead of boolean
    if (roll < 0.6) return 1; // Number instead of boolean
    if (roll < 0.8) return null;
    return !cleanValue;
  }

  // 8. Numeric fields (amount, balance, count, expires_in, id, status, port)
  if (typeof cleanValue === 'number' || k.includes('amount') || k.includes('balance') || k.includes('count') || k.includes('expires') || k.includes('fee') || k.includes('total') || k.includes('price')) {
    const roll = Math.random();
    if (roll < 0.2) return 0.1 + 0.2; // 0.30000000000000004 IEEE-754 precision trap
    if (roll < 0.4) return -1; // Negative value
    if (roll < 0.6) return 0; // Zero edge case
    if (roll < 0.8) return 999999999;
    return 9007199254740993; // MAX_SAFE_INTEGER + 2
  }

  // 9. Tokens / Hashes / IDs / Strings
  if (k.includes('token') || k.includes('id') || k.includes('hash') || k.includes('key') || k.includes('secret') || k.includes('scope')) {
    const roll = Math.random();
    if (roll < 0.3) return NAUGHTY_STRINGS[Math.floor(Math.random() * 20)]; // Injection / Zalgo
    if (roll < 0.6) return `${cleanValue}_EXPIRED_REVOKED_🚨`;
    if (roll < 0.8) return '00000000-0000-0000-0000-000000000000';
    return '';
  }

  // 10. Generic String fallback -> BLNS Naughty strings
  return NAUGHTY_STRINGS[Math.floor(Math.random() * NAUGHTY_STRINGS.length)];
}
