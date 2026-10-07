import { useState, useCallback } from 'react';
import exifr from 'exifr';

export interface ExifResult {
  hasExif: boolean;
  score: number; // 0 for Real Photo, 1 for AI, 0.5 for Unknown/Stripped
  tags: Record<string, any>;
  isAI?: boolean;
  isReal?: boolean;
  software?: string;
}

export function useExifProvenance() {
  const [isExifLoading, setIsExifLoading] = useState(false);

  const analyze = useCallback(async (file: File): Promise<ExifResult> => {
    setIsExifLoading(true);
    try {
      const tags = await exifr.parse(file, true);
      
      if (!tags) {
        // Missing EXIF entirely is slightly suspicious (often stripped by AI generators or social media)
        // But not definitive
        return { hasExif: false, score: 0.6, tags: {} };
      }

      let isAI = false;
      let isReal = false;
      let software = tags.Software as string | undefined;

      // Check Software Tag
      if (software) {
        const swLower = software.toLowerCase();
        if (
          swLower.includes('automatic1111') ||
          swLower.includes('comfyui') ||
          swLower.includes('midjourney') ||
          swLower.includes('novelai') ||
          swLower.includes('dall-e') ||
          swLower.includes('firefly')
        ) {
          isAI = true;
        } else if (
          swLower.includes('lightroom') ||
          swLower.includes('photoshop') ||
          swLower.includes('capture one')
        ) {
          // Could be a real photo edited, but could also be AI edited.
          // Neutral signal.
        } else {
          // Camera firmware
          isReal = true;
        }
      }

      // Check Make / Model
      if (tags.Make || tags.Model) {
        const make = (tags.Make || '').toLowerCase();
        if (make.includes('stable diffusion') || make.includes('midjourney')) {
          isAI = true;
        } else if (make.includes('canon') || make.includes('nikon') || make.includes('apple') || make.includes('sony')) {
          isReal = true;
        }
      }

      // High confidence real signals
      if (tags.GPSLatitude || tags.LensModel || tags.FNumber) {
        isReal = true;
      }

      let score = 0.5;
      if (isAI) score = 1.0;
      else if (isReal) score = 0.0;
      else score = 0.5;

      return {
        hasExif: true,
        score,
        tags,
        isAI,
        isReal,
        software
      };
    } catch (err) {
      console.error('EXIF error:', err);
      return { hasExif: false, score: 0.5, tags: {} };
    } finally {
      setIsExifLoading(false);
    }
  }, []);

  return { analyze, isExifLoading };
}
