import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  CHAOS_PRESETS,
  NAUGHTY_STRINGS,
  DIRTY_NAMES,
  DIRTY_EMAILS,
  DIRTY_ADDRESSES,
  DIRTY_PHONES,
  DIRTY_URLS,
  exportData,
} from '../src/utilities/chaos-data/chaosDataEngine';

describe('Chaos & Edge-Case Data Studio Engine', () => {
  describe('Dirty Data Pools Integrity', () => {
    it('contains comprehensive naughty strings and BLNS attack vectors', () => {
      assert.ok(NAUGHTY_STRINGS.length > 50);
      assert.ok(NAUGHTY_STRINGS.some((s) => s.includes('<script>')));
      assert.ok(NAUGHTY_STRINGS.some((s) => s.includes('DROP TABLE')));
      assert.ok(NAUGHTY_STRINGS.some((s) => s.includes('\u200B')));
    });

    it('contains varied international and edge-case person names', () => {
      assert.ok(DIRTY_NAMES.length > 20);
      assert.ok(DIRTY_NAMES.includes('null'));
      assert.ok(DIRTY_NAMES.some((n) => n.includes('O\'Connor')));
    });

    it('contains dirty emails with RFC edge cases and injections', () => {
      assert.ok(DIRTY_EMAILS.length > 20);
      assert.ok(DIRTY_EMAILS.some((e) => e.includes('+tag+')));
    });

    it('contains international addresses and boundary phone numbers', () => {
      assert.ok(DIRTY_ADDRESSES.length > 10);
      assert.ok(DIRTY_PHONES.length > 10);
      assert.ok(DIRTY_URLS.length > 15);
    });
  });

  describe('Chaos Presets Generation', () => {
    it('generates e-commerce orders with valid schema shape', () => {
      const preset = CHAOS_PRESETS.find((p) => p.id === 'ecommerce');
      assert.ok(preset);
      const items = preset.generate(10, 50);
      assert.equal(items.length, 10);

      const first = items[0];
      assert.ok('order_id' in first);
      assert.ok('customer_name' in first);
      assert.ok('currency' in first);
      assert.ok('total_amount' in first);
    });

    it('generates users preset with valid schema shape', () => {
      const preset = CHAOS_PRESETS.find((p) => p.id === 'users');
      assert.ok(preset);
      const items = preset.generate(5, 80);
      assert.equal(items.length, 5);

      const first = items[0];
      assert.ok('user_id' in first);
      assert.ok('display_name' in first);
      assert.ok('work_email' in first);
      assert.ok('role' in first);
    });

    it('generates financial invoices with edge-case attributes', () => {
      const preset = CHAOS_PRESETS.find((p) => p.id === 'financial');
      assert.ok(preset);
      const items = preset.generate(5, 50);
      assert.equal(items.length, 5);

      const first = items[0];
      assert.ok('invoice_number' in first);
      assert.ok('billing_type' in first);
      assert.ok('payment_status' in first);
    });

    it('generates naughty strings suite with payload diagnostics', () => {
      const preset = CHAOS_PRESETS.find((p) => p.id === 'naughty');
      assert.ok(preset);
      const items = preset.generate(15, 100);
      assert.equal(items.length, 15);

      const first = items[0];
      assert.ok('raw_payload' in first);
      assert.ok('byte_length' in first);
      assert.ok('category' in first);
    });
  });

  describe('Multi-Format Export Engine', () => {
    const sampleData = [
      { id: 1, name: 'Alice', active: true, balance: 100.5 },
      { id: 2, name: 'Bob "Quote"', active: false, balance: 0.0 },
    ];

    it('exports correctly to JSON', () => {
      const json = exportData(sampleData, 'json');
      const parsed = JSON.parse(json);
      assert.deepEqual(parsed, sampleData);
    });

    it('exports correctly to CSV with escaped quotes', () => {
      const csv = exportData(sampleData, 'csv');
      assert.match(csv, /"id","name","active","balance"/);
      assert.match(csv, /"Bob ""Quote"""/);
    });

    it('exports correctly to TypeScript interface definition', () => {
      const ts = exportData(sampleData, 'typescript');
      assert.match(ts, /export interface GeneratedMockItem/);
      assert.match(ts, /name: string;/);
      assert.match(ts, /active: boolean;/);
      assert.match(ts, /balance: number;/);
    });

    it('exports correctly to Zod schema definition', () => {
      const zod = exportData(sampleData, 'zod');
      assert.match(zod, /import { z } from 'zod';/);
      assert.match(zod, /export const MockItemSchema = z\.object\({/);
      assert.match(zod, /name: z\.string\(\)/);
    });

    it('returns empty string when data is empty', () => {
      assert.equal(exportData([], 'json'), '');
    });
  });
});
