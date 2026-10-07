'use client';

import React, { useState, useRef, useCallback } from 'react';
import { triggerFeedbackNudge } from '@/lib/feedbackNudge';
import {
  Upload, ShieldCheck, Cpu, Lock, CheckCircle2, AlertTriangle,
  Fingerprint, Activity, Image as ImageIcon, XCircle, RotateCcw,
  Info, Loader2, ScanEye, Wand2
} from 'lucide-react';
import { useClassifier, type ClassifierResult } from './ai-detector/useClassifier';
import { useC2pa, type C2paResult } from './ai-detector/useC2pa';
import { useSynthIdSignal, type SynthIdResult } from './ai-detector/useSynthIdSignal';
import { useExifProvenance, type ExifResult } from './ai-detector/useExifProvenance';
import { aggregateScore, type AggregateResult } from './ai-detector/aggregateScore';

/* ─── Helper: animated score arc ─────────────────────────────────────────── */
function ScoreArc({ score, isLoading }: { score: number; isLoading: boolean }) {
  const R = 54;
  const circ = 2 * Math.PI * R;
  const pct = isLoading ? 0 : Math.max(0, Math.min(1, score));
  const dash = pct * circ;
  const color = pct > 0.7 ? '#ef4444' : pct > 0.4 ? '#f59e0b' : '#10b981';

  return (
    <svg viewBox="0 0 120 120" className="w-36 h-36">
      <circle cx="60" cy="60" r={R} fill="none" stroke="var(--border-dev)" strokeWidth="10" />
      <circle
        cx="60" cy="60" r={R} fill="none"
        stroke={isLoading ? 'var(--border-dev)' : color}
        strokeWidth="10"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 60 60)"
        style={{ transition: 'stroke-dasharray 0.8s ease, stroke 0.5s ease' }}
      />
      <text x="60" y="54" textAnchor="middle" fill="var(--text-primary)" fontSize="20" fontWeight="700">
        {isLoading ? '…' : `${Math.round(pct * 100)}%`}
      </text>
      <text x="60" y="70" textAnchor="middle" fill="var(--text-secondary)" fontSize="9" fontWeight="500">
        {isLoading ? '' : 'AI SCORE'}
      </text>
    </svg>
  );
}

/* ─── Helper: layer card ──────────────────────────────────────────────────── */
type LayerStatus = 'idle' | 'loading' | 'done' | 'error';

interface LayerCardProps {
  icon: React.ReactNode;
  accentClass: string;
  title: string;
  subtitle: string;
  weight: string;
  status: LayerStatus;
  children: React.ReactNode;
}

function LayerCard({ icon, accentClass, title, subtitle, weight, status, children }: LayerCardProps) {
  const statusDot: Record<LayerStatus, React.ReactNode> = {
    idle: <span className="w-2 h-2 rounded-full bg-[var(--border-dev)] inline-block" />,
    loading: <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />,
    done: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />,
    error: <XCircle className="w-3.5 h-3.5 text-red-400" />,
  };

  return (
    <div className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-2xl p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[var(--color-accent)]/30">
      <div className="flex items-start gap-3 mb-4">
        <div className={`p-2 rounded-xl shrink-0 ${accentClass}`}>{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-[var(--text-primary)] leading-tight">{title}</h3>
            {statusDot[status]}
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">{subtitle}</p>
        </div>
        <span className="shrink-0 text-xs font-semibold text-[var(--text-secondary)] bg-[var(--bg-card)] border border-[var(--border-dev)] px-2 py-0.5 rounded-full">
          {weight}
        </span>
      </div>
      <div className="pl-11">{children}</div>
    </div>
  );
}

function WaitingRow() {
  return <p className="text-sm text-[var(--text-secondary)] italic">Upload an image to start analysis.</p>;
}

function LoadingRow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
      <Loader2 className="w-3.5 h-3.5 animate-spin" />{label}
    </div>
  );
}

function MiniBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="w-full bg-[var(--bg-card)] h-1.5 rounded-full overflow-hidden mt-2">
      <div
        className={`h-full rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${Math.round(value * 100)}%` }}
      />
    </div>
  );
}

