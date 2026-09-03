'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { ALL_SERVICE_RESPONSES, type ServiceResponseItem } from '@/lib/datasetLoader';
import { fillChaosPayload } from '@/utilities/chaos-data/chaosTemplateFiller';
import { 
  Radio, 
  Search, 
  Copy, 
  CheckCircle2, 
  ExternalLink, 
  Code2, 
  RefreshCw, 
  Sparkles, 
  Flame, 
  Sliders, 
  ShieldAlert,
  Terminal,
  FileJson,
  Plus,
  Trash2,
  Save,
  PenTool,
  SlidersHorizontal,
  Layers,
  ArrowRight
} from 'lucide-react';

interface CustomTemplate {
  id: string;
  name: string;
  category: string;
  rawJson: string;
  createdAt: number;
}

const SAMPLE_USER_JSON = `{
  "user_id": "usr_998877",
  "name": "Jane Developer",
  "email": "jane.dev@startup.io",
  "phone": "+1-555-0199",
  "website_url": "https://developer.io",
  "bio": "Building fast, scalable modern web applications.",
  "account_balance": 1500.50,
  "is_active": true,
  "created_at": "2026-09-03T12:00:00Z"
}`;

const SAMPLE_ORDER_JSON = `{
  "order_id": "ord_884411",
  "customer_name": "Alex Mercer",
  "customer_email": "alex@store.com",
  "shipping_address": "742 Evergreen Terrace, Springfield",
  "shipping_phone": "+1-555-0123",
  "item_count": 3,
  "currency": "USD",
  "total_price": 289.99,
  "order_status": "processing",
  "notes": "Leave at front desk"
}`;

const SAMPLE_WEBHOOK_JSON = `{
  "event_id": "evt_990011",
  "event_type": "payment.succeeded",
  "auth_token": "tok_live_sec_8833992211aa",
  "sender_name": "Stripe Gateway",
  "target_url": "https://api.startup.io/webhooks",
  "amount_paid": 99.00,
  "timestamp": "2026-09-03T18:30:00Z"
}`;

const DEFAULT_CUSTOM_JSON = SAMPLE_USER_JSON;

