'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {
  Upload,
  Download,
  Copy,
  Check,
  RefreshCw,
  Sliders,
  Eye,
  Columns,
  FileImage,
  Cpu,
  ShieldCheck,
  Zap,
  ChevronRight,
  AlertCircle,
  X,
  Maximize2,
  Lock,
  Unlock,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Palette,
  Sparkles,
  Layers,
  SlidersHorizontal,
  Camera,
  CheckCircle2,
  HardDrive,
  ArrowRight,
  Pipette,
  ImagePlus,
  Crosshair,
  MoveHorizontal
} from 'lucide-react';

interface MattePreset {
  id: string;
  name: string;
  color: string; // CSS color or gradient
  icon?: React.ReactNode;
}

interface Point {
  x: number;
  y: number;
}

interface BrushPath {
  type: 'restore' | 'erase';
  size: number;
  points: Point[];
}

interface SampleImage {
  id: string;
  name: string;
  category: string;
  url: string;
}

const SAMPLE_IMAGES: SampleImage[] = [
  { id: 'sample-sneaker', name: 'Athletic Sneaker', category: 'Product', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80' },
  { id: 'sample-portrait', name: 'Studio Portrait', category: 'People', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80' },
  { id: 'sample-headphones', name: 'Headphones', category: 'Tech Gadget', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80' },
  { id: 'sample-watch', name: 'Minimalist Watch', category: 'Luxury', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80' },
  { id: 'sample-car', name: 'Classic Car', category: 'Vehicle', url: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800&q=80' },
  { id: 'sample-backpack', name: 'Yellow Backpack', category: 'Product', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80' },
  { id: 'sample-chair', name: 'Modern Chair', category: 'Furniture', url: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=800&q=80' },
  { id: 'sample-puppy', name: 'Cute Puppy', category: 'Animals', url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80' },
  { id: 'sample-cat', name: 'Domestic Cat', category: 'Animals', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80' },
  { id: 'sample-plant', name: 'Potted Plant', category: 'Botanical', url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80' },
  { id: 'sample-drone', name: 'Drone', category: 'Tech Gadget', url: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&w=800&q=80' },
  { id: 'sample-portrait-2', name: 'Male Portrait', category: 'People', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80' },
  { id: 'sample-bicycle', name: 'Vintage Bicycle', category: 'Vehicle', url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80' },
  { id: 'sample-motorcycle', name: 'Custom Moto', category: 'Vehicle', url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80' },
  { id: 'sample-statue', name: 'Classical Statue', category: 'Art & Sculpture', url: 'https://images.unsplash.com/photo-1541336032412-2048a678540d?auto=format&fit=crop&w=800&q=80' }
];

type ModelQuality = 'isnet_fp16' | 'isnet' | 'isnet_quint8';
type ExportFormat = 'image/png' | 'image/webp' | 'image/jpeg';
type ViewMode = 'slider' | 'split' | 'result' | 'original';
type StudioTab = 'matte' | 'transform' | 'filters';

type OutputType = 'foreground' | 'mask';

interface MatteOption {
  id: string;
  name: string;
  type: 'transparent' | 'original' | 'blurred-original' | 'color' | 'gradient' | 'custom-image';
  value: string;
}

const MATTE_OPTIONS: MatteOption[] = [
  { id: 'transparent', name: 'Transparent (Alpha)', type: 'transparent', value: 'transparent' },
  { id: 'original', name: 'Original Background', type: 'original', value: 'original' },
  { id: 'blurred-original', name: 'Portrait Bokeh Blur', type: 'blurred-original', value: 'blurred-original' },
  { id: 'white', name: 'Studio White', type: 'color', value: '#ffffff' },
  { id: 'black', name: 'Carbon Black', type: 'color', value: '#06090f' },
  { id: 'slate', name: 'Cyber Slate', type: 'color', value: '#1e293b' },
  { id: 'rose', name: 'Vibrant Rose', type: 'color', value: '#f43f5e' },
  { id: 'emerald', name: 'Emerald Mint', type: 'color', value: '#10b981' },
  { id: 'gradient-sunset', name: 'Sunset Glow', type: 'gradient', value: 'linear-gradient(135deg, #f43f5e, #f59e0b)' },
  { id: 'gradient-cyber', name: 'Cyber Neon', type: 'gradient', value: 'linear-gradient(135deg, #06b6d4, #8b5cf6)' },
  { id: 'gradient-ocean', name: 'Ocean Breeze', type: 'gradient', value: 'linear-gradient(135deg, #667eea, #764ba2)' },
  { id: 'gradient-forest', name: 'Forest Green', type: 'gradient', value: 'linear-gradient(135deg, #11998e, #38ef7d)' },
  { id: 'gradient-midnight', name: 'Midnight Purple', type: 'gradient', value: 'linear-gradient(135deg, #2b5876, #4e4376)' },
  { id: 'gradient-peach', name: 'Warm Peach', type: 'gradient', value: 'linear-gradient(135deg, #ffecd2, #fcb69f)' },
];

const SHADOW_COLORS = [
  { label: 'Deep Black', value: 'rgba(0, 0, 0, 0.6)' },
  { label: 'Soft Charcoal', value: 'rgba(15, 23, 42, 0.45)' },
  { label: 'Rose Glow', value: 'rgba(244, 63, 94, 0.5)' },
  { label: 'Cyan Aura', value: 'rgba(6, 182, 212, 0.5)' },
];

// Robust image loader that works with blob:, data:, and http(s): URLs without CORS or COEP decode errors
const safeLoadImage = async (url: string): Promise<HTMLImageElement> => {
  let objectUrlToRevoke: string | null = null;
  let finalUrl = url;

  // If it is a remote HTTP(S) URL, fetch as blob first to completely bypass CORS cache poisoning and COEP blocking!
  if (url.startsWith('http://') || url.startsWith('https://')) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const blob = await res.blob();
        finalUrl = URL.createObjectURL(blob);
        objectUrlToRevoke = finalUrl;
      }
    } catch {
      finalUrl = url;
    }
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    // Only set crossOrigin for external http(s) URLs if not already converted to a local blob URL
    if (finalUrl.startsWith('http://') || finalUrl.startsWith('https://')) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => {
      if (objectUrlToRevoke) URL.revokeObjectURL(objectUrlToRevoke);
      resolve(img);
    };
    img.onerror = () => {
      if (objectUrlToRevoke) URL.revokeObjectURL(objectUrlToRevoke);
      reject(new Error(`Image failed to load in canvas: ${url.slice(0, 60)}`));
    };
    img.src = finalUrl;
  });
};

type TargetFileSizePreset = 'full' | '1000kb' | '500kb' | '200kb' | 'custom';

interface FileSizePresetOption {
  id: TargetFileSizePreset;
  label: string;
  sub: string;
  bytes: number | null;
}

const FILE_SIZE_PRESETS: FileSizePresetOption[] = [
  { id: 'full', label: 'Full Quality', sub: 'Max Fidelity', bytes: null },
  { id: '1000kb', label: '< 1 MB', sub: 'High Detail', bytes: 1024 * 1024 },
  { id: '500kb', label: '< 500 KB', sub: 'Web Optimized', bytes: 500 * 1024 },
  { id: '200kb', label: '< 200 KB', sub: 'Ultra Light', bytes: 200 * 1024 },
  { id: 'custom', label: 'Custom', sub: 'Specific KB', bytes: null },
];

const canvasToBlobAsync = (cvs: HTMLCanvasElement, fmt: string, q: number): Promise<Blob | null> => {
  return new Promise((resolve) => cvs.toBlob(resolve, fmt, q));
};

async function optimizeCanvasOutput(
  canvas: HTMLCanvasElement,
  format: ExportFormat,
  targetBytes: number | null
): Promise<{ blob: Blob; width: number; height: number; qualityUsed: number }> {
  let currentCanvas = canvas;
  let quality = 0.95;

  // 1. Initial full-quality attempt
  let blob = await canvasToBlobAsync(currentCanvas, format, quality);
  if (!blob) throw new Error('Canvas conversion failed');

  // If no target limit or already under budget, return immediately
  if (!targetBytes || blob.size <= targetBytes) {
    return {
      blob,
      width: currentCanvas.width,
      height: currentCanvas.height,
      qualityUsed: quality,
    };
  }

  // 2. Format-specific optimization:
  // For WebP and JPEG, binary search quality first (leaves resolution untouched!)
  if (format === 'image/webp' || format === 'image/jpeg') {
    let lowQ = 0.15;
    let highQ = 0.92;
    let bestBlob = blob;
    let bestQuality = quality;

    for (let i = 0; i < 5; i++) {
      const midQ = (lowQ + highQ) / 2;
      const testBlob = await canvasToBlobAsync(currentCanvas, format, midQ);
      if (testBlob) {
        if (testBlob.size <= targetBytes) {
          bestBlob = testBlob;
          bestQuality = midQ;
          lowQ = midQ;
        } else {
          highQ = midQ;
        }
      }
    }

    if (bestBlob.size <= targetBytes) {
      return {
        blob: bestBlob,
        width: currentCanvas.width,
        height: currentCanvas.height,
        qualityUsed: Math.round(bestQuality * 100) / 100,
      };
    }

    quality = 0.65;
  }

  // 3. Proportional resolution downscaling (for PNG or very large WebP/JPEG)
  let scale = Math.min(0.94, Math.sqrt(targetBytes / blob.size) * 0.96);
  for (let attempt = 0; attempt < 3; attempt++) {
    const nextW = Math.max(32, Math.round(canvas.width * scale));
    const nextH = Math.max(32, Math.round(canvas.height * scale));

    const scaledCanvas = document.createElement('canvas');
    scaledCanvas.width = nextW;
    scaledCanvas.height = nextH;
    const sCtx = scaledCanvas.getContext('2d');
    if (!sCtx) break;

    sCtx.imageSmoothingEnabled = true;
    sCtx.imageSmoothingQuality = 'high';
    sCtx.drawImage(canvas, 0, 0, nextW, nextH);

    const testBlob = await canvasToBlobAsync(scaledCanvas, format, quality);
    if (testBlob) {
      blob = testBlob;
      currentCanvas = scaledCanvas;
      if (blob.size <= targetBytes) {
        break;
      }
      scale = scale * 0.85;
    }
  }

  return {
    blob,
    width: currentCanvas.width,
    height: currentCanvas.height,
    qualityUsed: Math.round(quality * 100) / 100,
  };
}

export interface BgRemovalClientProps {
  initialMode?: 'bg-removal' | 'resizer' | 'compressor';
}

export function BgRemovalClient({ initialMode = 'bg-removal' }: BgRemovalClientProps) {
  // Image State
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [sourceBlob, setSourceBlob] = useState<Blob | null>(null);
  const [sourceFile, setSourceFile] = useState<{ name: string; size: number; width: number; height: number } | null>(null);

  // Crop & Undo State
  const [originalSourceImage, setOriginalSourceImage] = useState<string | null>(null);
  const [originalSourceBlob, setOriginalSourceBlob] = useState<Blob | null>(null);
  const [originalSourceFile, setOriginalSourceFile] = useState<{ name: string; size: number; width: number; height: number } | null>(null);
  const [isCropMode, setIsCropMode] = useState<boolean>(false);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);

  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);

  // Random sample state
  const [displaySamples, setDisplaySamples] = useState<SampleImage[]>(() => SAMPLE_IMAGES.slice(0, 4));

  useEffect(() => {
    shuffleSamples();
  }, []);

  const shuffleSamples = () => {
    const shuffled = [...SAMPLE_IMAGES].sort(() => 0.5 - Math.random());
    setDisplaySamples(shuffled.slice(0, 4));
  };

  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStage, setProgressStage] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [processingTimeMs, setProcessingTimeMs] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Model and Engine Configuration
  const [modelQuality, setModelQuality] = useState<ModelQuality>('isnet_fp16');
  const [outputType, setOutputType] = useState<OutputType>('foreground');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('image/png');
  const [selectedMatte, setSelectedMatte] = useState<string>('transparent');
  const [customColor, setCustomColor] = useState<string>('#3b82f6');
  const [customBgImage, setCustomBgImage] = useState<Blob | null>(null);
  const [customBgImageUrl, setCustomBgImageUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<StudioTab>(
    initialMode === 'resizer' || initialMode === 'compressor' ? 'transform' : 'matte'
  );

  // View and Inspection Controls
  const [viewMode, setViewMode] = useState<ViewMode>(
    initialMode === 'bg-removal' ? 'slider' : 'result'
  );
  const [sliderPosition, setSliderPosition] = useState<number>(50);

  // Sync viewMode and activeTab when initialMode prop changes (e.g. client route transitions)
  const prevInitialModeRef = useRef(initialMode);
  useEffect(() => {
    if (prevInitialModeRef.current !== initialMode) {
      prevInitialModeRef.current = initialMode;
      setViewMode(initialMode === 'bg-removal' ? 'slider' : 'result');
      setActiveTab(initialMode === 'resizer' || initialMode === 'compressor' ? 'transform' : 'matte');
    }
  }, [initialMode]);

  // Advanced Image Editing Attributes
  const [scalePreset, setScalePreset] = useState<number>(1);
  const [targetWidth, setTargetWidth] = useState<number>(0);
  const [targetHeight, setTargetHeight] = useState<number>(0);
  const [aspectRatioLocked, setAspectRatioLocked] = useState<boolean>(true);
  const [paddingPx, setPaddingPx] = useState<number>(0);

  // Transformations and Filters
  const [rotationDeg, setRotationDeg] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);

  // Color adjustments
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [saturation, setSaturation] = useState<number>(100);
  const [edgeCrispness, setEdgeCrispness] = useState<number>(0);
  const [featherRadius, setFeatherRadius] = useState<number>(0);

  // Chroma Key Cleanup
  const [isChromaKeyActive, setIsChromaKeyActive] = useState<boolean>(false);
  const [chromaKeyColor, setChromaKeyColor] = useState<string>('#00ff00');
  const [chromaKeyTolerance, setChromaKeyTolerance] = useState<number>(20);
  
  // Brush Mode State
  const [isBrushModeActive, setIsBrushModeActive] = useState<boolean>(false);
  const [isSingleStrokeMode, setIsSingleStrokeMode] = useState<boolean>(true);
  const [brushType, setBrushType] = useState<'restore' | 'erase'>('restore');
  const [brushSize, setBrushSize] = useState<number>(30);
  const [brushPaths, setBrushPaths] = useState<BrushPath[]>([]);
  const [brushPreviewUrl, setBrushPreviewUrl] = useState<string | null>(null);
  
  const brushPreviewUrlRef = useRef<string | null>(null);
  const currentPathRef = useRef<BrushPath | null>(null);
  const canvasOverlayRef = useRef<HTMLCanvasElement>(null);
  const [chromaPreviewUrl, setChromaPreviewUrl] = useState<string | null>(null);

  // Drop Shadow
  const [hasDropShadow, setHasDropShadow] = useState<boolean>(false);
  const [shadowBlur, setShadowBlur] = useState<number>(20);
  const [shadowOffsetY, setShadowOffsetY] = useState<number>(12);
  const [shadowColor, setShadowColor] = useState<string>('rgba(0, 0, 0, 0.55)');

  // Final Export Preview Modal State
  const [isExporting, setIsExporting] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [finalExportUrl, setFinalExportUrl] = useState<string | null>(null);
  const [finalExportBlob, setFinalExportBlob] = useState<Blob | null>(null);
  const [targetFileSize, setTargetFileSize] = useState<TargetFileSizePreset>('full');
  const [customTargetKb, setCustomTargetKb] = useState<number>(500);
  const [exportDimensions, setExportDimensions] = useState<{ width: number; height: number } | null>(null);
  const [exportQualityUsed, setExportQualityUsed] = useState<number | null>(null);
  const [originalExportSize, setOriginalExportSize] = useState<number | null>(null);

  // UI state
  const [isDragging, setIsDragging] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const isSlidingRef = useRef(false);
  const resultUrlRef = useRef<string | null>(null);
  const exportUrlRef = useRef<string | null>(null);

  useEffect(() => {
    resultUrlRef.current = resultImageUrl;
  }, [resultImageUrl]);

  useEffect(() => {
    exportUrlRef.current = finalExportUrl;
  }, [finalExportUrl]);

  const chromaPreviewUrlRef = useRef<string | null>(null);
  useEffect(() => {
    chromaPreviewUrlRef.current = chromaPreviewUrl;
  }, [chromaPreviewUrl]);

  useEffect(() => {
    brushPreviewUrlRef.current = brushPreviewUrl;
  }, [brushPreviewUrl]);

  // Cleanup object URLs strictly when component unmounts
  useEffect(() => {
    return () => {
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
      if (exportUrlRef.current) URL.revokeObjectURL(exportUrlRef.current);
      if (chromaPreviewUrlRef.current) URL.revokeObjectURL(chromaPreviewUrlRef.current);
      if (brushPreviewUrlRef.current) URL.revokeObjectURL(brushPreviewUrlRef.current);
    };
  }, []);

  // Live preview generation for Chroma Key (Runs AFTER Brush Mode)
  useEffect(() => {
    if (!isChromaKeyActive || !chromaKeyColor) {
      if (chromaPreviewUrl) {
        URL.revokeObjectURL(chromaPreviewUrl);
        setChromaPreviewUrl(null);
      }
      return;
    }
    
    let isCancelled = false;
    
    const runChroma = async () => {
      try {
        const sourceUrl = brushPreviewUrl || resultImageUrl || sourceImage;
        if (!sourceUrl) return;
        
        let img: HTMLImageElement;
        try {
          img = await safeLoadImage(sourceUrl);
        } catch (e) {
          console.error('Chroma Image load error for URL:', sourceUrl, e);
          return;
        }
        
        if (isCancelled) return;
        if (img.naturalWidth === 0 || img.naturalHeight === 0) return;
        
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;
        
        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        
        const hex = chromaKeyColor.replace('#', '');
        const targetR = parseInt(hex.substring(0, 2), 16);
        const targetG = parseInt(hex.substring(2, 4), 16);
        const targetB = parseInt(hex.substring(4, 6), 16);
        const maxDist = (chromaKeyTolerance / 100) * 250;
        
        for (let i = 0; i < data.length; i += 4) {
          if (data[i+3] === 0) continue;
          const r = data[i], g = data[i+1], b = data[i+2];
          const dist = Math.sqrt(Math.pow(r - targetR, 2) + Math.pow(g - targetG, 2) + Math.pow(b - targetB, 2));
          if (dist < maxDist) data[i+3] = 0;
          else if (dist < maxDist + 30) {
            const alphaFactor = (dist - maxDist) / 30;
            data[i+3] = Math.min(data[i+3], data[i+3] * alphaFactor);
          }
        }
        ctx.putImageData(imgData, 0, 0);
        
        canvas.toBlob(blob => {
          if (blob && !isCancelled) {
            const url = URL.createObjectURL(blob);
            setChromaPreviewUrl(prev => {
              if (prev) URL.revokeObjectURL(prev);
              return url;
            });
          }
        }, 'image/png');
      } catch (err) {
        console.error('Chroma live preview error:', err);
      }
    };
    
    const timer = setTimeout(runChroma, 30);
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [isChromaKeyActive, chromaKeyColor, chromaKeyTolerance, brushPreviewUrl, resultImageUrl, sourceImage]);

  // Live preview generation for Brush Mode (Runs BEFORE Chroma Key)
  useEffect(() => {
    if (brushPaths.length === 0) {
      if (brushPreviewUrl) {
        URL.revokeObjectURL(brushPreviewUrl);
        setBrushPreviewUrl(null);
      }
      return;
    }
    
    let isCancelled = false;
    
    const runBrush = async () => {
      try {
        const baseImgUrl = resultImageUrl || sourceImage;
        if (!baseImgUrl) return;
        
        const baseImg = await safeLoadImage(baseImgUrl);
        if (isCancelled) return;
        
        const canvas = document.createElement('canvas');
        canvas.width = baseImg.naturalWidth;
        canvas.height = baseImg.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        ctx.drawImage(baseImg, 0, 0);
        
        const origImg = sourceImage ? await safeLoadImage(sourceImage) : null;
        if (isCancelled) return;
        
        const strokeCanvas = document.createElement('canvas');
        strokeCanvas.width = canvas.width;
        strokeCanvas.height = canvas.height;
        const sCtx = strokeCanvas.getContext('2d');
        
        if (sCtx) {
          for (const path of brushPaths) {
            if (!path || !path.points || path.points.length === 0) continue;
            
            if (path.type === 'erase') {
              ctx.globalCompositeOperation = 'destination-out';
              ctx.lineCap = 'round';
              ctx.lineJoin = 'round';
              ctx.lineWidth = path.size;
              ctx.beginPath();
              ctx.moveTo(path.points[0].x, path.points[0].y);
              for (let i = 1; i < path.points.length; i++) {
                ctx.lineTo(path.points[i].x, path.points[i].y);
              }
              ctx.stroke();
              ctx.globalCompositeOperation = 'source-over';
            } else if (path.type === 'restore' && origImg) {
              sCtx.clearRect(0, 0, canvas.width, canvas.height);
              sCtx.globalCompositeOperation = 'source-over';
              sCtx.drawImage(origImg, 0, 0);
              
              sCtx.globalCompositeOperation = 'destination-in';
              sCtx.lineCap = 'round';
              sCtx.lineJoin = 'round';
              sCtx.lineWidth = path.size;
              sCtx.strokeStyle = 'black'; // Explicitly set stroke color
              sCtx.beginPath();
              sCtx.moveTo(path.points[0].x, path.points[0].y);
              for (let i = 1; i < path.points.length; i++) {
                sCtx.lineTo(path.points[i].x, path.points[i].y);
              }
              sCtx.stroke();
              
              // Restore the default composite operation just in case
              sCtx.globalCompositeOperation = 'source-over';
              
              ctx.drawImage(strokeCanvas, 0, 0);
            }
          }
        }
        
        canvas.toBlob(blob => {
          if (blob && !isCancelled) {
            const url = URL.createObjectURL(blob);
            setBrushPreviewUrl(prev => {
              if (prev) URL.revokeObjectURL(prev);
              return url;
            });
            // Clear overlay now that the live composite engine has rendered the final stroke
            if (canvasOverlayRef.current) {
              const oCtx = canvasOverlayRef.current.getContext('2d');
              if (oCtx) {
                oCtx.clearRect(0, 0, canvasOverlayRef.current.width, canvasOverlayRef.current.height);
              }
            }
          }
        }, 'image/png');
        
      } catch (err) {
        console.error('Brush live preview error:', err);
      }
    };
    
    const timer = setTimeout(runBrush, 30); 
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [brushPaths, resultImageUrl, sourceImage]);

  // Eagerly preload AI model weights + compile WASM during browser idle time
  useEffect(() => {
    const doPreload = async () => {
      try {
        const { preload } = await import('@imgly/background-removal');
        await preload({
          device: 'gpu',
          proxyToWorker: true,
          model: modelQuality,
        });
      } catch {
        // Silent — preload is best-effort; processImage will retry anyway
      }
    };

    if (typeof requestIdleCallback !== 'undefined') {
      const id = requestIdleCallback(() => doPreload());
      return () => cancelIdleCallback(id);
    } else {
      // Fallback: delay 2s so initial paint isn't blocked
      const timer = setTimeout(doPreload, 2000);
      return () => clearTimeout(timer);
    }
  }, [modelQuality]);

  // Main processing pipeline
  const processImage = useCallback(async (imageInput: string | Blob, fileName: string, fileSize: number) => {
    setIsProcessing(true);
    setErrorMessage(null);
    setProgressPercent(5);
    setProgressStage('Initializing Edge AI WebAssembly engine...');
    setSliderPosition(50); // Guarantee center slider
    const startTime = performance.now();

    try {
      const { removeBackground } = await import('@imgly/background-removal');

      const blobResult = await removeBackground(imageInput, {
        publicPath: `${window.location.origin}/assets/imgly-v1.7.0/`,
        device: 'gpu',
        proxyToWorker: true,
        model: modelQuality,
        output: {
          format: 'image/png',
          quality: 1,
          // @ts-ignore
          type: outputType,
        },
        progress: (key: string, current: number, total: number) => {
          let stageLabel = 'Downloading AI model weights...';
          if (key.includes('inference') || key.includes('compute')) {
            stageLabel = 'Running neural segmentation...';
          } else if (key.includes('wasm') || key.includes('runtime')) {
            stageLabel = 'Compiling WebAssembly ONNX runtime...';
          }

          setProgressStage(stageLabel);
          if (total > 0) {
            const pct = Math.min(98, Math.max(5, Math.round((current / total) * 100)));
            setProgressPercent(pct);
          } else {
            setProgressPercent(prev => Math.min(prev + 5, 92));
          }
        },
      });

      const endTime = performance.now();
      setProcessingTimeMs(Math.round(endTime - startTime));
      setProgressPercent(100);
      setProgressStage('Background removed successfully!');
      setSliderPosition(50); // Guarantee center slider

      setProcessedBlob(blobResult);
      if (resultImageUrl) URL.revokeObjectURL(resultImageUrl);
      const url = URL.createObjectURL(blobResult);
      setResultImageUrl(url);
      setViewMode('slider');
      setActiveTab('matte');
    } catch (err: unknown) {
      console.error('Background removal error:', err);
      const errStr = err instanceof Error ? err.message : String(err);
      setErrorMessage(`Failed to process image: ${errStr}. Ensure WebGPU/WASM is supported.`);
    } finally {
      setIsProcessing(false);
    }
  }, [modelQuality, outputType, resultImageUrl]);

  // On-demand AI Background Removal Trigger
  const handleTriggerBgRemoval = useCallback(() => {
    if (!sourceBlob && !sourceImage) return;
    const input = sourceBlob || sourceImage!;
    const name = sourceFile?.name || 'image.png';
    const size = sourceFile?.size || 500000;
    processImage(input, name, size);
  }, [sourceBlob, sourceImage, sourceFile, processImage]);

  // Logo Mode: one-click preset for sharp logo edges
  const handleLogoMode = useCallback(() => {
    setModelQuality('isnet');
    setEdgeCrispness(30);
    // Re-run if we already have a source
    if (sourceBlob || sourceImage) {
      const input = sourceBlob || sourceImage!;
      const name = sourceFile?.name || 'image.png';
      const size = sourceFile?.size || 500000;
      // Defer to next tick so model quality state update is picked up
      setTimeout(() => processImage(input, name, size), 50);
    }
  }, [sourceBlob, sourceImage, sourceFile, processImage]);

  // Handle Output Type Change: One-click re-run
  const handleOutputTypeChange = useCallback((newType: OutputType) => {
    if (newType === outputType) return;
    setOutputType(newType);
    if (sourceBlob || sourceImage) {
      const input = sourceBlob || sourceImage!;
      const name = sourceFile?.name || 'image.png';
      const size = sourceFile?.size || 500000;
      setTimeout(() => processImage(input, name, size), 50);
    }
  }, [outputType, sourceBlob, sourceImage, sourceFile, processImage]);

  // Custom background image upload handler
  const customBgInputRef = useRef<HTMLInputElement>(null);
  const handleCustomBgUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    // Revoke previous custom bg URL to avoid memory leak
    if (customBgImageUrl) URL.revokeObjectURL(customBgImageUrl);
    const url = URL.createObjectURL(file);
    setCustomBgImage(file);
    setCustomBgImageUrl(url);
    setSelectedMatte('custom-image');
  };

  // Load from File (Upload or Drop) - 0ms Instant Canvas Load without auto-running heavy AI model
  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, WebP, AVIF).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setSourceImage(dataUrl);
      setSourceBlob(file);
      setOriginalSourceImage(dataUrl);
      setOriginalSourceBlob(file);

      // Immediately measure true natural dimensions of the image
      const img = new Image();
      img.onload = () => {
        const w = img.naturalWidth || 800;
        const h = img.naturalHeight || 800;
        const fileInfo = { name: file.name, size: file.size, width: w, height: h };
        setSourceFile(fileInfo);
        setOriginalSourceFile(fileInfo);
        setTargetWidth(w);
        setTargetHeight(h);
        setScalePreset(1);
      };
      img.onerror = () => {
        setSourceFile({ name: file.name, size: file.size, width: 800, height: 800 });
        setTargetWidth(800);
        setTargetHeight(800);
        setScalePreset(1);
      };
      img.src = dataUrl;

      setProcessedBlob(null);
      if (resultImageUrl) URL.revokeObjectURL(resultImageUrl);
      setResultImageUrl(null);
      setSliderPosition(50);
      setViewMode(initialMode === 'bg-removal' ? 'slider' : 'result');
      resetAdjustments();
    };
    reader.readAsDataURL(file);
  };

  // Load from Pre-loaded Samples - Instant Studio preview without auto-running model
  const handleSelectSample = async (sample: SampleImage) => {
    setErrorMessage(null);
    setSourceImage(sample.url);
    setOriginalSourceImage(sample.url);
    setProcessedBlob(null);
    if (resultImageUrl) URL.revokeObjectURL(resultImageUrl);
    setResultImageUrl(null);
    setSliderPosition(50);
    setViewMode(initialMode === 'bg-removal' ? 'slider' : 'result');
    resetAdjustments();

    // Immediately measure natural dimensions of the sample image
    const sampleImg = new Image();
    sampleImg.crossOrigin = 'anonymous';
    sampleImg.onload = () => {
      const w = sampleImg.naturalWidth || 800;
      const h = sampleImg.naturalHeight || 800;
      const fileInfo = { name: `${sample.id}.jpg`, size: 280000, width: w, height: h };
      setSourceFile(fileInfo);
      setOriginalSourceFile(fileInfo);
      setTargetWidth(w);
      setTargetHeight(h);
      setScalePreset(1);
    };
    sampleImg.onerror = () => {
      setSourceFile({ name: `${sample.id}.jpg`, size: 280000, width: 800, height: 800 });
      setTargetWidth(800);
      setTargetHeight(800);
      setScalePreset(1);
    };
    sampleImg.src = sample.url;

    try {
      setIsProcessing(true);
      setProgressStage('Loading sample image into studio...');
      setProgressPercent(50);

      const res = await fetch(sample.url);
      const blob = await res.blob();
      setSourceBlob(blob);
      setOriginalSourceBlob(blob);
      setProgressPercent(100);
    } catch (err) {
      console.warn('Sample fetch failed:', err);
      setErrorMessage('Failed to fetch sample image. Please try another or upload your own file.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Drag and Drop handlers
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Interactive Slider mouse/touch drag handlers
  const handleSliderMove = useCallback((clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    if (rect.width <= 0) return;
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(pct);
  }, []);

  const onMouseDown = () => {
    isSlidingRef.current = true;
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isSlidingRef.current) {
        handleSliderMove(e.clientX);
      }
    };
    const onMouseUp = () => {
      isSlidingRef.current = false;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [handleSliderMove]);

  // Dimension scaling handlers
  const handleScalePresetChange = (scale: number) => {
    setScalePreset(scale);
    const baseW = sourceFile?.width || targetWidth || 800;
    const baseH = sourceFile?.height || targetHeight || 800;
    setTargetWidth(Math.round(baseW * scale));
    setTargetHeight(Math.round(baseH * scale));
  };

  const handleWidthChange = (w: number) => {
    const validW = Math.max(16, w || 16);
    setTargetWidth(validW);
    if (aspectRatioLocked && sourceFile?.width && sourceFile?.height && sourceFile.width > 0) {
      const ratio = sourceFile.height / sourceFile.width;
      setTargetHeight(Math.max(16, Math.round(validW * ratio)));
    }
  };

  const handleHeightChange = (h: number) => {
    const validH = Math.max(16, h || 16);
    setTargetHeight(validH);
    if (aspectRatioLocked && sourceFile?.width && sourceFile?.height && sourceFile.height > 0) {
      const ratio = sourceFile.width / sourceFile.height;
      setTargetWidth(Math.max(16, Math.round(validH * ratio)));
    }
  };

  // Reset adjustments
  const resetAdjustments = () => {
    if (sourceFile?.width && sourceFile?.height) {
      setTargetWidth(sourceFile.width);
      setTargetHeight(sourceFile.height);
    }
    setScalePreset(1);
    setPaddingPx(0);
    setRotationDeg(0);
    setFlipH(false);
    setFlipV(false);
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setEdgeCrispness(0);
    setFeatherRadius(0);
    setIsChromaKeyActive(false);
    setChromaKeyColor('#00ff00');
    setChromaKeyTolerance(20);
    setHasDropShadow(false);
    setSelectedMatte('transparent');
  };

  // Full composite render to canvas for download or clipboard copy
  const renderCompositeCanvas = async (): Promise<HTMLCanvasElement | null> => {
    const blobToUse = processedBlob || sourceBlob;
    const urlToUse = resultImageUrl || sourceImage;
    if (!blobToUse && !urlToUse) return null;

    // Load cutout bitmap or source image safely from memory buffer without CORS/COEP decode issues
    let img: ImageBitmap | HTMLImageElement;
    if (processedBlob && typeof createImageBitmap === 'function') {
      try {
        img = await createImageBitmap(processedBlob);
      } catch {
        img = await safeLoadImage(resultImageUrl || '');
      }
    } else if (sourceBlob && !processedBlob && typeof createImageBitmap === 'function') {
      try {
        img = await createImageBitmap(sourceBlob);
      } catch {
        img = await safeLoadImage(sourceImage || '');
      }
    } else if (urlToUse) {
      img = await safeLoadImage(urlToUse);
    } else {
      return null;
    }

    const currentMatte = MATTE_OPTIONS.find(m => m.id === selectedMatte);
    // For custom-color, build an ephemeral matte
    const activeMatte: MatteOption | undefined = selectedMatte === 'custom-color'
      ? { id: 'custom-color', name: 'Custom', type: 'color', value: customColor }
      : selectedMatte === 'custom-image'
        ? { id: 'custom-image', name: 'Custom Image', type: 'custom-image', value: '' }
        : currentMatte;

    const naturalW = 'naturalWidth' in img ? img.naturalWidth : img.width;
    const naturalH = 'naturalHeight' in img ? img.naturalHeight : img.height;

    // Final output dimensions
    const baseW = targetWidth > 0 ? targetWidth : (naturalW || 800);
    const baseH = targetHeight > 0 ? targetHeight : (naturalH || 800);

    // Additional canvas dimensions accounting for padding
    const outW = Math.max(16, baseW + paddingPx * 2);
    const outH = Math.max(16, baseH + paddingPx * 2);

    const canvas = document.createElement('canvas');
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // 1. Draw Backdrop / Matte
    if (activeMatte && activeMatte.type !== 'transparent') {
      if ((activeMatte.type === 'original' || activeMatte.type === 'blurred-original') && (sourceBlob || sourceImage)) {
        let srcImg: ImageBitmap | HTMLImageElement | null = null;
        try {
          if (sourceBlob && typeof createImageBitmap === 'function') {
            srcImg = await createImageBitmap(sourceBlob);
          } else if (sourceImage) {
            srcImg = await safeLoadImage(sourceImage);
          }
        } catch (e) {
          console.warn('Could not load backdrop image, proceeding with clean canvas:', e);
        }

        if (srcImg) {
          const sw = 'naturalWidth' in srcImg ? srcImg.naturalWidth : srcImg.width;
          const sh = 'naturalHeight' in srcImg ? srcImg.naturalHeight : srcImg.height;
          const sAspect = (sw > 0 && sh > 0) ? sw / sh : 1;
          const dAspect = outW / outH;
          let sx = 0, sy = 0, sWidth = sw, sHeight = sh;
          if (sAspect > dAspect) {
            sWidth = sh * dAspect;
            sx = (sw - sWidth) / 2;
          } else {
            sHeight = sw / dAspect;
            sy = (sh - sHeight) / 2;
          }

          if (activeMatte.type === 'blurred-original') {
            ctx.save();
            ctx.filter = 'blur(16px)';
            const bleed = 24;
            ctx.drawImage(srcImg, sx, sy, sWidth, sHeight, -bleed, -bleed, outW + bleed * 2, outH + bleed * 2);
            ctx.restore();
          } else {
            ctx.drawImage(srcImg, sx, sy, sWidth, sHeight, 0, 0, outW, outH);
          }
        }
      } else if (activeMatte.type === 'color') {
        ctx.fillStyle = activeMatte.value;
        ctx.fillRect(0, 0, outW, outH);
      } else if (activeMatte.type === 'gradient') {
        const grad = ctx.createLinearGradient(0, 0, outW, outH);
        // Parse gradient colors from value string: "linear-gradient(135deg, #color1, #color2)"
        const colorMatch = activeMatte.value.match(/#[0-9a-fA-F]{6}/g);
        if (colorMatch && colorMatch.length >= 2) {
          grad.addColorStop(0, colorMatch[0]);
          grad.addColorStop(1, colorMatch[1]);
        } else {
          grad.addColorStop(0, '#06b6d4');
          grad.addColorStop(1, '#8b5cf6');
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, outW, outH);
      } else if (activeMatte.type === 'custom-image' && customBgImage) {
        try {
          let bgImg: ImageBitmap | HTMLImageElement;
          if (typeof createImageBitmap === 'function') {
            bgImg = await createImageBitmap(customBgImage);
          } else {
            bgImg = await safeLoadImage(customBgImageUrl || '');
          }
          const bw = 'naturalWidth' in bgImg ? bgImg.naturalWidth : bgImg.width;
          const bh = 'naturalHeight' in bgImg ? bgImg.naturalHeight : bgImg.height;
          const bAspect = (bw > 0 && bh > 0) ? bw / bh : 1;
          const dAspect = outW / outH;
          let bsx = 0, bsy = 0, bsW = bw, bsH = bh;
          if (bAspect > dAspect) {
            bsW = bh * dAspect;
            bsx = (bw - bsW) / 2;
          } else {
            bsH = bw / dAspect;
            bsy = (bh - bsH) / 2;
          }
          ctx.drawImage(bgImg, bsx, bsy, bsW, bsH, 0, 0, outW, outH);
        } catch (e) {
          console.warn('Custom backdrop image failed:', e);
        }
      }
    }

    // 2. Setup Context Transformations (Center point, Rotation, Flip)
    ctx.save();
    ctx.translate(outW / 2, outH / 2);

    if (rotationDeg !== 0) {
      ctx.rotate((rotationDeg * Math.PI) / 180);
    }
    const scaleX = flipH ? -1 : 1;
    const scaleY = flipV ? -1 : 1;
    ctx.scale(scaleX, scaleY);

    // 3. Setup Drop Shadow (if enabled)
    if (hasDropShadow) {
      ctx.shadowColor = shadowColor;
      ctx.shadowBlur = shadowBlur;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = shadowOffsetY;
    }

    // 4. Setup Filters (Brightness, Contrast, Saturation)
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;

    let finalSubjectImg: CanvasImageSource = img;

    // 5. Apply Manual Brush Strokes (Runs BEFORE Chroma Key)
    if (brushPaths.length > 0) {
      const brushCvs = document.createElement('canvas');
      brushCvs.width = naturalW;
      brushCvs.height = naturalH;
      const bCtx = brushCvs.getContext('2d');
      if (bCtx) {
        bCtx.drawImage(finalSubjectImg, 0, 0);
        
        let origImg: HTMLImageElement | null = null;
        if (sourceImage) {
          try {
             origImg = await safeLoadImage(sourceImage);
          } catch(e) {}
        }
        
        const strokeCanvas = document.createElement('canvas');
        strokeCanvas.width = naturalW;
        strokeCanvas.height = naturalH;
        const sCtx = strokeCanvas.getContext('2d');
        
        if (sCtx) {
          for (const path of brushPaths) {
            if (!path || !path.points || path.points.length === 0) continue;
            
            if (path.type === 'erase') {
              bCtx.globalCompositeOperation = 'destination-out';
              bCtx.lineCap = 'round';
              bCtx.lineJoin = 'round';
              bCtx.lineWidth = path.size;
              bCtx.beginPath();
              bCtx.moveTo(path.points[0].x, path.points[0].y);
              for (let i = 1; i < path.points.length; i++) bCtx.lineTo(path.points[i].x, path.points[i].y);
              bCtx.stroke();
              bCtx.globalCompositeOperation = 'source-over';
            } else if (path.type === 'restore' && origImg) {
              sCtx.clearRect(0, 0, naturalW, naturalH);
              sCtx.globalCompositeOperation = 'source-over';
              sCtx.drawImage(origImg, 0, 0);
              sCtx.globalCompositeOperation = 'destination-in';
              sCtx.lineCap = 'round';
              sCtx.lineJoin = 'round';
              sCtx.lineWidth = path.size;
              sCtx.beginPath();
              sCtx.moveTo(path.points[0].x, path.points[0].y);
              for (let i = 1; i < path.points.length; i++) sCtx.lineTo(path.points[i].x, path.points[i].y);
              sCtx.stroke();
              
              bCtx.drawImage(strokeCanvas, 0, 0);
            }
          }
        }
        finalSubjectImg = brushCvs;
      }
    }

    // 6. Chroma Key (Color-based background removal cleanup, runs AFTER Brush)
    if (isChromaKeyActive && chromaKeyColor) {
      const hex = chromaKeyColor.replace('#', '');
      const targetR = parseInt(hex.substring(0, 2), 16);
      const targetG = parseInt(hex.substring(2, 4), 16);
      const targetB = parseInt(hex.substring(4, 6), 16);
      
      const tempCvs = document.createElement('canvas');
      tempCvs.width = naturalW;
      tempCvs.height = naturalH;
      const tCtx = tempCvs.getContext('2d');
      if (tCtx) {
        tCtx.drawImage(finalSubjectImg, 0, 0);
        const imgData = tCtx.getImageData(0, 0, naturalW, naturalH);
        const data = imgData.data;
        
        // Euclidean distance threshold max is roughly 441 (sqrt(255^2*3)). 
        // We map tolerance 0-100 to a reasonable distance threshold (0 to ~250).
        const maxDist = (chromaKeyTolerance / 100) * 250;
        
        for (let i = 0; i < data.length; i += 4) {
          if (data[i+3] === 0) continue; // already transparent
          const r = data[i];
          const g = data[i+1];
          const b = data[i+2];
          
          const dist = Math.sqrt(Math.pow(r - targetR, 2) + Math.pow(g - targetG, 2) + Math.pow(b - targetB, 2));
          
          if (dist < maxDist) {
            // Full transparent
            data[i+3] = 0;
          } else if (dist < maxDist + 30) {
            // Smooth blending at the edge of the tolerance
            const alphaFactor = (dist - maxDist) / 30;
            data[i+3] = Math.min(data[i+3], data[i+3] * alphaFactor);
          }
        }
        tCtx.putImageData(imgData, 0, 0);
        finalSubjectImg = tempCvs;
      }
    }

    // 7. Apply Edge Crispness (Alpha Threshold) if needed before drawing
    if (edgeCrispness > 0) {
      const tempCvs = document.createElement('canvas');
      tempCvs.width = naturalW;
      tempCvs.height = naturalH;
      const tCtx = tempCvs.getContext('2d');
      if (tCtx) {
        tCtx.drawImage(finalSubjectImg, 0, 0);
        const imgData = tCtx.getImageData(0, 0, naturalW, naturalH);
        const data = imgData.data;
        const threshold = Math.round((edgeCrispness / 100) * 255);
        for (let i = 3; i < data.length; i += 4) {
          data[i] = data[i] > threshold ? 255 : 0;
        }
        tCtx.putImageData(imgData, 0, 0);
        finalSubjectImg = tempCvs;
      }
    }

    // 8. Apply Feather (soft Gaussian blur on alpha edges)
    if (featherRadius > 0 && finalSubjectImg instanceof HTMLCanvasElement) {
      const fCvs = finalSubjectImg;
      const fCtx = fCvs.getContext('2d');
      if (fCtx) {
        fCtx.save();
        fCtx.globalCompositeOperation = 'destination-in';
        // Draw a slightly blurred copy to soften edges
        const blurCvs = document.createElement('canvas');
        blurCvs.width = fCvs.width;
        blurCvs.height = fCvs.height;
        const blurCtx = blurCvs.getContext('2d');
        if (blurCtx) {
          blurCtx.filter = `blur(${featherRadius}px)`;
          blurCtx.drawImage(fCvs, 0, 0);
          fCtx.drawImage(blurCvs, 0, 0);
        }
        fCtx.restore();
      }
    } else if (featherRadius > 0) {
      // Need to create a temp canvas from the image first
      const tempCvs = document.createElement('canvas');
      tempCvs.width = naturalW;
      tempCvs.height = naturalH;
      const tCtx = tempCvs.getContext('2d');
      if (tCtx) {
        tCtx.drawImage(finalSubjectImg, 0, 0);
        tCtx.save();
        tCtx.globalCompositeOperation = 'destination-in';
        const blurCvs = document.createElement('canvas');
        blurCvs.width = naturalW;
        blurCvs.height = naturalH;
        const blurCtx = blurCvs.getContext('2d');
        if (blurCtx) {
          blurCtx.filter = `blur(${featherRadius}px)`;
          blurCtx.drawImage(tempCvs, 0, 0);
          tCtx.drawImage(blurCvs, 0, 0);
        }
        tCtx.restore();
        finalSubjectImg = tempCvs;
      }
    }

    // 8. Draw the Subject Cutout with aspect-ratio preservation (object-contain)
    const imgAspect = (naturalW > 0 && naturalH > 0) ? naturalW / naturalH : 1;
    const artboardAspect = baseW / baseH;
    let drawW = baseW;
    let drawH = baseH;

    if (artboardAspect > imgAspect) {
      drawH = baseH;
      drawW = baseH * imgAspect;
    } else {
      drawW = baseW;
      drawH = baseW / imgAspect;
    }

    ctx.drawImage(finalSubjectImg, -drawW / 2, -drawH / 2, drawW, drawH);

    ctx.restore();
    return canvas;
  };

  // Generate optimized output blob according to format and target size budget
  const generateExportBlob = async (
    targetFmt: ExportFormat = exportFormat,
    targetSizePreset: TargetFileSizePreset = targetFileSize,
    customKbVal: number = customTargetKb
  ) => {
    if (!sourceBlob && !sourceImage && !processedBlob && !resultImageUrl) return;
    setIsExporting(true);
    setErrorMessage(null);

    try {
      const canvas = await renderCompositeCanvas();
      if (!canvas) {
        setIsExporting(false);
        return;
      }

      // Compute target budget in bytes
      let targetBytes: number | null = null;
      if (targetSizePreset === '1000kb') targetBytes = 1024 * 1024;
      else if (targetSizePreset === '500kb') targetBytes = 500 * 1024;
      else if (targetSizePreset === '200kb') targetBytes = 200 * 1024;
      else if (targetSizePreset === 'custom') targetBytes = Math.max(10, customKbVal) * 1024;

      // Also record raw uncompressed size for comparison if targeting a budget
      if (targetBytes) {
        const rawBlob = await canvasToBlobAsync(canvas, targetFmt, 0.95);
        if (rawBlob) setOriginalExportSize(rawBlob.size);
      } else {
        setOriginalExportSize(null);
      }

      const result = await optimizeCanvasOutput(canvas, targetFmt, targetBytes);

      if (finalExportUrl) URL.revokeObjectURL(finalExportUrl);
      const url = URL.createObjectURL(result.blob);
      setFinalExportBlob(result.blob);
      setFinalExportUrl(url);
      setExportDimensions({ width: result.width, height: result.height });
      setExportQualityUsed(result.qualityUsed);
      setPreviewModalOpen(true);
    } catch (err) {
      console.error('Render preview error:', err);
      setErrorMessage('Could not render export preview. Please check image format.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleOpenExportPreview = () => {
    generateExportBlob(exportFormat, targetFileSize, customTargetKb);
  };

  const handleModalFormatChange = (newFmt: ExportFormat) => {
    setExportFormat(newFmt);
    generateExportBlob(newFmt, targetFileSize, customTargetKb);
  };

  const handleModalTargetSizeChange = (newPreset: TargetFileSizePreset) => {
    setTargetFileSize(newPreset);
    generateExportBlob(exportFormat, newPreset, customTargetKb);
  };

  // Trigger actual file save from Modal or direct
  const handleConfirmDownload = () => {
    if (!finalExportBlob || !finalExportUrl) return;
    const ext = exportFormat === 'image/webp' ? 'webp' : exportFormat === 'image/jpeg' ? 'jpg' : 'png';
    const cleanName = sourceFile?.name ? sourceFile.name.replace(/\.[^/.]+$/, '') : 'image';
    const outW = exportDimensions?.width || (targetWidth + paddingPx * 2);
    const outH = exportDimensions?.height || (targetHeight + paddingPx * 2);
    const sizeTag = targetFileSize !== 'full' ? `-${Math.round(finalExportBlob.size / 1024)}kb` : '';
    const suffix = processedBlob ? '-cutout' : '-edited';

    const a = document.createElement('a');
    a.href = finalExportUrl;
    a.download = `${cleanName}${suffix}-${outW}x${outH}${sizeTag}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Copy Cutout directly to Clipboard as Image
  const handleCopyClipboard = async () => {
    if (!sourceBlob && !sourceImage && !processedBlob) return;
    setIsExporting(true);

    try {
      const canvas = await renderCompositeCanvas();
      if (!canvas) return;

      const blobToCopy = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), 'image/png')
      );

      if (blobToCopy) {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blobToCopy })]);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (err) {
      console.warn('Clipboard image write failed:', err);
      setErrorMessage('Could not copy image directly to clipboard. Please use Download.');
    } finally {
      setIsExporting(false);
    }
  };

  // Helper to map object-contain mouse coordinates to intrinsic pixels
  const getIntrinsicCoordinates = (e: React.PointerEvent<HTMLCanvasElement>, canvas: HTMLCanvasElement) => {
    const rectW = canvas.offsetWidth;
    const rectH = canvas.offsetHeight;
    const intrinsicW = canvas.width;
    const intrinsicH = canvas.height;
    
    if (intrinsicW === 0 || intrinsicH === 0) return { pxX: 0, pxY: 0 };

    const imgAspect = intrinsicW / intrinsicH;
    const rectAspect = rectW / rectH;

    let renderW, renderH, offsetX, offsetY;

    if (rectAspect > imgAspect) {
      renderH = rectH;
      renderW = rectH * imgAspect;
      offsetX = (rectW - renderW) / 2;
      offsetY = 0;
    } else {
      renderW = rectW;
      renderH = rectW / imgAspect;
      offsetX = 0;
      offsetY = (rectH - renderH) / 2;
    }

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - offsetX;
    const y = e.clientY - rect.top - offsetY;

    return {
      pxX: (x / renderW) * intrinsicW,
      pxY: (y / renderH) * intrinsicH
    };
  };

  // Brush Event Handlers
  const handleBrushPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isBrushModeActive) return;
    const canvas = e.currentTarget;
    e.currentTarget.setPointerCapture(e.pointerId);
    
    const { pxX, pxY } = getIntrinsicCoordinates(e, canvas);
    
    const newPath: BrushPath = { type: brushType, size: brushSize, points: [{ x: pxX, y: pxY }] };
    currentPathRef.current = newPath;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
       ctx.lineCap = 'round';
       ctx.lineJoin = 'round';
       ctx.lineWidth = brushSize;
       ctx.strokeStyle = brushType === 'restore' ? 'rgba(16, 185, 129, 0.6)' : 'rgba(239, 68, 68, 0.6)';
       ctx.beginPath();
       ctx.moveTo(pxX, pxY);
       ctx.lineTo(pxX, pxY);
       ctx.stroke();
    }
  };

  const handleBrushPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isBrushModeActive || !currentPathRef.current) return;
    const canvas = e.currentTarget;
    
    const { pxX, pxY } = getIntrinsicCoordinates(e, canvas);
    
    currentPathRef.current.points.push({ x: pxX, y: pxY });
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
       ctx.lineTo(pxX, pxY);
       ctx.stroke();
    }
  };

  const handleBrushPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isBrushModeActive || !currentPathRef.current) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    
    // Capture the object reference before nullifying the ref, 
    // because React 18 state updater callbacks can be executed asynchronously!
    const finalPath = currentPathRef.current;
    setBrushPaths(prev => [...prev, finalPath]);
    
    currentPathRef.current = null;
    
    if (isSingleStrokeMode) {
      setIsBrushModeActive(false);
    }
  };

  const undoLastBrushStroke = () => {
    setBrushPaths(prev => prev.slice(0, -1));
  };
  
  const clearAllBrushStrokes = () => {
    setBrushPaths([]);
  };

  // Reset to upload screen
  const handleReset = () => {
    setSourceImage(null);
    setSourceBlob(null);
    setSourceFile(null);
    setOriginalSourceImage(null);
    setOriginalSourceBlob(null);
    setOriginalSourceFile(null);
    setIsCropMode(false);
    setCrop(undefined);
    setCompletedCrop(undefined);
    setProcessedBlob(null);
    if (resultImageUrl) URL.revokeObjectURL(resultImageUrl);
    setResultImageUrl(null);
    if (finalExportUrl) URL.revokeObjectURL(finalExportUrl);
    setFinalExportUrl(null);
    if (chromaPreviewUrl) URL.revokeObjectURL(chromaPreviewUrl);
    setChromaPreviewUrl(null);
    if (brushPreviewUrl) URL.revokeObjectURL(brushPreviewUrl);
    setBrushPreviewUrl(null);
    
    setFinalExportBlob(null);
    setPreviewModalOpen(false);
    setProcessingTimeMs(null);
    setErrorMessage(null);
    setProgressPercent(0);
    setSliderPosition(50);
    setViewMode(initialMode === 'bg-removal' ? 'slider' : 'result');
    resetAdjustments();
    
    // Reset advanced modes
    setIsChromaKeyActive(false);
    setIsBrushModeActive(false);
    setBrushPaths([]);
  };

  const activeMatteObj: MatteOption | undefined = selectedMatte === 'custom-color'
    ? { id: 'custom-color', name: `Custom (${customColor})`, type: 'color', value: customColor }
    : selectedMatte === 'custom-image'
      ? { id: 'custom-image', name: 'Custom Image', type: 'custom-image', value: '' }
      : MATTE_OPTIONS.find(m => m.id === selectedMatte);

  const handleApplyCrop = async () => {
    if (!completedCrop || !completedCrop.width || !completedCrop.height || !imgRef.current) return;

    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(completedCrop.width * scaleX);
    canvas.height = Math.round(completedCrop.height * scaleY);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const croppedBlob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png', 1));
    if (!croppedBlob) return;
    const croppedUrl = URL.createObjectURL(croppedBlob);

    setSourceBlob(croppedBlob);
    setSourceImage(croppedUrl);
    setSourceFile(prev => prev ? { ...prev, width: canvas.width, height: canvas.height } : null);

    setTargetWidth(canvas.width);
    setTargetHeight(canvas.height);
    setIsCropMode(false);
    setCrop(undefined);
    setCompletedCrop(undefined);

    // Reset brush strokes because the pixel coordinate space has changed
    setBrushPaths([]);
    setIsBrushModeActive(false);

    setProcessedBlob(null);
    if (resultImageUrl) URL.revokeObjectURL(resultImageUrl);
    setResultImageUrl(null);
  };

  const handleUndoCrop = () => {
    if (originalSourceImage && originalSourceBlob && originalSourceFile) {
      setSourceImage(originalSourceImage);
      setSourceBlob(originalSourceBlob);
      setSourceFile(originalSourceFile);
      setTargetWidth(originalSourceFile.width);
      setTargetHeight(originalSourceFile.height);
      setIsCropMode(false);
      setCrop(undefined);
      setCompletedCrop(undefined);

      setProcessedBlob(null);
      if (resultImageUrl) URL.revokeObjectURL(resultImageUrl);
      setResultImageUrl(null);
    }
  };

  // Computed Aspect Ratio for the live workspace artboard with safe bounds
  const targetAspect = useMemo(() => {
    const w = targetWidth + paddingPx * 2;
    const h = targetHeight + paddingPx * 2;
    if (w > 10 && h > 10) {
      return w / h;
    }
    if (sourceFile?.width && sourceFile?.height && sourceFile.height > 0) {
      return sourceFile.width / sourceFile.height;
    }
    return 1;
  }, [targetWidth, targetHeight, paddingPx, sourceFile]);

  const safeAspect = useMemo(() => {
    return Math.max(0.2, Math.min(5, Number.isFinite(targetAspect) && targetAspect > 0 ? targetAspect : 1));
  }, [targetAspect]);

  const safeSliderPos = useMemo(() => {
    return Number.isFinite(sliderPosition) ? Math.max(0, Math.min(100, sliderPosition)) : 50;
  }, [sliderPosition]);

  // CSS Filter string for real-time preview canvas
  const previewFilterStyle = useMemo(() => {
    const filters: string[] = [];
    if (brightness !== 100) filters.push(`brightness(${brightness}%)`);
    if (contrast !== 100) filters.push(`contrast(${contrast}%)`);
    if (saturation !== 100) filters.push(`saturate(${saturation}%)`);
    if (edgeCrispness > 0) filters.push(`url(#crisp-edges)`);
    if (hasDropShadow) {
      filters.push(`drop-shadow(0px ${shadowOffsetY}px ${shadowBlur}px ${shadowColor})`);
    }
    return filters.join(' ');
  }, [brightness, contrast, saturation, edgeCrispness, hasDropShadow, shadowBlur, shadowOffsetY, shadowColor]);

  const previewTransformStyle = useMemo(() => {
    const transforms: string[] = [];
    if (rotationDeg !== 0) transforms.push(`rotate(${rotationDeg}deg)`);
    if (flipH) transforms.push('scaleX(-1)');
    if (flipV) transforms.push('scaleY(-1)');
    return transforms.join(' ');
  }, [rotationDeg, flipH, flipV]);

  const hasCutout = !!resultImageUrl || isChromaKeyActive;

  return (
    <div className="w-full h-full flex flex-col bg-[var(--bg-app)] text-[var(--text-primary)] select-none overflow-hidden font-mono">
      {/* SVG Filter Definition for Edge Crispness */}
      {edgeCrispness > 0 && (
        <svg width="0" height="0" className="absolute pointer-events-none">
          <filter id="crisp-edges">
            <feComponentTransfer>
              <feFuncA type="linear" slope="1000" intercept={-(edgeCrispness / 100) * 1000} />
            </feComponentTransfer>
          </filter>
        </svg>
      )}

      {/* Main Studio Body */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        {/* Left Side: Interactive Canvas and Viewport */}
        <div className="flex-1 flex flex-col min-w-0 bg-[var(--bg-app)] relative overflow-hidden">
          {/* Error Banner */}
          {errorMessage && (
            <div className="m-3 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center justify-between gap-2 shrink-0 z-30">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button onClick={() => setErrorMessage(null)} className="p-1 hover:text-white cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Upload / Dropzone state when no image is loaded */}
          {!sourceImage && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto">
              {/* Studio Tool Navigation Switcher */}
              <div className="w-full max-w-xl mb-4 flex items-center justify-center gap-1.5 p-1 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-dev)] text-xs shadow-sm">
                <Link
                  href="/background-remover"
                  className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 font-bold transition-all text-center ${initialMode === 'bg-removal'
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--pill-bg)]'
                    }`}
                >
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">AI BG Removal</span>
                </Link>
                <Link
                  href="/image-resizer"
                  className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 font-bold transition-all text-center ${initialMode === 'resizer'
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--pill-bg)]'
                    }`}
                >
                  <Maximize2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Resizer &amp; Artboard</span>
                </Link>
                <Link
                  href="/image-compressor"
                  className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 font-bold transition-all text-center ${initialMode === 'compressor'
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--pill-bg)]'
                    }`}
                >
                  <HardDrive className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Compressor &amp; WebP</span>
                </Link>
              </div>

              <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full max-w-xl p-8 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer group ${isDragging
                    ? 'border-rose-500 bg-rose-500/5 scale-[1.01]'
                    : 'border-[var(--border-dev)] bg-[var(--bg-panel)] hover:border-rose-500/50 hover:bg-[var(--bg-panel-hover)]'
                  }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/avif"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileSelect(e.target.files[0]);
                    }
                  }}
                />

                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500/20 via-amber-500/20 to-cyan-500/20 border border-[var(--border-dev)] flex items-center justify-center text-rose-500 mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-rose-500/10">
                  <Upload className="w-6 h-6" />
                </div>

                <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">
                  Drop your image here, or <span className="text-rose-500 underline underline-offset-2">browse file</span>
                </h3>
                <p className="text-xs text-[var(--text-secondary)] max-w-sm mb-4">
                  {initialMode === 'resizer'
                    ? '100% Client-side. Resize, crop, pad, and scale unlimited images instantly with no signup and zero server uploads.'
                    : initialMode === 'compressor'
                      ? '100% Client-side. Compress unlimited images under target budgets (<500 KB, <1 MB) with no signup and convert to WebP, PNG, or JPEG.'
                      : '100% Client-Side Edge AI. Remove backgrounds from unlimited images with no signup, zero server uploads, and high-resolution cutouts.'}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] text-[var(--text-muted)] font-mono">
                  <span className="px-2 py-0.5 rounded bg-[var(--bg-sidebar)] border border-[var(--border-dev)]">
                    {initialMode === 'resizer' ? 'Pixel-Exact Resizing' : initialMode === 'compressor' ? 'Size Budget Optimizer' : 'WebGPU Neural AI'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-emerald-500 font-bold">No Signup</span>
                  <span className="px-2 py-0.5 rounded bg-[var(--bg-sidebar)] border border-[var(--border-dev)]">Zero Cloud Uploads</span>
                  <span className="px-2 py-0.5 rounded bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-rose-500 font-bold">Free &amp; Unlimited</span>
                </div>
              </div>

              {/* Sample Quick-Picks Section */}
              <div className="w-full max-w-xl mt-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    Or test with developer sample assets
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[var(--text-muted)] hidden sm:inline-block">Instant Studio Preview</span>
                    <button
                      onClick={shuffleSamples}
                      className="flex items-center gap-1 text-[10px] bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-[var(--text-primary)] hover:bg-[var(--bg-panel-hover)] transition-colors cursor-pointer px-2 py-1 rounded"
                      title="Load new random samples"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Shuffle
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {displaySamples.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => handleSelectSample(sample)}
                      className="flex flex-col text-left p-2 rounded-lg border border-[var(--border-dev)] bg-[var(--bg-panel)] hover:border-rose-500/40 hover:bg-[var(--bg-panel-hover)] transition-all group cursor-pointer"
                    >
                      <div className="w-full h-24 rounded-md overflow-hidden bg-[var(--bg-sidebar)] mb-2 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={sample.url}
                          alt={sample.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1.5">
                          <span className="text-[9px] text-white font-bold flex items-center gap-1">
                            Load Studio <ChevronRight className="w-2.5 h-2.5" />
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-[var(--text-primary)] truncate">{sample.name}</span>
                      <span className="text-[9px] text-[var(--text-muted)] truncate">{sample.category}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Active Image Inspection Canvas */}
          {sourceImage && (
            <div className="flex-1 flex flex-col min-h-0 relative">
              {/* Contextual Canvas Control Bar (Sticky) */}
              <div className="h-10 bg-[var(--bg-panel)] border-b border-[var(--border-dev)] px-3 sm:px-4 flex items-center justify-between gap-2 shrink-0 z-30 sticky top-0 backdrop-blur-md shadow-xs">
                {/* View Mode Selector */}
                <div className="flex items-center gap-1 bg-[var(--bg-sidebar)] p-0.5 rounded border border-[var(--border-dev)] text-[11px]">
                  <button
                    onClick={() => {
                      setViewMode('slider');
                      setSliderPosition(50);
                    }}
                    className={`px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer transition-colors ${viewMode === 'slider' ? 'bg-rose-500 text-white font-bold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    title="Interactive Before/After Comparison Slider"
                  >
                    <Sliders className="w-3 h-3" />
                    <span className="hidden sm:inline">Slider (50/50)</span>
                  </button>
                  <button
                    onClick={() => setViewMode('split')}
                    className={`px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer transition-colors ${viewMode === 'split' ? 'bg-rose-500 text-white font-bold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    title="Side-by-Side Comparison"
                  >
                    <Columns className="w-3 h-3" />
                    <span className="hidden sm:inline">Side-by-Side</span>
                  </button>
                  <button
                    onClick={() => setViewMode('result')}
                    className={`px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer transition-colors ${viewMode === 'result' ? 'bg-rose-500 text-white font-bold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    title={resultImageUrl ? "Cutout Result Only" : "Live Artboard Preview"}
                  >
                    <Eye className="w-3 h-3" />
                    <span className="hidden sm:inline">{resultImageUrl ? 'Cutout' : 'Artboard'}</span>
                  </button>
                  <button
                    onClick={() => setViewMode('original')}
                    className={`px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer transition-colors ${viewMode === 'original' ? 'bg-rose-500 text-white font-bold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    title="Original Source Image"
                  >
                    <FileImage className="w-3 h-3" />
                    <span className="hidden sm:inline">Original</span>
                  </button>
                </div>

                {/* Right options: Trigger AI BG Removal, Model Engine, and New Image action */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTriggerBgRemoval}
                    disabled={isProcessing}
                    className={`px-2.5 py-1 text-[11px] rounded-md flex items-center gap-1.5 cursor-pointer font-bold transition-all ${resultImageUrl
                        ? 'bg-[var(--bg-sidebar)] border border-rose-500/40 text-rose-500 hover:bg-rose-500/10'
                        : 'bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white shadow-sm shadow-rose-500/20'
                      } disabled:opacity-50`}
                    title="Run Edge AI WebAssembly background removal"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{resultImageUrl ? 'Re-run AI' : '✨ Remove Background (AI)'}</span>
                  </button>

                  <div className="hidden lg:flex items-center gap-1 text-[11px] bg-[var(--bg-sidebar)] px-2 py-0.5 rounded border border-[var(--border-dev)]">
                    <Cpu className="w-3 h-3 text-[var(--text-muted)]" />
                    <select
                      value={modelQuality}
                      disabled={isProcessing}
                      onChange={(e) => setModelQuality(e.target.value as ModelQuality)}
                      className="bg-transparent text-[11px] text-[var(--text-primary)] outline-none cursor-pointer"
                    >
                      <option value="isnet" className="bg-[var(--bg-panel)]">Ultra Detail (Logos & Hard Edges)</option>
                      <option value="isnet_fp16" className="bg-[var(--bg-panel)]">Balanced (Photos & Portraits)</option>
                      <option value="isnet_quint8" className="bg-[var(--bg-panel)]">Fast & Light (Low Spec)</option>
                    </select>
                  </div>

                  <button
                    onClick={handleReset}
                    disabled={isProcessing}
                    className="px-2.5 py-1 text-[11px] rounded-md border border-[var(--border-dev)] bg-[var(--bg-sidebar)] hover:bg-[var(--pill-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>New Image</span>
                  </button>
                </div>
              </div>

              {/* Central Visual Canvas Area with Dynamic Artboard Aspect Ratio */}
              <div className="flex-1 flex items-center justify-center p-2 sm:p-4 min-h-0 overflow-hidden relative">
                {/* Artboard Dimensions Badge floating at top of canvas */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-white text-[10px] font-mono flex items-center gap-1.5 pointer-events-none shadow-lg">
                  <span className="text-rose-400 font-bold">Artboard:</span>
                  <span>{targetWidth || sourceFile?.width || 0} × {targetHeight || sourceFile?.height || 0}px</span>
                  <span className="text-white/30">|</span>
                  <span className="text-cyan-400 font-bold">{targetAspect.toFixed(2)}:1</span>
                  {scalePreset !== 1 && (
                    <>
                      <span className="text-white/30">|</span>
                      <span className="text-emerald-400 font-bold">{Math.round(scalePreset * 100)}% scale</span>
                    </>
                  )}
                  {paddingPx > 0 && (
                    <>
                      <span className="text-white/30">|</span>
                      <span className="text-amber-400">+{paddingPx}px pad</span>
                    </>
                  )}
                </div>

                {/* Processing Overlay with Progress Bar */}
                {isProcessing && (
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-full max-w-md p-6 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-dev)] shadow-2xl flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 mb-4 animate-spin">
                        <Sparkles className="w-5 h-5" />
                      </div>

                      <h4 className="text-sm font-bold text-[var(--text-primary)] mb-1">
                        Removing Background in Browser
                      </h4>
                      <p className="text-xs text-[var(--text-secondary)] mb-4">
                        {progressStage}
                      </p>

                      {/* Progress bar */}
                      <div className="w-full bg-[var(--bg-sidebar)] h-2 rounded-full overflow-hidden border border-[var(--border-dev)] mb-2">
                        <div
                          className="bg-gradient-to-r from-rose-500 via-amber-500 to-rose-400 h-full transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>

                      <div className="w-full flex justify-between text-[10px] text-[var(--text-muted)] font-mono">
                        <span>WebGPU Neural Acceleration</span>
                        <span className="font-bold text-[var(--text-primary)]">{progressPercent}%</span>
                      </div>
                    </div>
                  </div>
                )}
                {/* View Mode 0: Interactive Crop Mode */}
                {isCropMode && sourceImage && (
                  <div className="max-w-4xl max-h-[min(74vh,calc(100%-2.5rem))] flex items-center justify-center rounded-lg border border-[var(--border-dev)] bg-[var(--bg-sidebar)] overflow-hidden shadow-lg p-4 -translate-y-4 sm:-translate-y-5">
                    <ReactCrop
                      crop={crop}
                      onChange={(_, percentCrop) => setCrop(percentCrop)}
                      onComplete={(c) => setCompletedCrop(c)}
                      className="flex items-center justify-center"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        ref={imgRef}
                        src={sourceImage}
                        alt="Crop source"
                        crossOrigin="anonymous"
                        className="object-contain select-none pointer-events-auto block rounded"
                        style={{ maxWidth: '100%', maxHeight: '62vh' }}
                      />
                    </ReactCrop>
                  </div>
                )}

                {/* View Mode 1: Pixel-Perfect Interactive Slider with Live Aspect Ratio */}
                {!isCropMode && viewMode === 'slider' && (
                  <div
                    ref={sliderContainerRef}
                    onMouseDown={(e) => {
                      onMouseDown();
                      handleSliderMove(e.clientX);
                    }}
                    onTouchStart={(e) => {
                      if (e.touches[0]) handleSliderMove(e.touches[0].clientX);
                    }}
                    onTouchMove={(e) => {
                      if (e.touches[0]) handleSliderMove(e.touches[0].clientX);
                    }}
                    className="relative rounded-lg overflow-hidden select-none border-2 border-[var(--border-dev)] shadow-2xl flex items-center justify-center transition-all duration-150 cursor-ew-resize -translate-y-4 sm:-translate-y-5"
                    style={{
                      aspectRatio: `${safeAspect}`,
                      width: `min(100%, calc((100% - 2.5rem) * ${safeAspect.toFixed(4)}), calc(72vh * ${safeAspect.toFixed(4)}))`,
                      maxHeight: 'min(72vh, calc(100% - 2.5rem))',
                      maxWidth: '100%',
                      background: (activeMatteObj?.type === 'color' || activeMatteObj?.type === 'gradient') ? activeMatteObj.value : undefined,
                      padding: `${paddingPx}px`
                    }}
                  >
                    {/* Inner wrapper respecting padding box */}
                    <div className="w-full h-full relative overflow-hidden flex items-center justify-center pointer-events-none">
                      {/* Background Backdrop Layer */}
                      {activeMatteObj?.type === 'transparent' && (
                        <div className="absolute inset-0 bg-transparency-grid" />
                      )}
                      {activeMatteObj?.type === 'original' && sourceImage && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={sourceImage}
                          alt="Original Background Backdrop"
                          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                        />
                      )}
                      {activeMatteObj?.type === 'blurred-original' && sourceImage && (
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={sourceImage}
                            alt="Blurred Portrait Backdrop"
                            className="absolute inset-0 w-full h-full object-contain filter blur-md scale-105 pointer-events-none"
                          />
                        </div>
                      )}
                      {activeMatteObj?.type === 'custom-image' && customBgImageUrl && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={customBgImageUrl}
                          alt="Custom Backdrop"
                          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                        />
                      )}

                      {/* Bottom Layer: Segmented AI Cutout with transformations and filters */}
                      <div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
                        style={{
                          transform: previewTransformStyle || undefined,
                          filter: previewFilterStyle || undefined
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={chromaPreviewUrl || brushPreviewUrl || resultImageUrl || sourceImage!}
                          alt="Segmented Cutout"
                          className="w-full h-full object-contain pointer-events-none select-none"
                          draggable={false}
                        />
                      </div>

                      {/* Top Layer: Original Source Image, clipped cleanly using CSS clipPath */}
                      {viewMode === 'slider' && !isBrushModeActive && (
                        <div
                          className="absolute inset-0 pointer-events-none z-10"
                          style={{
                            clipPath: `inset(0 calc(100% - ${safeSliderPos}%) 0 0)`
                          }}
                        >
                          <div
                            className="absolute inset-0 flex items-center justify-center"
                            style={{
                              transform: previewTransformStyle || undefined,
                              filter: previewFilterStyle || undefined
                            }}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={sourceImage!}
                              alt="Original"
                              className="w-full h-full object-contain pointer-events-none select-none"
                              draggable={false}
                              onLoad={(e) => {
                                if (targetWidth === 0 && e.currentTarget.naturalWidth > 0) {
                                  const nw = e.currentTarget.naturalWidth;
                                  const nh = e.currentTarget.naturalHeight;
                                  setTargetWidth(nw);
                                  setTargetHeight(nh);
                                }
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Divider Line and Centered Drag Handle */}
                      {viewMode === 'slider' && !isBrushModeActive && (
                        <div
                          className={`absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize hover:bg-emerald-400 transition-colors shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20 group ${isBrushModeActive ? 'pointer-events-none opacity-50' : 'pointer-events-auto'}`}
                          style={{ left: `calc(${sliderPosition}% - 2px)` }}
                          onPointerDown={onMouseDown}
                        >
                          {/* Centered Grab Handle */}
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.3)] flex items-center justify-center border border-slate-200 group-hover:border-emerald-400 group-hover:scale-110 transition-transform">
                            <MoveHorizontal className="w-[18px] h-[18px] opacity-70" />
                          </div>
                        </div>
                      )}

                      {/* Badges on slider */}
                      <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold pointer-events-none z-10">
                        Original
                      </div>
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold pointer-events-none z-10">
                        AI Cutout
                      </div>

                      {/* If no AI cutout generated yet, display on-demand trigger overlay */}
                      {!resultImageUrl && (
                        <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center pointer-events-auto">
                          <div className="p-5 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-dev)] shadow-2xl max-w-sm flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 mb-3">
                              <Sparkles className="w-5 h-5" />
                            </div>
                            <h4 className="text-xs font-bold text-[var(--text-primary)] mb-1">
                              Before / After Comparison Slider
                            </h4>
                            <p className="text-[11px] text-[var(--text-secondary)] mb-4">
                              Run Edge AI background removal to isolate the subject and compare against your original photo.
                            </p>
                            <button
                              onClick={handleTriggerBgRemoval}
                              disabled={isProcessing}
                              className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white text-xs font-bold shadow-md shadow-rose-500/20 cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>✨ Run AI Background Removal</span>
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {/* Interactive Brush Canvas Overlay (Pulled out to be top-most) */}
                      {isBrushModeActive && (
                        <div
                          className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
                          style={{
                            transform: previewTransformStyle || undefined,
                            filter: previewFilterStyle || undefined
                          }}
                        >
                          <canvas
                            ref={canvasOverlayRef}
                            width={targetWidth}
                            height={targetHeight}
                            className="w-full h-full object-contain touch-none pointer-events-auto cursor-crosshair select-none"
                            draggable={false}
                            onPointerDown={handleBrushPointerDown}
                            onPointerMove={handleBrushPointerMove}
                            onPointerUp={handleBrushPointerUp}
                            onPointerOut={handleBrushPointerUp}
                            onPointerCancel={handleBrushPointerUp}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* View Mode 2: Side-by-Side */}
                {!isCropMode && viewMode === 'split' && (
                  <div className="w-full h-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-center overflow-hidden -translate-y-4 sm:-translate-y-5">
                    {/* Original card */}
                    <div className="flex-1 h-full max-h-[min(72vh,calc(100%-2.5rem))] flex flex-col rounded-lg border border-[var(--border-dev)] bg-[var(--bg-panel)] overflow-hidden">
                      <div className="h-8 px-3 bg-[var(--bg-panel-subtle)] border-b border-[var(--border-dev)] flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
                        <span className="font-bold">Original Image</span>
                        <span className="text-[10px] text-[var(--text-muted)]">Source File</span>
                      </div>
                      <div className="flex-1 p-3 flex items-center justify-center overflow-hidden bg-[var(--bg-sidebar)]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={sourceImage}
                          alt="Original"
                          className="max-w-full max-h-full object-contain rounded select-none"
                        />
                      </div>
                    </div>

                    {/* Result card */}
                    <div className="flex-1 h-full max-h-[min(72vh,calc(100%-2.5rem))] flex flex-col rounded-lg border border-[var(--border-dev)] bg-[var(--bg-panel)] overflow-hidden">
                      <div className="h-8 px-3 bg-[var(--bg-panel-subtle)] border-b border-[var(--border-dev)] flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
                        <span className="font-bold text-rose-500">AI Background Removed</span>
                        <span className="text-[10px] text-amber-500 font-bold">{resultImageUrl ? '100% Alpha Clean' : 'Pending AI Run'}</span>
                      </div>
                      <div
                        className="flex-1 p-3 overflow-hidden relative flex flex-col"
                        style={{
                          background: (activeMatteObj?.type === 'color' || activeMatteObj?.type === 'gradient') ? activeMatteObj.value : undefined,
                          padding: `${paddingPx}px`
                        }}
                      >
                        <div className="flex-1 relative w-full h-full flex items-center justify-center">
                          {activeMatteObj?.type === 'transparent' && (
                            <div className="absolute inset-0 bg-transparency-grid" />
                          )}
                          {!resultImageUrl ? (
                            <div className="flex flex-col items-center justify-center text-center p-4 z-10">
                              <Sparkles className="w-8 h-8 text-rose-500/60 mb-2" />
                              <p className="text-xs font-bold text-[var(--text-primary)] mb-1">AI Cutout Not Run Yet</p>
                              <p className="text-[10px] text-[var(--text-secondary)] max-w-xs mb-3">
                                Click below to segment your subject using client-side edge AI.
                              </p>
                              <button
                                onClick={handleTriggerBgRemoval}
                                disabled={isProcessing}
                                className="px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-sm cursor-pointer flex items-center gap-1.5"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Run AI Removal</span>
                              </button>
                            </div>
                          ) : (
                            <>
                              {activeMatteObj?.type === 'original' && sourceImage && (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                  src={sourceImage}
                                  alt="Original Background Backdrop"
                                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                                />
                              )}
                              {activeMatteObj?.type === 'blurred-original' && sourceImage && (
                                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={sourceImage}
                                    alt="Blurred Portrait Backdrop"
                                    className="absolute inset-0 w-full h-full object-contain filter blur-md scale-105 pointer-events-none"
                                  />
                                </div>
                              )}
                              {activeMatteObj?.type === 'custom-image' && customBgImageUrl && (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                  src={customBgImageUrl}
                                  alt="Custom Backdrop"
                                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                                />
                              )}
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={chromaPreviewUrl || brushPreviewUrl || resultImageUrl || sourceImage!}
                                alt="Result Canvas"
                                className="w-full h-full object-contain rounded relative z-10 select-none pointer-events-none"
                                style={{
                                  transform: previewTransformStyle || undefined,
                                  filter: previewFilterStyle || undefined
                                }}
                                draggable={false}
                              />
                            </>
                          )}

                          {/* Interactive Brush Canvas Overlay (Top-most in split view result card) */}
                          {isBrushModeActive && (
                            <div
                              className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
                              style={{
                                transform: previewTransformStyle || undefined,
                                filter: previewFilterStyle || undefined
                              }}
                            >
                              <canvas
                                ref={canvasOverlayRef}
                                width={targetWidth}
                                height={targetHeight}
                                className="w-full h-full object-contain touch-none pointer-events-auto cursor-crosshair select-none"
                                draggable={false}
                                onPointerDown={handleBrushPointerDown}
                                onPointerMove={handleBrushPointerMove}
                                onPointerUp={handleBrushPointerUp}
                                onPointerOut={handleBrushPointerUp}
                                onPointerCancel={handleBrushPointerUp}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* View Mode 3: Result Only */}
                {!isCropMode && viewMode === 'result' && (
                  <div
                    className="relative rounded-lg border-2 border-[var(--border-dev)] overflow-hidden shadow-2xl flex items-center justify-center transition-all duration-150 -translate-y-4 sm:-translate-y-5"
                    style={{
                      aspectRatio: `${safeAspect}`,
                      width: `min(100%, calc((100% - 2.5rem) * ${safeAspect.toFixed(4)}), calc(72vh * ${safeAspect.toFixed(4)}))`,
                      maxHeight: 'min(72vh, calc(100% - 2.5rem))',
                      maxWidth: '100%',
                      background: (activeMatteObj?.type === 'color' || activeMatteObj?.type === 'gradient') ? activeMatteObj.value : undefined,
                      padding: `${paddingPx}px`
                    }}
                  >
                    {/* Inner wrapper respecting padding box */}
                    <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
                      {activeMatteObj?.type === 'transparent' && (
                        <div className="absolute inset-0 bg-transparency-grid" />
                      )}
                      {activeMatteObj?.type === 'original' && sourceImage && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={sourceImage}
                          alt="Original Background Backdrop"
                          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                        />
                      )}
                      {activeMatteObj?.type === 'blurred-original' && sourceImage && (
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={sourceImage}
                            alt="Blurred Portrait Backdrop"
                            className="absolute inset-0 w-full h-full object-contain filter blur-md scale-105 pointer-events-none"
                          />
                        </div>
                      )}
                      {activeMatteObj?.type === 'custom-image' && customBgImageUrl && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={customBgImageUrl}
                          alt="Custom Backdrop"
                          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                        />
                      )}
                      <div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
                        style={{
                          transform: previewTransformStyle || undefined,
                          filter: previewFilterStyle || undefined
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={chromaPreviewUrl || brushPreviewUrl || resultImageUrl || sourceImage!}
                          alt={hasCutout ? "Cutout Only" : "Artboard Image"}
                          className="w-full h-full object-contain pointer-events-none select-none"
                          draggable={false}
                        />
                      </div>
                      
                      {/* Interactive Brush Canvas Overlay (Top-most in result view) */}
                      {isBrushModeActive && (
                        <div
                          className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
                          style={{
                            transform: previewTransformStyle || undefined,
                            filter: previewFilterStyle || undefined
                          }}
                        >
                          <canvas
                            ref={canvasOverlayRef}
                            width={targetWidth}
                            height={targetHeight}
                            className="w-full h-full object-contain touch-none pointer-events-auto cursor-crosshair select-none"
                            draggable={false}
                            onPointerDown={handleBrushPointerDown}
                            onPointerMove={handleBrushPointerMove}
                            onPointerUp={handleBrushPointerUp}
                            onPointerOut={handleBrushPointerUp}
                            onPointerCancel={handleBrushPointerUp}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* View Mode 4: Original Only */}
                {!isCropMode && viewMode === 'original' && (
                  <div className="w-full h-full max-w-4xl max-h-[min(74vh,calc(100%-2.5rem))] flex items-center justify-center relative rounded-lg border border-[var(--border-dev)] bg-[var(--bg-sidebar)] overflow-hidden shadow-lg p-4 -translate-y-4 sm:-translate-y-5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={sourceImage}
                      alt="Original Only"
                      className="w-full h-full object-contain rounded select-none pointer-events-none"
                      draggable={false}
                    />
                    
                    {/* Interactive Brush Canvas Overlay */}
                    {isBrushModeActive && (
                      <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none p-4">
                        <canvas
                          ref={canvasOverlayRef}
                          width={targetWidth}
                          height={targetHeight}
                          className="w-full h-full object-contain touch-none pointer-events-auto cursor-crosshair select-none"
                          draggable={false}
                          onPointerDown={handleBrushPointerDown}
                          onPointerMove={handleBrushPointerMove}
                          onPointerUp={handleBrushPointerUp}
                          onPointerOut={handleBrushPointerUp}
                          onPointerCancel={handleBrushPointerUp}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Comprehensive Studio Editor Panel */}
        {sourceImage && (
          <aside className="w-full md:w-80 lg:w-96 bg-[var(--bg-panel)] border-t md:border-t-0 md:border-l border-[var(--border-dev)] flex flex-col shrink-0 overflow-hidden z-20 h-[45%] md:h-full relative">
            {/* Editor Sub-Navigation Tabs (Sticky within panel) */}
            <div className="flex border-b border-[var(--border-dev)] bg-[var(--bg-panel)] text-xs shrink-0 sticky top-0 z-20 shadow-xs">
              <button
                onClick={() => {
                  setActiveTab('matte');
                  setIsCropMode(false);
                }}
                className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 font-bold transition-colors cursor-pointer ${activeTab === 'matte'
                    ? 'border-b-2 border-rose-500 text-rose-500 bg-[var(--bg-panel)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Backdrop</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('transform');
                  // We don't necessarily need to cancel it if they click the same tab, but let's be safe
                  if (activeTab !== 'transform') setIsCropMode(false);
                }}
                className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 font-bold transition-colors cursor-pointer ${activeTab === 'transform'
                    ? 'border-b-2 border-rose-500 text-rose-500 bg-[var(--bg-panel)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Size and Crop</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('filters');
                  setIsCropMode(false);
                }}
                className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 font-bold transition-colors cursor-pointer ${activeTab === 'filters'
                    ? 'border-b-2 border-rose-500 text-rose-500 bg-[var(--bg-panel)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Effects</span>
              </button>
            </div>

            <div className="p-4 flex-1 space-y-6 overflow-y-auto pb-6">
              {/* TAB 1: MATTE AND BACKDROPS */}
              {/* TAB 1: MATTE AND BACKDROPS */}
              {activeTab === 'matte' && (
                <div className="space-y-5">
                  
                  {/* Pro Logo Settings: Output Type & Logo Mode */}
                  <div className="flex flex-col gap-3 p-3 rounded-lg bg-[var(--bg-panel-subtle)] border border-[var(--border-dev)]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-rose-500" />
                        AI Output Mode
                      </span>
                      <button
                        onClick={handleLogoMode}
                        title="Instantly configures the AI for sharp, crisp edges perfect for logos and vector graphics."
                        className="text-[10px] bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 px-2 py-1 rounded font-bold border border-rose-500/20 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Crosshair className="w-3 h-3" />
                        Logo Mode
                      </button>
                    </div>
                    <div className="flex bg-[var(--bg-sidebar)] rounded border border-[var(--border-dev)] p-0.5 relative">
                      <div
                        className="absolute inset-y-0.5 w-[calc(50%-2px)] bg-[var(--bg-panel)] shadow-sm rounded-sm transition-transform duration-200 border border-[var(--border-dev)]"
                        style={{ transform: outputType === 'foreground' ? 'translateX(0)' : 'translateX(100%)' }}
                      />
                      <button
                        onClick={() => handleOutputTypeChange('foreground')}
                        title="Outputs the standard isolated object with a transparent background."
                        className={`flex-1 py-1.5 text-[11px] font-bold z-10 transition-colors cursor-pointer rounded-sm ${outputType === 'foreground' ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                      >
                        Foreground
                      </button>
                      <button
                        onClick={() => handleOutputTypeChange('mask')}
                        title="Outputs a black and white silhouette mask, useful for external compositing in Photoshop or Premiere."
                        className={`flex-1 py-1.5 text-[11px] font-bold z-10 transition-colors cursor-pointer rounded-sm ${outputType === 'mask' ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                      >
                        Alpha Mask
                      </button>
                    </div>
                    {outputType === 'mask' && (
                      <div className="text-[10px] text-amber-500 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" />
                        Generates a black/white silhouette (Photoshop).
                      </div>
                    )}
                  </div>

                  {/* Chroma Key Cleanup */}
                  <div className="flex flex-col gap-3 p-3 rounded-lg bg-[var(--bg-panel-subtle)] border border-[var(--border-dev)]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5" title="Removes specific colored backgrounds based on a hexadecimal target.">
                        <Pipette className="w-3.5 h-3.5 text-emerald-500" />
                        Chroma Key Cleanup
                      </span>
                      <button
                        onClick={() => setIsChromaKeyActive(!isChromaKeyActive)}
                        title="Toggle Chroma Key mode"
                        className={`text-[10px] px-2 py-1 rounded font-bold border transition-colors cursor-pointer ${isChromaKeyActive ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-[var(--bg-sidebar)] text-[var(--text-secondary)] border-[var(--border-dev)] hover:bg-[var(--pill-bg)]'}`}
                      >
                        {isChromaKeyActive ? 'Active' : 'Disabled'}
                      </button>
                    </div>
                    
                    {isChromaKeyActive && (
                      <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="flex gap-2">
                          <div className="relative h-8 flex-1 rounded-lg overflow-hidden border border-[var(--border-dev)] hover:border-[var(--text-muted)] cursor-pointer">
                            <input 
                              type="color" 
                              value={chromaKeyColor}
                              onChange={(e) => setChromaKeyColor(e.target.value)}
                              className="absolute inset-0 w-[200%] h-[200%] -top-4 -left-4 cursor-pointer"
                            />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20 text-white text-[10px] font-bold shadow-sm">
                              {chromaKeyColor.toUpperCase()}
                            </div>
                          </div>
                          
                          {typeof window !== 'undefined' && 'EyeDropper' in window && (
                            <button
                              onClick={async () => {
                                try {
                                  // @ts-ignore
                                  const eyeDropper = new window.EyeDropper();
                                  const result = await eyeDropper.open();
                                  setChromaKeyColor(result.sRGBHex);
                                } catch (e) {
                                  // User canceled or error
                                }
                              }}
                              className="h-8 px-3 rounded-lg bg-[var(--bg-sidebar)] border border-[var(--border-dev)] hover:bg-[var(--bg-panel-hover)] hover:border-emerald-500/50 flex items-center justify-center text-[var(--text-primary)] transition-colors cursor-pointer"
                              title="Pick color from screen"
                            >
                              <Pipette className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1.5 text-xs">
                            <span className="text-[var(--text-secondary)] font-bold">Tolerance</span>
                            <span className="text-[11px] font-mono text-emerald-500 font-bold">{chromaKeyTolerance}%</span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={chromaKeyTolerance}
                            onChange={(e) => setChromaKeyTolerance(Number(e.target.value))}
                            className="w-full accent-emerald-500 cursor-pointer"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Manual Brush Mode */}
                  <div className={`flex flex-col gap-3 p-3 rounded-lg bg-[var(--bg-panel-subtle)] border border-[var(--border-dev)] transition-all ${!sourceImage ? 'opacity-30 pointer-events-none' : ''}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5" title="Draw strokes on the image to manually restore original pixels or erase background.">
                        <Pipette className="w-3.5 h-3.5 text-blue-500" />
                        Manual Brush Cleanup
                      </span>
                      <div className="flex items-center gap-1.5">
                        {isBrushModeActive && brushPaths.length > 0 && (
                          <button
                            onClick={undoLastBrushStroke}
                            title="Undo Last Stroke"
                            className="text-[10px] px-2 py-1 rounded font-bold border bg-[var(--bg-sidebar)] text-[var(--text-secondary)] border-[var(--border-dev)] hover:bg-[var(--pill-bg)] hover:text-rose-500 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            Undo
                          </button>
                        )}
                        <button
                          onClick={() => setIsBrushModeActive(!isBrushModeActive)}
                          title="Toggle Manual Brush Tool"
                          className={`text-[10px] px-2 py-1 rounded font-bold border transition-colors flex items-center gap-1 cursor-pointer ${isBrushModeActive ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-[var(--bg-sidebar)] text-[var(--text-secondary)] border-[var(--border-dev)] hover:bg-[var(--pill-bg)]'}`}
                        >
                          {isBrushModeActive ? 'Active' : 'Disabled'}
                        </button>
                      </div>
                    </div>
                    
                    {isBrushModeActive && (
                      <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="text-[10px] text-blue-500/90 font-medium bg-blue-500/5 p-2 rounded flex items-start gap-1.5">
                          <span className="shrink-0">ℹ️</span>
                          <span>Paint over the image in the viewer to modify the mask. {isSingleStrokeMode ? 'Brush auto-deactivates after one stroke to prevent accidental touches.' : ''}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setBrushType('restore')}
                            title="Paint to bring back parts of the original image"
                            className={`flex-1 py-1.5 text-xs font-bold rounded border transition-colors cursor-pointer ${brushType === 'restore' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' : 'bg-[var(--bg-sidebar)] text-[var(--text-secondary)] border-[var(--border-dev)] hover:text-[var(--text-primary)]'}`}
                          >
                            Restore
                          </button>
                          <button
                            onClick={() => setBrushType('erase')}
                            title="Paint to remove parts of the image"
                            className={`flex-1 py-1.5 text-xs font-bold rounded border transition-colors cursor-pointer ${brushType === 'erase' ? 'bg-rose-500/10 text-rose-500 border-rose-500/30' : 'bg-[var(--bg-sidebar)] text-[var(--text-secondary)] border-[var(--border-dev)] hover:text-[var(--text-primary)]'}`}
                          >
                            Erase
                          </button>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <div className="flex justify-between text-[10px] text-[var(--text-secondary)]">
                            <span>Brush Size</span>
                            <span>{brushSize}px</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="200"
                            value={brushSize}
                            onChange={(e) => setBrushSize(parseInt(e.target.value))}
                            className="w-full accent-blue-500 h-1.5 bg-[var(--border-dev)] rounded-lg appearance-none cursor-pointer"
                            title="Adjust the size of the brush cursor"
                          />
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-[var(--border-dev)]">
                          <label className="flex items-center gap-1.5 cursor-pointer" title="Auto-deactivate the brush mode after every single stroke">
                            <input
                              type="checkbox"
                              checked={isSingleStrokeMode}
                              onChange={(e) => setIsSingleStrokeMode(e.target.checked)}
                              className="w-3 h-3 accent-blue-500"
                            />
                            <span className="text-[10px] font-bold text-[var(--text-secondary)]">Single-Stroke Safe Mode</span>
                          </label>
                          <button 
                            onClick={clearAllBrushStrokes}
                            title="Clear all manual edits"
                            className="text-[10px] text-rose-500 hover:text-rose-600 font-bold transition-colors cursor-pointer"
                          >
                            Reset Brush
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Edges & Feather */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1.5 text-xs">
                        <span className="font-bold text-[var(--text-primary)] flex items-center gap-1.5" title="Removes soft semi-transparent edges. Higher values make the edges sharper.">
                          <Crosshair className="w-3.5 h-3.5 text-rose-500" />
                          Edge Threshold (Logos)
                        </span>
                        <span className="text-[11px] font-mono text-rose-500 font-bold">{edgeCrispness}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={edgeCrispness}
                        onChange={(e) => setEdgeCrispness(Number(e.target.value))}
                        className="w-full accent-rose-500 cursor-pointer"
                      />
                      <div className="text-[9px] text-[var(--text-muted)] mt-1 flex justify-between">
                        <span>Smooth (0)</span>
                        <span>Logo Sharp (30)</span>
                        <span>Harsh (100)</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1.5 text-xs">
                        <span className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                          <Pipette className="w-3.5 h-3.5 text-rose-500" />
                          Edge Feather (Smoothing)
                        </span>
                        <span className="text-[11px] font-mono text-rose-500 font-bold">{featherRadius}px</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={5}
                        step={0.5}
                        value={featherRadius}
                        onChange={(e) => setFeatherRadius(Number(e.target.value))}
                        className="w-full accent-rose-500 cursor-pointer"
                      />
                      <div className="text-[9px] text-[var(--text-muted)] mt-1 flex justify-between">
                        <span>Hard (0)</span>
                        <span>Soft (5)</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-xs font-bold text-[var(--text-primary)] mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5 text-rose-500" />
                        <span>Background Fill</span>
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)] font-normal truncate max-w-[120px] text-right">
                        {resultImageUrl ? activeMatteObj?.name : 'Original Source'}
                      </span>
                    </label>

                    {/* Backdrop Options Container */}
                    <div className={`space-y-3 transition-all duration-300 ${!resultImageUrl ? 'opacity-30 grayscale pointer-events-none select-none filter' : ''}`}>
                      <div className="grid grid-cols-3 gap-2">
                        {/* Special Original Background options */}
                        <button
                          onClick={() => setSelectedMatte('original')}
                          disabled={!resultImageUrl}
                          className={`p-2 rounded-lg border text-left flex items-center gap-2 cursor-pointer transition-all ${selectedMatte === 'original'
                              ? 'border-rose-500 bg-rose-500/10 text-rose-500 font-bold'
                              : 'border-[var(--border-dev)] bg-[var(--bg-sidebar)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                            }`}
                        >
                          <FileImage className="w-4 h-4 text-amber-500 shrink-0" />
                          <div className="min-w-0">
                            <span className="text-[10px] block truncate font-bold">Original BG</span>
                          </div>
                        </button>

                        <button
                          onClick={() => setSelectedMatte('blurred-original')}
                          disabled={!resultImageUrl}
                          className={`p-2 rounded-lg border text-left flex items-center gap-2 cursor-pointer transition-all ${selectedMatte === 'blurred-original'
                              ? 'border-rose-500 bg-rose-500/10 text-rose-500 font-bold'
                              : 'border-[var(--border-dev)] bg-[var(--bg-sidebar)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                            }`}
                        >
                          <Camera className="w-4 h-4 text-cyan-500 shrink-0" />
                          <div className="min-w-0">
                            <span className="text-[10px] block truncate font-bold">Bokeh Blur</span>
                          </div>
                        </button>
                        
                        {/* Custom Image Upload */}
                        <div className="relative">
                          <input 
                            type="file" 
                            ref={customBgInputRef} 
                            onChange={(e) => {
                              if (e.target.files && e.target.files.length > 0) {
                                handleCustomBgUpload(e.target.files[0]);
                              }
                            }}
                            className="hidden" 
                            accept="image/*"
                          />
                          <button
                            onClick={() => {
                              if (customBgImage) {
                                setSelectedMatte('custom-image');
                              } else {
                                customBgInputRef.current?.click();
                              }
                            }}
                            disabled={!resultImageUrl}
                            className={`w-full h-full p-2 rounded-lg border text-left flex items-center gap-2 cursor-pointer transition-all ${selectedMatte === 'custom-image'
                                ? 'border-rose-500 bg-rose-500/10 text-rose-500 font-bold'
                                : 'border-[var(--border-dev)] bg-[var(--bg-sidebar)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                              }`}
                          >
                            <ImagePlus className="w-4 h-4 text-purple-500 shrink-0" />
                            <div className="min-w-0">
                              <span className="text-[10px] block truncate font-bold">Upload BG</span>
                            </div>
                          </button>
                          {customBgImage && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); customBgInputRef.current?.click(); }}
                              className="absolute top-1 right-1 p-0.5 bg-black/50 hover:bg-black/80 rounded-full text-white pointer-events-auto"
                              title="Replace Custom Background"
                            >
                              <RefreshCw className="w-2.5 h-2.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-6 gap-2">
                        {/* Custom Color Picker */}
                        <div className="relative h-11 rounded-lg overflow-hidden border border-[var(--border-dev)] hover:border-[var(--text-muted)] cursor-pointer">
                          <input 
                            type="color" 
                            value={customColor}
                            onChange={(e) => {
                              setCustomColor(e.target.value);
                              setSelectedMatte('custom-color');
                            }}
                            className="absolute inset-0 w-[200%] h-[200%] -top-4 -left-4 cursor-pointer"
                          />
                          {selectedMatte === 'custom-color' && (
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">
                              <Check className="w-4 h-4 text-white drop-shadow" />
                            </div>
                          )}
                          <div className="absolute bottom-0 inset-x-0 bg-black/60 text-[8px] text-white text-center pointer-events-none pb-0.5">Custom</div>
                        </div>

                        {MATTE_OPTIONS.filter(m => m.type !== 'original' && m.type !== 'blurred-original').map((m) => (
                          <button
                            key={m.id}
                            onClick={() => setSelectedMatte(m.id)}
                            disabled={!resultImageUrl}
                            className={`h-11 rounded-lg border relative flex flex-col items-center justify-center overflow-hidden transition-all cursor-pointer ${selectedMatte === m.id
                                ? 'border-rose-500 ring-2 ring-rose-500/30'
                                : 'border-[var(--border-dev)] hover:border-[var(--text-muted)]'
                              }`}
                            title={m.name}
                          >
                            {m.type === 'transparent' ? (
                              <div className="w-full h-full bg-transparency-grid flex items-center justify-center">
                                <span className="text-[8px] font-bold px-1 bg-black/60 text-white rounded">Alpha</span>
                              </div>
                            ) : (
                              <div className="w-full h-full" style={{ background: m.value }} />
                            )}
                            {selectedMatte === m.id && (
                              <div className="absolute inset-0 bg-rose-500/10 flex items-center justify-center">
                                <Check className="w-4 h-4 text-white drop-shadow" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Frosted Glass Overlay Prompt when Background Removal is NOT triggered */}
                    {!resultImageUrl && (
                      <div className="absolute inset-0 top-6 rounded-xl bg-[var(--bg-panel)]/80 backdrop-blur-[2px] border border-[var(--border-dev)] flex flex-col items-center justify-center p-4 text-center z-10 shadow-lg animate-in fade-in duration-200">
                        <div className="w-9 h-9 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 mb-2">
                          <Lock className="w-4 h-4" />
                        </div>
                        <h4 className="text-xs font-bold text-[var(--text-primary)] mb-0.5">
                          Backdrops Locked
                        </h4>
                        <p className="text-[10px] text-[var(--text-secondary)] max-w-[210px] mb-3 leading-tight">
                          Run Edge AI background removal to unlock transparent alpha, solid colors, and bokeh blur.
                        </p>
                        <button
                          onClick={handleTriggerBgRemoval}
                          disabled={isProcessing}
                          className="py-1.5 px-3.5 rounded-lg bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-500/25 cursor-pointer transition-all hover:scale-[1.02] disabled:opacity-50"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>✨ Unlock with AI Removal</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Padding / Margin around cutout */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5 text-xs">
                      <span className="font-bold text-[var(--text-primary)]">Canvas Padding</span>
                      <span className="text-[11px] font-mono text-rose-500 font-bold">{paddingPx}px</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={120}
                      step={4}
                      value={paddingPx}
                      onChange={(e) => setPaddingPx(Number(e.target.value))}
                      className="w-full accent-rose-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-[var(--text-muted)] mt-1 font-mono">
                      <span>Edge Flush (0px)</span>
                      <span>Avatar (32px)</span>
                      <span>Product (80px)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: RESOLUTION, SCALE AND TRANSFORM */}
              {activeTab === 'transform' && (
                <div className="space-y-5">
                  {/* Cropping Tool */}
                  <div className="p-3 rounded-lg bg-[var(--bg-sidebar)] border border-rose-500/30 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                        <Maximize2 className="w-3.5 h-3.5 text-rose-500" />
                        Interactive Image Cropper
                      </span>
                      {originalSourceImage !== sourceImage && (
                        <button
                          onClick={handleUndoCrop}
                          className="text-[10px] px-2 py-0.5 rounded border border-[var(--border-dev)] hover:bg-[var(--pill-bg)] transition-colors cursor-pointer"
                        >
                          Undo Crop
                        </button>
                      )}
                    </div>
                    {isCropMode ? (
                      <div className="flex gap-2">
                        <button
                          onClick={handleApplyCrop}
                          disabled={!completedCrop?.width || !completedCrop?.height}
                          className="flex-1 py-1.5 text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white rounded cursor-pointer transition-colors disabled:opacity-50"
                        >
                          Apply Crop
                        </button>
                        <button
                          onClick={() => setIsCropMode(false)}
                          className="flex-1 py-1.5 text-xs font-bold border border-[var(--border-dev)] text-[var(--text-primary)] hover:bg-[var(--pill-bg)] rounded cursor-pointer transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsCropMode(true)}
                        className="w-full py-1.5 text-xs font-bold border border-rose-500/50 text-rose-500 hover:bg-rose-500/10 rounded cursor-pointer transition-colors"
                      >
                        Enter Crop Mode
                      </button>
                    )}
                  </div>

                  {/* Resolution Input */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[var(--text-primary)]">Output Resolution</span>
                        {sourceFile?.width && sourceFile?.height && (
                          <button
                            onClick={() => {
                              setTargetWidth(sourceFile.width);
                              setTargetHeight(sourceFile.height);
                              setScalePreset(1);
                            }}
                            className="text-[9px] text-rose-500 hover:underline flex items-center gap-0.5 cursor-pointer"
                            title="Reset to Original Dimensions"
                          >
                            <RotateCcw className="w-2.5 h-2.5" />
                            <span>Reset ({sourceFile.width}×{sourceFile.height})</span>
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => setAspectRatioLocked(!aspectRatioLocked)}
                        className={`text-[10px] px-2 py-0.5 rounded flex items-center gap-1 border cursor-pointer transition-colors ${aspectRatioLocked
                            ? 'bg-rose-500/10 border-rose-500/30 text-rose-500 font-bold'
                            : 'bg-[var(--bg-sidebar)] border-[var(--border-dev)] text-[var(--text-muted)]'
                          }`}
                        title={aspectRatioLocked ? 'Aspect Ratio Locked' : 'Aspect Ratio Free'}
                      >
                        {aspectRatioLocked ? <Lock className="w-2.5 h-2.5" /> : <Unlock className="w-2.5 h-2.5" />}
                        <span>{aspectRatioLocked ? 'Locked' : 'Free'}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center bg-[var(--bg-sidebar)] border border-[var(--border-dev)] rounded-lg px-2.5 py-1.5">
                        <span className="text-[10px] text-[var(--text-muted)] font-bold mr-2">W</span>
                        <input
                          type="number"
                          min={16}
                          value={targetWidth || ''}
                          onChange={(e) => handleWidthChange(Number(e.target.value))}
                          className="w-full bg-transparent text-[var(--text-primary)] outline-none font-mono text-xs"
                          placeholder="Width"
                        />
                        <span className="text-[9px] text-[var(--text-muted)]">px</span>
                      </div>
                      <div className="flex items-center bg-[var(--bg-sidebar)] border border-[var(--border-dev)] rounded-lg px-2.5 py-1.5">
                        <span className="text-[10px] text-[var(--text-muted)] font-bold mr-2">H</span>
                        <input
                          type="number"
                          min={16}
                          value={targetHeight || ''}
                          onChange={(e) => handleHeightChange(Number(e.target.value))}
                          className="w-full bg-transparent text-[var(--text-primary)] outline-none font-mono text-xs"
                          placeholder="Height"
                        />
                        <span className="text-[9px] text-[var(--text-muted)]">px</span>
                      </div>
                    </div>
                  </div>

                  {/* Scale Presets */}
                  <div>
                    <span className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1.5">
                      Scaling Presets
                    </span>
                    <div className="grid grid-cols-5 gap-1.5 text-center text-xs">
                      {[
                        { label: '25%', val: 0.25 },
                        { label: '50%', val: 0.5 },
                        { label: '75%', val: 0.75 },
                        { label: '100%', val: 1 },
                        { label: '200%', val: 2 },
                      ].map((item) => (
                        <button
                          key={item.label}
                          onClick={() => handleScalePresetChange(item.val)}
                          className={`py-1 rounded border text-[10px] font-mono transition-colors cursor-pointer ${scalePreset === item.val
                              ? 'bg-rose-500 text-white font-bold border-rose-500'
                              : 'bg-[var(--bg-sidebar)] border-[var(--border-dev)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                            }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rotation and Flip Controls */}
                  <div>
                    <span className="block text-[11px] font-bold text-[var(--text-secondary)] mb-2">
                      Orientation and Mirror
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setRotationDeg((prev) => (prev + 90) % 360)}
                        className="py-1.5 px-2 rounded-lg border border-[var(--border-dev)] bg-[var(--bg-sidebar)] hover:bg-[var(--pill-bg)] text-xs flex items-center justify-center gap-1.5 text-[var(--text-primary)] cursor-pointer"
                        title="Rotate 90 degrees"
                      >
                        <RotateCw className="w-3.5 h-3.5 text-rose-500" />
                        <span className="text-[10px] font-mono">+{rotationDeg}°</span>
                      </button>
                      <button
                        onClick={() => setFlipH(!flipH)}
                        className={`py-1.5 px-2 rounded-lg border text-xs flex items-center justify-center gap-1.5 cursor-pointer ${flipH
                            ? 'bg-rose-500/10 border-rose-500 text-rose-500 font-bold'
                            : 'border-[var(--border-dev)] bg-[var(--bg-sidebar)] text-[var(--text-primary)]'
                          }`}
                        title="Flip Horizontal (Mirror)"
                      >
                        <FlipHorizontal className="w-3.5 h-3.5" />
                        <span className="text-[10px]">Flip H</span>
                      </button>
                      <button
                        onClick={() => setFlipV(!flipV)}
                        className={`py-1.5 px-2 rounded-lg border text-xs flex items-center justify-center gap-1.5 cursor-pointer ${flipV
                            ? 'bg-rose-500/10 border-rose-500 text-rose-500 font-bold'
                            : 'border-[var(--border-dev)] bg-[var(--bg-sidebar)] text-[var(--text-primary)]'
                          }`}
                        title="Flip Vertical"
                      >
                        <FlipVertical className="w-3.5 h-3.5" />
                        <span className="text-[10px]">Flip V</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: FILTERS AND SHADOW EFFECTS */}
              {activeTab === 'filters' && (
                <div className="space-y-4">
                  {/* Drop Shadow Toggle */}
                  <div className="p-3 rounded-lg bg-[var(--bg-sidebar)] border border-[var(--border-dev)] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-rose-500" />
                        Studio Drop Shadow
                      </span>
                      <button
                        onClick={() => setHasDropShadow(!hasDropShadow)}
                        className={`text-[10px] px-2 py-0.5 rounded font-bold cursor-pointer transition-colors ${hasDropShadow
                            ? 'bg-rose-500 text-white'
                            : 'bg-[var(--bg-panel)] text-[var(--text-muted)] border border-[var(--border-dev)]'
                          }`}
                      >
                        {hasDropShadow ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>

                    {hasDropShadow && (
                      <div className="space-y-3 pt-2 border-t border-[var(--border-dev)]">
                        <div>
                          <div className="flex justify-between text-[10px] text-[var(--text-muted)] mb-1">
                            <span>Blur Intensity</span>
                            <span>{shadowBlur}px</span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={50}
                            value={shadowBlur}
                            onChange={(e) => setShadowBlur(Number(e.target.value))}
                            className="w-full accent-rose-500 cursor-pointer"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-[10px] text-[var(--text-muted)] mb-1">
                            <span>Distance Y</span>
                            <span>{shadowOffsetY}px</span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={40}
                            value={shadowOffsetY}
                            onChange={(e) => setShadowOffsetY(Number(e.target.value))}
                            className="w-full accent-rose-500 cursor-pointer"
                          />
                        </div>

                        <div>
                          <span className="block text-[10px] text-[var(--text-muted)] mb-1.5">Shadow Mood</span>
                          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                            {SHADOW_COLORS.map((sc) => (
                              <button
                                key={sc.label}
                                onClick={() => setShadowColor(sc.value)}
                                className={`py-1 px-2 rounded border text-left truncate cursor-pointer ${shadowColor === sc.value
                                    ? 'border-rose-500 bg-rose-500/10 text-rose-500 font-bold'
                                    : 'border-[var(--border-dev)] bg-[var(--bg-panel)] text-[var(--text-secondary)]'
                                  }`}
                              >
                                {sc.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Brightness, Contrast, Saturation Sliders */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-[11px] font-bold mb-1">
                        <span className="text-[var(--text-primary)]">Brightness</span>
                        <span className="font-mono text-rose-500">{brightness}%</span>
                      </div>
                      <input
                        type="range"
                        min={50}
                        max={150}
                        value={brightness}
                        onChange={(e) => setBrightness(Number(e.target.value))}
                        className="w-full accent-rose-500 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-bold mb-1">
                        <span className="text-[var(--text-primary)]">Contrast</span>
                        <span className="font-mono text-rose-500">{contrast}%</span>
                      </div>
                      <input
                        type="range"
                        min={50}
                        max={150}
                        value={contrast}
                        onChange={(e) => setContrast(Number(e.target.value))}
                        className="w-full accent-rose-500 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-bold mb-1">
                        <span className="text-[var(--text-primary)]">Saturation</span>
                        <span className="font-mono text-rose-500">{saturation}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={200}
                        value={saturation}
                        onChange={(e) => setSaturation(Number(e.target.value))}
                        className="w-full accent-rose-500 cursor-pointer"
                      />
                    </div>
                    

                  </div>

                  <button
                    onClick={resetAdjustments}
                    className="w-full py-1.5 text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] text-center cursor-pointer border border-[var(--border-dev)] rounded-md hover:bg-[var(--pill-bg)] transition-colors"
                  >
                    Reset All Adjustments
                  </button>
                </div>
              )}

              {/* Export Format Selector */}
              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-2">
                  Export Format
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    onClick={() => setExportFormat('image/png')}
                    className={`py-2 px-2 rounded-lg border text-center transition-all cursor-pointer ${exportFormat === 'image/png'
                        ? 'bg-rose-500/10 border-rose-500 text-rose-500 font-bold'
                        : 'border-[var(--border-dev)] bg-[var(--bg-sidebar)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                  >
                    PNG
                    <span className="block text-[8px] text-[var(--text-muted)] font-normal">Lossless Alpha</span>
                  </button>
                  <button
                    onClick={() => setExportFormat('image/webp')}
                    className={`py-2 px-2 rounded-lg border text-center transition-all cursor-pointer ${exportFormat === 'image/webp'
                        ? 'bg-rose-500/10 border-rose-500 text-rose-500 font-bold'
                        : 'border-[var(--border-dev)] bg-[var(--bg-sidebar)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                  >
                    WebP
                    <span className="block text-[8px] text-[var(--text-muted)] font-normal">Ultra Compact</span>
                  </button>
                  <button
                    onClick={() => setExportFormat('image/jpeg')}
                    className={`py-2 px-2 rounded-lg border text-center transition-all cursor-pointer ${exportFormat === 'image/jpeg'
                        ? 'bg-rose-500/10 border-rose-500 text-rose-500 font-bold'
                        : 'border-[var(--border-dev)] bg-[var(--bg-sidebar)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                  >
                    JPEG
                    <span className="block text-[8px] text-[var(--text-muted)] font-normal">Standard</span>
                  </button>
                </div>
              </div>

              {/* Target File Size Budget Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-rose-500" />
                    <span>Target File Size</span>
                  </label>
                  {targetFileSize !== 'full' && (
                    <span className="text-[10px] text-emerald-500 font-bold font-mono">
                      {targetFileSize === 'custom' ? `< ${customTargetKb} KB` : FILE_SIZE_PRESETS.find(p => p.id === targetFileSize)?.label}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-xs mb-2">
                  {FILE_SIZE_PRESETS.slice(0, 4).map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => setTargetFileSize(preset.id)}
                      className={`py-1.5 px-2 rounded-lg border text-left transition-all cursor-pointer ${targetFileSize === preset.id
                          ? 'bg-rose-500/10 border-rose-500 text-rose-500 font-bold shadow-sm'
                          : 'border-[var(--border-dev)] bg-[var(--bg-sidebar)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                    >
                      <span className="block text-[11px] font-bold truncate">{preset.label}</span>
                      <span className="block text-[8px] text-[var(--text-muted)] font-normal truncate">{preset.sub}</span>
                    </button>
                  ))}
                </div>

                {/* Custom Target KB Toggle / Input */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTargetFileSize('custom')}
                    className={`py-1 px-2.5 text-[10px] rounded border transition-colors cursor-pointer ${targetFileSize === 'custom'
                        ? 'bg-rose-500 text-white font-bold border-rose-500'
                        : 'bg-[var(--bg-sidebar)] border-[var(--border-dev)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                  >
                    Custom Size
                  </button>
                  {targetFileSize === 'custom' && (
                    <div className="flex items-center gap-1.5 flex-1">
                      <input
                        type="number"
                        min="20"
                        max="20000"
                        step="50"
                        value={customTargetKb}
                        onChange={(e) => setCustomTargetKb(Math.max(10, parseInt(e.target.value) || 100))}
                        className="w-24 px-2 py-1 text-[11px] font-mono rounded bg-[var(--bg-sidebar)] border border-[var(--border-dev)] text-[var(--text-primary)] outline-none focus:border-rose-500"
                      />
                      <span className="text-[10px] text-[var(--text-muted)] font-mono">KB limit</span>
                    </div>
                  )}
                </div>

                {targetFileSize !== 'full' && exportFormat === 'image/png' && (
                  <p className="mt-1.5 text-[10px] text-amber-500/90 leading-tight">
                    💡 Tip: WebP format keeps full resolution while fitting within the target size budget.
                  </p>
                )}
              </div>

              {/* Primary Action Buttons (Moved to Sticky Footer) */}

              {/* Live Image Diagnostics */}
              <div className="p-3 rounded-lg bg-[var(--bg-sidebar)] border border-[var(--border-dev)] space-y-1.5 text-[10px] font-mono">
                <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">
                  Studio Specs and Metrics
                </span>
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Export Target:</span>
                  <span className="text-rose-500 font-bold">{targetWidth + paddingPx * 2} × {targetHeight + paddingPx * 2}px</span>
                </div>
                {processingTimeMs !== null && (
                  <div className="flex justify-between text-[var(--text-secondary)]">
                    <span>Inference Speed:</span>
                    <span className="text-emerald-500 font-bold">{(processingTimeMs / 1000).toFixed(2)}s</span>
                  </div>
                )}
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Privacy:</span>
                  <span className="text-emerald-500 font-semibold">100% Client-Side</span>
                </div>
              </div>

              {/* Related Image Studio Workflows (Internal Linking) */}
              <div className="p-3 rounded-lg bg-[var(--bg-sidebar)] border border-[var(--border-dev)] space-y-2 text-left">
                <span className="text-[9px] font-bold text-[var(--text-primary)] uppercase tracking-wider block font-sans">
                  Related Studio Tools
                </span>
                <div className="flex flex-col gap-1.5 text-xs">
                  {initialMode !== 'bg-removal' && (
                    <Link
                      href="/background-remover"
                      className="flex items-center justify-between p-2 rounded bg-[var(--bg-panel)] hover:bg-[var(--pill-bg)] border border-[var(--border-dev)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all group"
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <Sparkles className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span className="truncate text-[11px] font-medium">AI Background Remover</span>
                      </div>
                      <ArrowRight className="w-3 h-3 text-[var(--text-muted)] group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </Link>
                  )}
                  {initialMode !== 'resizer' && (
                    <Link
                      href="/image-resizer"
                      className="flex items-center justify-between p-2 rounded bg-[var(--bg-panel)] hover:bg-[var(--pill-bg)] border border-[var(--border-dev)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all group"
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <Maximize2 className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                        <span className="truncate text-[11px] font-medium">Resize &amp; Frame Artboard</span>
                      </div>
                      <ArrowRight className="w-3 h-3 text-[var(--text-muted)] group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </Link>
                  )}
                  {initialMode !== 'compressor' && (
                    <Link
                      href="/image-compressor"
                      className="flex items-center justify-between p-2 rounded bg-[var(--bg-panel)] hover:bg-[var(--pill-bg)] border border-[var(--border-dev)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all group"
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <HardDrive className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="truncate text-[11px] font-medium">Compress &amp; WebP Converter</span>
                      </div>
                      <ArrowRight className="w-3 h-3 text-[var(--text-muted)] group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
            
            {/* Sticky Action Footer */}
            <div className="sticky bottom-0 bg-[var(--bg-panel)] p-4 border-t border-[var(--border-dev)] z-30 shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
              <div className="space-y-2">
                <button
                  onClick={handleOpenExportPreview}
                  disabled={!sourceImage || isProcessing || isExporting}
                  className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {isExporting
                      ? 'Compositing Output...'
                      : resultImageUrl
                        ? 'Preview and Download Cutout'
                        : 'Preview and Download Image'}
                  </span>
                </button>

                <button
                  onClick={handleCopyClipboard}
                  disabled={!sourceImage || isProcessing || isExporting}
                  className="w-full py-2 px-4 rounded-lg border border-[var(--border-dev)] bg-[var(--bg-sidebar)] hover:bg-[var(--pill-bg)] text-[var(--text-primary)] font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500">Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      <span>{resultImageUrl ? 'Copy PNG Cutout to Clipboard' : 'Copy Image to Clipboard'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* FINAL EXPORT PREVIEW MODAL */}
      {previewModalOpen && finalExportUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
            {/* Modal Header */}
            <div className="h-12 px-4 border-b border-[var(--border-dev)] flex items-center justify-between bg-[var(--bg-panel-subtle)] shrink-0">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-[var(--text-primary)]">Final Export Preview</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--bg-sidebar)] text-[var(--text-muted)] font-mono">
                  {exportDimensions?.width || targetWidth + paddingPx * 2} × {exportDimensions?.height || targetHeight + paddingPx * 2}px
                </span>
              </div>
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--pill-bg)] cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Quick Adjustment Controls: Format & Size Budget */}
            <div className="px-4 py-2 bg-[var(--bg-panel)] border-b border-[var(--border-dev)] flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
              {/* Quick Format Toggles */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase mr-0.5">Format:</span>
                {(['image/png', 'image/webp', 'image/jpeg'] as ExportFormat[]).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => handleModalFormatChange(fmt)}
                    disabled={isExporting}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${exportFormat === fmt
                        ? 'bg-rose-500 text-white border-rose-500'
                        : 'bg-[var(--bg-sidebar)] border-[var(--border-dev)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                  >
                    {fmt.replace('image/', '').toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Quick Target Size Toggles */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase mr-0.5">Size Target:</span>
                {FILE_SIZE_PRESETS.slice(0, 4).map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleModalTargetSizeChange(preset.id)}
                    disabled={isExporting}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${targetFileSize === preset.id
                        ? 'bg-rose-500 text-white border-rose-500'
                        : 'bg-[var(--bg-sidebar)] border-[var(--border-dev)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Body: Rendered Preview Stage */}
            <div className="flex-1 p-6 flex items-center justify-center overflow-hidden bg-[var(--bg-app)] relative min-h-[300px]">
              <div className="max-w-full max-h-[50vh] relative rounded-lg overflow-hidden border border-[var(--border-dev)] shadow-xl flex items-center justify-center">
                {activeMatteObj?.type === 'transparent' && (
                  <div className="absolute inset-0 bg-transparency-grid" />
                )}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={finalExportUrl}
                  alt="Final Cutout Preview"
                  className="max-w-full max-h-[50vh] object-contain relative z-10 select-none"
                />
              </div>
            </div>

            {/* Modal Metadata Bar */}
            <div className="p-4 bg-[var(--bg-panel-subtle)] border-t border-[var(--border-dev)] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs shrink-0">
              <div>
                <span className="text-[10px] text-[var(--text-muted)] block font-mono">Dimensions</span>
                <span className="font-bold text-[var(--text-primary)] font-mono flex items-center gap-1">
                  <span>
                    {exportDimensions?.width || targetWidth + paddingPx * 2} × {exportDimensions?.height || targetHeight + paddingPx * 2}px
                  </span>
                  {exportDimensions && (exportDimensions.width < (targetWidth + paddingPx * 2)) && (
                    <span className="text-[9px] text-amber-500 font-normal">(scaled)</span>
                  )}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-muted)] block font-mono">Output File Size</span>
                <span className="font-bold text-emerald-500 font-mono flex items-center gap-1">
                  <span>{finalExportBlob ? `${(finalExportBlob.size / 1024).toFixed(1)} KB` : 'Estimating...'}</span>
                  {originalExportSize && finalExportBlob && originalExportSize > finalExportBlob.size && (
                    <span className="text-[9px] text-emerald-400 font-normal">
                      (-{Math.round((1 - finalExportBlob.size / originalExportSize) * 100)}%)
                    </span>
                  )}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-muted)] block font-mono">Size Target & Quality</span>
                <span className="font-bold font-mono">
                  {targetFileSize === 'full' ? (
                    <span className="text-cyan-400">Full Quality (100%)</span>
                  ) : (
                    <span className="text-emerald-400">
                      Budget: {targetFileSize === 'custom' ? `< ${customTargetKb}KB` : FILE_SIZE_PRESETS.find(p => p.id === targetFileSize)?.label}
                    </span>
                  )}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-muted)] block font-mono">Backdrop</span>
                <span className="font-bold text-rose-500 truncate block">
                  {activeMatteObj?.name || 'Transparent'}
                </span>
              </div>
            </div>

            {/* Modal Cross-Tool Next Action Link */}
            <div className="px-4 py-2 bg-[var(--bg-sidebar)] border-t border-[var(--border-dev)] flex items-center justify-between text-xs">
              <span className="text-[10px] text-[var(--text-muted)] font-mono">Next Workflow Step:</span>
              <div className="flex items-center gap-3 text-[11px]">
                {initialMode !== 'resizer' && (
                  <Link href="/image-resizer" className="text-rose-500 hover:underline flex items-center gap-1 font-semibold">
                    <Maximize2 className="w-3 h-3" />
                    <span>Resize &amp; Frame</span>
                  </Link>
                )}
                {initialMode !== 'compressor' && (
                  <Link href="/image-compressor" className="text-amber-500 hover:underline flex items-center gap-1 font-semibold">
                    <HardDrive className="w-3 h-3" />
                    <span>Compress for Web</span>
                  </Link>
                )}
                {initialMode !== 'bg-removal' && (
                  <Link href="/background-remover" className="text-rose-500 hover:underline flex items-center gap-1 font-semibold">
                    <Sparkles className="w-3 h-3" />
                    <span>AI Background Remover</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="p-4 border-t border-[var(--border-dev)] flex items-center justify-end gap-3 bg-[var(--bg-panel)] shrink-0">
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--pill-bg)] transition-colors cursor-pointer"
              >
                Back to Editing
              </button>
              <button
                onClick={handleConfirmDownload}
                className="px-5 py-2 text-xs font-bold bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white rounded-lg flex items-center gap-2 shadow-lg shadow-rose-500/20 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Save to Device</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Status Bar */}
      <footer className="dev-statusbar bg-[var(--bg-statusbar)] border-t border-[var(--border-dev)] px-4 flex items-center justify-between text-[var(--text-muted)] shrink-0 select-none z-20">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-[var(--text-primary)]">EDGE AI STUDIO</span>
          </span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline">WebGPU and WebAssembly SIMD</span>
        </div>

        <div className="flex items-center gap-3">
          <ShieldCheck className="w-3 h-3 text-emerald-500" />
          <span className="text-[var(--text-secondary)]">Zero Server Uploads</span>
        </div>
      </footer>
    </div>
  );
}
