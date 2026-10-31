import { BgRemovalClient } from '@/components/clients/BgRemovalClient';

export default function ImageCompressorPage({ slug = 'image-compressor' }: { slug?: string }) {
  const webp = slug === 'png-to-webp';
  const title = webp ? 'PNG to WebP Converter' : 'Image Compressor';
  const description = webp
    ? 'Convert a PNG or JPEG to WebP without uploading it. WebP output is selected for you; preview the result and download the converted image.'
    : 'Reduce a JPEG, PNG, or WebP image toward a file-size budget. Preview the output format, dimensions, and actual size before downloading.';
  const url = `https://devpantry.com/tools/${slug}`;
  const jsonLd = [
    { '@context': 'https://schema.org', '@type': 'WebApplication', name: title, description, url, applicationCategory: 'MultimediaApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://devpantry.com' },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://devpantry.com/tools' },
      { '@type': 'ListItem', position: 3, name: title, item: url },
    ] },
  ];
  return <div className="flex flex-col min-h-full">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <header className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-6 pb-4"><h1 className="text-2xl sm:text-3xl font-bold">{title}</h1><p className="text-[var(--text-secondary)] mt-2 max-w-3xl">{description}</p></header>
    <div className="h-[calc(100dvh-9rem)] min-h-[580px]"><BgRemovalClient initialMode="compressor" initialExportFormat={webp ? 'image/webp' : 'image/jpeg'} /></div>
    <article className="tool-seo-content prose prose-sm max-w-none dark:prose-invert">
      <h2>{webp ? 'How to convert PNG to WebP' : 'How to compress an image to a KB budget'}</h2>
      <ol>
        <li>Choose an image from your device, or try a sample image.</li>
        <li>{webp ? 'Open export preview. WebP is preselected; keep a transparent background if the source includes one.' : 'Choose an output format and a target file size. JPEG and WebP support quality adjustments; PNG may need smaller dimensions.'}</li>
        <li>Inspect the preview, actual output size, and dimensions. Download the result when it fits your needs.</li>
      </ol>
      {webp ? <>
        <h3>Transparency and file size</h3>
        <p>WebP supports transparency, so a transparent PNG can remain transparent. File-size savings depend on the image and export settings; a conversion is not guaranteed to be smaller. Compare the output before replacing an asset in your website.</p>
        <h3>Choosing an image format</h3>
        <p>WebP is useful for browser-delivered photos and illustrations. Keep the original PNG when another application requires it. Use JPEG when compatibility matters more than transparency.</p>
      </> : <>
        <h3>Quality and dimensions are different controls</h3>
        <p>The compressor tests export quality and can reduce dimensions when a smaller file is needed. A tight KB budget can reduce detail. The export preview shows the resulting dimensions so you can choose the right tradeoff for an avatar, banner, or form upload.</p>
        <h3>Local processing</h3>
        <p>Compression uses your browser’s canvas encoders. The source image is not uploaded, and image compression does not download an AI model.</p>
      </>}
      <h3>Related tools</h3>
      <p><a href="/tools/image-resizer">Resize an image</a> before compression, <a href="/tools/strip-gps-from-photo">remove photo GPS metadata</a>, or <a href="/tools/background-remover">remove its background</a>.</p>
    </article>
  </div>;
}
