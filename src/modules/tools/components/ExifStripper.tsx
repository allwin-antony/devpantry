'use client';

import React from 'react';
import { ExifStripperUtility } from '@/utilities/exif-stripper/ExifStripperUtility';

export default function ExifStripperWrapper({ slug }: { slug: string }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 h-[calc(100vh-100px)]">
      <ExifStripperUtility />
    </div>
  );
}
