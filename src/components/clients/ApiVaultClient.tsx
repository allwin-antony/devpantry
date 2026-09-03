'use client';

import React, { useState, useMemo } from 'react';
import { ALL_SERVICE_RESPONSES, type ServiceResponseItem } from '@/lib/datasetLoader';
import { 
  Radio, 
  Search, 
  Copy, 
  CheckCircle2, 
  ExternalLink
} from 'lucide-react';

export function ApiVaultClient() {
  const [selectedServiceId, setSelectedServiceId] = useState<string>(ALL_SERVICE_RESPONSES[0].id);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeResponseKey, setActiveResponseKey] = useState<string>('');
  const [viewMode, setViewMode] = useState<'payload' | 'typescript' | 'curl' | 'schema'>('payload');
  const [simulatedStatus, setSimulatedStatus] = useState<number>(200);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const categories = [
    { id: 'All', label: 'All Services' },
    { id: 'auth_and_sso', label: 'Auth & SSO' },
    { id: 'ecommerce_and_b2b', label: 'E-Commerce & B2B' },
    { id: 'developer_and_cloud', label: 'Cloud & APIs' },
    { id: 'schemas', label: 'Standards & Schemas' },
  ];

  const filteredServices = useMemo(() => {
    return ALL_SERVICE_RESPONSES.filter(svc => {
      const matchesCategory = selectedCategory === 'All' || svc.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        svc.service.toLowerCase().includes(q) || 
        svc.provider.toLowerCase().includes(q) ||
        svc.id.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const activeService = useMemo(() => {
    return ALL_SERVICE_RESPONSES.find(s => s.id === selectedServiceId) || ALL_SERVICE_RESPONSES[0];
  }, [selectedServiceId]);

  // Available responses in the selected service
  const responseKeys = useMemo(() => {
    if (!activeService.responses) return [];
    return Object.keys(activeService.responses);
  }, [activeService]);

  const currentResponseKey = activeResponseKey && responseKeys.includes(activeResponseKey) 
    ? activeResponseKey 
    : responseKeys[0] || '';

  const activeResponseObj = activeService.responses?.[currentResponseKey];

  // Helper to generate simulated error payload based on RFC 7807
  const currentPayload = useMemo(() => {
    if (simulatedStatus === 400) {
      return {
        type: "https://errors.api.io/bad-request",
        title: "Bad Request",
        status: 400,
        detail: "The request payload failed validation against the schema.",
        instance: `/requests/${Date.now()}`,
        invalid_parameters: [
          { name: "token", reason: "Value cannot be null or empty string" }
        ]
      };
    }
    if (simulatedStatus === 401) {
      return {
        error: "invalid_client",
        error_description: "Client authentication failed (e.g., unknown client, no client authentication included, or unsupported authentication method).",
        status: 401
      };
    }
    if (simulatedStatus === 429) {
      return {
        error: "rate_limit_exceeded",
        message: "You have exceeded the maximum request quota of 100 requests/minute.",
        retry_after_seconds: 42,
        status: 429
      };
    }
    if (simulatedStatus === 500) {
      return {
        error: "internal_server_error",
        message: "An unexpected error occurred while communicating with the upstream identity provider.",
        incident_id: `inc_${Math.random().toString(36).substring(2, 9)}`,
        status: 500
      };
    }
    return activeResponseObj?.payload || activeService.payload || { message: "No payload specification" };
  }, [activeResponseObj, activeService, simulatedStatus]);

  // TypeScript interface generator
  const generatedTypeScript = useMemo(() => {
    const inferType = (val: any): string => {
      if (val === null) return 'string | null';
      if (typeof val === 'number') return 'number';
      if (typeof val === 'boolean') return 'boolean';
      if (Array.isArray(val)) {
        if (val.length === 0) return 'any[]';
        return `${inferType(val[0])}[]`;
      }
      if (typeof val === 'object') return 'Record<string, any>';
      return 'string';
    };

    const typeName = activeService.service.replace(/[^a-zA-Z0-9]/g, '') + 'Response';
    const fields = Object.entries(currentPayload)
      .map(([k, v]) => `  ${k}: ${inferType(v)};`)
      .join('\n');

    return `export interface ${typeName} {\n${fields}\n}\n\n// Sample Mock Instance:\nexport const SAMPLE_${typeName.toUpperCase()}: ${typeName} = ${JSON.stringify(currentPayload, null, 2)};`;
  }, [currentPayload, activeService]);

  // cURL generator
  const generatedCurl = useMemo(() => {
    const endpointUrl = activeService.endpoints ? Object.values(activeService.endpoints)[0] : 'https://api.service.com/v1/endpoint';
    return `curl -X POST "${endpointUrl}" \\
  -H "Authorization: Bearer sample_bearer_token_${Date.now()}" \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json" \\
  -d '${JSON.stringify(currentPayload).slice(0, 120)}...'`;
  }, [activeService, currentPayload]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 1800);
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30';
    if (status === 429) return 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/30';
    return 'bg-rose-500/15 text-rose-600 dark:text-rose-300 border-rose-500/30';
  };

  return (
    <div className="h-full flex flex-col md:flex-row p-3 overflow-hidden gap-3 font-mono">
      {/* Left Sidebar: Service Explorer & Search */}
      <div className="w-full md:w-72 bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-xl flex flex-col overflow-hidden shrink-0 shadow-sm transition-colors">
        {/* Search & Category Filter */}
        <div className="p-3 border-b border-[var(--border-dev)] flex flex-col gap-2 bg-[var(--bg-panel-subtle)] shrink-0">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold text-[var(--text-primary)] font-sans uppercase">API Fixture Vault</span>
          </div>

          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search services (Google, Stripe, Supabase...)"
              className="dev-input flex-1 px-2 py-1 rounded text-xs"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="dev-input px-2 py-1 rounded text-xs bg-[var(--bg-sidebar)]"
          >
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Services List */}
        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1.5">
          {filteredServices.map(svc => {
            const isSelected = svc.id === selectedServiceId;
            return (
              <button
                key={svc.id}
                onClick={() => {
                  setSelectedServiceId(svc.id);
                  setActiveResponseKey('');
                  setSimulatedStatus(200);
                }}
                className={`w-full text-left p-2.5 rounded-lg border transition-all flex flex-col gap-1 cursor-pointer ${
                  isSelected 
                    ? 'bg-[var(--bg-sidebar)] border-emerald-500 shadow-sm' 
                    : 'border-transparent hover:bg-[var(--bg-sidebar)]/60 text-[var(--text-secondary)]'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-xs font-bold font-sans truncate ${isSelected ? 'text-emerald-500' : 'text-[var(--text-primary)]'}`}>
                    {svc.service}
                  </span>
                </div>
                <div className="text-[10px] text-[var(--text-muted)] truncate flex items-center justify-between">
                  <span>{svc.provider}</span>
                  <span className="font-bold opacity-75">{svc.categoryTitle}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-2 border-t border-[var(--border-dev)] text-[10px] text-[var(--text-muted)] text-center bg-[var(--bg-panel-subtle)]">
          <strong>{filteredServices.length}</strong> production specifications
        </div>
      </div>

      {/* Main Workbench: Service Specs, Endpoints & Payloads */}
      <div className="flex-1 flex flex-col gap-3 min-w-0 overflow-hidden">
        {/* Service Header Card */}
        <div className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-xl p-4 shrink-0 shadow-sm transition-colors flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border-dev)]">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-base font-bold text-[var(--text-primary)] font-sans">
                  {activeService.service}
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-[var(--pill-bg)] border border-[var(--border-dev)] text-[var(--text-muted)]">
                  {activeService.provider}
                </span>
              </div>
              <div className="text-xs text-[var(--text-secondary)] font-sans mt-0.5">
                {activeResponseObj?.description || activeService.description || 'Production API response specification and schema fixtures.'}
              </div>
            </div>

            {/* Official Docs Link */}
            {activeService.documentation_url && (
              <a
                href={activeService.documentation_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 text-xs font-semibold rounded bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-[var(--text-primary)] hover:border-emerald-500 flex items-center gap-1.5 transition-colors"
              >
                <span>Official Documentation</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-500" />
              </a>
            )}
          </div>

          {/* Endpoints & Status Simulator Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Response tabs if multiple available */}
            {responseKeys.length > 1 && (
              <div className="flex items-center gap-1 bg-[var(--bg-sidebar)] p-0.5 rounded border border-[var(--border-dev)]">
                <span className="text-[10px] text-[var(--text-muted)] px-1.5">RESPONSE:</span>
                {responseKeys.map(key => (
                  <button
                    key={key}
                    onClick={() => {
                      setActiveResponseKey(key);
                      setSimulatedStatus(200);
                    }}
                    className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
                      currentResponseKey === key
                        ? 'bg-emerald-500 text-white font-bold'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {key.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            )}

            {/* HTTP Status Code Simulator */}
            <div className="flex items-center gap-1 bg-[var(--bg-sidebar)] p-0.5 rounded border border-[var(--border-dev)]">
              <span className="text-[10px] text-[var(--text-muted)] px-1.5">SIMULATE:</span>
              {[200, 400, 401, 429, 500].map(st => (
                <button
                  key={st}
                  onClick={() => setSimulatedStatus(st)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                    simulatedStatus === st
                      ? (st === 200 ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white')
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* View Mode Bar */}
            <div className="flex items-center gap-1 bg-[var(--bg-sidebar)] p-0.5 rounded border border-[var(--border-dev)]">
              {(['payload', 'typescript', 'curl', 'schema'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-2 py-0.5 rounded text-[11px] uppercase transition-colors cursor-pointer ${
                    viewMode === mode
                      ? 'bg-black/15 dark:bg-white/15 text-[var(--text-primary)] font-bold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Copy Button */}
            <button
              onClick={() => {
                const textToCopy = 
                  viewMode === 'typescript' ? generatedTypeScript :
                  viewMode === 'curl' ? generatedCurl :
                  JSON.stringify(currentPayload, null, 2);
                copyToClipboard(textToCopy, 'main-copy');
              }}
              className="px-2.5 py-1 text-xs font-semibold rounded bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-[var(--text-primary)] hover:border-emerald-500 flex items-center gap-1 transition-colors cursor-pointer"
            >
              {copiedCode === 'main-copy' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode === 'main-copy' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Output Viewer */}
        <div className="flex-1 min-h-0 bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-xl overflow-hidden flex flex-col shadow-sm">
          {/* Output Top Bar */}
          <div className="px-4 py-2 border-b border-[var(--border-dev)] flex items-center justify-between text-xs bg-[var(--bg-panel-subtle)] shrink-0">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusColor(simulatedStatus)}`}>
                HTTP {simulatedStatus} {simulatedStatus === 200 ? 'OK' : simulatedStatus === 429 ? 'Rate Limited' : 'Error'}
              </span>
              <span className="text-[var(--text-muted)] text-[11px]">
                format: application/json
              </span>
            </div>

            <div className="text-[11px] text-[var(--text-muted)]">
              size: <strong className="text-cyan-500">{(new TextEncoder().encode(JSON.stringify(currentPayload)).length / 1024).toFixed(1)} KB</strong>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-auto p-4 bg-[var(--bg-codebox)] font-mono text-xs leading-relaxed text-[var(--text-code)]">
            {viewMode === 'schema' && activeResponseObj?.data_types ? (
              <table className="dev-table">
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Data Type</th>
                    <th>Specification Description</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(activeResponseObj.data_types).map(([field, typeDesc]) => {
                    const descStr = typeof typeDesc === 'object' ? JSON.stringify(typeDesc) : String(typeDesc);
                    return (
                      <tr key={field}>
                        <td className="font-bold text-rose-500">{field}</td>
                        <td className="text-cyan-500">{descStr.split('(')[0].trim()}</td>
                        <td className="text-[var(--text-secondary)]">{descStr}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : viewMode === 'typescript' ? (
              <pre className="m-0">
                <code>{generatedTypeScript}</code>
              </pre>
            ) : viewMode === 'curl' ? (
              <pre className="m-0 text-emerald-400">
                <code>{generatedCurl}</code>
              </pre>
            ) : (
              <pre className="m-0">
                <code>{JSON.stringify(currentPayload, null, 2)}</code>
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
