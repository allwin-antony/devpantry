'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  type ServiceResponseItem, 
  ALL_SERVICE_RESPONSES 
} from '@/lib/loaders/serviceResponseLoader';
import { fillChaosPayload } from '@/utilities/chaos-data/chaosTemplateFiller';
import { 
  Radio, 
  Copy, 
  CheckCircle2, 
  ExternalLink, 
  Code2, 
  RefreshCw, 
  Sparkles, 
  Flame, 
  SlidersHorizontal,
  ArrowRight,
  ArrowLeft,
  Terminal,
  FileJson,
  Download,
  ShieldCheck,
  Zap,
  Globe,
  Layers,
  Check
} from 'lucide-react';

interface Props {
  service: ServiceResponseItem;
}

export function ChaosTemplateDetailClient({ service }: Props) {
  const [entropy, setEntropy] = useState<number>(75);
  const [viewMode, setViewMode] = useState<'chaos' | 'clean' | 'typescript' | 'curl'>('chaos');
  const [seed, setSeed] = useState<number>(0);
  const [simulatedStatus, setSimulatedStatus] = useState<number>(200);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Response variations
  const responseKeys = useMemo(() => {
    if (!service.responses) return [];
    return Object.keys(service.responses);
  }, [service]);

  const [activeResponseKey, setActiveResponseKey] = useState<string>(responseKeys[0] || '');

  // Re-roll hotkey R
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'r' || e.key === 'R') && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        setSeed(s => s + 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeResponseObj = service.responses?.[activeResponseKey];

  const cleanPayload = useMemo(() => {
    return activeResponseObj?.payload || service.payload || { message: "Standard service payload" };
  }, [activeResponseObj, service]);

  const chaosPayload = useMemo(() => {
    void seed;
    if (!mounted) {
      return cleanPayload;
    }
    if (simulatedStatus === 400) {
      return {
        type: "https://errors.api.io/bad-request",
        title: "Bad Request — Schema Validation Failure",
        status: 400,
        detail: "The payload failed validation against strict chaos schema constraints.",
        instance: `/requests/req_${Math.random().toString(36).substring(2, 9)}`,
        invalid_parameters: [
          { name: "token", reason: "Value contained zero-width Unicode injection" },
          { name: "email", reason: "Invalid punycode domain formatting" }
        ]
      };
    }
    if (simulatedStatus === 401) {
      return {
        error: "invalid_client_credentials",
        error_description: "Client authentication token revoked or expired.",
        status: 401
      };
    }
    if (simulatedStatus === 429) {
      return {
        error: "rate_limit_exceeded",
        message: "You have exceeded the maximum request quota (100 requests/min).",
        retry_after_seconds: 42,
        status: 429
      };
    }
    if (simulatedStatus === 500) {
      return {
        error: "internal_server_error",
        message: "Upstream identity provider returned malformed JSON response.",
        incident_id: `inc_${Math.random().toString(36).substring(2, 9)}`,
        status: 500
      };
    }

    return fillChaosPayload(cleanPayload, entropy);
  }, [cleanPayload, entropy, seed, simulatedStatus, mounted]);

  const activeDisplayPayload = viewMode === 'clean' ? cleanPayload : chaosPayload;

  // TypeScript interface generator
  const generatedTypeScript = useMemo(() => {
    const generateInterface = (obj: any, interfaceName: string): string => {
      if (typeof obj !== 'object' || obj === null) return `type ${interfaceName} = any;`;
      
      const lines: string[] = [`export interface ${interfaceName} {`];
      for (const [key, value] of Object.entries(obj)) {
        let typeStr = 'any';
        if (typeof value === 'string') typeStr = 'string';
        else if (typeof value === 'number') typeStr = 'number';
        else if (typeof value === 'boolean') typeStr = 'boolean';
        else if (Array.isArray(value)) {
          if (value.length > 0 && typeof value[0] === 'string') typeStr = 'string[]';
          else if (value.length > 0 && typeof value[0] === 'number') typeStr = 'number[]';
          else typeStr = 'any[]';
        } else if (typeof value === 'object' && value !== null) {
          typeStr = 'Record<string, any>';
        }
        lines.push(`  ${key}: ${typeStr};`);
      }
      lines.push('}');
      return lines.join('\n');
    };

    const cleanTypeName = service.service.replace(/[^a-zA-Z0-9]/g, '') + 'Response';
    return generateInterface(cleanPayload, cleanTypeName);
  }, [cleanPayload, service.service]);

  // cURL CLI command generator
  const generatedCurl = useMemo(() => {
    return `# Simulated Mock Response for ${service.service} (${service.provider})
curl -X POST "https://api.mock.devpantry.com/v1/${service.id}" \\
  -H "Content-Type: application/json" \\
  -H "X-Chaos-Entropy: ${entropy}%" \\
  -d '${JSON.stringify(activeDisplayPayload)}'`;
  }, [service, entropy, activeDisplayPayload]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 1800);
  };

  const handleDownload = () => {
    const isTs = viewMode === 'typescript';
    const isCurl = viewMode === 'curl';
    const content = isTs ? generatedTypeScript : isCurl ? generatedCurl : JSON.stringify(activeDisplayPayload, null, 2);
    const ext = isTs ? 'ts' : isCurl ? 'sh' : 'json';
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${service.id}-payload.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: number) => {
    if (status === 200) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (status === 400 || status === 401) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
  };

  // Related Services
  const relatedServices = useMemo(() => {
    return ALL_SERVICE_RESPONSES
      .filter(s => s.id !== service.id)
      .slice(0, 4);
  }, [service.id]);

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 flex flex-col gap-6 max-w-7xl mx-auto w-full font-mono">
      {/* ── Breadcrumb & Navigation Bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[var(--text-muted)]">
          <Link href="/api-templates" className="hover:text-rose-500 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All 17 Templates</span>
          </Link>
          <span>/</span>
          <span className="text-[var(--text-secondary)]">{service.categoryTitle}</span>
          <span>/</span>
          <span className="text-[var(--text-primary)] font-bold">{service.service}</span>
        </div>

        <Link
          href="/mock-data"
          className="text-[11px] text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 font-bold"
        >
          <span>Need Columnar Tables GUI? Go to Schema Studio</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* ── Service Header Banner ── */}
      <section className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-2xl p-6 shadow-sm transition-colors relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-gradient-to-br from-rose-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                {service.categoryTitle}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[var(--bg-panel-subtle)] text-[var(--text-secondary)] border border-[var(--border-dev)] font-mono">
                {service.provider}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 font-mono">
                JSON &amp; TypeScript Fixtures
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-primary)] font-sans mb-2">
              {service.service}
            </h1>

            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-sans max-w-3xl">
              {activeResponseObj?.description || service.description || 'Production API response schema injected with high-entropy dirty mock data (BLNS, Punycode, precision traps).'}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setSeed(s => s + 1)}
              className="px-3.5 py-2 rounded-xl bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-rose-600 transition-all shadow-md shadow-rose-500/20 cursor-pointer"
              title="Re-roll chaos permutations (Hotkey: R)"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Re-roll (R)</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3.5 py-2 rounded-xl bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-[var(--text-primary)] font-bold text-xs flex items-center gap-1.5 hover:border-rose-500 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Interactive Chaos Workbench ── */}
      <div className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-2xl p-5 shadow-sm transition-colors flex flex-col gap-4">
        {/* Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border-dev)]">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Entropy Slider */}
            <div className="flex items-center gap-2 bg-[var(--bg-sidebar)] px-3 py-1.5 rounded-lg border border-[var(--border-dev)]">
              <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1 font-bold">
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                <span>CHAOS ENTROPY:</span>
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={entropy}
                onChange={e => setEntropy(Number(e.target.value))}
                className="w-24 accent-rose-500 cursor-pointer h-1.5"
              />
              <span className="text-xs font-bold text-rose-500 w-8 text-right font-mono">{entropy}%</span>
            </div>

            {/* HTTP Status Code Simulator */}
            <div className="flex items-center gap-1 bg-[var(--bg-sidebar)] p-1 rounded-lg border border-[var(--border-dev)]">
              <span className="text-[10px] text-[var(--text-muted)] font-bold px-1">HTTP:</span>
              {[200, 400, 401, 429, 500].map(code => (
                <button
                  key={code}
                  onClick={() => setSimulatedStatus(code)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                    simulatedStatus === code 
                      ? `${getStatusColor(code)} shadow-sm font-black` 
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>

            {/* Response variation selector (if multiple) */}
            {responseKeys.length > 1 && (
              <div className="flex items-center gap-1 bg-[var(--bg-sidebar)] p-1 rounded-lg border border-[var(--border-dev)]">
                <span className="text-[10px] text-[var(--text-muted)] font-bold px-1">VARIATION:</span>
                {responseKeys.map(k => (
                  <button
                    key={k}
                    onClick={() => setActiveResponseKey(k)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                      activeResponseKey === k
                        ? 'bg-rose-500 text-white shadow-sm'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {k.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View Mode Switcher & Copy */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[var(--bg-sidebar)] p-1 rounded-lg border border-[var(--border-dev)] text-xs">
              {(['chaos', 'clean', 'typescript', 'curl'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1 rounded-md text-[11px] font-bold uppercase transition-colors cursor-pointer ${
                    viewMode === mode
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {mode === 'chaos' ? '⚡ Chaos Payload' : mode}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                const textToCopy = 
                  viewMode === 'typescript' ? generatedTypeScript :
                  viewMode === 'curl' ? generatedCurl :
                  JSON.stringify(activeDisplayPayload, null, 2);
                copyToClipboard(textToCopy, 'main-copy');
              }}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-[var(--text-primary)] hover:border-rose-500 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedCode === 'main-copy' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-rose-500" />}
              <span>{copiedCode === 'main-copy' ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Code Output Viewer */}
        <div className="bg-[var(--bg-codebox)] rounded-xl border border-[var(--border-dev)] overflow-hidden shadow-inner flex flex-col">
          <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between text-xs bg-black/20 shrink-0">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusColor(simulatedStatus)}`}>
                HTTP {simulatedStatus} {simulatedStatus === 200 ? 'OK' : simulatedStatus === 429 ? 'Rate Limited' : 'Error'}
              </span>
              <span className="text-slate-400 text-[11px]">
                mode: <strong className="text-rose-400">{viewMode}</strong>
              </span>
            </div>

            <div className="text-[11px] text-slate-400" suppressHydrationWarning>
              size: <strong className="text-cyan-400" suppressHydrationWarning>{(new TextEncoder().encode(JSON.stringify(activeDisplayPayload)).length / 1024).toFixed(1)} KB</strong>
            </div>
          </div>

          <div className="p-4 font-mono text-xs leading-relaxed text-[var(--text-code)] max-h-[460px] overflow-auto">
            {viewMode === 'typescript' ? (
              <pre className="m-0 text-cyan-300">
                <code>{generatedTypeScript}</code>
              </pre>
            ) : viewMode === 'curl' ? (
              <pre className="m-0 text-emerald-400">
                <code>{generatedCurl}</code>
              </pre>
            ) : (
              <pre className="m-0">
                <code>{JSON.stringify(activeDisplayPayload, null, 2)}</code>
              </pre>
            )}
          </div>
        </div>
      </div>

      {/* ── Related Service Templates Grid (SEO & Navigation) ── */}
      <section className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-2xl p-5 shadow-sm transition-colors flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs pb-2 border-b border-[var(--border-dev-subtle)]">
          <span className="font-bold text-[var(--text-primary)] font-sans">
            Related Production API Chaos Templates
          </span>
          <Link href="/api-templates" className="text-[11px] text-rose-500 hover:underline flex items-center gap-1 font-bold">
            <span>Browse All 17 Templates</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {relatedServices.map(rel => (
            <Link
              key={rel.id}
              href={`/chaos-templates/${rel.id}`}
              className="p-3.5 rounded-xl bg-[var(--bg-sidebar)] border border-[var(--border-dev)] hover:border-rose-500/50 hover:bg-[var(--bg-panel)] transition-all flex flex-col justify-between gap-2 group shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] mb-1">
                  <span>{rel.provider}</span>
                  <span className="px-1.5 py-0.2 rounded bg-[var(--pill-bg)] text-rose-600 dark:text-rose-400 font-bold">
                    {rel.categoryTitle}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-[var(--text-primary)] font-sans group-hover:text-rose-500 transition-colors truncate">
                  {rel.service}
                </h3>
              </div>

              <div className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] group-hover:text-rose-500 font-bold pt-1 border-t border-[var(--border-dev-subtle)]">
                <span>View Chaos Schema</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
