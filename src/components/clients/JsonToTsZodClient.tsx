import React, { useState, useEffect } from 'react';
import { Play, Copy, Check, AlertCircle, FileJson, FileCode, Braces } from 'lucide-react';

type TsType = 
  | { type: 'string' }
  | { type: 'number' }
  | { type: 'boolean' }
  | { type: 'null' }
  | { type: 'any' }
  | { type: 'object'; properties: Record<string, TsType> }
  | { type: 'array'; items: TsType };

function infer(json: any): TsType {
  if (json === null) return { type: 'null' };
  if (typeof json === 'string') return { type: 'string' };
  if (typeof json === 'number') return { type: 'number' };
  if (typeof json === 'boolean') return { type: 'boolean' };
  if (Array.isArray(json)) {
    if (json.length === 0) return { type: 'array', items: { type: 'any' } };
    return { type: 'array', items: infer(json[0]) };
  }
  if (typeof json === 'object') {
    const properties: Record<string, TsType> = {};
    for (const key in json) {
      properties[key] = infer(json[key]);
    }
    return { type: 'object', properties };
  }
  return { type: 'any' };
}

function generateTs(ast: TsType, indent = ''): string {
  if (ast.type === 'string') return 'string';
  if (ast.type === 'number') return 'number';
  if (ast.type === 'boolean') return 'boolean';
  if (ast.type === 'null') return 'null';
  if (ast.type === 'any') return 'any';
  if (ast.type === 'array') {
    const inner = generateTs(ast.items, indent);
    return inner.includes(' ') || inner.includes('{') ? `Array<${inner}>` : `${inner}[]`;
  }
  if (ast.type === 'object') {
    const entries = Object.entries(ast.properties);
    if (entries.length === 0) return 'Record<string, any>';
    let str = '{\n';
    for (const [key, val] of entries) {
       // quote key if it has special characters
       const safeKey = /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(key) ? key : JSON.stringify(key);
       str += `${indent}  ${safeKey}: ${generateTs(val, indent + '  ')};\n`;
    }
    str += `${indent}}`;
    return str;
  }
  return 'any';
}

function generateZod(ast: TsType, indent = ''): string {
  if (ast.type === 'string') return 'z.string()';
  if (ast.type === 'number') return 'z.number()';
  if (ast.type === 'boolean') return 'z.boolean()';
  if (ast.type === 'null') return 'z.null()';
  if (ast.type === 'any') return 'z.any()';
  if (ast.type === 'array') {
    return `z.array(${generateZod(ast.items, indent)})`;
  }
  if (ast.type === 'object') {
    const entries = Object.entries(ast.properties);
    if (entries.length === 0) return 'z.record(z.string(), z.any())';
    let str = 'z.object({\n';
    for (const [key, val] of entries) {
       const safeKey = /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(key) ? key : JSON.stringify(key);
       str += `${indent}  ${safeKey}: ${generateZod(val, indent + '  ')},\n`;
    }
    str += `${indent}})`;
    return str;
  }
  return 'z.any()';
}

