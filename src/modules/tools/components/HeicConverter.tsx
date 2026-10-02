'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Upload, Image as ImageIcon, Download, Trash, RefreshCw, CheckCircle } from 'lucide-react';
// We import heic2any dynamically to avoid SSR issues
// import heic2any from 'heic2any';

interface ConversionItem {
  id: string;
  file: File;
  status: 'idle' | 'converting' | 'done' | 'error';
  blob?: Blob;
  previewUrl?: string;
  error?: string;
}

export default function HeicConverter({ slug }: { slug?: string }) {
  const [items, setItems] = useState<ConversionItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (newFiles: FileList | File[]) => {
    const newItems: ConversionItem[] = Array.from(newFiles)
      .filter((file) => file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif'))
      .map((file) => ({
        id: Math.random().toString(36).substring(2, 9),
        file,
        status: 'idle',
      }));

    if (newItems.length > 0) {
      setItems((prev) => [...prev, ...newItems]);
    } else {
      alert('Please upload .heic or .heif files.');
    }
  };

  const convertItem = async (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'converting' } : item))
    );

    try {
      const heic2any = (await import('heic2any')).default;
      const item = items.find((i) => i.id === id);
      if (!item) return;

      const result = await heic2any({
        blob: item.file,
        toType: 'image/jpeg',
        quality: 0.9, // Adjust quality as needed
      });

      const convertedBlob = Array.isArray(result) ? result[0] : result;
      const previewUrl = URL.createObjectURL(convertedBlob);

      setItems((prev) =>
        prev.map((i) =>
          i.id === id
            ? { ...i, status: 'done', blob: convertedBlob, previewUrl }
            : i
        )
      );
    } catch (error: any) {
      console.error('Conversion failed:', error);
      setItems((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, status: 'error', error: error.message || 'Conversion failed' } : i
        )
      );
    }
  };

  const convertAll = async () => {
    const idleItems = items.filter((i) => i.status === 'idle' || i.status === 'error');
    for (const item of idleItems) {
      await convertItem(item.id);
    }
  };

  const downloadItem = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item || !item.blob) return;

    const newFilename = item.file.name.replace(/\.heic|\.heif$/i, '.jpg');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(item.blob);
    a.download = newFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item?.previewUrl) {
        URL.revokeObjectURL(item.previewUrl);
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [items]);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'HEIC to JPG Converter',
      description: 'Convert iPhone HEIC photos to JPG format completely locally in your browser.',
      applicationCategory: 'MultimediaApplication',
      operatingSystem: 'Any',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    }
  ];

  return (
    <div className="flex flex-col min-h-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col shrink-0 w-full p-4 lg:p-8 max-w-6xl mx-auto min-h-[580px]">
        <h1 className="text-3xl font-bold mb-2 text-[var(--text-primary)]">HEIC to JPG Converter</h1>
        <p className="text-[var(--text-secondary)] mb-8 max-w-2xl">
          Easily convert your iPhone HEIC photos to widely supported JPG format. 
          Everything runs entirely on your device using WebAssembly — no photos are ever uploaded to a server.
        </p>

        <div
          className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl transition-colors ${
            isDragging
              ? 'border-rose-500 bg-rose-500/5'
              : 'border-[var(--border-dev)] bg-[var(--bg-panel)]'
          } mb-8`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="w-16 h-16 rounded-full bg-[var(--bg-app)] border border-[var(--border-dev)] flex items-center justify-center mb-4 text-[var(--text-muted)]">
            <Upload size={32} />
          </div>
          <p className="text-lg font-medium text-[var(--text-primary)] mb-2">
            Drag & Drop HEIC files here
          </p>
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            Or select files from your device to start converting.
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-3 bg-[var(--text-primary)] text-[var(--bg-app)] font-medium rounded-lg shadow hover:opacity-90 transition-opacity"
          >
            Select Photos
          </button>
          <input
            type="file"
            multiple
            accept=".heic,.heif"
            className="hidden"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files) handleFiles(e.target.files);
            }}
          />
        </div>

        {items.length > 0 && (
          <div className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-[var(--border-dev)] flex items-center justify-between bg-[var(--bg-app)]/50">
              <h2 className="font-semibold flex items-center gap-2 text-[var(--text-primary)]">
                <ImageIcon size={18} />
                Conversion Queue ({items.length})
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setItems([])}
                  className="px-3 py-1.5 text-sm rounded-md border border-[var(--border-dev)] text-[var(--text-secondary)] hover:bg-[var(--bg-app)] transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={convertAll}
                  className="px-4 py-1.5 text-sm rounded-md bg-rose-500 text-white font-medium shadow-sm hover:bg-rose-600 transition-colors flex items-center gap-2"
                >
                  <RefreshCw size={14} />
                  Convert Pending
                </button>
              </div>
            </div>
            
            <ul className="divide-y divide-[var(--border-dev)]">
              {items.map((item) => (
                <li key={item.id} className="p-4 flex items-center gap-4 hover:bg-[var(--bg-app)]/30 transition-colors">
                  {item.previewUrl ? (
                    <img src={item.previewUrl} alt="Preview" className="w-16 h-16 object-cover rounded-md border border-[var(--border-dev)] bg-[var(--bg-app)]" />
                  ) : (
                    <div className="w-16 h-16 rounded-md bg-[var(--bg-app)] border border-[var(--border-dev)] flex items-center justify-center text-[var(--text-muted)]">
                      <ImageIcon size={24} />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[var(--text-primary)] truncate">{item.file.name}</p>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                      {(item.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-end min-w-[120px] gap-2">
                    {item.status === 'idle' && (
                      <button
                        onClick={() => convertItem(item.id)}
                        className="px-3 py-1.5 text-sm font-medium rounded-md text-rose-500 hover:bg-rose-500/10 transition-colors"
                      >
                        Convert
                      </button>
                    )}
                    {item.status === 'converting' && (
                      <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm">
                        <RefreshCw size={14} className="animate-spin" />
                        Converting...
                      </div>
                    )}
                    {item.status === 'done' && (
                      <button
                        onClick={() => downloadItem(item.id)}
                        className="px-3 py-1.5 text-sm font-medium rounded-md bg-[var(--bg-app)] border border-[var(--border-dev)] text-[var(--text-primary)] hover:bg-[var(--bg-panel)] transition-colors flex items-center gap-2"
                      >
                        <Download size={14} />
                        Download
                      </button>
                    )}
                    {item.status === 'error' && (
                      <span className="text-sm text-red-500">{item.error}</span>
                    )}
                    
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 text-[var(--text-muted)] hover:text-red-500 rounded-md hover:bg-red-500/10 transition-colors ml-2"
                      title="Remove"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* SEO Content Block */}
      <article className="tool-seo-content prose prose-sm max-w-none dark:prose-invert mt-auto border-t border-[var(--border-dev)] pt-12 px-4 lg:px-8 max-w-6xl mx-auto w-full mb-16">
        <h2>Private & Fast HEIC to JPG Converter</h2>
        <p>
          Apple's HEIC format is highly efficient for storing photos on iPhones, saving significant storage space. However, many older web portals, government forms, and CRM systems do not support HEIC files out of the box, leading to frustrating upload errors.
        </p>
        
        <h3>100% Local Conversion (WebAssembly)</h3>
        <p>
          Unlike most HEIC converters that require you to upload your personal photos to an external server, DevPantry's HEIC to JPG converter runs completely inside your browser using WebAssembly. This means <strong>zero data leaves your device</strong>. The conversion process is faster, entirely private, and doesn't rely on your internet connection speed.
        </p>
        
        <h3>How it Works</h3>
        <p>
          We utilize the open-source <code>heic2any</code> library, which leverages WASM-compiled C++ libraries to decode High-Efficiency Image Container (HEIC) sequences in JavaScript. The output is a standard JPEG file formatted and ready for any system, fully retaining visual quality.
        </p>
      </article>
    </div>
  );
}
