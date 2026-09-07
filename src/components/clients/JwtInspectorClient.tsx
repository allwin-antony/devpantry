'use client';

import React, { useState, useEffect, useMemo, useCallback, useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};
function useIsClient(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
import {
  Key,
  ShieldCheck,
  ShieldAlert,
  Copy,
  Check,
  Flame,
  RefreshCw,
  Trash2,
  Clock,
  Unlock,
  Sliders,
  Sparkles,
  Terminal,
  Code2,
  FileText,
  AlertTriangle,
  Zap,
  Plus,
  Lock,
  Info,
  X,
  ChevronDown,
} from 'lucide-react';
import { parseJwt, buildCompactJwt } from '@/lib/jwt/codec';
import { ParsedJwt } from '@/lib/jwt/types';
import {
  expireTokenNow,
  expireTokenSoon,
  renewTokenValid,
  injectClockSkewFuture,
  simulateAlgNone,
  corruptSignature,
  stripClaim,
  injectBlnsClaim,
  swapAlgorithmToHs256,
  setCustomClaim,
  CHAOS_EXPLOIT_HINTS,
  ChaosExploitHint,
} from '@/lib/jwt/chaos';
import { signHmac, verifyHmac, generateTestRsaKeyPair, signRsa, SupportedHmacAlg } from '@/lib/jwt/crypto';
import { getJwtPresets } from '@/lib/jwt/presets';

function formatDeterministicTime(sec: number | undefined): string {
  if (!sec) return 'N/A';
  const d = new Date(sec * 1000);
  const hours = String(d.getUTCHours()).padStart(2, '0');
  const mins = String(d.getUTCMinutes()).padStart(2, '0');
  const secs = String(d.getUTCSeconds()).padStart(2, '0');
  return `${hours}:${mins}:${secs} UTC`;
}

export const JwtInspectorClient: React.FC = () => {
  const presets = useMemo(() => getJwtPresets(), []);
  
  // 100% in-memory state — never stored in localStorage (safe for production tokens)
  const [rawToken, setRawToken] = useState<string>(presets[0].token);
  const [activeTab, setActiveTab] = useState<'claims' | 'json' | 'crypto' | 'export'>('claims');
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  
  // Client mount check to safely eliminate hydration mismatches
  const mounted = useIsClient();

  // Expanded claims tracking for in-place accordion hints (default 'exp' open)
  const [expandedClaimKeys, setExpandedClaimKeys] = useState<Record<string, boolean>>({ exp: true });
  const [activeChaosHint, setActiveChaosHint] = useState<ChaosExploitHint | null>(null);
  const [activePartHint, setActivePartHint] = useState<'header' | 'payload' | 'signature' | null>(null);

  // JSON Editor strings for two-way synchronization
  const [headerJsonDraft, setHeaderJsonDraft] = useState<string | null>(null);
  const [payloadJsonDraft, setPayloadJsonDraft] = useState<string | null>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);

  // New claim modal state
  const [isAddingClaim, setIsAddingClaim] = useState<boolean>(false);
  const [newClaimKey, setNewClaimKey] = useState<string>('');
  const [newClaimValue, setNewClaimValue] = useState<string>('');

  // WebCrypto signing & verification state
  const [hmacSecret, setHmacSecret] = useState<string>(presets[0].sampleSecret || 'secret-key-123');
  const [cryptoAlg, setCryptoAlg] = useState<SupportedHmacAlg>('HS256');
  const [verifyResult, setVerifyResult] = useState<{ isValid: boolean; message: string } | null>(null);
  const [isSigning, setIsSigning] = useState<boolean>(false);
  const [rsaStatus, setRsaStatus] = useState<string | null>(null);

  // Parse the current raw token
  const parsed: ParsedJwt = useMemo(() => {
    return parseJwt(rawToken);
  }, [rawToken]);

  // Derived JSON editor strings
  const headerJsonStr = headerJsonDraft !== null 
    ? headerJsonDraft 
    : (parsed.isValidStructure ? JSON.stringify(parsed.header, null, 2) : '');

  const payloadJsonStr = payloadJsonDraft !== null 
    ? payloadJsonDraft 
    : (parsed.isValidStructure ? JSON.stringify(parsed.payload, null, 2) : '');

  // Live timer tick for seconds countdown
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setTick(t => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const triggerCopy = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(label);
    setTimeout(() => setCopyFeedback(null), 2000);
  }, []);

  // Handle manual edits to Header JSON
  const handleHeaderJsonChange = (newStr: string) => {
    setHeaderJsonDraft(newStr);
    try {
      const parsedHeader = JSON.parse(newStr);
      setJsonError(null);
      const updated = buildCompactJwt(parsedHeader, parsed.payload, parsed.signatureB64);
      setRawToken(updated);
      setHeaderJsonDraft(null);
    } catch {
      setJsonError('Header syntax error: Invalid JSON');
    }
  };

  // Handle manual edits to Payload JSON
  const handlePayloadJsonChange = (newStr: string) => {
    setPayloadJsonDraft(newStr);
    try {
      const parsedPayload = JSON.parse(newStr);
      setJsonError(null);
      const updated = buildCompactJwt(parsed.header, parsedPayload, parsed.signatureB64);
      setRawToken(updated);
      setPayloadJsonDraft(null);
    } catch {
      setJsonError('Payload syntax error: Invalid JSON');
    }
  };

  // Load a preset
  const handleSelectPreset = (presetId: string) => {
    const p = presets.find(item => item.id === presetId);
    if (p) {
      setRawToken(p.token);
      if (p.sampleSecret) {
        setHmacSecret(p.sampleSecret);
      }
      setVerifyResult(null);
      setRsaStatus(null);
      setActiveChaosHint(null);
      setExpandedClaimKeys({ exp: true });
    }
  };

  // Chaos Mutations with auto-activated Hint
  const runChaosMutation = (action: () => string, label: string, hintId?: string) => {
    const updated = action();
    setRawToken(updated);
    setVerifyResult(null);
    triggerCopy(updated, `⚡ ${label}`);
    if (hintId && CHAOS_EXPLOIT_HINTS[hintId]) {
      setActiveChaosHint(CHAOS_EXPLOIT_HINTS[hintId]);
    }
  };

  // Toggle in-place claim expansion
  const toggleClaimExpansion = (key: string) => {
    setExpandedClaimKeys(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Add custom claim
  const handleAddCustomClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClaimKey.trim()) return;

    let finalVal: unknown = newClaimValue;
    try {
      finalVal = JSON.parse(newClaimValue);
    } catch {
      // String fallback
    }

    const updated = setCustomClaim(parsed, newClaimKey.trim(), finalVal);
    setRawToken(updated);
    setExpandedClaimKeys(prev => ({ ...prev, [newClaimKey.trim()]: true }));
    setNewClaimKey('');
    setNewClaimValue('');
    setIsAddingClaim(false);
    triggerCopy(updated, `Added claim: ${newClaimKey}`);
  };

  // Delete claim
  const handleDeleteClaim = (claimKey: string) => {
    const updated = stripClaim(parsed, claimKey);
    setRawToken(updated);
    triggerCopy(updated, `Stripped claim: ${claimKey}`);
  };

  // Cryptographic Verification
  const handleVerifyHmac = async () => {
    const res = await verifyHmac(rawToken, hmacSecret, cryptoAlg);
    setVerifyResult(res);
  };

  // Cryptographic Signing
  const handleSignHmac = async () => {
    setIsSigning(true);
    try {
      const res = await signHmac(parsed.header, parsed.payload, hmacSecret, cryptoAlg);
      setRawToken(res.compactToken);
      setVerifyResult({
        isValid: true,
        message: `✅ Freshly signed with ${cryptoAlg} via browser WebCrypto!`,
      });
      triggerCopy(res.compactToken, 'Token Signed & Copied');
    } catch (err: unknown) {
      setVerifyResult({
        isValid: false,
        message: `Sign error: ${err instanceof Error ? err.message : 'Failed to sign'}`,
      });
    } finally {
      setIsSigning(false);
    }
  };

  // Ephemeral RSA Test Key Signing
  const handleGenerateRsaAndSign = async () => {
    setIsSigning(true);
    try {
      setRsaStatus('Generating RSA-2048 key pair in browser WebCrypto...');
      const { keyPair } = await generateTestRsaKeyPair();
      setRsaStatus('Signing with newly generated ephemeral RSA private key...');
      const res = await signRsa(parsed.header, parsed.payload, keyPair.privateKey);
      setRawToken(res.compactToken);
      setRsaStatus('✅ Signed with RS256! (Client-Side RSA-2048 generated)');
      triggerCopy(res.compactToken, 'RS256 Token Signed & Copied');
    } catch (err: unknown) {
      setRsaStatus(`RSA Error: ${err instanceof Error ? err.message : 'Failed'}`);
    } finally {
      setIsSigning(false);
    }
  };

  // Formatted TypeScript interface for the payload
  const typeScriptDefinition = useMemo(() => {
    if (!parsed.isValidStructure) return '// Valid token required';
    const lines = ['export interface DecodedJwtPayload {'];
    for (const [k, v] of Object.entries(parsed.payload)) {
      const t = typeof v;
      if (Array.isArray(v)) {
        lines.push(`  ${k}: string[];`);
      } else if (t === 'object' && v !== null) {
        lines.push(`  ${k}: Record<string, unknown>;`);
      } else {
        lines.push(`  ${k}: ${t};`);
      }
    }
    lines.push('}');
    return lines.join('\n');
  }, [parsed]);

  return (
    <div className="w-full min-h-[calc(100vh-3rem)] bg-[var(--bg-app)] text-[var(--text-primary)] flex flex-col font-sans transition-colors">
      
      {/* 1. Studio Top Command Bar */}
      <div className="bg-[var(--bg-panel)] border-b border-[var(--border-dev)] px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0 z-20">
        
        {/* Left: Security Sandbox Guarantee Badge */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% IN-MEMORY SANDBOX
          </div>
          <span className="text-[var(--text-muted)] hidden sm:inline">•</span>
          <span className="text-[var(--text-secondary)] hidden sm:inline text-[11px]">
            Zero network requests. Safe for enterprise &amp; production tokens.
          </span>
        </div>

        {/* Center: Presets Quick Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[11px] font-mono text-[var(--text-muted)] flex items-center gap-1 mr-1">
            <Key className="w-3 h-3 text-rose-500" /> Presets:
          </span>
          {presets.map(p => (
            <button
              key={p.id}
              onClick={() => handleSelectPreset(p.id)}
              className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-[var(--bg-sidebar)] hover:bg-[var(--pill-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-dev)] hover:border-rose-500/40 transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Right: Quick Action Buttons & Feedback */}
        <div className="flex items-center gap-2">
          {copyFeedback && (
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-[11px] font-mono flex items-center gap-1 animate-fade-in">
              <Check className="w-3 h-3" /> {copyFeedback}
            </span>
          )}
          <button
            onClick={() => {
              setRawToken('');
              setVerifyResult(null);
              setRsaStatus(null);
              setActiveChaosHint(null);
              setExpandedClaimKeys({});
            }}
            className="px-2.5 py-1 rounded-md bg-[var(--bg-sidebar)] hover:bg-rose-500/20 text-[var(--text-secondary)] hover:text-rose-600 dark:hover:text-rose-400 border border-[var(--border-dev)] hover:border-rose-500/30 transition-colors flex items-center gap-1 cursor-pointer font-mono text-[11px]"
            title="Purge token from browser memory"
          >
            <Trash2 className="w-3 h-3" /> Clear
          </button>
        </div>
      </div>

      {/* 2. Main Studio Workspace (2 Columns) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-y-auto lg:overflow-hidden">
        
        {/* ============================================================ */}
        {/* LEFT COLUMN: Visual Token Terminal & Expiry Radar (5 Cols)   */}
        {/* ============================================================ */}
        <div className="lg:col-span-5 border-r border-[var(--border-dev)] flex flex-col bg-[var(--bg-panel)] overflow-y-auto p-4 gap-4">
          
          {/* Card 1: Encoded Token (Compact JWT) */}
          <div className="rounded-xl border border-[var(--border-dev)] bg-[var(--bg-panel-subtle)] p-3.5 flex flex-col gap-2.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                <Code2 className="w-4 h-4 text-rose-500" />
                Encoded Token (Compact)
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--text-muted)]">
                <span>{rawToken.trim().length} bytes</span>
                <button
                  onClick={() => triggerCopy(rawToken, 'Raw Token Copied')}
                  className="p-1 rounded hover:bg-[var(--pill-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                  title="Copy Raw Token"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Textarea */}
            <textarea
              value={rawToken}
              onChange={e => setRawToken(e.target.value)}
              placeholder="Paste JWT here (header.payload.signature)..."
              rows={4}
              className="w-full p-2.5 rounded-lg bg-[var(--bg-app)] border border-[var(--border-dev)] text-[var(--text-primary)] font-mono text-xs focus:outline-none focus:border-rose-500/80 resize-none transition-colors leading-relaxed selection:bg-rose-500/30"
              spellCheck={false}
            />

            {/* 3-Part Token Anatomy Rows (Subtle, professional, non-distracting) */}
            {parsed.isValidStructure ? (
              <div className="flex flex-col gap-2 pt-1 border-t border-[var(--border-dev)]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider">
                    Token Segments (Click to inspect):
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-1.5 text-xs font-mono">
                  
                  {/* Header Part */}
                  <div
                    onClick={() => setActivePartHint(activePartHint === 'header' ? null : 'header')}
                    className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-2 bg-[var(--bg-panel)] ${
                      activePartHint === 'header'
                        ? 'border-rose-500/60 shadow-xs'
                        : 'border-[var(--border-dev)] hover:border-rose-500/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                      <span className="font-bold text-[var(--text-primary)] shrink-0">Header:</span>
                      <span className="truncate text-[var(--text-secondary)] text-[11px]" title={parsed.headerB64}>
                        {parsed.headerB64}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="px-1.5 py-0.2 rounded bg-[var(--pill-bg)] text-[var(--text-primary)] text-[10px] font-bold border border-[var(--border-dev)]">
                        {parsed.header.alg}
                      </span>
                      <span className="text-[10px] text-rose-500">Hint</span>
                    </div>
                  </div>

                  {/* Header Hint Drawer */}
                  {activePartHint === 'header' && (
                    <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-slate-100 flex flex-col gap-1.5 animate-fade-in shadow-xs">
                      <div className="font-bold flex items-center gap-1 text-rose-700 dark:text-rose-400">
                        <Info className="w-3.5 h-3.5" /> Header Segment (JOSE Header):
                      </div>
                      <p className="text-[11px] leading-relaxed text-slate-800 dark:text-slate-300">
                        Base64URL-encoded JSON specifying the cryptographic signing algorithm (<code>alg: &quot;{parsed.header.alg}&quot;</code>) and token format (<code>typ: &quot;{parsed.header.typ || 'JWT'}&quot;</code>). Key ID hint (<code>kid</code>) is optional for JWKS matching.
                      </p>
                    </div>
                  )}

                  {/* Payload Part */}
                  <div
                    onClick={() => setActivePartHint(activePartHint === 'payload' ? null : 'payload')}
                    className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-2 bg-[var(--bg-panel)] ${
                      activePartHint === 'payload'
                        ? 'border-purple-500/60 shadow-xs'
                        : 'border-[var(--border-dev)] hover:border-purple-500/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                      <span className="font-bold text-[var(--text-primary)] shrink-0">Payload:</span>
                      <span className="truncate text-[var(--text-secondary)] text-[11px]" title={parsed.payloadB64}>
                        {parsed.payloadB64}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="px-1.5 py-0.2 rounded bg-[var(--pill-bg)] text-[var(--text-primary)] text-[10px] font-bold border border-[var(--border-dev)]">
                        {parsed.diagnostics.length} claims
                      </span>
                      <span className="text-[10px] text-purple-500">Hint</span>
                    </div>
                  </div>

                  {/* Payload Hint Drawer */}
                  {activePartHint === 'payload' && (
                    <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-slate-100 flex flex-col gap-1.5 animate-fade-in shadow-xs">
                      <div className="font-bold flex items-center gap-1 text-purple-700 dark:text-purple-400">
                        <Info className="w-3.5 h-3.5" /> Payload Segment (JWT Claims):
                      </div>
                      <p className="text-[11px] leading-relaxed text-slate-800 dark:text-slate-300">
                        Base64URL-encoded claims containing identity assertions (<code>sub</code>, <code>email</code>, <code>roles</code>) and timestamps (<code>exp</code>, <code>iat</code>, <code>nbf</code>). Anyone with access to the token can decode and read this data without a key. Never store raw passwords or sensitive PII here!
                      </p>
                    </div>
                  )}

                  {/* Signature Part */}
                  <div
                    onClick={() => setActivePartHint(activePartHint === 'signature' ? null : 'signature')}
                    className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-2 bg-[var(--bg-panel)] ${
                      activePartHint === 'signature'
                        ? 'border-cyan-500/60 shadow-xs'
                        : 'border-[var(--border-dev)] hover:border-cyan-500/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-cyan-500 shrink-0" />
                      <span className="font-bold text-[var(--text-primary)] shrink-0">Signature:</span>
                      <span className="truncate text-[var(--text-secondary)] text-[11px]" title={parsed.signatureB64 || '(none)'}>
                        {parsed.signatureB64 || '(unsigned / signature stripped)'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                          parsed.hasSignature
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                            : 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
                        }`}
                      >
                        {parsed.hasSignature ? 'Present' : 'None'}
                      </span>
                      <span className="text-[10px] text-cyan-600 dark:text-cyan-400">Hint</span>
                    </div>
                  </div>

                  {/* Signature Hint Drawer */}
                  {activePartHint === 'signature' && (
                    <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-slate-100 flex flex-col gap-1.5 animate-fade-in shadow-xs">
                      <div className="font-bold flex items-center gap-1 text-cyan-700 dark:text-cyan-400">
                        <Info className="w-3.5 h-3.5" /> Signature Segment:
                      </div>
                      <p className="text-[11px] leading-relaxed text-slate-800 dark:text-slate-300">
                        Cryptographic signature generated by computing <code>algorithm(base64Url(header) + &quot;.&quot; + base64Url(payload), secretKey)</code>. Guarantees that neither the header nor payload was tampered with in transit.
                      </p>
                    </div>
                  )}

                </div>
              </div>
            ) : (
              parsed.error && (
                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-mono flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Format Error:</div>
                    <div className="text-[11px] opacity-90">{parsed.error}</div>
                  </div>
                </div>
              )
            )}
          </div>

          {/* Card 2: Live Expiry Radar & Timeline */}
          <div className="rounded-xl border border-[var(--border-dev)] bg-[var(--bg-panel-subtle)] p-3.5 flex flex-col gap-3 shadow-2xs">
            
            {/* Status Radar Header */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-rose-500" />
                Live Status Radar
              </span>

              {parsed.status === 'valid' && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <Check className="w-3 h-3" /> ACTIVE &amp; VALID
                </span>
              )}
              {parsed.status === 'expired' && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> EXPIRED TOKEN
                </span>
              )}
              {parsed.status === 'premature' && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> NOT YET VALID (nbf)
                </span>
              )}
              {parsed.status === 'alg_none' && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-purple-500/15 text-purple-700 dark:text-purple-400 border border-purple-500/30 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" /> ALG: NONE (EXPLOIT)
                </span>
              )}
              {parsed.status === 'malformed' && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono text-[var(--text-muted)] border border-[var(--border-dev)]">
                  WAITING FOR INPUT
                </span>
              )}
            </div>

            {/* Main Status Message */}
            <div className="p-2.5 rounded-lg bg-[var(--bg-panel)] border border-[var(--border-dev)] font-mono text-xs font-semibold text-[var(--text-primary)]">
              {parsed.statusMessage}
            </div>

            {/* Lifetime Timeline Gauge */}
            {parsed.secondsRemaining !== null && (
              <div className="flex flex-col gap-2 p-2.5 rounded-lg bg-[var(--bg-panel)] border border-[var(--border-dev)] font-mono">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[var(--text-secondary)]">Lifetime Countdown:</span>
                  <span
                    className={`font-bold ${
                      parsed.secondsRemaining > 0
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : 'text-rose-700 dark:text-rose-400'
                    }`}
                  >
                    {parsed.secondsRemaining > 0
                      ? `${Math.floor(parsed.secondsRemaining / 60)}m ${parsed.secondsRemaining % 60}s remaining`
                      : 'Expired'}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2.5 rounded-full bg-[var(--border-dev)] overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${
                      parsed.secondsRemaining <= 0
                        ? 'bg-rose-500'
                        : parsed.secondsRemaining < 60
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.max(0, Math.min(100, parsed.percentRemaining ?? 0))}%` }}
                  />
                </div>

                {/* Issued / Expiry timestamps (Hydration-Safe Deterministic Formatting) */}
                <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] pt-1">
                  <span>
                    iat: {mounted ? formatDeterministicTime(parsed.payload.iat) : 'N/A'}
                  </span>
                  <span>
                    exp: {mounted ? formatDeterministicTime(parsed.payload.exp) : 'N/A'}
                  </span>
                </div>
              </div>
            )}

            {/* Standard Claims Metadata Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
              <div
                onClick={() => toggleClaimExpansion('iss')}
                className="p-2 rounded bg-[var(--bg-panel)] border border-[var(--border-dev)] hover:border-rose-500/40 transition-colors cursor-pointer"
              >
                <div className="text-[10px] text-[var(--text-muted)] uppercase flex items-center justify-between">
                  <span>Issuer (iss)</span>
                  <span className="text-rose-600 dark:text-rose-400 text-[9px]">Hint</span>
                </div>
                <div className="font-bold truncate text-[var(--text-primary)]" title={String(parsed.payload.iss || 'None')}>
                  {parsed.payload.iss ? String(parsed.payload.iss) : 'None'}
                </div>
              </div>

              <div
                onClick={() => toggleClaimExpansion('sub')}
                className="p-2 rounded bg-[var(--bg-panel)] border border-[var(--border-dev)] hover:border-rose-500/40 transition-colors cursor-pointer"
              >
                <div className="text-[10px] text-[var(--text-muted)] uppercase flex items-center justify-between">
                  <span>Subject (sub)</span>
                  <span className="text-rose-600 dark:text-rose-400 text-[9px]">Hint</span>
                </div>
                <div className="font-bold truncate text-[var(--text-primary)]" title={String(parsed.payload.sub || 'None')}>
                  {parsed.payload.sub ? String(parsed.payload.sub) : 'None'}
                </div>
              </div>

              <div
                onClick={() => toggleClaimExpansion('aud')}
                className="p-2 rounded bg-[var(--bg-panel)] border border-[var(--border-dev)] hover:border-rose-500/40 transition-colors cursor-pointer"
              >
                <div className="text-[10px] text-[var(--text-muted)] uppercase flex items-center justify-between">
                  <span>Audience (aud)</span>
                  <span className="text-rose-600 dark:text-rose-400 text-[9px]">Hint</span>
                </div>
                <div className="font-bold truncate text-[var(--text-primary)]" title={String(parsed.payload.aud || 'None')}>
                  {parsed.payload.aud ? String(parsed.payload.aud) : 'None'}
                </div>
              </div>

              <div
                onClick={() => toggleClaimExpansion('exp')}
                className="p-2 rounded bg-[var(--bg-panel)] border border-[var(--border-dev)] hover:border-rose-500/40 transition-colors cursor-pointer"
              >
                <div className="text-[10px] text-[var(--text-muted)] uppercase flex items-center justify-between">
                  <span>Algorithm (alg)</span>
                  <span className="text-rose-600 dark:text-rose-400 text-[9px]">Hint</span>
                </div>
                <div className="font-bold text-rose-600 dark:text-rose-400">
                  {parsed.header.alg || 'N/A'}
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: Pinned Chaos Deck & Workspace Tabs (7 Cols)   */}
        {/* ============================================================ */}
        <div className="lg:col-span-7 flex flex-col bg-[var(--bg-panel-subtle)] overflow-y-auto">
          
          {/* 🔥 1. PINNED TOP: Chaos Mutations Deck (Clean, Professional, Non-Rainbow) */}
          <div className="p-4 border-b border-[var(--border-dev)] bg-[var(--bg-panel)] flex flex-col gap-3 sticky top-0 z-10 shadow-xs">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                <Flame className="w-4 h-4 text-rose-500" />
                Chaos Mutations &mdash; Negative Path Simulator
              </div>
              <span className="text-[11px] font-mono text-[var(--text-muted)]">
                Click any action to apply &amp; view hint
              </span>
            </div>

            {/* Unified, sleek, professional action buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              
              {/* Expire Now */}
              <button
                onClick={() => runChaosMutation(() => expireTokenNow(parsed, 300), 'Expired (-5m)', 'expire_now')}
                className="p-2 rounded-lg bg-[var(--bg-sidebar)] hover:bg-[var(--pill-bg)] text-[var(--text-primary)] border border-[var(--border-dev)] hover:border-rose-500/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer font-medium"
              >
                <Clock className="w-3.5 h-3.5 text-rose-500 shrink-0" /> Expire (-5m)
              </button>

              {/* Race Condition (10s) */}
              <button
                onClick={() => runChaosMutation(() => expireTokenSoon(parsed, 10), 'Expiring in 10s', 'race_expire')}
                className="p-2 rounded-lg bg-[var(--bg-sidebar)] hover:bg-[var(--pill-bg)] text-[var(--text-primary)] border border-[var(--border-dev)] hover:border-amber-500/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer font-medium"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Race (10s)
              </button>

              {/* Clock Skew */}
              <button
                onClick={() => runChaosMutation(() => injectClockSkewFuture(parsed, 300), 'Clock Skew Injected', 'clock_skew')}
                className="p-2 rounded-lg bg-[var(--bg-sidebar)] hover:bg-[var(--pill-bg)] text-[var(--text-primary)] border border-[var(--border-dev)] hover:border-cyan-500/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer font-medium"
              >
                <Sliders className="w-3.5 h-3.5 text-cyan-500 shrink-0" /> Clock Skew (+5m)
              </button>

              {/* Renew (+1h) */}
              <button
                onClick={() => runChaosMutation(() => renewTokenValid(parsed, 3600), 'Renewed (+1h)', 'renew')}
                className="p-2 rounded-lg bg-[var(--bg-sidebar)] hover:bg-[var(--pill-bg)] text-[var(--text-primary)] border border-[var(--border-dev)] hover:border-emerald-500/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer font-medium"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Renew (+1h)
              </button>

              {/* alg: none Exploit */}
              <button
                onClick={() => runChaosMutation(() => simulateAlgNone(parsed), 'alg: none Exploit', 'alg_none')}
                className="p-2 rounded-lg bg-[var(--bg-sidebar)] hover:bg-[var(--pill-bg)] text-[var(--text-primary)] border border-[var(--border-dev)] hover:border-purple-500/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer font-medium"
              >
                <Unlock className="w-3.5 h-3.5 text-purple-500 shrink-0" /> alg: none
              </button>

              {/* Corrupt Signature */}
              <button
                onClick={() => runChaosMutation(() => corruptSignature(parsed), 'Signature Corrupted', 'corrupt_sig')}
                className="p-2 rounded-lg bg-[var(--bg-sidebar)] hover:bg-[var(--pill-bg)] text-[var(--text-primary)] border border-[var(--border-dev)] hover:border-rose-500/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer font-medium"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" /> Corrupt Sig
              </button>

              {/* Swap to HS256 */}
              <button
                onClick={() => runChaosMutation(() => swapAlgorithmToHs256(parsed), 'Swapped to HS256', 'swap_hs256')}
                className="p-2 rounded-lg bg-[var(--bg-sidebar)] hover:bg-[var(--pill-bg)] text-[var(--text-primary)] border border-[var(--border-dev)] hover:border-amber-500/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer font-medium"
              >
                <RefreshCw className="w-3.5 h-3.5 text-amber-500 shrink-0" /> To HS256
              </button>

              {/* Inject BLNS */}
              <button
                onClick={() => runChaosMutation(() => injectBlnsClaim(parsed, 'name'), 'Naughty String Injected', 'inject_blns')}
                className="p-2 rounded-lg bg-[var(--bg-sidebar)] hover:bg-[var(--pill-bg)] text-[var(--text-primary)] border border-[var(--border-dev)] hover:border-indigo-500/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer font-medium"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" /> Inject BLNS
              </button>

            </div>

            {/* High-Contrast Active Chaos Scenario & Testing Guide (100% visible in light & dark mode) */}
            {activeChaosHint && (
              <div className="mt-1 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-300 dark:border-amber-700/60 text-xs font-mono flex flex-col gap-2 shadow-sm animate-fade-in text-slate-900 dark:text-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      {activeChaosHint.title}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full border font-bold bg-amber-200/60 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 border-amber-400/50">
                      {activeChaosHint.badge}
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveChaosHint(null)}
                    className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 cursor-pointer"
                    title="Dismiss Hint"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-1.5 text-xs leading-relaxed">
                  <div>
                    <span className="text-slate-600 dark:text-slate-400 font-bold">What was modified: </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{activeChaosHint.mutation}</span>
                  </div>
                  <div>
                    <span className="text-slate-600 dark:text-slate-400 font-bold">Security Impact: </span>
                    <span className="text-slate-800 dark:text-slate-200">{activeChaosHint.securityImpact}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-amber-300/80 dark:border-amber-700/40 text-xs shadow-2xs">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">How to test your app: </span>
                    <span className="text-slate-900 dark:text-slate-100">{activeChaosHint.howToTest}</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* 2. Workspace Tabs Navigation */}
          <div className="flex items-center justify-between px-4 border-b border-[var(--border-dev)] bg-[var(--bg-panel)]">
            <div className="flex items-center gap-2 pt-2">
              
              <button
                onClick={() => setActiveTab('claims')}
                className={`px-3 py-2 text-xs font-mono font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'claims'
                    ? 'border-rose-500 text-rose-600 dark:text-rose-400'
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> Decoded Claims ({parsed.diagnostics.length})
              </button>

              <button
                onClick={() => setActiveTab('json')}
                className={`px-3 py-2 text-xs font-mono font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'json'
                    ? 'border-rose-500 text-rose-600 dark:text-rose-400'
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" /> JSON Editors
              </button>

              <button
                onClick={() => setActiveTab('crypto')}
                className={`px-3 py-2 text-xs font-mono font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'crypto'
                    ? 'border-rose-500 text-rose-600 dark:text-rose-400'
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Lock className="w-3.5 h-3.5" /> WebCrypto Signer
              </button>

              <button
                onClick={() => setActiveTab('export')}
                className={`px-3 py-2 text-xs font-mono font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'export'
                    ? 'border-rose-500 text-rose-600 dark:text-rose-400'
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" /> Export Snippets
              </button>

            </div>

            {jsonError && (
              <span className="text-[11px] font-mono text-rose-500 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> {jsonError}
              </span>
            )}
          </div>

          {/* 3. Tab Content */}
          <div className="p-4 flex-1">
            
            {/* TAB 1: Decoded Claims (In-Place Expandable Hint Cards) */}
            {activeTab === 'claims' && (
              <div className="flex flex-col gap-3">
                
                {/* Header Action Row */}
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[var(--text-secondary)]">
                    Click any claim to expand its RFC definition and security testing hint:
                  </span>
                  <button
                    onClick={() => setIsAddingClaim(!isAddingClaim)}
                    className="px-2.5 py-1 rounded-md bg-[var(--bg-sidebar)] hover:bg-[var(--pill-bg)] text-[var(--text-primary)] border border-[var(--border-dev)] transition-colors flex items-center gap-1 cursor-pointer font-bold"
                  >
                    <Plus className="w-3 h-3" /> {isAddingClaim ? 'Cancel' : 'Add Custom Claim'}
                  </button>
                </div>

                {/* Add Custom Claim Inline Form */}
                {isAddingClaim && (
                  <form
                    onSubmit={handleAddCustomClaim}
                    className="p-3.5 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-dev)] flex flex-col gap-2.5 text-xs font-mono shadow-sm"
                  >
                    <div className="font-bold text-[var(--text-primary)]">
                      Add Custom Claim to Payload:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={newClaimKey}
                        onChange={e => setNewClaimKey(e.target.value)}
                        placeholder="Claim Key (e.g., role, org_id, tier)..."
                        className="px-2.5 py-1.5 rounded-md bg-[var(--bg-app)] border border-[var(--border-dev)] text-[var(--text-primary)] focus:outline-none focus:border-rose-500"
                        required
                      />
                      <input
                        type="text"
                        value={newClaimValue}
                        onChange={e => setNewClaimValue(e.target.value)}
                        placeholder='Claim Value (e.g. "admin", 100, true)...'
                        className="px-2.5 py-1.5 rounded-md bg-[var(--bg-app)] border border-[var(--border-dev)] text-[var(--text-primary)] focus:outline-none focus:border-rose-500"
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingClaim(false)}
                        className="px-3 py-1 rounded-md bg-[var(--bg-sidebar)] text-[var(--text-secondary)] cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1 rounded-md bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer transition-colors"
                      >
                        Add to Payload
                      </button>
                    </div>
                  </form>
                )}

                {/* List of Decoded Claim Cards (With IN-PLACE expandable Hint Accordion) */}
                <div className="flex flex-col gap-2.5">
                  {parsed.diagnostics.map(claim => {
                    const isExpanded = Boolean(expandedClaimKeys[claim.key]);

                    return (
                      <div
                        key={claim.key}
                        className={`p-3.5 rounded-xl border transition-all flex flex-col gap-2.5 shadow-2xs font-mono bg-[var(--bg-panel)] ${
                          isExpanded
                            ? 'border-slate-400 dark:border-slate-600 shadow-xs'
                            : 'border-[var(--border-dev)] hover:border-[var(--border-dev-subtle)]'
                        }`}
                      >
                        {/* Top Claim Row */}
                        <div
                          onClick={() => toggleClaimExpansion(claim.key)}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer select-none"
                        >
                          <div className="flex items-center gap-2 flex-wrap min-w-0">
                            <span className="font-bold text-sm text-[var(--text-primary)]">
                              {claim.key}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[var(--pill-bg)] text-[var(--text-muted)] border border-[var(--border-dev)]">
                              {claim.label}
                            </span>
                            {claim.isStandard && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                                Standard
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 shrink-0 text-xs">
                            <span className="text-[11px] font-medium text-rose-600 dark:text-rose-400 flex items-center gap-1">
                              {isExpanded ? 'Hide Hint' : 'View Hint'}
                              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                            </span>
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                handleDeleteClaim(claim.key);
                              }}
                              className="px-2 py-0.5 rounded bg-[var(--bg-sidebar)] hover:bg-rose-500/20 text-[var(--text-muted)] hover:text-rose-600 dark:hover:text-rose-400 border border-[var(--border-dev)] transition-colors text-[11px] flex items-center gap-1 cursor-pointer"
                              title={`Remove "${claim.key}" claim`}
                            >
                              <Trash2 className="w-3 h-3" /> Strip
                            </button>
                          </div>
                        </div>

                        {/* Raw/Formatted Value Display */}
                        <div className="text-xs text-[var(--text-primary)] break-all font-mono select-all bg-[var(--bg-app)] p-2 rounded-lg border border-[var(--border-dev)]">
                          {typeof claim.value === 'object'
                            ? JSON.stringify(claim.value)
                            : String(claim.value)}
                        </div>

                        {/* Human-Readable Date Pill (if timestamp) */}
                        {claim.formattedTime && (
                          <div className="text-[11px] flex items-center gap-2">
                            <span className="text-[var(--text-muted)]">{claim.formattedTime}</span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                claim.status === 'expired'
                                  ? 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30'
                                  : claim.status === 'future'
                                  ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                                  : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                              }`}
                            >
                              {claim.relativeTime}
                            </span>
                          </div>
                        )}

                        {/* ======================================================== */}
                        {/* IN-PLACE EXPANDABLE HINT DRAWER (100% VISIBLE ON CLICK)   */}
                        {/* ======================================================== */}
                        {isExpanded && (
                          <div className="mt-1 p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-slate-100 flex flex-col gap-2 animate-fade-in shadow-xs">
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100">
                                <Info className="w-4 h-4 text-rose-500 shrink-0" />
                                <span>{claim.label} ({claim.key})</span>
                              </div>
                              {claim.rfc && (
                                <span className="text-[10px] px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-bold">
                                  {claim.rfc}
                                </span>
                              )}
                            </div>

                            {/* Definition */}
                            <p className="text-[11px] leading-relaxed text-slate-800 dark:text-slate-300">
                              {claim.description}
                            </p>

                            {/* Security & Testing Hint Callout */}
                            {claim.hint && (
                              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-[11px] leading-relaxed shadow-2xs">
                                <span className="font-bold text-rose-700 dark:text-rose-400">Security &amp; Testing Gotcha: </span>
                                <span className="text-slate-900 dark:text-slate-100">{claim.hint}</span>
                              </div>
                            )}

                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>

              </div>
            )}

            {/* TAB 2: JSON Editors (Header & Payload) */}
            {activeTab === 'json' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Header JSON Editor */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-[var(--text-primary)]">
                    <span className="flex items-center gap-1">
                      <Code2 className="w-3.5 h-3.5 text-rose-500" /> Header JSON:
                    </span>
                    <button
                      onClick={() => triggerCopy(headerJsonStr, 'Header JSON Copied')}
                      className="p-1 hover:bg-[var(--pill-bg)] rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                      title="Copy Header JSON"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <textarea
                    value={headerJsonStr}
                    onChange={e => handleHeaderJsonChange(e.target.value)}
                    rows={12}
                    className="w-full p-3 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-dev)] text-[var(--text-primary)] font-mono text-xs focus:outline-none focus:border-rose-500 resize-none leading-relaxed shadow-2xs"
                    spellCheck={false}
                  />
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">
                    Edits auto-synchronize to compact token.
                  </span>
                </div>

                {/* Payload JSON Editor */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-[var(--text-primary)]">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-purple-500" /> Payload JSON:
                    </span>
                    <button
                      onClick={() => triggerCopy(payloadJsonStr, 'Payload JSON Copied')}
                      className="p-1 hover:bg-[var(--pill-bg)] rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                      title="Copy Payload JSON"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <textarea
                    value={payloadJsonStr}
                    onChange={e => handlePayloadJsonChange(e.target.value)}
                    rows={12}
                    className="w-full p-3 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-dev)] text-[var(--text-primary)] font-mono text-xs focus:outline-none focus:border-purple-500 resize-none leading-relaxed shadow-2xs"
                    spellCheck={false}
                  />
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">
                    Edits auto-synchronize to compact token.
                  </span>
                </div>

              </div>
            )}

            {/* TAB 3: WebCrypto Signer & Verification */}
            {activeTab === 'crypto' && (
              <div className="flex flex-col gap-4">
                
                {/* HMAC Verification / Signing Card */}
                <div className="p-4 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-dev)] flex flex-col gap-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-cyan-500" /> Client-Side HMAC Signer &amp; Verifier
                    </span>
                    <select
                      value={cryptoAlg}
                      onChange={e => setCryptoAlg(e.target.value as SupportedHmacAlg)}
                      aria-label="Select HMAC Algorithm"
                      className="px-2.5 py-1 rounded-md bg-[var(--bg-app)] border border-[var(--border-dev)] text-xs font-mono text-[var(--text-primary)] focus:outline-none"
                    >
                      <option value="HS256">HMAC-SHA256 (HS256)</option>
                      <option value="HS384">HMAC-SHA384 (HS384)</option>
                      <option value="HS512">HMAC-SHA512 (HS512)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-[var(--text-muted)] mb-1">
                      Signing Secret / Pre-shared Key:
                    </label>
                    <input
                      type="text"
                      value={hmacSecret}
                      onChange={e => setHmacSecret(e.target.value)}
                      placeholder="Enter HMAC secret string..."
                      className="w-full px-3 py-2 rounded-lg bg-[var(--bg-app)] border border-[var(--border-dev)] text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-rose-500 transition-colors"
                    />
                  </div>

                  <div className="flex items-center gap-2.5 pt-1">
                    <button
                      onClick={handleVerifyHmac}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-[var(--bg-sidebar)] hover:bg-[var(--pill-bg)] text-[var(--text-primary)] border border-[var(--border-dev)] transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" /> Verify HMAC Signature
                    </button>
                    <button
                      onClick={handleSignHmac}
                      disabled={isSigning}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Sign with Secret
                    </button>
                  </div>

                  {verifyResult && (
                    <div
                      className={`p-3 rounded-lg text-xs font-mono border ${
                        verifyResult.isValid
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-400'
                      }`}
                    >
                      {verifyResult.message}
                    </div>
                  )}
                </div>

                {/* Ephemeral RSA-2048 Testing Card */}
                <div className="p-4 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-dev)] flex flex-col gap-2.5 shadow-2xs">
                  <span className="text-xs font-mono font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                    <Key className="w-4 h-4 text-purple-500" /> Ephemeral RSA-2048 Asymmetric Signer (RS256)
                  </span>
                  <p className="text-xs font-mono text-[var(--text-secondary)] leading-relaxed">
                    Generate an isolated, real RSA-2048 public/private key pair in browser memory using WebCrypto, sign the JWT with RS256, and test your backend asymmetric verification.
                  </p>
                  <div>
                    <button
                      onClick={handleGenerateRsaAndSign}
                      disabled={isSigning}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-[var(--bg-sidebar)] hover:bg-[var(--pill-bg)] text-[var(--text-primary)] border border-[var(--border-dev)] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Zap className="w-3.5 h-3.5 text-purple-500" /> Generate RSA Key Pair &amp; Sign RS256
                    </button>
                  </div>
                  {rsaStatus && (
                    <div className="p-2.5 rounded-lg text-xs font-mono bg-[var(--bg-panel-subtle)] border border-[var(--border-dev)] text-[var(--text-primary)]">
                      {rsaStatus}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB 4: Export Snippets */}
            {activeTab === 'export' && (
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  
                  {/* Bearer Token */}
                  <div className="p-3 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-dev)] flex flex-col justify-between gap-2 shadow-2xs">
                    <div>
                      <div className="font-bold text-[var(--text-primary)]">Authorization Header:</div>
                      <div className="text-[11px] text-[var(--text-muted)] truncate mt-1">
                        Bearer {rawToken}
                      </div>
                    </div>
                    <button
                      onClick={() => triggerCopy(`Bearer ${rawToken}`, 'Copied Bearer Token')}
                      className="px-3 py-1.5 rounded-md bg-[var(--bg-sidebar)] hover:bg-[var(--pill-bg)] border border-[var(--border-dev)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center justify-center gap-1.5 cursor-pointer self-start"
                    >
                      <Copy className="w-3 h-3" /> Copy Bearer Header
                    </button>
                  </div>

                  {/* cURL Command */}
                  <div className="p-3 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-dev)] flex flex-col justify-between gap-2 shadow-2xs">
                    <div>
                      <div className="font-bold text-[var(--text-primary)]">Executable cURL Request:</div>
                      <div className="text-[11px] text-[var(--text-muted)] truncate mt-1">
                        curl -H &quot;Authorization: Bearer ...&quot;
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        triggerCopy(
                          `curl -X GET "https://api.example.com/v1/profile" \\\n  -H "Authorization: Bearer ${rawToken}"`,
                          'Copied cURL Request'
                        )
                      }
                      className="px-3 py-1.5 rounded-md bg-[var(--bg-sidebar)] hover:bg-[var(--pill-bg)] border border-[var(--border-dev)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center justify-center gap-1.5 cursor-pointer self-start"
                    >
                      <Terminal className="w-3 h-3" /> Copy cURL Command
                    </button>
                  </div>

                  {/* TypeScript Interface */}
                  <div className="p-3 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-dev)] flex flex-col justify-between gap-2 shadow-2xs">
                    <div>
                      <div className="font-bold text-[var(--text-primary)]">TypeScript Claims Interface:</div>
                      <div className="text-[11px] text-[var(--text-muted)] truncate mt-1">
                        export interface DecodedJwtPayload ...
                      </div>
                    </div>
                    <button
                      onClick={() => triggerCopy(typeScriptDefinition, 'Copied TypeScript Types')}
                      className="px-3 py-1.5 rounded-md bg-[var(--bg-sidebar)] hover:bg-[var(--pill-bg)] border border-[var(--border-dev)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center justify-center gap-1.5 cursor-pointer self-start"
                    >
                      <Code2 className="w-3 h-3" /> Copy TypeScript Interface
                    </button>
                  </div>

                  {/* Playwright Header Snippet */}
                  <div className="p-3 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-dev)] flex flex-col justify-between gap-2 shadow-2xs">
                    <div>
                      <div className="font-bold text-[var(--text-primary)]">Playwright / Test Snippet:</div>
                      <div className="text-[11px] text-[var(--text-muted)] truncate mt-1">
                        await page.setExtraHTTPHeaders(...)
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        triggerCopy(
                          `await page.setExtraHTTPHeaders({\n  'Authorization': 'Bearer ${rawToken}'\n});`,
                          'Copied Playwright Snippet'
                        )
                      }
                      className="px-3 py-1.5 rounded-md bg-[var(--bg-sidebar)] hover:bg-[var(--pill-bg)] border border-[var(--border-dev)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center justify-center gap-1.5 cursor-pointer self-start"
                    >
                      <FileText className="w-3 h-3" /> Copy Playwright Header
                    </button>
                  </div>

                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
