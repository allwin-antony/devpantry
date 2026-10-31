import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, Download, Trash2, MapPin, Eye, FileJson, CheckCircle2, RefreshCw } from 'lucide-react';
import { triggerFeedbackNudge } from '@/lib/feedbackNudge';
import exifr from 'exifr';

export const ExifStripperUtility: React.FC<{ focus?: 'gps' | 'metadata' }> = ({ focus = 'metadata' }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<any>(null);
  const [isStripping, setIsStripping] = useState(false);
  const [strippedBlobUrl, setStrippedBlobUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'metadata'>('preview');
  const [error, setError] = useState('');
  const [outputType, setOutputType] = useState('image/png');
  const selectionVersion = useRef(0);

  const previewRef = useRef<string | null>(null);
  const strippedBlobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    previewRef.current = preview;
  }, [preview]);

  useEffect(() => {
    strippedBlobUrlRef.current = strippedBlobUrl;
  }, [strippedBlobUrl]);

  useEffect(() => {
    return () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
      if (strippedBlobUrlRef.current) URL.revokeObjectURL(strippedBlobUrlRef.current);
    };
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    e.target.value = '';
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(selectedFile.type) || selectedFile.size > 50 * 1024 * 1024) {
      setError('Choose a JPEG, PNG, or WebP image no larger than 50 MB.');
      return;
    }
    const version = ++selectionVersion.current;
    setError('');
    
    if (preview) URL.revokeObjectURL(preview);
    if (strippedBlobUrl) URL.revokeObjectURL(strippedBlobUrl);

    setFile(selectedFile);
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    setStrippedBlobUrl(null);
    setMetadata(null);
    setActiveTab(focus === 'gps' ? 'metadata' : 'preview');

    try {
      // Parse basic EXIF data
      const parsed = await exifr.parse(selectedFile);
      if (version === selectionVersion.current) setMetadata(parsed || {});
    } catch (err) {
      console.error('Error parsing EXIF:', err);
      if (version === selectionVersion.current) { setMetadata({}); setError('The metadata could not be read. You can still re-encode a supported image.'); }
    }
  };

  const stripMetadata = async () => {
    if (!file || !preview) return;
    setIsStripping(true);
    setError('');
    const version = selectionVersion.current;

    try {
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = preview;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      
      // Draw image to canvas (this natively strips metadata)
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (version !== selectionVersion.current) { setIsStripping(false); return; }
        if (blob) {
          const newUrl = URL.createObjectURL(blob);
          setStrippedBlobUrl(prev => {
            if (prev) URL.revokeObjectURL(prev);
            return newUrl;
          });
          setOutputType(blob.type);
          triggerFeedbackNudge('exif-stripper-success');
        } else {
          setError('The image could not be exported. Try a smaller image.');
        }
        setIsStripping(false);
        canvas.width = 0;
        canvas.height = 0;
      }, file.type, 1.0); // 1.0 keeps max quality for formats like JPEG/WebP
    } catch (error) {
      console.error('Failed to strip metadata:', error);
      setError('The image could not be processed. Try another JPEG, PNG, or WebP.');
      setIsStripping(false);
    }
  };

  const handleDownload = () => {
    if (!strippedBlobUrl || !file) return;
    const a = document.createElement('a');
    a.href = strippedBlobUrl;
    
    // Create new filename
    const parts = file.name.split('.');
    parts.pop();
    const ext = outputType === 'image/jpeg' ? 'jpg' : outputType === 'image/webp' ? 'webp' : 'png';
    const base = parts.join('.');
    a.download = `${base}_stripped.${ext}`;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    triggerFeedbackNudge('exif-stripper-download');
  };

  const handleClear = () => {
    selectionVersion.current++;
    if (preview) URL.revokeObjectURL(preview);
    if (strippedBlobUrl) URL.revokeObjectURL(strippedBlobUrl);
    setFile(null);
    setPreview(null);
    setMetadata(null);
    setStrippedBlobUrl(null);
  };

  const hasGPS = metadata && (metadata.latitude !== undefined || metadata.GPSLatitude !== undefined);

  return (
    <div className="flex flex-col gap-4 font-sans">
      
      {/* Top Banner */}
      <div className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-xl p-4 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-indigo-500" />
            {focus === 'gps' ? 'Remove GPS from a Photo' : 'Image Metadata & EXIF Stripper'}
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            {focus === 'gps' ? 'Check a photo for embedded location coordinates, then remove its source EXIF metadata locally.' : 'Inspect camera, date, and location fields, then export a new image without the original EXIF metadata.'}
          </p>
        </div>
      </div>

      {error && <p role="alert" className="p-3 rounded-lg bg-amber-500/10 text-sm">{error}</p>}
      <div className="grid md:grid-cols-2 gap-4">
        
        {/* Left Column: Upload & Preview */}
        <div className="flex flex-col gap-4 min-h-[22rem] min-w-0">
          {!file ? (
            <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-[var(--border-dev)] rounded-xl bg-[var(--bg-panel)] hover:bg-[var(--bg-sidebar)] transition-colors cursor-pointer group">
              <input type="file" accept="image/jpeg, image/png, image/webp" className="hidden" onChange={handleFileChange} />
              <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-8 h-8 text-indigo-500" />
              </div>
              <p className="font-medium text-lg">Choose an image</p>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Supports JPEG, PNG, WebP (Max 50MB)</p>
            </label>
          ) : (
            <div className="flex-1 flex flex-col bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-xl overflow-hidden shadow-sm relative group">
              {/* Header/Tabs */}
              <div className="flex border-b border-[var(--border-dev)] shrink-0">
                <button 
                  onClick={() => setActiveTab('preview')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${activeTab === 'preview' ? 'border-b-2 border-indigo-500 text-indigo-500 bg-indigo-500/5' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-sidebar)]'}`}
                >
                  <Eye className="w-4 h-4" /> Image Preview
                </button>
                <button 
                  onClick={() => setActiveTab('metadata')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${activeTab === 'metadata' ? 'border-b-2 border-indigo-500 text-indigo-500 bg-indigo-500/5' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-sidebar)]'}`}
                >
                  <FileJson className="w-4 h-4" /> Metadata ({metadata ? Object.keys(metadata).length : 0})
                  {hasGPS && <MapPin className="w-3 h-3 text-red-500" />}
                </button>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-auto bg-[var(--bg-sidebar)] relative">
                {activeTab === 'preview' ? (
                  <div className="absolute inset-0 p-4 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview!} alt="Selected image preview" className="max-w-full max-h-full object-contain rounded-lg shadow-lg border border-[var(--border-dev)]" />
                  </div>
                ) : (
                  <div className="p-4 font-mono text-sm overflow-auto absolute inset-0">
                    <pre className="text-[var(--text-primary)]">
                      {metadata ? JSON.stringify(metadata, null, 2) : 'Loading metadata...'}
                    </pre>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="p-3 border-t border-[var(--border-dev)] flex justify-between items-center bg-[var(--bg-panel)] shrink-0">
                <span className="text-xs text-[var(--text-secondary)] truncate max-w-[200px]" title={file.name}>
                  {file.name}
                </span>
                <button 
                  onClick={handleClear}
                  className="px-3 py-1.5 text-sm font-medium text-red-500 hover:bg-red-500/10 rounded-md transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Clear
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Processing & Output */}
        <div className="flex flex-col gap-4 min-h-[22rem] min-w-0">
          <div className="flex-1 bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden">
            
            {/* Background Gradient */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />

            {!file ? (
              <div className="relative z-10 flex flex-col items-center max-w-sm">
                <div className="w-20 h-20 bg-[var(--bg-sidebar)] rounded-full border border-[var(--border-dev)] flex items-center justify-center mb-6 shadow-inner">
                  <Eye className="w-10 h-10 text-[var(--text-secondary)] opacity-50" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Waiting for image</h3>
                <p className="text-[var(--text-secondary)]">Choose an image to inspect its embedded metadata.</p>
              </div>
            ) : !strippedBlobUrl ? (
              <div className="relative z-10 flex flex-col items-center w-full max-w-sm">
                
                {hasGPS && (
                  <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/5 text-red-500 w-full animate-in slide-in-from-bottom-4">
                    <div className="flex items-center gap-2 justify-center font-bold mb-1">
                      <MapPin className="w-5 h-5" /> GPS Coordinates Detected
                    </div>
                    <p className="text-sm opacity-90 text-center">This image contains location data that can expose where it was taken.</p>
                  </div>
                )}

                <div className="mb-8 text-[var(--text-secondary)]">
                  {metadata && Object.keys(metadata).length > 0 ? (
                    <p>Found <strong className="text-[var(--text-primary)]">{Object.keys(metadata).length}</strong> metadata fields.</p>
                  ) : (
                    <p>No significant EXIF data found, but you can still process it to be safe.</p>
                  )}
                </div>

                <button
                  onClick={stripMetadata}
                  disabled={isStripping}
                  className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  {isStripping ? (
                    <span className="flex items-center gap-2"><RefreshCw className="w-5 h-5 animate-spin" /> Processing...</span>
                  ) : (
                    <span className="flex items-center gap-2"><Trash2 className="w-5 h-5" /> Strip All Metadata</span>
                  )}
                </button>
              </div>
            ) : (
              <div className="relative z-10 flex flex-col items-center w-full max-w-sm animate-in zoom-in-95 duration-300">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full border border-emerald-500/20 flex items-center justify-center mb-6 text-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-emerald-500 mb-2">Cleaned & Ready</h3>
                <p className="text-[var(--text-secondary)] mb-8">All hidden metadata, including GPS coordinates and camera specs, has been securely stripped.</p>
                
                <button
                  onClick={handleDownload}
                  className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Download className="w-5 h-5" /> Download Safe Image
                </button>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};
