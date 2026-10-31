'use client';

import React from 'react';
import { ExifStripperUtility } from '@/utilities/exif-stripper/ExifStripperUtility';

export default function ExifStripperWrapper({ slug }: { slug?: string } = {}) {
  const gps = slug === 'strip-gps-from-photo';
  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-6">
      <ExifStripperUtility focus={gps ? 'gps' : 'metadata'} />
      <article className="tool-seo-content prose prose-sm max-w-none dark:prose-invert">
        <h2>{gps ? 'Remove location data before sharing a photo' : 'Inspect and remove image EXIF metadata'}</h2>
        <p>{gps ? 'A photo can contain GPS coordinates even when no location is visible in the picture. Select a JPEG, PNG, or WebP to inspect its metadata. The tool highlights detected GPS fields, then creates a new image without the source EXIF data.' : 'EXIF can record camera models, capture dates, exposure settings, and location. Inspect the parsed fields before exporting a re-encoded image without the original metadata.'}</p>
        <ol><li>Select an image. It is processed on your device.</li><li>{gps ? 'Check whether GPS coordinates were found in the metadata.' : 'Switch between the image preview and metadata table.'}</li><li>Choose “Strip All Metadata” and download the new image. Your original file stays unchanged.</li></ol>
        <h3>What changes in the exported image?</h3>
        <p>The browser decodes the image and writes a new file from its pixels. Original EXIF fields are removed. JPEG and WebP are re-encoded, so the file size and pixel values can change. Removing metadata does not hide location clues visible in the picture itself.</p>
        <p>Next, <a href="/tools/image-compressor">compress the image</a> or <a href="/tools/png-to-webp">convert it to WebP</a> for a website.</p>
      </article>
    </div>
  );
}
