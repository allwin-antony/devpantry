import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  getAllTools,
  getAllToolsForDisplay,
  getFeaturedTools,
  getToolBySlug,
  getToolsByCategory,
  TOOL_CATEGORIES,
} from '../src/lib/loaders/toolLoader';

describe('Tool Loader Registry Suite', () => {
  describe('Tool Slugs & Routing Integrity', () => {
    it('getAllTools() returns exclusively routable tools without hash fragments', () => {
      const tools = getAllTools();
      assert.ok(tools.length > 0);
      for (const tool of tools) {
        assert.ok(!tool.slug.includes('#'), `Slug ${tool.slug} should not contain a hash fragment`);
        assert.ok(tool.name.trim().length > 0, `Tool ${tool.slug} should have a non-empty name`);
        assert.ok(tool.description.trim().length > 0, `Tool ${tool.slug} should have a description`);
      }
    });

    it('getAllToolsForDisplay() includes virtual sub-utility entries', () => {
      const displayTools = getAllToolsForDisplay();
      const routableTools = getAllTools();
      assert.ok(displayTools.length >= routableTools.length);
      const hasVirtual = displayTools.some((t) => t.slug.includes('#'));
      assert.ok(hasVirtual, 'Expected at least one virtual hash tool (e.g. mock-data#schema-builder)');
    });

    it('ensures all tool slugs are lowercase and URL-safe', () => {
      const tools = getAllTools();
      for (const tool of tools) {
        assert.match(tool.slug, /^[a-z0-9-]+$/, `Slug ${tool.slug} must be lowercase alphanumeric with hyphens`);
      }
    });

    it('ensures all tool slugs are strictly unique among routable tools', () => {
      const tools = getAllTools();
      const seen = new Set<string>();
      for (const tool of tools) {
        assert.ok(!seen.has(tool.slug), `Duplicate tool slug found: ${tool.slug}`);
        seen.add(tool.slug);
      }
    });
  });

  describe('Lookup & Categorization', () => {
    it('getToolBySlug returns correct tool item for valid slug', () => {
      const tool = getToolBySlug('background-remover');
      assert.ok(tool !== null);
      assert.equal(tool.name, 'AI Background Remover');
      assert.equal(tool.category, 'Media');
    });

    it('getToolBySlug returns null for invalid or hash slug', () => {
      assert.equal(getToolBySlug('non-existent-tool-slug'), null);
      assert.equal(getToolBySlug('mock-data#schema-builder'), null);
    });

    it('getFeaturedTools returns only featured items', () => {
      const featured = getFeaturedTools();
      assert.ok(featured.length > 0);
      for (const tool of featured) {
        assert.equal(tool.featured, true);
      }
    });

    it('categorizes all tools into valid categories in TOOL_CATEGORIES', () => {
      for (const category of TOOL_CATEGORIES) {
        const tools = getToolsByCategory(category);
        for (const tool of tools) {
          assert.equal(tool.category, category);
        }
      }
    });
  });
});
