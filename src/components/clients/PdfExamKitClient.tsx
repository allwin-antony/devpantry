'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PDFDocument } from 'pdf-lib';
import { triggerFeedbackNudge } from '@/lib/feedbackNudge';
import { FileText, Image as ImageIcon, Scissors, Settings, Download, Trash2, ArrowRight, Merge, X, AlertTriangle } from 'lucide-react';

const PDF_TOOL_COPY = {
  'img-to-pdf': {
    title: 'Image to PDF Converter',
    summary: 'Combine JPEG and PNG images into one PDF in selection order. Processing happens on your device, with no upload or account.',
    heading: 'Create a PDF from JPG and PNG images',
    steps: ['Select one or more JPEG or PNG images.', 'Check the file order. Images are added in selection order, one per page.', 'Generate the PDF and download the resulting document.'],
    detail: 'Each page uses the source image’s dimensions. This conversion embeds your images; it does not automatically reduce their file size. Compress or resize large source images first when the finished PDF must fit an upload limit.',
  },
  'pdf-merge': {
    title: 'Merge PDF Files',
    summary: 'Combine multiple PDFs into one document locally. Select files in the order you want their pages to appear.',
    heading: 'Combine documents in the right order',
    steps: ['Choose at least two PDF documents.', 'Check their selection order and remove any unwanted files.', 'Merge the pages and download the combined PDF.'],
    detail: 'Pages are copied into a new document. Merging does not compress embedded images, so the result may remain close to the combined source sizes. Encrypted PDFs must be unlocked before this tool can read them.',
  },
  'passport-photo': {
    title: 'Passport Photo Resizer & KB Compressor',
    summary: 'Choose pixel dimensions and a target KB size for a photo. Preview the exported JPEG and its actual size before downloading.',
    heading: 'Prepare a photo for an upload form',
    steps: ['Select a photo and enter the form’s maximum size in KB.', 'Optionally set output width and height in pixels. Using both dimensions center-crops the image to that shape.', 'Compress, review the preview and actual dimensions, and download the JPEG.'],
    detail: 'JPEG quality is reduced toward your requested file size. Some targets cannot be reached at the chosen dimensions; the result states whether the budget was met. This tool does not verify passport or visa requirements—use the dimensions and composition rules supplied by your application.',
  },
  'pdf-compress': {
    title: 'PDF Compressor & Structural Optimizer',
    summary: 'Rewrite PDF object streams and clear common document-info fields locally. Compare the before-and-after sizes; embedded images are not downsampled.',
    heading: 'Understand what this PDF optimizer changes',
    steps: ['Choose a PDF from your device.', 'Run structural optimization.', 'Compare the input and output sizes before downloading the result.'],
    detail: 'The optimizer uses pdf-lib object streams and clears common title, author, subject, creator, and producer fields. It does not resample scans or guarantee a smaller file. Already optimized PDFs can remain the same size or grow. For image-heavy PDFs, compress the source images before making a new PDF.',
  },
};

