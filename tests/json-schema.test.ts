import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';
import { generateJsonSchemas } from '../src/lib/jsonSchema';

describe('JSON schema generation', () => {
  it('emits valid type aliases for arrays and primitive roots', () => {
    for (const input of ['[1, "pending", null]', '42', 'true', 'null', '"hello"', '{}', '[]']) {
      const result = generateJsonSchemas(input);
      assert.match(result.typescript, /^export type Root = /);
      for (const source of [result.typescript, result.zod]) {
        const parsed = ts.transpileModule(source, { reportDiagnostics: true, compilerOptions: { target: ts.ScriptTarget.ES2022 } });
        assert.equal(parsed.diagnostics?.length, 0, source);
      }
    }
  });

  it('examines later array records to infer missing fields and union types', () => {
    const result = generateJsonSchemas('[{"id":1,"name":"Ada"},{"id":"pending","active":true}]');
    assert.match(result.typescript, /id: number \| string;/);
    assert.match(result.typescript, /name\?: string;/);
    assert.match(result.typescript, /active\?: boolean;/);
    assert.match(result.zod, /id: z\.union\(\[z\.number\(\), z\.string\(\)\]\)/);
    assert.match(result.zod, /name: z\.string\(\)\.optional\(\)/);
  });

  it('merges nested objects and derives array types from nonempty examples', () => {
    const result = generateJsonSchemas('[{"profile":{"name":"Ada"},"tags":[]},{"profile":{"age":3},"tags":["admin"]}]');
    assert.match(result.typescript, /name\?: string;/);
    assert.match(result.typescript, /age\?: number;/);
    assert.match(result.typescript, /tags: Array<string>;/);
    assert.match(result.zod, /tags: z\.array\(z\.string\(\)\)/);
  });

  it('keeps special JSON keys as data properties', () => {
    const result = generateJsonSchemas('{"__proto__":{"enabled":true},"some-key":1,"constructor":"value"}');
    assert.match(result.zod, /\["__proto__"\]: z\.object/);
    assert.match(result.typescript, /"some-key": number/);
    assert.match(result.typescript, /constructor: string/);
    assert.equal(({} as { enabled?: boolean }).enabled, undefined);
  });

  it('rejects malformed JSON instead of returning stale generated code', () => {
    assert.throws(() => generateJsonSchemas('{"id":'), SyntaxError);
  });
});
