import { Suspense } from 'react';
import { CollabWrapper } from '@/components/collaboration/CollabWrapper';

export default function CollabPage() {
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'DevPantry Encrypted Collaborative Editor',
    description: 'Collaborative text editing with Yjs, browser-side encryption, and a Cloudflare WebSocket relay.',
    url: 'https://devpantry.com/tools/collab',
    applicationCategory: 'DeveloperApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
  return <div className="flex flex-col min-h-full bg-[var(--bg-app)]">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <h1 className="sr-only">Encrypted Collaborative Editor</h1>
    <div className="h-[calc(100dvh-3rem)] min-h-[580px]">
      <Suspense fallback={<p className="p-6">Loading collaborative editor…</p>}><CollabWrapper /></Suspense>
    </div>
    <article className="tool-seo-content prose prose-sm max-w-none dark:prose-invert">
      <h2>Edit a shared document with browser-side encryption</h2>
      <p>Create or join a room to work on code, notes, or Markdown with other participants. Yjs merges concurrent edits, and the interface shows connected participants and a Markdown preview.</p>
      <h3>How synchronization works</h3>
      <p>Document updates are encrypted with AES-GCM in the browser. A Cloudflare Durable Object relays the encrypted updates over WebSockets and stores them for later synchronization. The password-derived key stays in the client. This implementation uses a server relay, rather than direct WebRTC data channels.</p>
      <h3>Local document storage</h3>
      <p>The editor stores local document state in IndexedDB. Clearing the site’s browser storage removes that local copy. Share room access only with the people you intend to collaborate with.</p>
      <p>Read the <a href="/guides/p2p-webrtc-collaboration">collaboration implementation guide</a> and <a href="/privacy">privacy details</a>, or create example payloads with the <a href="/tools/mock-data">mock data generator</a>.</p>
    </article>
  </div>;
}