export const PdfExamKitClient: React.FC<{ initialTab?: 'img-to-pdf' | 'passport-photo' | 'pdf-compress' | 'pdf-merge' }> = ({ initialTab }) => {
  const [activeTab, setActiveTab] = useState<'img-to-pdf' | 'passport-photo' | 'pdf-compress' | 'pdf-merge'>(initialTab || 'img-to-pdf');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputFileName, setOutputFileName] = useState('');
  const [targetKb, setTargetKb] = useState<number>(200);
  const [targetWidth, setTargetWidth] = useState(0);
  const [targetHeight, setTargetHeight] = useState(0);
  const [error, setError] = useState('');
  const [outputInfo, setOutputInfo] = useState<{ inputBytes: number; outputBytes: number; width?: number; height?: number; metTarget?: boolean } | null>(null);
  const copy = PDF_TOOL_COPY[activeTab];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const outputUrlRef = useRef<string | null>(null);
  const router = useRouter();

  const updateOutputUrl = (newUrl: string | null) => {
    if (outputUrlRef.current) {
      URL.revokeObjectURL(outputUrlRef.current);
    }
    outputUrlRef.current = newUrl;
    setOutputUrl(newUrl);
    if (!newUrl) setOutputInfo(null);
  };

  const setResult = (blob: Blob, info: Omit<NonNullable<typeof outputInfo>, 'outputBytes'>) => {
    updateOutputUrl(URL.createObjectURL(blob));
    setOutputInfo({ ...info, outputBytes: blob.size });
  };

  useEffect(() => {
    return () => {
      if (outputUrlRef.current) URL.revokeObjectURL(outputUrlRef.current);
    };
  }, []);

  const handleTabClick = (newTab: 'img-to-pdf' | 'passport-photo' | 'pdf-compress' | 'pdf-merge') => {
    if (isProcessing) return;
    setActiveTab(newTab);
    clearFiles();
    const urlMap = {
      'img-to-pdf': '/tools/image-to-pdf',
      'pdf-merge': '/tools/merge-pdf',
      'pdf-compress': '/tools/compress-pdf',
      'passport-photo': '/tools/passport-photo-maker'
    };
    router.push(urlMap[newTab], { scroll: false });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const pdfMode = activeTab === 'pdf-merge' || activeTab === 'pdf-compress';
      const accepted = newFiles.filter(file => pdfMode ? file.type === 'application/pdf' : ['image/jpeg', 'image/png', 'image/webp'].includes(file.type));
      setError(accepted.length === newFiles.length ? '' : 'Some files were not a supported format. Choose PDFs or supported images for the selected tool.');
      setSelectedFiles(prev => activeTab === 'passport-photo' || activeTab === 'pdf-compress' ? accepted.slice(0, 1) : [...prev, ...accepted]);
      updateOutputUrl(null);
      
      // Defer resetting the input so React has time to process the file objects
      setTimeout(() => {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 0);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    updateOutputUrl(null);
  };

  const clearFiles = () => {
    setSelectedFiles([]);
    updateOutputUrl(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageToPdf = async () => {
    if (selectedFiles.length === 0) return;
    setIsProcessing(true);
    setError('');
    updateOutputUrl(null);
    try {
      const pdfDoc = await PDFDocument.create();
      
      for (const file of selectedFiles) {
        const arrayBuffer = await file.arrayBuffer();
        let image;
        if (file.type === 'image/jpeg') {
          image = await pdfDoc.embedJpg(arrayBuffer);
        } else if (file.type === 'image/png') {
          image = await pdfDoc.embedPng(arrayBuffer);
        } else {
          throw new Error('Image to PDF supports JPEG and PNG. Convert other formats first.');
        }

        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });
      }

      const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      setResult(blob, { inputBytes: selectedFiles.reduce((total, file) => total + file.size, 0) });
      triggerFeedbackNudge('pdf-exam-kit-generate');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'The PDF could not be created.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMergePdf = async () => {
    if (selectedFiles.length < 2) {
      setError('Please select at least two PDFs to merge.');
      return;
    }
    setIsProcessing(true);
    setError('');
    updateOutputUrl(null);
    try {
      const mergedPdf = await PDFDocument.create();
      
      for (const file of selectedFiles) {
        if (file.type !== 'application/pdf') continue;
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach(page => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save({ useObjectStreams: true });
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      setResult(blob, { inputBytes: selectedFiles.reduce((total, file) => total + file.size, 0) });
      triggerFeedbackNudge('pdf-exam-kit-merge');
    } catch (err) {
      console.error(err);
      setError('The PDFs could not be merged. Check that they are readable and not encrypted.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompressImage = async () => {
    if (selectedFiles.length === 0) return;
    if (!Number.isFinite(targetKb) || targetKb < 1 || targetKb > 10240 || ![targetWidth, targetHeight].every(value => Number.isInteger(value) && value >= 0 && value <= 8192)) {
      setError('Use a target between 1 and 10,240 KB and pixel dimensions between 1 and 8,192, or leave dimensions empty.');
      return;
    }
    setIsProcessing(true);
    setError('');
    updateOutputUrl(null);
    try {
      const file = selectedFiles[0];
      const img = document.createElement('img');
      const tempImgUrl = URL.createObjectURL(file);
      try {
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = tempImgUrl;
        });

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth || (targetHeight ? Math.max(1, Math.round(img.width * targetHeight / img.height)) : img.width);
        canvas.height = targetHeight || (targetWidth ? Math.max(1, Math.round(img.height * targetWidth / img.width)) : img.height);
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        ctx.drawImage(img, (canvas.width - img.width * scale) / 2, (canvas.height - img.height * scale) / 2, img.width * scale, img.height * scale);

        let quality = 0.95;
        let blob: Blob | null = null;
        
        while (quality > 0.05) {
          blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
          if (blob && blob.size <= targetKb * 1024) {
            break;
          }
          quality -= 0.05;
        }

        if (blob) {
          setResult(blob, { inputBytes: file.size, width: canvas.width, height: canvas.height, metTarget: blob.size <= targetKb * 1024 });
          triggerFeedbackNudge('pdf-exam-kit-compress');
        } else {
          setError('The photo could not be exported.');
        }
        canvas.width = 0;
        canvas.height = 0;
      } finally {
        URL.revokeObjectURL(tempImgUrl);
      }
    } catch (err) {
      console.error(err);
      setError('The photo could not be processed. Try a JPEG, PNG, or WebP image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompressPdf = async () => {
    if (selectedFiles.length === 0) return;
    setIsProcessing(true);
    setError('');
    updateOutputUrl(null);
    try {
      const file = selectedFiles[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer, { updateMetadata: false });
      
      // Basic compression by stripping metadata and using object streams
      pdf.setTitle('');
      pdf.setAuthor('');
      pdf.setSubject('');
      pdf.setProducer('');
      pdf.setCreator('');
      
      const pdfBytes = await pdf.save({ useObjectStreams: true });
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      setResult(blob, { inputBytes: file.size });
      triggerFeedbackNudge('pdf-exam-kit-compress-pdf');
    } catch (err) {
      console.error(err);
      setError('The PDF could not be optimized. Check that it is readable and not encrypted.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'img-to-pdf':
        return (
          <div className="space-y-4">
            <p className="text-sm text-[var(--text-secondary)]">
              Convert JPEGs or PNGs into a single PDF document. Perfect for scanned exams or assignments.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleImageToPdf}
                disabled={selectedFiles.length === 0 || isProcessing}
                className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-semibold disabled:opacity-50 flex items-center gap-2"
              >
                {isProcessing ? 'Processing...' : 'Generate PDF'}
                {!isProcessing && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        );
      case 'pdf-merge':
        return (
          <div className="space-y-4">
            <p className="text-sm text-[var(--text-secondary)]">
              Merge multiple PDF documents into one single file. Order depends on selection.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleMergePdf}
                disabled={selectedFiles.length < 2 || isProcessing}
                className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-semibold disabled:opacity-50 flex items-center gap-2"
              >
                {isProcessing ? 'Merging...' : 'Merge PDFs'}
                {!isProcessing && <Merge className="w-4 h-4" />}
              </button>
            </div>
          </div>
        );
      case 'passport-photo':
        return (
          <div className="space-y-4">
            <p className="text-sm text-[var(--text-secondary)]">
              Set a JPEG size budget and optional pixel dimensions. The result reports whether the budget was reached.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <label htmlFor="photo-target-kb" className="text-sm font-semibold text-[var(--text-primary)] whitespace-nowrap">Max Size (KB):</label>
                <input 
                  id="photo-target-kb"
                  type="number" 
                  min={1}
                  max={10240}
                  value={targetKb} 
                  onChange={(e) => setTargetKb(Number(e.target.value))}
                  className="w-24 px-2 py-1 text-sm bg-[var(--bg-body)] border border-[var(--border-dev)] rounded-lg text-[var(--text-primary)] outline-none focus:border-rose-500"
                />
              </div>
              <button
                onClick={handleCompressImage}
                disabled={selectedFiles.length === 0 || isProcessing}
                className="w-full sm:w-auto px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? 'Compressing...' : 'Compress Photo'}
                {!isProcessing && <Scissors className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <label>Width (px)<input aria-label="Photo width in pixels" type="number" min={1} max={8192} value={targetWidth || ''} onChange={event => setTargetWidth(Number(event.target.value))} placeholder="Original" className="block mt-1 w-32 p-2 rounded-lg border border-[var(--border-dev)] bg-[var(--bg-panel)]" /></label>
              <label>Height (px)<input aria-label="Photo height in pixels" type="number" min={1} max={8192} value={targetHeight || ''} onChange={event => setTargetHeight(Number(event.target.value))} placeholder="Original" className="block mt-1 w-32 p-2 rounded-lg border border-[var(--border-dev)] bg-[var(--bg-panel)]" /></label>
            </div>
          </div>
        );
      case 'pdf-compress':
        return (
           <div className="space-y-4">
            <p className="text-sm text-[var(--text-secondary)]">
              Rewrite object streams and clear common document-info fields. The actual size change is shown after processing.
            </p>
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-700 dark:text-amber-400 space-y-1">
                <p className="font-semibold">Structural optimization, without image downsampling</p>
                <p>This implementation does not recompress images embedded in an existing PDF. A smaller file or a particular KB limit cannot be guaranteed.</p>
                <p>For large scans, <a href="/tools/image-compressor" className="underline">compress the source images</a> first, then combine them with Image to PDF.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCompressPdf}
                disabled={selectedFiles.length === 0 || isProcessing}
                className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-semibold disabled:opacity-50 flex items-center gap-2"
              >
                {isProcessing ? 'Optimizing...' : 'Optimize PDF'}
                {!isProcessing && <Settings className="w-4 h-4" />}
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 pt-8 sm:pt-12 px-4 sm:px-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">{copy.title}</h1>
        <p className="text-[var(--text-secondary)] mt-2">
          {copy.summary}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex w-full max-w-full border-b border-[var(--border-dev)] gap-4 overflow-x-auto pb-1 scrollbar-hide">
        <button 
          onClick={() => handleTabClick('img-to-pdf')}
          className={`pb-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'img-to-pdf' ? 'border-rose-500 text-rose-500' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
        >
          <div className="flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Image to PDF</div>
        </button>
        <button 
          onClick={() => handleTabClick('pdf-merge')}
          className={`pb-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'pdf-merge' ? 'border-rose-500 text-rose-500' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
        >
          <div className="flex items-center gap-2"><FileText className="w-4 h-4" /> Merge PDF</div>
        </button>
        <button 
          onClick={() => handleTabClick('passport-photo')}
          className={`pb-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'passport-photo' ? 'border-rose-500 text-rose-500' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
        >
          <div className="flex items-center gap-2"><Scissors className="w-4 h-4" /> Passport Photo</div>
        </button>
        <button 
          onClick={() => handleTabClick('pdf-compress')}
          className={`pb-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'pdf-compress' ? 'border-rose-500 text-rose-500' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
        >
          <div className="flex items-center gap-2"><Settings className="w-4 h-4" /> Compress PDF</div>
        </button>
      </div>

      {/* File Uploader */}
      {error && <p role="alert" className="p-3 bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg text-sm">{error}</p>}
      <div className="bg-[var(--bg-panel)] rounded-xl border border-[var(--border-dev)] p-6">
        <div className="mb-6">
          <label className="block text-sm font-semibold text-[var(--text-primary)] mb-3">
            {activeTab === 'img-to-pdf' ? 'Select Images (Multiple allowed)' : 'Select Files'}
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <input
              type="file"
              ref={fileInputRef}
              multiple={activeTab === 'img-to-pdf' || activeTab === 'pdf-merge'}
              disabled={isProcessing}
              accept={activeTab === 'img-to-pdf' ? 'image/jpeg,image/png' : activeTab === 'pdf-merge' || activeTab === 'pdf-compress' ? 'application/pdf' : 'image/jpeg,image/png,image/webp'}
              onChange={handleFileChange}
              className="hidden"
              id="file-upload-input"
            />
            <label
              htmlFor="file-upload-input"
              className="w-full sm:w-auto text-center px-4 py-2.5 bg-[var(--pill-bg)] hover:bg-[var(--pill-bg-hover)] text-[var(--text-primary)] border border-[var(--border-dev)] rounded-lg text-sm font-semibold cursor-pointer transition-colors"
            >
              + Add File(s)
            </label>
            {selectedFiles.length > 0 && (
              <button onClick={clearFiles} className="w-full sm:w-auto justify-center p-2 text-[var(--text-secondary)] hover:text-red-500 transition-colors flex items-center gap-1.5 text-sm font-medium border border-[var(--border-dev)] sm:border-transparent rounded-lg sm:rounded-none bg-[var(--bg-body)] sm:bg-transparent">
                <Trash2 className="w-4 h-4" /> Clear All
              </button>
            )}
          </div>
          {selectedFiles.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedFiles.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-xs px-2 py-1.5 bg-[var(--pill-bg)] border border-[var(--border-dev)] rounded-md max-w-full">
                  <span className="truncate flex-1 min-w-0 font-mono" title={f.name}>{f.name}</span>
                  <span className="text-[var(--text-secondary)] shrink-0">({(f.size / 1024).toFixed(1)} KB)</span>
                  <button onClick={() => removeFile(i)} className="text-[var(--text-secondary)] hover:text-red-500 transition-colors ml-1 shrink-0" title="Remove file">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {renderActiveTab()}

        {outputUrl && (
          <div className="mt-8 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p role="status" className="text-sm font-semibold text-green-700 dark:text-green-400">Processing complete</p>
              {outputInfo && <div className="text-sm text-[var(--text-secondary)] mt-2 space-y-1">
                <p>Input: {(outputInfo.inputBytes / 1024).toFixed(1)} KB · Output: {(outputInfo.outputBytes / 1024).toFixed(1)} KB</p>
                {outputInfo.width && <p>{outputInfo.width} × {outputInfo.height} pixels</p>}
                {outputInfo.metTarget === false && <p className="text-amber-700 dark:text-amber-400">The target KB size was not reached. Try smaller dimensions or a higher limit.</p>}
                {outputInfo.metTarget === true && <p>The target KB size was reached.</p>}
                {activeTab === 'pdf-compress' && outputInfo.outputBytes >= outputInfo.inputBytes && <p className="text-amber-700 dark:text-amber-400">Structural optimization did not reduce this PDF’s size.</p>}
                {activeTab === 'passport-photo' && <img src={outputUrl} alt="Processed photo preview" className="max-h-48 max-w-full rounded border border-[var(--border-dev)] mt-3" />}
              </div>}
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="text"
                placeholder="Custom file name (optional)"
                value={outputFileName}
                onChange={(e) => setOutputFileName(e.target.value)}
                className="px-3 py-2 text-sm bg-[var(--bg-body)] border border-[var(--border-dev)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-tertiary)] outline-none focus:border-rose-500 transition-colors w-full sm:w-56"
              />
              <a
                href={outputUrl}
                download={outputFileName.trim() ? (outputFileName.trim().toLowerCase().endsWith(activeTab.includes('pdf') ? '.pdf' : '.jpg') ? outputFileName.trim() : `${outputFileName.trim()}.${activeTab.includes('pdf') ? 'pdf' : 'jpg'}`) : `devpantry-${activeTab}.${activeTab.includes('pdf') ? 'pdf' : 'jpg'}`}
                onClick={() => triggerFeedbackNudge('pdf-exam-kit-download')}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
              >
                <Download className="w-4 h-4" /> Download
              </a>
            </div>
          </div>
        )}
      </div>

      <article className="tool-seo-content prose prose-sm max-w-none dark:prose-invert">
        <h2>{copy.heading}</h2>
        <ol>{copy.steps.map(step => <li key={step}>{step}</li>)}</ol>
        <h3>Output and file-size behavior</h3>
        <p>{copy.detail}</p>
        <h3>Related tools and implementation</h3>
        <p><a href="/tools/image-compressor">Compress source images</a>, <a href="/tools/image-resizer">resize an image</a>, or read the <a href="/guides/client-side-pdf-manipulation">PDF processing guide</a>.</p>
      </article>

    </div>
  );
};
