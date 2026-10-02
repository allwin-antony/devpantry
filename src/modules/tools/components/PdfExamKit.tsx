import React from 'react';
import { PdfExamKitClient } from '@/components/clients/PdfExamKitClient';

export default function PdfExamKit({ slug }: { slug?: string }) {
  let initialTab: 'img-to-pdf' | 'passport-photo' | 'pdf-compress' | 'pdf-merge' = 'img-to-pdf';
  
  if (slug === 'merge-pdf') initialTab = 'pdf-merge';
  if (slug === 'compress-pdf') initialTab = 'pdf-compress';
  if (slug === 'passport-photo-maker') initialTab = 'passport-photo';

  return <PdfExamKitClient initialTab={initialTab} />;
}
