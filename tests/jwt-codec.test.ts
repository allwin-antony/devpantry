import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  base64UrlToUint8Array,
  uint8ArrayToBase64Url,
  decodeBase64UrlString,
  encodeBase64UrlString,
  encodeJsonToBase64Url,
  parseJwt,
  buildCompactJwt,
  formatTimestamp,
} from '../src/lib/jwt/codec';

describe('JWT Codec & Decoder Suite', () => {
  describe('Base64URL Utility Functions', () => {
    it('correctly round-trips binary data through base64url', () => {
      const original = new Uint8Array([0, 1, 2, 250, 255, 128, 64]);
      const encoded = uint8ArrayToBase64Url(original);
      const decoded = base64UrlToUint8Array(encoded);
      assert.deepEqual(decoded, original);
    });

    it('correctly encodes and decodes UTF-8 strings', () => {
      const text = 'DevPantry \u26A1 100% Private Offline Tools!';
      const encoded = encodeBase64UrlString(text);
      const decoded = decodeBase64UrlString(encoded);
      assert.equal(decoded, text);
    });

    it('encodes JSON objects safely to base64url', () => {
      const payload = { sub: 'usr_123', admin: true, roles: ['read', 'write'] };
      const encoded = encodeJsonToBase64Url(payload);
      const decodedStr = decodeBase64UrlString(encoded);
      const decodedObj = JSON.parse(decodedStr);
      assert.deepEqual(decodedObj, payload);
    });

    it('returns empty Uint8Array on corrupted base64url without crashing', () => {
      const corrupted = '%%%invalid-base64%%%';
      // In base64UrlToUint8Array, invalid input is caught and returns empty array
      const result = base64UrlToUint8Array(corrupted);
      assert.equal(result.length, 0);
    });
  });

  describe('JWT Parsing & Diagnostic Engine', () => {
    it('parses a valid standard HS256 JWT correctly', () => {
      const nowSec = Math.floor(Date.now() / 1000);
      const header = { alg: 'HS256', typ: 'JWT' };
      const payload = {
        sub: 'user_42',
        iss: 'https://auth.devpantry.com',
        aud: 'https://api.devpantry.com',
        iat: nowSec - 60,
        exp: nowSec + 3600,
      };
      const token = buildCompactJwt(header, payload, 'mock_signature_bytes');
      const parsed = parseJwt(token);

      assert.equal(parsed.isValidStructure, true);
      assert.equal(parsed.status, 'valid');
      assert.equal(parsed.header.alg, 'HS256');
      assert.equal(parsed.payload.sub, 'user_42');
      assert.equal(parsed.hasSignature, true);
      assert.ok(parsed.secondsRemaining !== null && parsed.secondsRemaining > 0);
      assert.equal(parsed.diagnostics.length, 5);
    });

    it('flags alg: none as a critical vulnerability', () => {
      const nowSec = Math.floor(Date.now() / 1000);
      const header = { alg: 'none', typ: 'JWT' };
      const payload = { sub: 'admin', exp: nowSec + 3600 };
      const token = buildCompactJwt(header, payload, '');
      const parsed = parseJwt(token);

      assert.equal(parsed.isValidStructure, true);
      assert.equal(parsed.status, 'alg_none');
      assert.match(parsed.statusMessage, /alg: none detected/);
    });

    it('detects expired tokens correctly', () => {
      const nowSec = Math.floor(Date.now() / 1000);
      const header = { alg: 'HS256', typ: 'JWT' };
      const payload = { sub: 'user_expired', exp: nowSec - 300 };
      const token = buildCompactJwt(header, payload, 'sig');
      const parsed = parseJwt(token);

      assert.equal(parsed.isValidStructure, true);
      assert.equal(parsed.status, 'expired');
      assert.match(parsed.statusMessage, /Expired/);
    });

    it('detects premature tokens with future nbf', () => {
      const nowSec = Math.floor(Date.now() / 1000);
      const header = { alg: 'HS256', typ: 'JWT' };
      const payload = { sub: 'user_premature', nbf: nowSec + 1000, exp: nowSec + 5000 };
      const token = buildCompactJwt(header, payload, 'sig');
      const parsed = parseJwt(token);

      assert.equal(parsed.isValidStructure, true);
      assert.equal(parsed.status, 'premature');
      assert.match(parsed.statusMessage, /Not valid yet/);
    });

    it('gracefully handles malformed dot structure', () => {
      const parsed1 = parseJwt('single-part-token');
      assert.equal(parsed1.isValidStructure, false);
      assert.equal(parsed1.status, 'malformed');

      const parsed2 = parseJwt('part1.part2.part3.part4.part5');
      assert.equal(parsed2.isValidStructure, false);
      assert.equal(parsed2.status, 'malformed');
    });

    it('gracefully handles empty or whitespace input', () => {
      const parsed = parseJwt('   ');
      assert.equal(parsed.isValidStructure, false);
      assert.equal(parsed.status, 'malformed');
    });
  });

  describe('formatTimestamp Helper', () => {
    it('formats a timestamp into UTC string and relative duration', () => {
      const nowSec = Math.floor(Date.now() / 1000);
      const formatted = formatTimestamp(nowSec + 600);
      assert.match(formatted.formatted, /UTC/);
      assert.ok(formatted.relative.includes('in '));
    });
  });
});