export function ChaosTemplatesClient() {
  const [selectedServiceId, setSelectedServiceId] = useState<string>(ALL_SERVICE_RESPONSES[0].id);
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeResponseKey, setActiveResponseKey] = useState<string>('');
  const [entropy, setEntropy] = useState<number>(75);
  const [viewMode, setViewMode] = useState<'chaos' | 'clean' | 'typescript' | 'curl' | 'edit_custom'>('chaos');
  const [seed, setSeed] = useState<number>(0);
  const [simulatedStatus, setSimulatedStatus] = useState<number>(200);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Custom User Templates (stored in localStorage)
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([]);
  const [activeCustomId, setActiveCustomId] = useState<string>('');
  const [customTitle, setCustomTitle] = useState<string>('My Webhook Payload');
  const [customRawJson, setCustomRawJson] = useState<string>(DEFAULT_CUSTOM_JSON);
  const [jsonParseError, setJsonParseError] = useState<string | null>(null);

  // Load custom templates on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('devplayground_custom_templates');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCustomTemplates(parsed);
          setActiveCustomId(parsed[0].id);
          setCustomTitle(parsed[0].name);
          setCustomRawJson(parsed[0].rawJson);
        }
      }
    } catch {}
  }, []);

  // Save custom templates
  const saveCustomTemplate = () => {
    try {
      JSON.parse(customRawJson); // validate
      setJsonParseError(null);
      const newTmpl: CustomTemplate = {
        id: activeCustomId || `custom_${Date.now()}`,
        name: customTitle || 'Untitled Custom Template',
        category: 'Custom API',
        rawJson: customRawJson,
        createdAt: Date.now()
      };

      const updated = [newTmpl, ...customTemplates.filter(t => t.id !== newTmpl.id)];
      setCustomTemplates(updated);
      setActiveCustomId(newTmpl.id);
      localStorage.setItem('devplayground_custom_templates', JSON.stringify(updated));
      setViewMode('chaos');
      setCopiedCode('saved');
      setTimeout(() => setCopiedCode(null), 1500);
    } catch (err: any) {
      setJsonParseError(err.message || 'Invalid JSON syntax');
    }
  };

  const deleteCustomTemplate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = customTemplates.filter(t => t.id !== id);
    setCustomTemplates(updated);
    localStorage.setItem('devplayground_custom_templates', JSON.stringify(updated));
    if (activeCustomId === id) {
      if (updated.length > 0) {
        setActiveCustomId(updated[0].id);
        setCustomTitle(updated[0].name);
        setCustomRawJson(updated[0].rawJson);
      } else {
        setIsCustomMode(false);
        setSelectedServiceId(ALL_SERVICE_RESPONSES[0].id);
      }
    }
  };

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

  const categories = [
    { id: 'All', label: 'All 17 Templates' },
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
        !q ||
        svc.service.toLowerCase().includes(q) || 
        svc.provider.toLowerCase().includes(q) ||
        svc.id.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const activeService = useMemo(() => {
    return ALL_SERVICE_RESPONSES.find(s => s.id === selectedServiceId) || ALL_SERVICE_RESPONSES[0];
  }, [selectedServiceId]);

  const responseKeys = useMemo(() => {
    if (!activeService.responses) return [];
    return Object.keys(activeService.responses);
  }, [activeService]);

  const currentResponseKey = activeResponseKey && responseKeys.includes(activeResponseKey) 
    ? activeResponseKey 
    : responseKeys[0] || '';

  const activeResponseObj = activeService.responses?.[currentResponseKey];

  // Clean original payload (built-in service or custom JSON)
  const cleanPayload = useMemo(() => {
    if (isCustomMode) {
      try {
        return JSON.parse(customRawJson);
      } catch {
        return { error: "Invalid Custom JSON syntax" };
      }
    }
    return activeResponseObj?.payload || activeService.payload || { message: "Standard service payload" };
  }, [isCustomMode, customRawJson, activeResponseObj, activeService]);

  // Chaos-filled dirty payload generated by chaos engine
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

  // Active payload depending on mode
  const activeDisplayPayload = viewMode === 'clean' ? cleanPayload : chaosPayload;

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

    const titleStr = isCustomMode ? customTitle : activeService.service;
    const typeName = titleStr.replace(/[^a-zA-Z0-9]/g, '') + 'Fixture';
    const fields = Object.entries(activeDisplayPayload)
      .map(([k, v]) => `  ${k}: ${inferType(v)};`)
      .join('\n');

    return `export interface ${typeName} {\n${fields}\n}\n\n// Chaos-Injected Test Fixture:\nexport const CHAOS_${typeName.toUpperCase()}: ${typeName} = ${JSON.stringify(activeDisplayPayload, null, 2)};`;
  }, [activeDisplayPayload, isCustomMode, customTitle, activeService]);

  // cURL generator
  const generatedCurl = useMemo(() => {
    const endpointUrl = isCustomMode ? 'https://api.myapp.com/v1/webhook' : (activeService.endpoints ? Object.values(activeService.endpoints)[0] : 'https://api.service.com/v1/endpoint');
    return `curl -X POST "${endpointUrl}" \\
  -H "Authorization: Bearer ${(chaosPayload.access_token || 'sample_chaos_token_' + Date.now()).slice(0, 32)}" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(chaosPayload).slice(0, 160)}...'`;
  }, [activeService, chaosPayload, isCustomMode]);

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
      {/* Left Sidebar: Templates & Custom Creator Button */}
      <div className="w-full md:w-80 bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-xl flex flex-col overflow-hidden shrink-0 shadow-sm transition-colors">
        {/* Top Header & Custom Creator Action Button */}
        <div className="p-3 border-b border-[var(--border-dev)] flex flex-col gap-2 bg-[var(--bg-panel-subtle)] shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-500" />
              <span className="text-xs font-bold text-[var(--text-primary)] font-sans uppercase">Chaos Templates</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[var(--pill-bg)] text-rose-500 font-bold">
              17 APIs + Custom
            </span>
          </div>

          {/* Prominent Custom Template Creator Button */}
          <button
            onClick={() => {
              setIsCustomMode(true);
              setViewMode('edit_custom');
              setActiveCustomId('');
              setCustomTitle('New Custom API Schema');
              setCustomRawJson(DEFAULT_CUSTOM_JSON);
            }}
            className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
              isCustomMode
                ? 'bg-rose-500 text-white shadow-rose-500/25 ring-2 ring-rose-500/40'
                : 'bg-[var(--bg-sidebar)] border border-rose-500/40 text-rose-500 hover:bg-rose-500 hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Create Custom Chaos Template</span>
          </button>

          {/* Quick link to Columnar Schema GUI */}
          <Link
            href="/chaos-data"
            className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center justify-between px-1 transition-colors"
          >
            <span>Need Columnar Tables GUI?</span>
            <span className="text-cyan-500 flex items-center gap-0.5">
              <span>Schema Studio</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </Link>

          <div className="flex items-center gap-2 pt-1">
            <Search className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search templates (Google, Stripe...)"
              className="dev-input flex-1 px-2 py-1 rounded text-xs"
            />
          </div>
        </div>

        {/* Templates List */}
        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1.5">
          {/* Custom Templates Section */}
          {customTemplates.length > 0 && (
            <div className="mb-2 pb-2 border-b border-[var(--border-dev-subtle)]">
              <div className="text-[10px] text-rose-500 font-bold px-2 py-1 uppercase tracking-wider flex items-center justify-between">
                <span>My Custom Schemas ({customTemplates.length})</span>
              </div>
              {customTemplates.map(tmpl => {
                const isSelected = isCustomMode && activeCustomId === tmpl.id;
                return (
                  <div
                    key={tmpl.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setIsCustomMode(true);
                      setActiveCustomId(tmpl.id);
                      setCustomTitle(tmpl.name);
                      setCustomRawJson(tmpl.rawJson);
                      setViewMode('chaos');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setIsCustomMode(true);
                        setActiveCustomId(tmpl.id);
                        setCustomTitle(tmpl.name);
                        setCustomRawJson(tmpl.rawJson);
                        setViewMode('chaos');
                      }
                    }}
                    className={`w-full text-left p-2 rounded-lg border transition-all flex items-center justify-between gap-1 cursor-pointer my-0.5 select-none ${
                      isSelected 
                        ? 'bg-[var(--bg-sidebar)] border-rose-500 shadow-sm' 
                        : 'border-transparent hover:bg-[var(--bg-sidebar)]/60 text-[var(--text-secondary)]'
                    }`}
                  >
                    <div className="truncate">
                      <div className={`text-xs font-bold truncate ${isSelected ? 'text-rose-500' : 'text-[var(--text-primary)]'}`}>
                        {tmpl.name}
                      </div>
                      <div className="text-[9px] text-[var(--text-muted)]">Custom Schema</div>
                    </div>
                    <button
                      onClick={(e) => deleteCustomTemplate(tmpl.id, e)}
                      title="Delete template"
                      className="p-1 rounded text-[var(--text-muted)] hover:text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Built-in 17 Service Templates */}
          <div className="text-[10px] text-[var(--text-muted)] font-bold px-2 py-0.5 uppercase tracking-wider">
            <span>Production API Standards</span>
          </div>

          {filteredServices.map(svc => {
            const isSelected = !isCustomMode && svc.id === selectedServiceId;
            return (
              <button
                key={svc.id}
                onClick={() => {
                  setIsCustomMode(false);
                  setSelectedServiceId(svc.id);
                  setActiveResponseKey('');
                  setSimulatedStatus(200);
                  if (viewMode === 'edit_custom') setViewMode('chaos');
                }}
                className={`w-full text-left p-2.5 rounded-lg border transition-all flex flex-col gap-1 cursor-pointer ${
                  isSelected 
                    ? 'bg-[var(--bg-sidebar)] border-rose-500 shadow-sm' 
                    : 'border-transparent hover:bg-[var(--bg-sidebar)]/60 text-[var(--text-secondary)]'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-xs font-bold font-sans truncate ${isSelected ? 'text-rose-500' : 'text-[var(--text-primary)]'}`}>
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
      </div>

      {/* Main Workbench */}
      <div className="flex-1 flex flex-col gap-3 min-w-0 overflow-hidden">
        {/* Top Control Bar */}
        <div className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-xl p-4 shrink-0 shadow-sm transition-colors flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border-dev)]">
            <div>
              {isCustomMode ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customTitle}
                    onChange={e => setCustomTitle(e.target.value)}
                    placeholder="Enter template name..."
                    className="text-base font-bold text-[var(--text-primary)] font-sans bg-transparent border-b border-dashed border-rose-500 outline-none pb-0.5"
                  />
                  <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-rose-500/15 text-rose-500 border border-rose-500/30">
                    Custom Template Creator
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <h2 className="text-base font-bold text-[var(--text-primary)] font-sans">
                    {activeService.service}
                  </h2>
                  <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-[var(--pill-bg)] border border-[var(--border-dev)] text-[var(--text-muted)]">
                    {activeService.provider}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-rose-500/15 text-rose-500 border border-rose-500/30">
                    Chaos Injected
                  </span>
                </div>
              )}

              <div className="text-xs text-[var(--text-secondary)] font-sans mt-0.5">
                {isCustomMode 
                  ? 'Paste any JSON schema below. The engine will infer fields and inject high-entropy chaos edge cases.'
                  : (activeResponseObj?.description || activeService.description || 'Production API response filled with high-entropy edge case test values.')}
              </div>
            </div>

            {/* Actions: Save / Re-roll */}
            <div className="flex items-center gap-2">
              {isCustomMode && (
                <button
                  onClick={saveCustomTemplate}
                  className="px-3 py-1 text-xs font-bold rounded bg-emerald-500 text-white hover:bg-emerald-600 flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{copiedCode === 'saved' ? 'Saved!' : 'Save Template'}</span>
                </button>
              )}

              <button
                onClick={() => setSeed(s => s + 1)}
                className="px-3 py-1 text-xs font-bold rounded bg-rose-500 text-white hover:bg-rose-600 flex items-center gap-1.5 transition-colors shadow-sm shadow-rose-500/20 cursor-pointer"
                title="Re-roll chaos values (Hotkey: [R])"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-roll (R)</span>
              </button>
            </div>
          </div>

          {/* Sliders & Mode Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              {/* Chaos Entropy Slider */}
              <div className="flex items-center gap-1.5 bg-[var(--bg-sidebar)] px-2.5 py-1 rounded border border-[var(--border-dev)]">
                <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                  <Flame className="w-3 h-3 text-rose-500" />
                  <span>CHAOS ENTROPY:</span>
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={entropy}
                  onChange={e => setEntropy(Number(e.target.value))}
                  className="w-20 accent-rose-500 cursor-pointer h-1"
                />
                <span className="text-[10px] font-bold text-rose-500 w-8 text-right">{entropy}%</span>
              </div>

              {/* Status Code Simulator */}
              <div className="flex items-center gap-1 bg-[var(--bg-sidebar)] p-0.5 rounded border border-[var(--border-dev)]">
                <span className="text-[10px] text-[var(--text-muted)] px-1.5">STATUS:</span>
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
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-[var(--bg-sidebar)] p-0.5 rounded border border-[var(--border-dev)]">
                {isCustomMode && (
                  <button
                    onClick={() => setViewMode('edit_custom')}
                    className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
                      viewMode === 'edit_custom'
                        ? 'bg-rose-500 text-white font-bold'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    ✏️ Edit Schema
                  </button>
                )}

                {(['chaos', 'clean', 'typescript', 'curl'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-2 py-0.5 rounded text-[11px] uppercase transition-colors cursor-pointer ${
                      viewMode === mode
                        ? 'bg-black/15 dark:bg-white/15 text-rose-500 font-bold'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
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
                className="px-2.5 py-1 text-xs font-semibold rounded bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-[var(--text-primary)] hover:border-rose-500 flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedCode === 'main-copy' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-rose-500" />}
                <span>{copiedCode === 'main-copy' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Editor or Viewer Body */}
        <div className="flex-1 min-h-0 bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-xl overflow-hidden flex flex-col shadow-sm">
          {viewMode === 'edit_custom' ? (
            <div className="flex-1 flex flex-col p-4 bg-[var(--bg-codebox)] gap-3 overflow-y-auto">
              {/* Intuitive 3-Step Instruction Card */}
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-3 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-rose-500" />
                    <span className="text-xs font-bold text-rose-500 font-sans uppercase">
                      How Custom Chaos Blueprints Work
                    </span>
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono">
                    3 Simple Steps
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] text-[var(--text-code)] font-sans">
                  <div className="bg-black/30 p-2.5 rounded border border-white/10 flex flex-col gap-1">
                    <strong className="text-amber-400 font-mono text-xs">1. Paste Clean JSON</strong>
                    <span className="text-[10px] text-slate-300 leading-snug">
                      Write or paste your normal API response structure, or click a sample preset below.
                    </span>
                  </div>

                  <div className="bg-black/30 p-2.5 rounded border border-white/10 flex flex-col gap-1">
                    <strong className="text-cyan-400 font-mono text-xs">2. Auto-Detect Keys</strong>
                    <span className="text-[10px] text-slate-300 leading-snug">
                      Keys like <code className="text-rose-400">email</code>, <code className="text-rose-400">name</code>, <code className="text-rose-400">price</code>, <code className="text-rose-400">phone</code>, <code className="text-rose-400">url</code>, <code className="text-rose-400">token</code> are automatically matched.
                    </span>
                  </div>

                  <div className="bg-black/30 p-2.5 rounded border border-white/10 flex flex-col gap-1">
                    <strong className="text-emerald-400 font-mono text-xs">3. Test & Export</strong>
                    <span className="text-[10px] text-slate-300 leading-snug">
                      Click <strong>Preview Chaos Payload</strong> to slide entropy (0–100%), re-roll permutations (<kbd className="bg-white/10 px-1 rounded">R</kbd>), or export TypeScript types.
                    </span>
                  </div>
                </div>

                {/* Instant Sample Presets */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-rose-500/20">
                  <span className="text-[10px] text-[var(--text-muted)] font-bold font-mono mr-1">LOAD QUICK SAMPLE:</span>
                  <button
                    onClick={() => {
                      setCustomRawJson(SAMPLE_USER_JSON);
                      setCustomTitle('User Profile API');
                      setJsonParseError(null);
                    }}
                    className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono border border-white/15 cursor-pointer transition-colors"
                  >
                    👤 User Profile
                  </button>
                  <button
                    onClick={() => {
                      setCustomRawJson(SAMPLE_ORDER_JSON);
                      setCustomTitle('E-Commerce Order API');
                      setJsonParseError(null);
                    }}
                    className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono border border-white/15 cursor-pointer transition-colors"
                  >
                    🛒 E-Commerce Order
                  </button>
                  <button
                    onClick={() => {
                      setCustomRawJson(SAMPLE_WEBHOOK_JSON);
                      setCustomTitle('Payment Webhook API');
                      setJsonParseError(null);
                    }}
                    className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono border border-white/15 cursor-pointer transition-colors"
                  >
                    ⚡ Payment Webhook
                  </button>
                </div>
              </div>

              {/* JSON Blueprint Editor */}
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pb-1 border-b border-[var(--border-dev)] shrink-0">
                <span className="font-mono text-[11px] text-slate-300 font-bold">JSON Blueprint Code:</span>
                {jsonParseError && <span className="text-rose-400 font-bold font-mono text-[11px]">{jsonParseError}</span>}
              </div>

              <textarea
                value={customRawJson}
                onChange={e => {
                  setCustomRawJson(e.target.value);
                  try {
                    JSON.parse(e.target.value);
                    setJsonParseError(null);
                  } catch (err: any) {
                    setJsonParseError(err.message);
                  }
                }}
                className="flex-1 w-full min-h-[220px] bg-black/20 p-3 rounded-lg border border-white/10 outline-none font-mono text-xs text-[var(--text-code)] resize-none leading-relaxed focus:border-rose-500"
                placeholder="Paste your clean JSON response schema here..."
                spellCheck={false}
              />

              <div className="flex items-center justify-between pt-2 border-t border-[var(--border-dev)] shrink-0">
                <span className="text-[10px] text-[var(--text-muted)] font-mono">
                  Press <strong className="text-emerald-400">Save Template</strong> in the top bar to keep it across sessions.
                </span>
                <button
                  onClick={() => setViewMode('chaos')}
                  className="px-4 py-2 rounded-lg bg-rose-500 text-white text-xs font-bold hover:bg-rose-600 transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-rose-500/20"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Preview Chaos Payload</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="px-4 py-2 border-b border-[var(--border-dev)] flex items-center justify-between text-xs bg-[var(--bg-panel-subtle)] shrink-0">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusColor(simulatedStatus)}`}>
                    HTTP {simulatedStatus} {simulatedStatus === 200 ? 'OK' : simulatedStatus === 429 ? 'Rate Limited' : 'Error'}
                  </span>
                  <span className="text-[var(--text-muted)] text-[11px]">
                    mode: <strong className="text-rose-500">{viewMode}</strong>
                  </span>
                </div>

                <div className="text-[11px] text-[var(--text-muted)]" suppressHydrationWarning>
                  size: <strong className="text-cyan-500" suppressHydrationWarning>{(new TextEncoder().encode(JSON.stringify(activeDisplayPayload)).length / 1024).toFixed(1)} KB</strong>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-4 bg-[var(--bg-codebox)] font-mono text-xs leading-relaxed text-[var(--text-code)]">
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
