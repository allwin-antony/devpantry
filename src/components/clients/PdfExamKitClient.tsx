'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { PDFDocument } from 'pdf-lib';
import { FileText, Image as ImageIcon, Scissors, Settings, Download, Trash2, ArrowRight, Merge, X, AlertTriangle } from 'lucide-react';

export const PdfExamKitClient: React.FC<{ initialTab?: 'img-to-pdf' | 'passport-photo' | 'pdf-compress' | 'pdf-merge' }> = ({ initialTab }) => {
  const [activeTab, setActiveTab] = useState<'img-to-pdf' | 'passport-photo' | 'pdf-compress' | 'pdf-merge'>(initialTab || 'img-to-pdf');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputFileName, setOutputFileName] = useState('');
  const [targetKb, setTargetKb] = useState<number>(200);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleTabClick = (newTab: 'img-to-pdf' | 'passport-photo' | 'pdf-compress' | 'pdf-merge') => {
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
      setSelectedFiles(prev => [...prev, ...newFiles]);
      setOutputUrl(null);
      
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
    setOutputUrl(null);
  };

  const clearFiles = () => {
    setSelectedFiles([]);
    setOutputUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageToPdf = async () => {
    if (selectedFiles.length === 0) return;
    setIsProcessing(true);
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
          continue; // Skip unsupported
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
      const url = URL.createObjectURL(blob);
      setOutputUrl(url);
    } catch (err) {
      console.error(err);
      alert('Error creating PDF');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMergePdf = async () => {
    if (selectedFiles.length < 2) {
      alert('Please select at least 2 PDFs to merge.');
      return;
    }
    setIsProcessing(true);
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
      const url = URL.createObjectURL(blob);
      setOutputUrl(url);
    } catch (err) {
      console.error(err);
      alert('Error merging PDFs');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompressImage = async () => {
    if (selectedFiles.length === 0) return;
    setIsProcessing(true);
    try {
      const file = selectedFiles[0];
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      await new Promise(resolve => (img.onload = resolve));

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);

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
        setOutputUrl(URL.createObjectURL(blob));
      } else {
        alert('Could not compress to the target size.');
      }
    } catch (err) {
      console.error(err);
      alert('Error compressing photo');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompressPdf = async () => {
    if (selectedFiles.length === 0) return;
    setIsProcessing(true);
    try {
      const file = selectedFiles[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      
      // Basic compression by stripping metadata and using object streams
      pdf.setTitle('');
      pdf.setAuthor('');
      pdf.setSubject('');
      pdf.setProducer('');
      pdf.setCreator('');
      
      const pdfBytes = await pdf.save({ useObjectStreams: true });
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      setOutputUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error(err);
      alert('Error compressing PDF');
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
              Resize your photo and strictly compress it below a target KB size for portals.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-semibold text-[var(--text-primary)] whitespace-nowrap">Max Size (KB):</label>
                <input 
                  type="number" 
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
          </div>
        );
      case 'pdf-compress':
        return (
           <div className="space-y-4">
            <p className="text-sm text-[var(--text-secondary)]">
              Perform a basic, lossless optimization of your PDF to try hitting exam portal limits.
            </p>
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-700 dark:text-amber-400 space-y-1">
                <p className="font-semibold">Pure Client-Side Limitation</p>
                <p>Because this tool runs 100% in your browser for privacy, it cannot deeply re-sample images embedded inside existing PDFs. It only performs structural compression (removing hidden metadata).</p>
                <p>If your PDF is made of heavy scanned images, it will not shrink significantly. For best results, use the <strong>Image to PDF</strong> tab to compress your photos <em>before</em> turning them into a PDF.</p>
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
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">PDF & Exam Form Kit</h1>
        <p className="text-[var(--text-secondary)] mt-2">
          Secure, 100% client-side tools for manipulating PDFs, resizing photos, and hitting strict KB limits for exam and job portals.
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
      <div className="bg-[var(--bg-panel)] rounded-xl border border-[var(--border-dev)] p-6">
        <div className="mb-6">
          <label className="block text-sm font-semibold text-[var(--text-primary)] mb-3">
            {activeTab === 'img-to-pdf' ? 'Select Images (Multiple allowed)' : 'Select Files'}
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept={activeTab === 'img-to-pdf' ? 'image/jpeg,image/png' : activeTab === 'pdf-merge' || activeTab === 'pdf-compress' ? 'application/pdf' : 'image/*'}
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
              <p className="text-sm font-semibold text-green-700 dark:text-green-400">Success!</p>
              <p className="text-xs text-green-600 dark:text-green-500">Your processed file is ready.</p>
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
                download={outputFileName.trim() ? (outputFileName.trim().toLowerCase().endsWith(activeTab.includes('pdf') ? '.pdf' : '.jpg') ? outputFileName.trim() : `${outputFileName.trim()}.${activeTab.includes('pdf') ? 'pdf' : 'jpg'}`) : `processed-${Date.now()}.${activeTab.includes('pdf') ? 'pdf' : 'jpg'}`}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
              >
                <Download className="w-4 h-4" /> Download
              </a>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
