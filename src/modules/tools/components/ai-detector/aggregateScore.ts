import type { ClassifierResult } from './useClassifier';
import type { C2paResult } from './useC2pa';
import type { SynthIdResult } from './useSynthIdSignal';
import type { ExifResult } from './useExifProvenance';

export interface AggregateResult {
  score: number; // 0 to 1, where 1 is highly likely AI
  verdict: string;
  isConfirmedAI: boolean;
}

export function aggregateScore(
  classifier: ClassifierResult | null,
  c2pa: C2paResult | null,
  synthId: SynthIdResult | null,
  exif: ExifResult | null
): AggregateResult {
  
  // Weights based on reliability
  const wClassifier = 0.50;
  const wC2pa = 0.30;
  const wSynthId = 0.10;
  const wExif = 0.10;

  let totalScore = 0;
  
  // 1. Classifier
  if (classifier) {
    totalScore += classifier.score * wClassifier;
  } else {
    totalScore += 0.5 * wClassifier;
  }

  // 2. C2PA (If C2PA confirms AI, it's definitive)
  let isConfirmedAI = false;
  if (c2pa) {
    totalScore += c2pa.score * wC2pa;
    if (c2pa.isAI) {
      isConfirmedAI = true;
    }
  } else {
    totalScore += 0.5 * wC2pa;
  }

  // 3. SynthID heuristic
  if (synthId) {
    totalScore += synthId.score * wSynthId;
  } else {
    totalScore += 0.5 * wSynthId;
  }

  // 4. EXIF Provenance
  if (exif) {
    totalScore += exif.score * wExif;
    if (exif.isAI) {
      isConfirmedAI = true;
    }
  } else {
    totalScore += 0.5 * wExif;
  }

  // If we have a definitive AI proof from C2PA or EXIF Software tag, floor the score to at least 0.9
  if (isConfirmedAI && totalScore < 0.9) {
    totalScore = 0.9;
  }

  let verdict = '📷 Likely authentic photo';
  if (totalScore >= 0.75) verdict = '🤖 Very likely AI-generated';
  else if (totalScore >= 0.50) verdict = '⚠️ Possibly AI-generated';
  
  if (isConfirmedAI) verdict = '🤖 Confirmed AI-generated';

  return {
    score: totalScore,
    verdict,
    isConfirmedAI
  };
}
