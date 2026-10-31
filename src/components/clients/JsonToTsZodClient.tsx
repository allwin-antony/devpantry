'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Braces, Check, Copy, Share2 } from 'lucide-react';
import { generateJsonSchemas } from '@/lib/jsonSchema';
import { triggerFeedbackNudge } from '@/lib/feedbackNudge';

const EXAMPLE = JSON.stringify({ users: [{ id: 1, name: 'Ada', active: true }, { id: 2, active: false }], nextPage: null }, null, 2);
type Output = 'typescript' | 'zod';

export function JsonToTsZodClient({ children, initialOutput = 'typescript' }: { children?: ReactNode; initialOutput?: Output }) {
  const [input, setInput] = useState(EXAMPLE);
  const [output, setOutput] = useState<Output>(initialOutput);
  const [copied, setCopied] = useState('');
  const [message, setMessage] = useState('');
  const result = useMemo(() => {
    if (!input.trim()) return { typescript: '', zod: '', error: '' };
    try { return { ...generateJsonSchemas(input), error: '' }; }
    catch (error) { return { typescript: '', zod: '', error: error instanceof Error ? error.message : 'Enter valid JSON.' }; }
  }, [input]);

  useEffect(() => {
    if (!window.location.hash.startsWith('#state=')) return;
    try { setInput(decodeURIComponent(window.location.hash.slice(7))); }
    catch { setMessage('The shared link could not be decoded. Paste your JSON below.'); }
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(''), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async (value: string, action: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(action);
      setMessage('');
      triggerFeedbackNudge(action === 'share' ? 'json-payload-share' : `schema-copy-${action}`);
    } catch { setMessage('Clipboard access was unavailable. Select and copy the code manually.'); }
  };

  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3"><Braces className="w-7 h-7 text-[var(--accent-blue)] shrink-0" />{initialOutput === 'zod' ? 'JSON to Zod Schema Generator' : 'JSON to TypeScript & Zod'}</h1>
      <p className="text-[var(--text-secondary)] mt-3 max-w-3xl">{initialOutput === 'zod' ? 'Generate a Zod validation schema from a JSON example. Nested objects, mixed arrays, and missing fields are inferred locally in your browser.' : 'Turn a JSON example into TypeScript types and a Zod schema. Compare both outputs and copy the code you need—your JSON is processed on your device.'}</p>
      <div className="flex flex-wrap items-center gap-3 my-5">
        <button onClick={() => setInput(EXAMPLE)} className="px-3 py-2 rounded-lg border border-[var(--border-dev)] bg-[var(--bg-panel)] text-sm">Load example</button>
        <button onClick={() => setInput('')} className="px-3 py-2 rounded-lg border border-[var(--border-dev)] bg-[var(--bg-panel)] text-sm">Clear input</button>
        <button disabled={!result[output]} onClick={() => copy(result[output], output)} className="px-3 py-2 rounded-lg bg-[var(--accent-blue)] text-white text-sm disabled:opacity-50 flex items-center gap-2">{copied === output ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}{copied === output ? 'Copied' : `Copy ${output === 'zod' ? 'Zod schema' : 'TypeScript'}`}</button>
        <button onClick={() => copy(`${window.location.origin}${window.location.pathname}#state=${encodeURIComponent(input)}`, 'share')} className="px-3 py-2 rounded-lg border border-[var(--border-dev)] bg-[var(--bg-panel)] text-sm flex items-center gap-2"><Share2 className="w-4 h-4" />{copied === 'share' ? 'Link copied' : 'Copy share link'}</button>
      </div>
      {message && <p role="status" className="text-sm mb-4 text-[var(--text-secondary)]">{message}</p>}
      {result.error && <p role="alert" className="text-sm mb-4 p-3 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400">Invalid JSON: {result.error}</p>}
      <div className="grid lg:grid-cols-2 gap-4">
        <section className="rounded-xl border border-[var(--border-dev)] bg-[var(--bg-panel)] overflow-hidden flex flex-col">
          <div className="p-3 flex items-center justify-between gap-3 border-b border-[var(--border-dev)]">
            <label htmlFor="json-input" className="font-semibold text-sm">JSON input</label>
            <button disabled={!input.trim() || !!result.error} onClick={() => setInput(JSON.stringify(JSON.parse(input), null, 2))} className="text-sm text-[var(--accent-blue)] disabled:opacity-50 px-2 py-1">Format JSON</button>
          </div>
          <textarea id="json-input" spellCheck={false} value={input} onChange={event => setInput(event.target.value)} placeholder="Paste your JSON here…" className="w-full h-72 lg:h-[32rem] resize-y p-4 bg-transparent font-mono text-sm outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500/40" />
        </section>
        <section className="rounded-xl border border-[var(--border-dev)] bg-[var(--bg-panel)] overflow-hidden flex flex-col">
          <div role="tablist" aria-label="Generated code format" className="flex gap-2 p-3 border-b border-[var(--border-dev)]">
            {(initialOutput === 'zod' ? ['zod', 'typescript'] as const : ['typescript', 'zod'] as const).map(format => <button key={format} id={`output-${format}-tab`} role="tab" aria-selected={format === output} aria-controls="generated-code" onClick={() => setOutput(format)} className={`px-3 py-1 rounded-md text-sm font-semibold ${format === output ? 'bg-blue-500/15 text-[var(--accent-blue)]' : 'text-[var(--text-secondary)]'}`}>{format === 'zod' ? 'Zod schema' : 'TypeScript'}</button>)}
          </div>
          <pre id="generated-code" role="tabpanel" aria-labelledby={`output-${output}-tab`} tabIndex={0} className="h-72 lg:h-[32rem] overflow-auto p-4 text-sm font-mono whitespace-pre bg-[var(--bg-codebox)] text-[var(--text-code)]"><code>{result[output] || 'Paste valid JSON to generate code.'}</code></pre>
        </section>
      </div>
      {children}
    </div>
  );
}