export function JsonToTsZodClient({ children }: { children?: React.ReactNode }) {
  const [jsonInput, setJsonInput] = useState('{\n  "id": 1,\n  "name": "Leanne Graham",\n  "username": "Bret",\n  "email": "Sincere@april.biz",\n  "address": {\n    "street": "Kulas Light",\n    "suite": "Apt. 556",\n    "city": "Gwenborough",\n    "zipcode": "92998-3874",\n    "geo": {\n      "lat": "-37.3159",\n      "lng": "81.1496"\n    }\n  },\n  "phone": "1-770-736-8031 x56442",\n  "website": "hildegard.org",\n  "company": {\n    "name": "Romaguera-Crona",\n    "catchPhrase": "Multi-layered client-server neural-net",\n    "bs": "harness real-time e-markets"\n  }\n}');
  const [tsOutput, setTsOutput] = useState('');
  const [zodOutput, setZodOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copiedTs, setCopiedTs] = useState(false);
  const [copiedZod, setCopiedZod] = useState(false);

  useEffect(() => {
    try {
      if (!jsonInput.trim()) {
        setTsOutput('');
        setZodOutput('');
        setError(null);
        return;
      }
      const parsed = JSON.parse(jsonInput);
      const ast = infer(parsed);
      
      const tsCode = `export interface Root ${generateTs(ast)}`;
      setTsOutput(tsCode);
      
      const zodCode = `import { z } from "zod";\n\nexport const rootSchema = ${generateZod(ast)};\n\nexport type Root = z.infer<typeof rootSchema>;`;
      setZodOutput(zodCode);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Invalid JSON');
    }
  }, [jsonInput]);

  const copyToClipboard = (text: string, type: 'ts' | 'zod') => {
    navigator.clipboard.writeText(text);
    if (type === 'ts') {
      setCopiedTs(true);
      setTimeout(() => setCopiedTs(false), 2000);
    } else {
      setCopiedZod(true);
      setTimeout(() => setCopiedZod(false), 2000);
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full max-w-[1600px] mx-auto w-full p-4 lg:p-8 gap-6 relative">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] flex items-center gap-3">
            <Braces className="w-8 h-8 text-rose-500" />
            JSON to TS & Zod
          </h1>
          <p className="text-[var(--text-secondary)] mt-2 max-w-2xl">
            Instantly convert JSON API responses into strict TypeScript interfaces and Zod schemas. Runs 100% in your browser for total privacy—paste your proprietary payloads without fear.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[600px] flex-1">
        {/* Input Panel */}
        <div className="flex flex-col bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 bg-[var(--bg-sidebar)] border-b border-[var(--border-dev)]">
            <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
              <FileJson className="w-4 h-4 text-emerald-500" />
              JSON Input
            </div>
            <button
              onClick={() => {
                try {
                  const parsed = JSON.parse(jsonInput);
                  setJsonInput(JSON.stringify(parsed, null, 2));
                } catch (e) {}
              }}
              className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-2 py-1 bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded hover:border-emerald-500/50 transition-colors"
            >
              Format JSON
            </button>
          </div>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="flex-1 w-full bg-transparent resize-none p-4 font-mono text-sm text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-rose-500/50"
            placeholder="Paste your JSON here..."
            spellCheck={false}
          />
        </div>

        {/* Output Panel */}
        <div className="flex flex-col gap-6">
          {/* TypeScript Output */}
          <div className="flex flex-col flex-1 bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-4 py-3 bg-[var(--bg-sidebar)] border-b border-[var(--border-dev)]">
              <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
                <FileCode className="w-4 h-4 text-blue-500" />
                TypeScript Interfaces
              </div>
              <button
                onClick={() => copyToClipboard(tsOutput, 'ts')}
                className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-2 py-1 bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded hover:border-blue-500/50 transition-colors"
              >
                {copiedTs ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedTs ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-black/5 dark:bg-black/40">
              <pre className="font-mono text-sm text-blue-600 dark:text-blue-300 whitespace-pre-wrap break-all">
                {tsOutput || <span className="text-gray-500 italic">Waiting for valid JSON...</span>}
              </pre>
            </div>
          </div>

          {/* Zod Output */}
          <div className="flex flex-col flex-1 bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-4 py-3 bg-[var(--bg-sidebar)] border-b border-[var(--border-dev)]">
              <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
                <FileCode className="w-4 h-4 text-amber-500" />
                Zod Schema
              </div>
              <button
                onClick={() => copyToClipboard(zodOutput, 'zod')}
                className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-2 py-1 bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded hover:border-amber-500/50 transition-colors"
              >
                {copiedZod ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedZod ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-black/5 dark:bg-black/40">
              <pre className="font-mono text-sm text-amber-600 dark:text-amber-200 whitespace-pre-wrap break-all">
                {zodOutput || <span className="text-gray-500 italic">Waiting for valid JSON...</span>}
              </pre>
            </div>
          </div>
        </div>
      </div>
      
      {children && (
        <div className="mt-12 pt-8 border-t border-[var(--border-dev)]">
          {children}
        </div>
      )}
    </div>
  );
}
