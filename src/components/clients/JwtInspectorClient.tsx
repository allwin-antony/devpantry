'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  Lock,
  Unlock,
  Sliders,
  Sparkles,
  Terminal,
  Code2,
  FileText,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { parseJwt, buildCompactJwt } from '@/lib/jwt/codec';
import { ParsedJwt } from '@/lib/jwt/types';
import {
  expireTokenNow,
  expireTokenSoon,
  injectClockSkewFuture,
  simulateAlgNone,
  corruptSignature,
  stripClaim,
  injectBlnsClaim,
  swapAlgorithmToHs256,
} from '@/lib/jwt/chaos';
import { signHmac, verifyHmac, generateTestRsaKeyPair, signRsa, SupportedHmacAlg } from '@/lib/jwt/crypto';
import { getJwtPresets } from '@/lib/jwt/presets';

export const JwtInspectorClient: React.FC = () => {
  const presets = useMemo(() => getJwtPresets(), []);
  
  // 100% in-memory state — never stored in localStorage (safe for production tokens)
  const [rawToken, setRawToken] = useState<string>(presets[0].token);
  const [activeTab, setActiveTab] = useState<'payload' | 'header' | 'crypto'>('payload');
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  
  // JSON Editor strings for two-way synchronization
  const [headerJsonDraft, setHeaderJsonDraft] = useState<string | null>(null);
  const [payloadJsonDraft, setPayloadJsonDraft] = useState<string | null>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);

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

  // Derived JSON editor strings: use active draft if user is editing, otherwise pretty-print parsed token
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
    }
  };

  // Chaos Mutations
  const runChaosMutation = (action: () => string, label: string) => {
    const updated = action();
    setRawToken(updated);
    setVerifyResult(null);
    triggerCopy(updated, `⚡ ${label}`);
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
    <div className="w-full min-h-[calc(100vh-3rem)] bg-[var(--bg-app)] text-[var(--text-primary)] flex flex-col font-sans">
      {/* Top Banner: 100% In-Memory Sandbox Guarantee */}
      <div className="bg-[var(--bg-panel)] border-b border-[var(--border-dev)] px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-emerald-500 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Client-Side In-Memory Sandbox
          </span>
          <span className="text-[var(--text-muted)] hidden sm:inline">|</span>
          <span className="text-[var(--text-secondary)] hidden sm:inline">
            Zero network transmission. Pasted tokens never leave your browser.
          </span>
        </div>

        {/* Quick Actions & Clear */}
        <div className="flex items-center gap-2">
          {copyFeedback && (
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-mono animate-fade-in flex items-center gap-1">
              <Check className="w-3 h-3" /> {copyFeedback}
            </span>
          )}
          <button
            onClick={() => {
              setRawToken('');
              setVerifyResult(null);
              setRsaStatus(null);
            }}
            className="px-2.5 py-1 rounded bg-[var(--bg-panel-subtle)] hover:bg-rose-500/20 text-[var(--text-secondary)] hover:text-rose-400 border border-[var(--border-dev)] hover:border-rose-500/30 transition-colors flex items-center gap-1 cursor-pointer font-mono"
            title="Clear current token from memory"
          >
            <Trash2 className="w-3 h-3" /> Clear
          </button>
        </div>
      </div>

      {/* Preset Selector Pill Bar */}
      <div className="bg-[var(--bg-sidebar)] border-b border-[var(--border-dev)] px-4 py-2.5 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[var(--text-muted)] flex items-center gap-1">
            <Key className="w-3.5 h-3.5 text-rose-500" /> Presets:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {presets.map(p => (
              <button
                key={p.id}
                onClick={() => handleSelectPreset(p.id)}
                className="px-2.5 py-1 rounded text-xs font-mono bg-[var(--bg-panel)] hover:bg-[var(--pill-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-dev)] hover:border-rose-500/40 transition-colors cursor-pointer"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div className="text-[11px] font-mono text-[var(--text-muted)] flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded bg-[var(--bg-panel)] border border-[var(--border-dev)]">
            UTC: {new Date().toISOString().slice(11, 19)}
          </span>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        
        {/* Left Column: Compact Token Input & Live Status Radar (5 cols) */}
        <div className="lg:col-span-5 border-r border-[var(--border-dev)] flex flex-col bg-[var(--bg-panel)] overflow-y-auto">
          {/* Section Header */}
          <div className="p-3 border-b border-[var(--border-dev)] flex items-center justify-between bg-[var(--bg-panel-subtle)]">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-rose-500" />
              <h2 className="font-semibold text-xs uppercase tracking-wider font-mono">
                Encoded JWT (Compact Token)
              </h2>
            </div>
            <button
              onClick={() => triggerCopy(rawToken, 'Raw JWT Copied')}
              className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--pill-bg)] transition-colors cursor-pointer"
              title="Copy Raw Compact JWT"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Raw Input Textarea */}
          <div className="p-3">
            <label className="block text-[11px] font-mono text-[var(--text-muted)] mb-1">
              Paste token here or select a preset:
            </label>
            <textarea
              value={rawToken}
              onChange={e => setRawToken(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
              rows={5}
              className="w-full p-2.5 rounded-lg bg-[var(--bg-codebox)] border border-[var(--border-dev)] text-[var(--text-code)] font-mono text-xs focus:outline-none focus:border-rose-500/80 resize-none transition-colors"
              spellCheck={false}
            />
          </div>

          {/* Color-Coded Token Anatomy Breakdown */}
          {parsed.isValidStructure ? (
            <div className="px-3 pb-3">
              <div className="p-3 rounded-lg bg-[var(--bg-panel-subtle)] border border-[var(--border-dev)] font-mono text-xs break-all leading-relaxed">
                <span className="text-rose-500 font-bold" title="Header (Algorithm & Type)">
                  {parsed.headerB64}
                </span>
                <span className="text-[var(--text-muted)] font-bold">.</span>
                <span className="text-purple-400 font-bold" title="Payload (Claims Data)">
                  {parsed.payloadB64}
                </span>
                <span className="text-[var(--text-muted)] font-bold">.</span>
                <span
                  className={parsed.hasSignature ? 'text-cyan-400 font-bold' : 'text-amber-500 italic'}
                  title={parsed.hasSignature ? 'Signature' : 'Unsigned / Signature Stripped'}
                >
                  {parsed.signatureB64 || '(empty signature)'}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-2 text-[10px] font-mono text-[var(--text-muted)]">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500" /> Header
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-purple-400" /> Payload
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" /> Signature
                </span>
              </div>
            </div>
          ) : (
            parsed.error && (
              <div className="px-3 pb-3">
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Token Parsing Error</div>
                    <div className="text-[11px] opacity-90 mt-0.5">{parsed.error}</div>
                  </div>
                </div>
              </div>
            )
          )}

          {/* Live Diagnostic Radar Card */}
          <div className="p-3 m-3 rounded-xl bg-[var(--bg-panel-subtle)] border border-[var(--border-dev)] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
                Status Radar
              </span>
              {parsed.status === 'valid' && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <Check className="w-3 h-3" /> ACTIVE & VALID
                </span>
              )}
              {parsed.status === 'expired' && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> EXPIRED
                </span>
              )}
              {parsed.status === 'premature' && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> NOT YET VALID (nbf)
                </span>
              )}
              {parsed.status === 'alg_none' && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" /> ALG: NONE (INSECURE)
                </span>
              )}
              {parsed.status === 'malformed' && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono text-[var(--text-muted)] border border-[var(--border-dev)]">
                  WAITING FOR INPUT
                </span>
              )}
            </div>

            <div className="text-xs font-mono font-bold text-[var(--text-primary)]">
              {parsed.statusMessage}
            </div>

            {/* Countdown Progress Bar */}
            {parsed.secondsRemaining !== null && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
                  <span>Token Lifetime Remaining</span>
                  <span className="font-bold text-[var(--text-primary)]">
                    {parsed.secondsRemaining > 0
                      ? `${Math.floor(parsed.secondsRemaining / 60)}m ${parsed.secondsRemaining % 60}s`
                      : '0s (Expired)'}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[var(--border-dev)] overflow-hidden">
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
              </div>
            )}

            {/* Quick Metadata Specs */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--border-dev)] text-[11px] font-mono">
              <div>
                <span className="text-[var(--text-muted)]">Algorithm (alg):</span>{' '}
                <span className="font-bold text-rose-400">{parsed.header.alg || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[var(--text-muted)]">Type (typ):</span>{' '}
                <span className="font-bold text-[var(--text-primary)]">{parsed.header.typ || 'JWT'}</span>
              </div>
              <div>
                <span className="text-[var(--text-muted)]">Key ID (kid):</span>{' '}
                <span className="font-bold text-[var(--text-secondary)]">{parsed.header.kid || 'None'}</span>
              </div>
              <div>
                <span className="text-[var(--text-muted)]">Signature:</span>{' '}
                <span className={parsed.hasSignature ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {parsed.hasSignature ? 'Present' : 'None'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Chaos Tamperer & Interactive Editors (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-[var(--bg-panel-subtle)] overflow-y-auto">
          
          {/* 🔥 1-Click Chaos Tamperer Bar (The FailState Feature) */}
          <div className="p-3 border-b border-[var(--border-dev)] bg-[var(--bg-panel)] flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-rose-500 uppercase tracking-wider">
                <Flame className="w-4 h-4" /> 1-Click Chaos Mutations
              </div>
              <span className="text-[11px] font-mono text-[var(--text-muted)]">
                Simulate edge-case auth failures
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Expire Now */}
              <button
                onClick={() => runChaosMutation(() => expireTokenNow(parsed, 300), 'Expired (-5m)')}
                className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:border-rose-500/50 transition-all flex items-center gap-1 cursor-pointer"
                title="Sets exp = now - 5 minutes"
              >
                <Clock className="w-3.5 h-3.5" /> Expire Now (-5m)
              </button>

              {/* Expire in 10s */}
              <button
                onClick={() => runChaosMutation(() => expireTokenSoon(parsed, 10), 'Expiring in 10s')}
                className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:border-amber-500/50 transition-all flex items-center gap-1 cursor-pointer"
                title="Sets exp = now + 10s to test race conditions & token refresh"
              >
                <Zap className="w-3.5 h-3.5" /> Expire in 10s
              </button>

              {/* Clock Skew */}
              <button
                onClick={() => runChaosMutation(() => injectClockSkewFuture(parsed, 300), 'Clock Skew Injected')}
                className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:border-cyan-500/50 transition-all flex items-center gap-1 cursor-pointer"
                title="Sets nbf & iat to now + 5 minutes to test clock-drift tolerance"
              >
                <Sliders className="w-3.5 h-3.5" /> Clock Skew (+5m)
              </button>

              {/* alg: none */}
              <button
                onClick={() => runChaosMutation(() => simulateAlgNone(parsed), 'alg: none Exploit Active')}
                className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:border-purple-500/50 transition-all flex items-center gap-1 cursor-pointer"
                title="Sets alg = none and removes signature to test parser vulnerability (CVE-2015-9235)"
              >
                <Unlock className="w-3.5 h-3.5" /> alg: none Exploit
              </button>

              {/* Corrupt Signature */}
              <button
                onClick={() => runChaosMutation(() => corruptSignature(parsed), 'Signature Corrupted')}
                className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:border-rose-500/50 transition-all flex items-center gap-1 cursor-pointer"
                title="Flips random characters in signature to trigger 401 Unauthorized"
              >
                <AlertTriangle className="w-3.5 h-3.5" /> Corrupt Signature
              </button>

              {/* Inject BLNS */}
              <button
                onClick={() => runChaosMutation(() => injectBlnsClaim(parsed, 'name'), 'Naughty String Injected')}
                className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/50 transition-all flex items-center gap-1 cursor-pointer"
                title="Injects Big List of Naughty Strings into user claims"
              >
                <Sparkles className="w-3.5 h-3.5" /> Inject BLNS
              </button>

              {/* Swap to HS256 */}
              <button
                onClick={() => runChaosMutation(() => swapAlgorithmToHs256(parsed), 'Algorithm Swapped to HS256')}
                className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium bg-[var(--bg-panel)] hover:bg-[var(--pill-bg)] text-[var(--text-secondary)] border border-[var(--border-dev)] transition-all flex items-center gap-1 cursor-pointer"
                title="Swaps alg from RS256 to HS256 to test Public Key Confusion"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Swap to HS256
              </button>

              {/* Strip Claim Dropdown / Quick buttons */}
              <button
                onClick={() => runChaosMutation(() => stripClaim(parsed, 'sub'), 'Stripped sub claim')}
                className="px-2 py-1 rounded text-[11px] font-mono bg-[var(--bg-panel)] hover:bg-rose-500/20 text-[var(--text-muted)] hover:text-rose-400 border border-[var(--border-dev)] transition-colors cursor-pointer"
                title="Strip sub (User ID)"
              >
                - Strip sub
              </button>
              <button
                onClick={() => runChaosMutation(() => stripClaim(parsed, 'roles'), 'Stripped roles claim')}
                className="px-2 py-1 rounded text-[11px] font-mono bg-[var(--bg-panel)] hover:bg-rose-500/20 text-[var(--text-muted)] hover:text-rose-400 border border-[var(--border-dev)] transition-colors cursor-pointer"
                title="Strip roles claim"
              >
                - Strip roles
              </button>
            </div>
          </div>

          {/* Navigation Tabs (Payload / Header / WebCrypto Signer) */}
          <div className="flex items-center justify-between px-3 border-b border-[var(--border-dev)] bg-[var(--bg-panel)]">
            <div className="flex items-center gap-1 pt-2">
              <button
                onClick={() => setActiveTab('payload')}
                className={`px-3 py-2 text-xs font-mono font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'payload'
                    ? 'border-purple-400 text-purple-400'
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> Payload (Claims)
              </button>
              <button
                onClick={() => setActiveTab('header')}
                className={`px-3 py-2 text-xs font-mono font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'header'
                    ? 'border-rose-500 text-rose-500'
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" /> Header (Alg/Typ)
              </button>
              <button
                onClick={() => setActiveTab('crypto')}
                className={`px-3 py-2 text-xs font-mono font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'crypto'
                    ? 'border-cyan-400 text-cyan-400'
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Lock className="w-3.5 h-3.5" /> WebCrypto Signer
              </button>
            </div>

            {jsonError && (
              <span className="text-[11px] font-mono text-rose-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> {jsonError}
              </span>
            )}
          </div>

          {/* Tab Content 1: Payload (Claims) */}
          {activeTab === 'payload' && (
            <div className="p-3 flex flex-col gap-3">
              {/* Editable JSON Box */}
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] mb-1">
                  <span>Interactive JSON Payload (Two-Way Synced):</span>
                  <button
                    onClick={() => triggerCopy(payloadJsonStr, 'Payload JSON Copied')}
                    className="hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
                <textarea
                  value={payloadJsonStr}
                  onChange={e => handlePayloadJsonChange(e.target.value)}
                  rows={9}
                  className="w-full p-2.5 rounded-lg bg-[var(--bg-codebox)] border border-[var(--border-dev)] text-purple-300 font-mono text-xs focus:outline-none focus:border-purple-400 resize-y"
                  spellCheck={false}
                />
              </div>

              {/* Decoded Claims Diagnostic Table */}
              <div className="rounded-lg border border-[var(--border-dev)] overflow-hidden bg-[var(--bg-panel)]">
                <div className="px-3 py-2 border-b border-[var(--border-dev)] bg-[var(--table-th-bg)] flex items-center justify-between text-xs font-mono">
                  <span className="font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Decoded Claims Table ({parsed.diagnostics.length})
                  </span>
                </div>
                <div className="overflow-x-auto max-h-72 overflow-y-auto">
                  <table className="dev-table">
                    <thead>
                      <tr>
                        <th>Claim Key</th>
                        <th>Standard Name</th>
                        <th>Value</th>
                        <th>Human Readable / Expiry</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsed.diagnostics.map(claim => (
                        <tr key={claim.key} className="hover:bg-[var(--table-hover)]">
                          <td className="font-bold text-purple-400">{claim.key}</td>
                          <td className="text-[var(--text-secondary)]">{claim.label}</td>
                          <td className="max-w-xs truncate text-[var(--text-primary)]" title={String(claim.value)}>
                            {typeof claim.value === 'object'
                              ? JSON.stringify(claim.value)
                              : String(claim.value)}
                          </td>
                          <td>
                            {claim.formattedTime ? (
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                  claim.status === 'expired'
                                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                    : claim.status === 'future'
                                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                }`}
                              >
                                {claim.formattedTime} ({claim.relativeTime})
                              </span>
                            ) : (
                              <span className="text-[var(--text-muted)] text-[10px]">
                                {claim.description}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content 2: Header (Alg / Typ) */}
          {activeTab === 'header' && (
            <div className="p-3 flex flex-col gap-3">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] mb-1">
                  <span>Interactive JSON Header:</span>
                  <button
                    onClick={() => triggerCopy(headerJsonStr, 'Header JSON Copied')}
                    className="hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
                <textarea
                  value={headerJsonStr}
                  onChange={e => handleHeaderJsonChange(e.target.value)}
                  rows={8}
                  className="w-full p-2.5 rounded-lg bg-[var(--bg-codebox)] border border-[var(--border-dev)] text-rose-300 font-mono text-xs focus:outline-none focus:border-rose-400 resize-y"
                  spellCheck={false}
                />
              </div>

              <div className="p-3 rounded-lg bg-[var(--bg-panel)] border border-[var(--border-dev)] text-xs font-mono text-[var(--text-secondary)] space-y-2">
                <div className="font-bold text-[var(--text-primary)]">Header Parameters Guide:</div>
                <div>• <span className="text-rose-400 font-bold">alg</span>: The cryptographic algorithm used to secure the token (e.g., HS256, RS256, or &quot;none&quot;).</div>
                <div>• <span className="text-rose-400 font-bold">typ</span>: Media type of the token (typically &quot;JWT&quot;).</div>
                <div>• <span className="text-rose-400 font-bold">kid</span>: Key ID hint indicating which specific public key in a JWKS validates the token.</div>
              </div>
            </div>
          )}

          {/* Tab Content 3: WebCrypto Signer & Verification */}
          {activeTab === 'crypto' && (
            <div className="p-3 flex flex-col gap-3">
              {/* HMAC Verifier / Signer */}
              <div className="p-3 rounded-lg bg-[var(--bg-panel)] border border-[var(--border-dev)] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" /> Client-Side HMAC (HS256 / HS384 / HS512)
                  </span>
                  <select
                    value={cryptoAlg}
                    onChange={e => setCryptoAlg(e.target.value as SupportedHmacAlg)}
                    aria-label="Cryptographic HMAC Algorithm"
                    className="px-2 py-1 rounded bg-[var(--bg-panel-subtle)] border border-[var(--border-dev)] text-xs font-mono text-[var(--text-primary)] focus:outline-none"
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
                    placeholder="Enter HMAC secret..."
                    className="w-full px-2.5 py-1.5 rounded bg-[var(--bg-codebox)] border border-[var(--border-dev)] text-xs font-mono text-[var(--text-code)] focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleVerifyHmac}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:border-cyan-500/50 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" /> Verify Signature
                  </button>
                  <button
                    onClick={handleSignHmac}
                    disabled={isSigning}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-sm hover:opacity-95 transition-opacity flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Sign with Secret
                  </button>
                </div>

                {verifyResult && (
                  <div
                    className={`p-2.5 rounded text-xs font-mono border ${
                      verifyResult.isValid
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                    }`}
                  >
                    {verifyResult.message}
                  </div>
                )}
              </div>

              {/* Ephemeral RSA-2048 Testing */}
              <div className="p-3 rounded-lg bg-[var(--bg-panel)] border border-[var(--border-dev)] flex flex-col gap-2">
                <span className="text-xs font-mono font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-purple-400" /> Ephemeral RSA-2048 Asymmetric Signer (RS256)
                </span>
                <p className="text-[11px] font-mono text-[var(--text-secondary)]">
                  Generate an isolated RSA-2048 key pair directly in browser WebCrypto memory and sign the token with RS256. Zero external APIs or keys sent.
                </p>
                <div>
                  <button
                    onClick={handleGenerateRsaAndSign}
                    disabled={isSigning}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:border-purple-500/50 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Zap className="w-3.5 h-3.5" /> Generate Key &amp; Sign RS256
                  </button>
                </div>
                {rsaStatus && (
                  <div className="p-2 rounded text-xs font-mono bg-purple-500/10 border border-purple-500/20 text-purple-300">
                    {rsaStatus}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bottom Export Workbench */}
          <div className="mt-auto p-3 border-t border-[var(--border-dev)] bg-[var(--bg-panel)] flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
              <span className="flex items-center gap-1 font-semibold">
                <Terminal className="w-3.5 h-3.5" /> Quick Export Snippets
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => triggerCopy(`Bearer ${rawToken}`, 'Copied Bearer Token')}
                className="px-2.5 py-1.5 rounded bg-[var(--bg-panel-subtle)] hover:bg-[var(--pill-bg)] border border-[var(--border-dev)] hover:border-rose-500/40 text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3 h-3" /> Bearer Token
              </button>

              <button
                onClick={() =>
                  triggerCopy(
                    `curl -X GET "https://api.example.com/v1/user" \\\n  -H "Authorization: Bearer ${rawToken}"`,
                    'Copied cURL Command'
                  )
                }
                className="px-2.5 py-1.5 rounded bg-[var(--bg-panel-subtle)] hover:bg-[var(--pill-bg)] border border-[var(--border-dev)] hover:border-rose-500/40 text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Terminal className="w-3 h-3" /> cURL Request
              </button>

              <button
                onClick={() => triggerCopy(typeScriptDefinition, 'Copied TypeScript Types')}
                className="px-2.5 py-1.5 rounded bg-[var(--bg-panel-subtle)] hover:bg-[var(--pill-bg)] border border-[var(--border-dev)] hover:border-rose-500/40 text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Code2 className="w-3 h-3" /> TypeScript Interface
              </button>

              <button
                onClick={() =>
                  triggerCopy(
                    `await page.setExtraHTTPHeaders({\n  'Authorization': 'Bearer ${rawToken}'\n});`,
                    'Copied Playwright Snippet'
                  )
                }
                className="px-2.5 py-1.5 rounded bg-[var(--bg-panel-subtle)] hover:bg-[var(--pill-bg)] border border-[var(--border-dev)] hover:border-rose-500/40 text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3 h-3" /> Playwright Header
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
