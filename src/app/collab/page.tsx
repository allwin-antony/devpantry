import { Metadata } from 'next';
import { Suspense } from 'react';
import { CollabWrapper } from '@/components/collaboration/CollabWrapper';

export const metadata: Metadata = {
  title: 'P2P Collaborative Editor | DevPantry',
  description: 'Zero-knowledge, real-time collaborative text and code editor powered by pure WebRTC and Yjs CRDTs. No central database, 100% encrypted.',
  openGraph: {
    title: 'P2P Collaborative Editor | DevPantry',
    description: 'Zero-knowledge, real-time collaborative text and code editor powered by pure WebRTC and Yjs CRDTs.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevPantry P2P Collaborative Editor',
    description: 'Real-time collaborative code editor with Zero-Knowledge AES-GCM encryption.',
  },
  alternates: {
    canonical: 'https://devpantry.com/collab',
  },
};

export default function CollabPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'DevPantry P2P Collaborative Editor',
      description: 'Zero-knowledge, real-time collaborative text and code editor powered by pure WebRTC and Yjs CRDTs.',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Any',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://devpantry.com' },
        { '@type': 'ListItem', position: 2, name: 'Collab Editor', item: 'https://devpantry.com/collab' }
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-full bg-[var(--bg-app)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col w-full flex-1">
        <h1 className="sr-only">P2P Collaborative Editor</h1>
        <Suspense
          fallback={
            <div className="p-6 text-xs font-mono text-[var(--text-muted)] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              Loading Collab Studio...
            </div>
          }
        >
          <CollabWrapper />
          <article className="tool-seo-content prose prose-sm max-w-none dark:prose-invert mt-8 px-4 sm:px-6 md:px-8 pb-12 max-w-5xl mx-auto">
            <h2>Why We Built a Zero-Knowledge P2P Collaborative Editor Using WebRTC and Yjs</h2>
            <p>
              Real-time collaboration is the standard for modern web applications. Whether you're pair programming, taking shared notes, or brainstorming architectures, the ability to see someone else's cursor dancing across the screen is expected. 
            </p>
            <p>
              But traditional collaborative editors come with a massive hidden cost: <strong>privacy</strong>. When you type into standard cloud editors, your keystrokes are transmitted to a central backend server, stored in a database, and then broadcasted to other clients. That’s why we built the DevPantry P2P Collaborative Editor — a 100% free, real-time, zero-knowledge collaborative coding environment that never sends your document to a central server.
            </p>

            <h3>The Architecture: Pure Peer-to-Peer with WebRTC</h3>
            <p>
              To achieve true privacy, we had to eliminate the central database. Instead of a classic client-server model, the DevPantry editor utilizes <strong>WebRTC DataChannels</strong> to establish direct, peer-to-peer (P2P) connections between browsers. The result? Lightning-fast sub-millisecond latency. No central server intercepts your data, meaning zero database costs and infinite horizontal scalability.
            </p>

            <h3>Conflict-Free Syncing with Yjs CRDTs</h3>
            <p>
              Because we are P2P, we utilize <strong><a href="https://yjs.dev/" target="_blank" rel="noopener noreferrer">Yjs</a></strong>, a blazing-fast Conflict-free Replicated Data Type (CRDT) implementation. Yjs ensures that no matter what order the network delivers packets in, and no matter how many users are typing concurrently, all clients mathematically converge on the exact same document state.
            </p>

            <h3>Zero-Knowledge: Client-Side AES-GCM Encryption</h3>
            <p>
              While WebRTC connections are inherently encrypted (DTLS/SRTP), we wanted to guarantee absolute zero-knowledge security, even against our own signaling infrastructure. When you generate a room, you enter a Password. We use the standard browser <strong>Web Crypto API</strong> (PBKDF2) to derive a cryptographically strong 256-bit AES-GCM key purely in browser memory. Every packet is aggressively encrypted before transmission.
            </p>

            <h3>Related Tools</h3>
            <ul>
              <li><a href="/jwt-decoder" className="text-rose-500 hover:underline">JWT Decoder</a> — Validate auth tokens before setting up collab sessions.</li>
              <li><a href="/mock-data" className="text-rose-500 hover:underline">Chaos Data</a> — Need data to paste into the editor? Synthesize mock data instantly.</li>
              <li><a href="/api-templates" className="text-rose-500 hover:underline">API Mocks</a> — View production WebRTC/Signaling JSON payloads.</li>
            </ul>
          </article>
        </Suspense>
      </div>
    </div>
  );
}
