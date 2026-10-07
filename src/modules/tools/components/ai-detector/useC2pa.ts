import { useState, useCallback } from 'react';
import { createC2pa, Reader } from '@contentauth/c2pa-web';

export interface C2paResult {
  hasManifest: boolean;
  producer?: string;
  isAI?: boolean;
  score: number; // 0 for Authentic, 1 for AI, 0.5 for Unknown
}

export function useC2pa() {
  const [isC2paLoading, setIsC2paLoading] = useState(false);

  const analyze = useCallback(async (file: File): Promise<C2paResult> => {
    setIsC2paLoading(true);
    try {
      // Initialize C2PA (this might require loading WASM, c2pa-web handles it)
      const c2pa = await createC2pa({
        wasmSrc: 'https://cdn.jsdelivr.net/npm/@contentauth/c2pa-web@0.15.3/dist/resources/c2pa_bg.wasm'
      });

      const reader = await Reader.fromBlob(c2pa, file.type, file);
      if (!reader) {
        return { hasManifest: false, score: 0.5 };
      }

      const activeManifest = await reader.activeManifest();
      if (!activeManifest) {
        return { hasManifest: false, score: 0.5 };
      }
      const producer = (activeManifest.claimGenerator as string) || '';
      
      // Look for AI claims
      // AI tools typically add an assertion indicating generative AI training
      const assertions = (activeManifest.assertions || []) as any[];
      let isAI = false;
      let isAuthentic = false;

      // Check for generative AI actions
      for (const assertion of assertions) {
        if (assertion.label === 'c2pa.actions') {
          const actions = assertion.data?.actions || [];
          for (const action of actions) {
            if (
              action.action === 'c2pa.created' && 
              action.parameters?.name?.toLowerCase().includes('ai')
            ) {
              isAI = true;
            }
            if (action.action && action.action.includes('ai_generative')) {
              isAI = true;
            }
          }
        }
      }

      // Identify common producers
      const producerLower = producer.toLowerCase();
      if (
        producerLower.includes('adobe firefly') ||
        producerLower.includes('dall-e') ||
        producerLower.includes('midjourney') ||
        producerLower.includes('bing image creator') ||
        producerLower.includes('openai')
      ) {
        isAI = true;
      }
      
      if (producerLower.includes('leica') || producerLower.includes('sony')) {
        isAuthentic = true;
      }

      return {
        hasManifest: true,
        producer,
        isAI,
        score: isAI ? 1.0 : (isAuthentic ? 0.0 : 0.5),
      };
    } catch (err) {
      console.error('C2PA error:', err);
      return { hasManifest: false, score: 0.5 };
    } finally {
      setIsC2paLoading(false);
    }
  }, []);

  return { analyze, isC2paLoading };
}
