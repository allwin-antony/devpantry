import React, { useState, useMemo, useEffect } from 'react';
import { 
  AVAILABLE_FIELD_TYPES, 
  DOMAIN_TEMPLATES, 
  generateFromSchema, 
  exportSchemaData,
  type SchemaFieldConfig,
  type FieldTypeId
} from './schemaFieldGenerators';
import { 
  Plus, 
  Trash2, 
  Copy, 
  Download, 
  RefreshCw, 
  Eye, 
  CheckCircle2, 
  SlidersHorizontal,
  Sparkles,
  Layers
} from 'lucide-react';

const STORAGE_KEY = 'failstate-custom-schema';

export const SchemaBuilderUtility: React.FC = () => {
  // Load saved fields or default to User Profile template
  const [fields, setFields] = useState<SchemaFieldConfig[]>(DOMAIN_TEMPLATES[0].fields);
  const [count, setCount] = useState<number>(25);
  const [globalEntropy, setGlobalEntropy] = useState<number>(65);
  const [viewMode, setViewMode] = useState<'table' | 'json' | 'typescript' | 'zod' | 'csv' | 'sql'>('table');
  const [copied, setCopied] = useState<boolean>(false);
  const [seed, setSeed] = useState<number>(0);
  const [mounted, setMounted] = useState<boolean>(false);

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) setFields(parsed);
      }
    } catch {}
  }, []);

  // Persist fields in localStorage
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fields));
    } catch {}
  }, [fields, mounted]);

  // Global hotkey: R to re-roll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'r' || e.key === 'R') && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        setSeed(s => s + 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Generate records
  const generatedData = useMemo(() => {
    void seed;
    if (!mounted) {
      return generateFromSchema(fields, count, 0);
    }
    return generateFromSchema(fields, count, globalEntropy);
  }, [fields, count, globalEntropy, seed, mounted]);

  const currentExportFormat = viewMode === 'table' ? 'json' : viewMode;

  const exportedString = useMemo(() => {
    return exportSchemaData(generatedData, currentExportFormat);
  }, [generatedData, currentExportFormat]);

  const payloadByteSize = useMemo(() => {
    return new TextEncoder().encode(exportedString).length;
  }, [exportedString]);

  const columns = useMemo(() => {
    if (!generatedData || generatedData.length === 0) return [];
    return Object.keys(generatedData[0]);
  }, [generatedData]);

  // Field manipulation helpers
  const handleAddField = () => {
    const newField: SchemaFieldConfig = {
      id: `f_${Date.now()}`,
      name: `field_${fields.length + 1}`,
      type: 'name',
      chaosLevel: 60
    };
    setFields(prev => [...prev, newField]);
  };

  const handleUpdateField = (id: string, updates: Partial<SchemaFieldConfig>) => {
    setFields(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const handleRemoveField = (id: string) => {
    if (fields.length <= 1) return; // Maintain at least 1 field
    setFields(prev => prev.filter(f => f.id !== id));
  };

  const handleApplyTemplate = (templateId: string) => {
    const template = DOMAIN_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setFields(template.fields);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(exportedString);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    const extMap: Record<string, string> = {
      json: 'json',
      csv: 'csv',
      typescript: 'ts',
      zod: 'ts',
      sql: 'sql'
    };
    const ext = extMap[currentExportFormat] || 'json';
    const blob = new Blob([exportedString], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `custom-schema-${Date.now()}.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col gap-3 font-mono">
      {/* Top Controls & Template Bar */}
      <div className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-lg p-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-sm transition-colors">
        {/* Template Starters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1 text-[11px] font-bold text-[var(--text-muted)] uppercase mr-1 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Templates:</span>
          </div>

          {DOMAIN_TEMPLATES.map(t => (
            <button
              key={t.id}
              onClick={() => handleApplyTemplate(t.id)}
              className="px-2.5 py-1 text-xs rounded transition-colors shrink-0 bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-rose-500/40"
              title={t.description}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Sliders & Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Row count buttons */}
          <div className="flex items-center gap-1 bg-[var(--bg-sidebar)] p-0.5 rounded border border-[var(--border-dev)] text-xs">
            <span className="text-[var(--text-muted)] px-1.5 text-[10px]">ROWS:</span>
            {[10, 25, 50, 100].map(n => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                  count === n 
                    ? 'bg-black/10 dark:bg-white/10 text-cyan-500 font-bold' 
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {n}
              </button>
            ))}
          </div>

          {/* Global Entropy Slider */}
          <div className="flex items-center gap-2 text-xs bg-[var(--bg-sidebar)] px-2 py-1 rounded border border-[var(--border-dev)]">
            <span className="text-[var(--text-muted)] text-[10px]">GLOBAL CHAOS:</span>
            <input
              type="range"
              min="0"
              max="100"
              value={globalEntropy}
              onChange={e => setGlobalEntropy(Number(e.target.value))}
              className="w-20 accent-rose-500 cursor-pointer h-1"
            />
            <span className={`font-bold text-[11px] ${globalEntropy > 70 ? 'text-rose-500' : 'text-cyan-500'}`}>
              {globalEntropy}%
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSeed(s => s + 1)}
              title="Re-roll permutations (Hotkey: R)"
              className="px-2.5 py-1 text-xs font-semibold rounded bg-rose-500/15 text-rose-600 dark:text-rose-300 border border-rose-500/30 hover:bg-rose-500/25 flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Re-roll (R)</span>
            </button>

            <button
              onClick={handleCopy}
              className="px-2.5 py-1 text-xs font-semibold rounded bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-[var(--text-primary)] hover:border-rose-500/40 flex items-center gap-1 transition-colors"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handleDownload}
              title="Download generated payload"
              className="p-1 rounded bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Split Workbench: Left Schema Editor (40%), Right Live Output (60%) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0 overflow-hidden">
        {/* Left Column: Visual Schema Composer */}
        <div className="lg:col-span-5 bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-lg flex flex-col overflow-hidden shadow-sm transition-colors">
          {/* Header */}
          <div className="p-3 border-b border-[var(--border-dev)] flex items-center justify-between bg-[var(--bg-panel-subtle)] shrink-0">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-rose-500" />
              <span className="text-xs font-bold text-[var(--text-primary)] uppercase">Schema Fields</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[var(--pill-bg)] text-[var(--text-muted)] font-bold">
                {fields.length}
              </span>
            </div>

            <button
              onClick={handleAddField}
              className="px-2 py-1 text-xs font-semibold rounded bg-rose-500 text-white hover:bg-rose-600 flex items-center gap-1 transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Field</span>
            </button>
          </div>

          {/* Fields Scroll List */}
          <div className="flex-1 overflow-y-auto p-2.5 flex flex-col gap-2">
            {fields.map((field, idx) => (
              <div 
                key={field.id}
                className="p-2.5 rounded-lg bg-[var(--bg-panel-subtle)] border border-[var(--border-dev)] flex flex-col gap-2 group hover:border-rose-500/40 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[var(--text-muted)] font-bold w-4 select-none">
                    #{idx + 1}
                  </span>

                  {/* Field Name Input */}
                  <input
                    type="text"
                    value={field.name}
                    onChange={e => handleUpdateField(field.id, { name: e.target.value.replace(/\s+/g, '_') })}
                    placeholder="field_name"
                    className="dev-input flex-1 px-2 py-1 rounded text-xs"
                  />

                  {/* Field Type Select */}
                  <select
                    value={field.type}
                    onChange={e => handleUpdateField(field.id, { type: e.target.value as FieldTypeId })}
                    className="dev-input px-2 py-1 rounded text-xs bg-[var(--bg-sidebar)] max-w-[140px]"
                  >
                    {AVAILABLE_FIELD_TYPES.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.label}
                      </option>
                    ))}
                  </select>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleRemoveField(field.id)}
                    disabled={fields.length <= 1}
                    title={fields.length <= 1 ? "At least one field is required" : "Delete field"}
                    className="p-1 rounded text-[var(--text-muted)] hover:text-rose-500 hover:bg-rose-500/10 disabled:opacity-30 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* If Enum, render comma-separated values input */}
                {field.type === 'enum' && (
                  <div className="flex items-center gap-2 pl-6">
                    <span className="text-[10px] text-[var(--text-muted)] shrink-0">Values:</span>
                    <input
                      type="text"
                      value={field.options || 'active, pending, suspended'}
                      onChange={e => handleUpdateField(field.id, { options: e.target.value })}
                      placeholder="e.g. pending, active, cancelled"
                      className="dev-input flex-1 px-2 py-0.5 rounded text-[11px]"
                    />
                  </div>
                )}

                {/* Per-field Chaos Slider */}
                <div className="flex items-center justify-between gap-3 pl-6 pt-1 border-t border-[var(--border-dev-subtle)] text-[11px]">
                  <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
                    <SlidersHorizontal className="w-3 h-3 text-rose-500" />
                    <span className="text-[10px]">Field Chaos:</span>
                  </div>

                  <div className="flex items-center gap-2 flex-1 max-w-[180px]">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={field.chaosLevel}
                      onChange={e => handleUpdateField(field.id, { chaosLevel: Number(e.target.value) })}
                      className="w-full accent-rose-500 cursor-pointer h-1"
                    />
                    <span className={`text-[10px] font-bold w-7 text-right ${field.chaosLevel > 70 ? 'text-rose-500' : 'text-cyan-500'}`}>
                      {field.chaosLevel}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Stats */}
          <div className="p-2 border-t border-[var(--border-dev)] bg-[var(--bg-panel-subtle)] flex items-center justify-between text-[11px] text-[var(--text-muted)] shrink-0">
            <span>Saved in localStorage</span>
            <button
              onClick={() => {
                localStorage.removeItem(STORAGE_KEY);
                setFields(DOMAIN_TEMPLATES[0].fields);
              }}
              className="hover:text-rose-500 text-[10px] underline"
            >
              Reset to Defaults
            </button>
          </div>
        </div>

        {/* Right Column: Live Data Grid & Code Output */}
        <div className="lg:col-span-7 flex flex-col gap-2 min-h-0 overflow-hidden">
          {/* View Mode Bar */}
          <div className="flex items-center justify-between text-xs shrink-0">
            <div className="flex items-center gap-1 bg-[var(--bg-panel)] p-0.5 rounded border border-[var(--border-dev)]">
              <button
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 rounded text-xs transition-colors flex items-center gap-1.5 ${
                  viewMode === 'table' 
                    ? 'bg-black/10 dark:bg-white/10 text-[var(--text-primary)] font-bold' 
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Table Grid</span>
              </button>
              {(['json', 'typescript', 'zod', 'csv', 'sql'] as const).map(fmt => (
                <button
                  key={fmt}
                  onClick={() => setViewMode(fmt)}
                  className={`px-2 py-1 rounded text-xs uppercase transition-colors ${
                    viewMode === fmt 
                      ? 'bg-rose-500 text-white font-bold' 
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 text-[var(--text-muted)] text-[11px]" suppressHydrationWarning>
              <span>cols: <strong className="text-[var(--text-primary)]">{columns.length}</strong></span>
              <span>size: <strong className="text-cyan-500" suppressHydrationWarning>{(payloadByteSize / 1024).toFixed(1)} KB</strong></span>
            </div>
          </div>

          {/* Main Output Box */}
          <div className="flex-1 min-h-0 bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-lg overflow-hidden flex flex-col shadow-sm">
            {viewMode === 'table' ? (
              <div className="flex-1 overflow-auto">
                <table className="dev-table">
                  <thead>
                    <tr>
                      <th style={{ width: '45px' }}>#</th>
                      {columns.map(col => (
                        <th key={col}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {generatedData.map((row, idx) => (
                      <tr key={idx}>
                        <td className="text-[var(--text-muted)] select-none font-bold">{idx + 1}</td>
                        {columns.map(col => {
                          const val = row[col];
                          const isNull = val === null || val === undefined;
                          const isNum = typeof val === 'number';
                          const display = typeof val === 'object' ? JSON.stringify(val) : String(val);

                          return (
                            <td key={col} className="max-w-xs truncate" title={display}>
                              {isNull ? (
                                <span className="text-rose-500 font-semibold italic">null</span>
                              ) : isNum ? (
                                <span className="text-emerald-600 dark:text-emerald-300">{display}</span>
                              ) : (
                                <span className="text-[var(--text-primary)]">{display}</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex-1 overflow-auto p-4 font-mono text-xs text-[var(--text-code)] leading-relaxed bg-[var(--bg-codebox)]">
                <pre className="m-0">
                  <code>{exportedString}</code>
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