/* ─── Main component ──────────────────────────────────────────────────────── */
export default function AiImageDetector() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [classifierResult, setClassifierResult] = useState<ClassifierResult | null>(null);
  const [c2paResult, setC2paResult] = useState<C2paResult | null>(null);
  const [synthIdResult, setSynthIdResult] = useState<SynthIdResult | null>(null);
  const [exifResult, setExifResult] = useState<ExifResult | null>(null);
  const [aggregate, setAggregate] = useState<AggregateResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { analyze: analyzeClassifier, isModelLoading } = useClassifier();
  const { analyze: analyzeC2pa, isC2paLoading } = useC2pa();
  const { analyze: analyzeSynthId, isSynthIdLoading } = useSynthIdSignal();
  const { analyze: analyzeExif, isExifLoading } = useExifProvenance();

  const reset = useCallback(() => {
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    setImageFile(null);
    setImagePreviewUrl(null);
    setClassifierResult(null);
    setC2paResult(null);
    setSynthIdResult(null);
    setExifResult(null);
    setAggregate(null);
  }, [imagePreviewUrl]);

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;

    reset();
    setImageFile(file);
    const objectUrl = URL.createObjectURL(file);
    setImagePreviewUrl(objectUrl);
    setIsAnalyzing(true);

    try {
      const [clsRes, c2paRes, synthRes, exifRes] = await Promise.all([
        analyzeClassifier(objectUrl),
        analyzeC2pa(file),
        analyzeSynthId(file),
        analyzeExif(file),
      ]);

      setClassifierResult(clsRes);
      setC2paResult(c2paRes);
      setSynthIdResult(synthRes);
      setExifResult(exifRes);

      const finalAgg = aggregateScore(clsRes, c2paRes, synthRes, exifRes);
      setAggregate(finalAgg);

      setTimeout(() => triggerFeedbackNudge('ai-image-detector'), 1200);
    } catch (e) {
      console.error('Detection failed', e);
    } finally {
      setIsAnalyzing(false);
    }
  }, [reset, analyzeClassifier, analyzeC2pa, analyzeSynthId, analyzeExif]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
  }, [handleFileUpload]);

  const verdictScore = aggregate?.score ?? 0;
  const verdictColor = verdictScore > 0.7
    ? { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-600 dark:text-red-400', label: 'Likely AI-Generated' }
    : verdictScore > 0.4
      ? { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-600 dark:text-amber-400', label: 'Uncertain / Inconclusive' }
      : { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-600 dark:text-emerald-400', label: 'Likely Authentic' };

  const clsStatus: LayerStatus = !imageFile ? 'idle' : isModelLoading || isAnalyzing ? 'loading' : classifierResult ? 'done' : 'idle';
  const c2paStatus: LayerStatus = !imageFile ? 'idle' : isC2paLoading || isAnalyzing ? 'loading' : c2paResult ? 'done' : 'idle';
  const synthStatus: LayerStatus = !imageFile ? 'idle' : isSynthIdLoading || isAnalyzing ? 'loading' : synthIdResult ? 'done' : 'idle';
  const exifStatus: LayerStatus = !imageFile ? 'idle' : isExifLoading || isAnalyzing ? 'loading' : exifResult ? 'done' : 'idle';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-[var(--text-primary)]">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ScanEye className="w-8 h-8 text-[var(--color-accent)]" />
            AI Image Detector
          </h1>
          <p className="text-[var(--text-secondary)] mt-1.5 text-sm max-w-xl">
            4-layer forensic analysis — deep learning, C2PA content credentials, SynthID frequency
            heuristic, and EXIF provenance. All in-browser, zero uploads.
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0">
          <Lock className="w-3.5 h-3.5" />
          100% Client-Side · Zero Uploads
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left: Upload & Preview */}
        <div className="lg:col-span-5 space-y-4">
          {!imagePreviewUrl ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[380px] group ${
                isDragging
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/5 scale-[1.01]'
                  : 'border-[var(--border-dev)] hover:border-[var(--color-accent)]/60 bg-[var(--bg-panel)]'
              }`}
            >
              <input
                type="file" ref={fileInputRef}
                onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
                accept="image/*" className="hidden"
              />
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-5 transition-colors border ${
                isDragging
                  ? 'bg-[var(--color-accent)]/10 border-[var(--color-accent)]/30'
                  : 'bg-[var(--bg-card)] border-[var(--border-dev)] group-hover:border-[var(--color-accent)]/40'
              }`}>
                <Upload className={`w-9 h-9 transition-colors ${isDragging ? 'text-[var(--color-accent)]' : 'text-[var(--text-secondary)]'}`} />
              </div>
              <h3 className="text-lg font-semibold mb-1">Drop your image here</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-4">or click to browse · JPG, PNG, WebP, AVIF</p>
              <span className="text-xs font-medium bg-[var(--bg-card)] border border-[var(--border-dev)] px-3 py-1 rounded-full text-[var(--text-secondary)]">
                Max 50 MB
              </span>
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden border border-[var(--border-dev)] bg-[var(--bg-panel)] shadow-sm">
              <div className="relative">
                <img
                  src={imagePreviewUrl} alt="Preview"
                  className="w-full h-auto max-h-[380px] object-contain bg-[var(--bg-card)]"
                />
                {isAnalyzing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-3 text-white">
                      <Loader2 className="w-8 h-8 animate-spin" />
                      <span className="text-sm font-medium">Analyzing…</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-3 flex items-center justify-between border-t border-[var(--border-dev)]">
                <span className="text-xs text-[var(--text-secondary)] truncate max-w-[60%]">{imageFile?.name}</span>
                <button
                  onClick={reset}
                  className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors border border-[var(--border-dev)] hover:border-[var(--color-accent)]/40 px-2.5 py-1 rounded-lg"
                >
                  <RotateCcw className="w-3 h-3" /> Analyze another
                </button>
              </div>
            </div>
          )}

          {/* Info card */}
          <div className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-2xl p-4 text-xs text-[var(--text-secondary)] space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-[var(--text-primary)]">
              <Info className="w-3.5 h-3.5" /> How it works
            </div>
            <p>All 4 detection layers run simultaneously in your browser. No data ever leaves your device.</p>
            <p>Results are advisory. For legal or professional use, combine with expert forensic review.</p>
          </div>
        </div>

        {/* Right: Verdict + Layers */}
        <div className="lg:col-span-7 space-y-4">

          {/* Verdict banner */}
          <div className={`rounded-2xl p-5 border shadow-sm transition-all duration-500 ${
            !imageFile
              ? 'bg-[var(--bg-panel)] border-[var(--border-dev)]'
              : isAnalyzing
                ? 'bg-[var(--bg-panel)] border-[var(--border-dev)] animate-pulse'
                : aggregate
                  ? `${verdictColor.bg} ${verdictColor.border}`
                  : 'bg-[var(--bg-panel)] border-[var(--border-dev)]'
          }`}>
            <div className="flex items-center gap-5">
              <ScoreArc score={verdictScore} isLoading={!aggregate} />
              <div className="flex-1">
                {!imageFile ? (
                  <p className="text-sm text-[var(--text-secondary)]">Upload an image to see the verdict.</p>
                ) : isAnalyzing ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-[var(--text-secondary)]" />
                      <span className="font-semibold">Running analysis…</span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">All 4 layers are running in parallel.</p>
                  </>
                ) : aggregate ? (
                  <>
                    <div className={`text-xl font-bold ${verdictColor.text}`}>
                      {verdictScore > 0.7
                        ? <span className="flex items-center gap-2"><AlertTriangle className="w-5 h-5" />{verdictColor.label}</span>
                        : verdictScore > 0.4
                          ? <span className="flex items-center gap-2"><Wand2 className="w-5 h-5" />{verdictColor.label}</span>
                          : <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5" />{verdictColor.label}</span>
                      }
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">{aggregate.verdict}</p>
                    <MiniBar
                      value={verdictScore}
                      color={verdictScore > 0.7 ? 'bg-red-500' : verdictScore > 0.4 ? 'bg-amber-500' : 'bg-emerald-500'}
                    />
                  </>
                ) : null}
              </div>
            </div>
          </div>

          {/* Layer 1: ML Classifier */}
          <LayerCard
            icon={<Cpu className="w-4 h-4" />}
            accentClass="bg-blue-500/10 text-blue-600 dark:text-blue-400"
            title="Deep Learning Classifier"
            subtitle="ResNet-50 model via WebGPU / WASM"
            weight="50% weight"
            status={clsStatus}
          >
            {!imageFile ? <WaitingRow /> :
              clsStatus === 'loading' ? <LoadingRow label="Loading model weights…" /> :
              classifierResult ? (
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-secondary)]">Prediction</span>
                    <span className={`font-semibold ${classifierResult.label === 'AI' ? 'text-red-500' : 'text-emerald-500'}`}>
                      {classifierResult.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                    <span>Real ←</span><span>→ AI</span>
                  </div>
                  <div className="w-full bg-[var(--bg-card)] h-2 rounded-full overflow-hidden flex">
                    <div className="bg-emerald-500 h-full transition-all duration-700" style={{ width: `${(1 - classifierResult.score) * 100}%` }} />
                    <div className="bg-red-500 h-full transition-all duration-700" style={{ width: `${classifierResult.score * 100}%` }} />
                  </div>
                  <p className="text-xs text-[var(--text-secondary)]">{(classifierResult.confidence * 100).toFixed(1)}% model confidence</p>
                </div>
              ) : <WaitingRow />
            }
          </LayerCard>

          {/* Layer 2: C2PA */}
          <LayerCard
            icon={<ShieldCheck className="w-4 h-4" />}
            accentClass="bg-purple-500/10 text-purple-600 dark:text-purple-400"
            title="C2PA Content Credentials"
            subtitle="Cryptographic provenance manifest (CAI standard)"
            weight="30% weight"
            status={c2paStatus}
          >
            {!imageFile ? <WaitingRow /> :
              c2paStatus === 'loading' ? <LoadingRow label="Parsing C2PA manifest…" /> :
              c2paResult ? (
                <div className="space-y-1.5 text-sm">
                  {c2paResult.hasManifest ? (
                    <>
                      <p className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Signed manifest found
                      </p>
                      {c2paResult.producer && (
                        <p className="text-[var(--text-secondary)]">
                          Producer: <strong className="text-[var(--text-primary)]">{c2paResult.producer}</strong>
                        </p>
                      )}
                      {c2paResult.isAI && (
                        <p className="text-red-500 font-medium flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" /> Generative AI action confirmed in manifest
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-[var(--text-secondary)] flex items-center gap-1.5">
                      <XCircle className="w-3.5 h-3.5" /> No C2PA manifest — image is unsigned
                    </p>
                  )}
                </div>
              ) : <WaitingRow />
            }
          </LayerCard>

          {/* Layer 3: SynthID */}
          <LayerCard
            icon={<Activity className="w-4 h-4" />}
            accentClass="bg-amber-500/10 text-amber-600 dark:text-amber-400"
            title="SynthID Frequency Heuristic"
            subtitle="Statistical high-frequency pattern analysis"
            weight="10% weight"
            status={synthStatus}
          >
            {!imageFile ? <WaitingRow /> :
              synthStatus === 'loading' ? <LoadingRow label="Analyzing frequency patterns…" /> :
              synthIdResult ? (
                <div className="space-y-2 text-sm">
                  <p className={synthIdResult.detected ? 'text-amber-600 dark:text-amber-400 font-medium' : 'text-[var(--text-secondary)]'}>
                    {synthIdResult.detected
                      ? 'Anomalous high-frequency embedding detected'
                      : 'Normal frequency distribution'}
                  </p>
                  <MiniBar value={synthIdResult.score} color={synthIdResult.score > 0.5 ? 'bg-amber-500' : 'bg-emerald-500'} />
                  <p className="text-xs text-[var(--text-secondary)] bg-[var(--bg-card)] border border-[var(--border-dev)] p-2 rounded-lg leading-relaxed">
                    Definitive SynthID decoding requires Google's private key. This is a statistical proxy only.
                  </p>
                </div>
              ) : <WaitingRow />
            }
          </LayerCard>

          {/* Layer 4: EXIF */}
          <LayerCard
            icon={<ImageIcon className="w-4 h-4" />}
            accentClass="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            title="EXIF Provenance"
            subtitle="Metadata tags — software, camera model, GPS, timestamps"
            weight="10% weight"
            status={exifStatus}
          >
            {!imageFile ? <WaitingRow /> :
              exifStatus === 'loading' ? <LoadingRow label="Reading EXIF metadata…" /> :
              exifResult ? (
                <div className="space-y-1.5 text-sm">
                  {exifResult.hasExif ? (
                    <>
                      <p className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> EXIF metadata present
                      </p>
                      {exifResult.software && (
                        <p className="text-[var(--text-secondary)]">
                          Software: <strong className="text-[var(--text-primary)]">{exifResult.software}</strong>
                        </p>
                      )}
                      {exifResult.isAI && (
                        <p className="text-red-500 font-medium flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" /> Known AI generator identified in metadata
                        </p>
                      )}
                      {exifResult.isReal && (
                        <p className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Authentic camera signals detected
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-[var(--text-secondary)] flex items-center gap-1.5">
                      <XCircle className="w-3.5 h-3.5" /> No EXIF found — metadata stripped or absent
                    </p>
                  )}
                </div>
              ) : <WaitingRow />
            }
          </LayerCard>

        </div>
      </div>
    </div>
  );
}
