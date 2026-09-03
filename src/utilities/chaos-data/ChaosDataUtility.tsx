import React, { useState, useMemo, useEffect } from 'react';
import { CHAOS_PRESETS, exportData } from './chaosDataEngine';
import { Copy, Download, RefreshCw, Eye, CheckCircle2, Database } from 'lucide-react';

export const ChaosDataUtility: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(CHAOS_PRESETS[0].id);
  const [count, setCount] = useState<number>(25);
  const [entropy, setEntropy] = useState<number>(65);
  const [viewMode, setViewMode] = useState<'table' | 'json' | 'typescript' | 'zod' | 'csv'>('table');
  const [copied, setCopied] = useState<boolean>(false);
  const [seed, setSeed] = useState<number>(0);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'r' || e.key === 'R') && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        setSeed(s => s + 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const selectedPreset = useMemo(() => {
    return CHAOS_PRESETS.find(p => p.id === selectedPresetId) || CHAOS_PRESETS[0];
  }, [selectedPresetId]);

  const generatedData = useMemo(() => {
    void seed;
    if (!mounted) {
      return selectedPreset.generate(count, 0);
    }
    return selectedPreset.generate(count, entropy);
  }, [selectedPreset, count, entropy, seed, mounted]);

  const currentExportFormat = viewMode === 'table' ? 'json' : viewMode;

  const exportedString = useMemo(() => {
    return exportData(generatedData, currentExportFormat);
  }, [generatedData, currentExportFormat]);

  const payloadByteSize = useMemo(() => {
    return new TextEncoder().encode(exportedString).length;
  }, [exportedString]);

  const handleCopy = () => {
    navigator.clipboard.writeText(exportedString);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    const ext = currentExportFormat === 'typescript' ? 'ts' : currentExportFormat === 'csv' ? 'csv' : currentExportFormat === 'zod' ? 'ts' : 'json';
    const blob = new Blob([exportedString], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `failstate-${selectedPreset.id}-${Date.now()}.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const columns = useMemo(() => {
    if (!generatedData || generatedData.length === 0) return [];
    return Object.keys(generatedData[0]);
  }, [generatedData]);

  return (
    <div className="h-full flex flex-col gap-3 font-mono">
      {/* Top Developer Control Bar */}
      <div className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-lg p-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0 transition-colors shadow-sm">
        {/* Presets Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1 text-[11px] font-bold text-[var(--text-muted)] uppercase mr-1 shrink-0">
            <Database className="w-3.5 h-3.5 text-rose-500" />
            <span>Schema:</span>
          </div>

          {CHAOS_PRESETS.map(preset => {
            const isSelected = preset.id === selectedPresetId;
            return (
              <button
                key={preset.id}
                onClick={() => setSelectedPresetId(preset.id)}
                className={`px-2.5 py-1 text-xs rounded transition-colors shrink-0 ${
                  isSelected
                    ? 'bg-rose-500/15 text-rose-500 dark:text-rose-300 border border-rose-500/40 font-bold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-sidebar)] border border-[var(--border-dev)]'
                }`}
              >
                {preset.name}
              </button>
            );
          })}
        </div>

        {/* Sliders & Parameters */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Quick Record Counters */}
          <div className="flex items-center gap-1 bg-[var(--bg-sidebar)] p-0.5 rounded border border-[var(--border-dev)] text-xs">
            <span className="text-[var(--text-muted)] px-1.5 text-[10px]">ROWS:</span>
            {[10, 25, 50, 100].map(n => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                  count === n ? 'bg-black/10 dark:bg-white/10 text-cyan-500 font-bold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {n}
              </button>
            ))}
          </div>

          {/* Entropy Slider */}
          <div className="flex items-center gap-2 text-xs bg-[var(--bg-sidebar)] px-2 py-1 rounded border border-[var(--border-dev)]">
            <span className="text-[var(--text-muted)] text-[10px]">ENTROPY:</span>
            <input
              type="range"
              min="0"
              max="100"
              value={entropy}
              onChange={e => setEntropy(Number(e.target.value))}
              className="w-20 accent-rose-500 cursor-pointer h-1"
            />
            <span className={`font-bold text-[11px] ${entropy > 70 ? 'text-rose-500' : 'text-cyan-500'}`}>
              {entropy}%
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSeed(s => s + 1)}
              title="Re-roll chaos permutations (Hotkey: R)"
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

      {/* View Mode Bar */}
      <div className="flex items-center justify-between px-1 text-xs shrink-0">
        <div className="flex items-center gap-1 bg-[var(--bg-panel)] p-0.5 rounded border border-[var(--border-dev)]">
          <button
            onClick={() => setViewMode('table')}
            className={`px-2.5 py-1 rounded text-xs transition-colors flex items-center gap-1.5 ${
              viewMode === 'table' ? 'bg-black/10 dark:bg-white/10 text-[var(--text-primary)] font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Table Grid</span>
          </button>
          {(['json', 'typescript', 'zod', 'csv'] as const).map(fmt => (
            <button
              key={fmt}
              onClick={() => setViewMode(fmt)}
              className={`px-2.5 py-1 rounded text-xs uppercase transition-colors ${
                viewMode === fmt ? 'bg-rose-500 text-white font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-[var(--text-muted)] text-[11px]" suppressHydrationWarning>
          <span>schema: <strong className="text-[var(--text-primary)]">{selectedPreset.id}</strong></span>
          <span>columns: <strong className="text-[var(--text-primary)]">{columns.length}</strong></span>
          <span>size: <strong className="text-cyan-500" suppressHydrationWarning>{(payloadByteSize / 1024).toFixed(1)} KB</strong></span>
        </div>
      </div>

      {/* Main Full-Screen Content Pane */}
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
                      const val = (row as Record<string, any>)[col];
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
  );
};
