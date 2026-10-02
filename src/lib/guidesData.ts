export interface GuideSection {
  title: string;
  id: string;
  content: string; // Markdown / HTML text
  codeSnippet?: {
    language: string;
    code: string;
    title?: string;
  };
}

export interface GuideArticle {
  slug: string;
  title: string;
  description: string;
  category: 'WebRTC & P2P' | 'AI & WASM' | 'Security & Privacy' | 'Media & Graphics' | 'Architecture';
  readingTime: string;
  publishedDate: string;
  updatedDate: string;
  author: {
    name: string;
    role: string;
    avatarUrl?: string;
  };
  matchingToolUrl: string;
  matchingToolName: string;
  tags: string[];
  keyTakeaways: string[];
  sections: GuideSection[];
}

export const GUIDES_DATA: GuideArticle[] = [
  {
    slug: 'client-side-pdf-manipulation',
    title: 'Client-Side PDF Manipulation & Structural Compression in the Browser',
    description: 'Learn how to process, merge, and compress PDF documents securely in the browser using ArrayBuffers, PDF-lib, and structural optimization without server uploads.',
    category: 'Media & Graphics',
    readingTime: '5 min read',
    publishedDate: 'October 2, 2026',
    updatedDate: 'October 2, 2026',
    author: {
      name: 'DevPantry Engineering',
      role: 'Media & Graphics Architecture',
    },
    matchingToolUrl: '/tools/image-to-pdf',
    matchingToolName: 'PDF Exam & Photo Kit',
    tags: ['PDF', 'Compression', 'Client-Side', 'Privacy', 'PDF-lib', 'JavaScript'],
    keyTakeaways: [
      'Client-side processing guarantees zero data leakage for highly sensitive documents like passports and IDs.',
      'PDF-lib allows for deep structural manipulation by modifying cross-reference tables and stripping out hidden metadata.',
      'True client-side structural compression focuses on lossless optimization (removing dead objects) rather than lossy image downsampling.',
      'Converting modern image formats (like WebP) into PDF structures requires careful rasterization and canvas handling.'
    ],
    sections: [
      {
        id: 'overview',
        title: '1. The Privacy Problem with Online PDF Tools',
        content: `Every day, millions of users upload highly sensitive documents—Aadhar cards, SSNs, passports, and exam marksheets—to third-party server-side PDF compressors. These files reside on temporary cloud storage, often with unclear retention policies, creating a massive privacy risk.

By moving PDF manipulation entirely to the client, we eliminate this attack surface. Browsers are incredibly powerful environments. Using modern Web APIs like \`FileReader\`, \`ArrayBuffer\`, and \`Blob\`, we can load megabytes of document data directly into browser memory, process them, and download them instantly—zero HTTP uploads required.`
      },
      {
        id: 'structural-compression',
        title: '2. How Client-Side PDF Compression Works',
        content: `When compressing a PDF purely in the browser without WebAssembly image engines, we are inherently limited to **structural optimization**.

Unlike server-side compressors (like Ghostscript) which deeply resample embedded JPEGs into lower qualities, our client-side structural compressor uses \`pdf-lib\` to:
* Strip out unused embedded fonts.
* Remove extraneous document metadata and XML objects.
* Discard hidden interactive elements and dead reference objects.
* Flatten cross-reference (xref) tables.

If your PDF is primarily text-based or contains poorly structured object streams, this structural compression can yield huge file size savings. However, if your PDF is simply a wrapper around a massive 5MB scanned JPEG, structural compression will have minimal impact.

*Try it yourself using the [Compress PDF](/tools/compress-pdf) tool!*`
      },
      {
        id: 'image-to-pdf',
        title: '3. Combining Images into PDFs',
        content: `When creating PDFs from images, especially to hit strict \`< 200 KB\` limits enforced by job portals, the workflow should be:
1. First, compress the raw images to your target size budget (e.g. 150KB).
2. Second, embed those compressed images into a new, cleanly-structured PDF envelope.

*Try it yourself using the [Image to PDF Converter](/tools/image-to-pdf) tool!*`,
        codeSnippet: {
          language: 'typescript',
          title: 'Embedding Images into a PDF with pdf-lib',
          code: `import { PDFDocument } from 'pdf-lib';

async function createPdfFromImages(imageFiles: File[]) {
  const pdfDoc = await PDFDocument.create();
  
  for (const file of imageFiles) {
    const arrayBuffer = await file.arrayBuffer();
    
    // Embed the JPEG/PNG based on type
    const image = file.type === 'image/jpeg' 
      ? await pdfDoc.embedJpg(arrayBuffer)
      : await pdfDoc.embedPng(arrayBuffer);
      
    // Create a new page matching the image dimensions
    const page = pdfDoc.addPage([image.width, image.height]);
    
    // Draw the image onto the page
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });
  }
  
  // Save structurally optimized PDF
  const pdfBytes = await pdfDoc.save({ useObjectStreams: false });
  return new Blob([pdfBytes], { type: 'application/pdf' });
}`
        }
      }
    ]
  },
  {
    slug: 'p2p-webrtc-collaboration',
    title: 'Building a Real-Time Collaborative Code Editor with Yjs CRDTs, E2E Encryption & Cloudflare Durable Objects',
    description: 'Learn how to build a zero-knowledge, real-time collaborative text editor using Yjs CRDTs over WebSockets, 256-bit AES-GCM client-side encryption, Cloudflare Durable Objects as a relay with SQLite persistence, and IndexedDB for offline-first local state.',
    category: 'WebRTC & P2P',
    readingTime: '8 min read',
    publishedDate: 'September 20, 2026',
    updatedDate: 'October 2, 2026',
    author: {
      name: 'DevPantry Engineering',
      role: 'Systems & Real-time Architecture',
    },
    matchingToolUrl: '/tools/collab',
    matchingToolName: 'Collaborative Editor',
    tags: ['Yjs', 'CRDT', 'WebSocket', 'Cloudflare Workers', 'Durable Objects', 'TypeScript', 'Web Crypto API', 'IndexedDB'],
    keyTakeaways: [
      'All document updates are encrypted client-side with AES-GCM 256-bit keys before leaving the browser — the Cloudflare relay is zero-knowledge and never sees plaintext.',
      'Yjs CRDTs automatically resolve concurrent document edits without requiring central lock servers or operational transformation.',
      'Cloudflare Durable Objects with WebSocket Hibernation consume zero CPU when idle, making thousands of concurrent rooms cost $0.',
      'SQLite persistence inside the Durable Object lets late-joining peers catch up to the full document state without requiring any other peer to be online.',
      'IndexedDB local persistence (via y-indexeddb) gives each client offline-first access to their room\'s last known document state.'
    ],
    sections: [
      {
        id: 'architecture-overview',
        title: '1. Architecture & Threat Model Overview',
        content: `Traditional collaborative platforms (like Google Docs or Notion) route every keystroke through a central database cluster. This incurs high server costs, database concurrency bottlenecks, and potential privacy risks.

DevPantry's collaborative editor uses a **WebSocket relay** hosted on a Cloudflare Durable Object. Every peer maintains a persistent WebSocket connection to the same Durable Object room. The DO fans out messages between all connected peers and persists encrypted update snapshots in its SQLite storage.

Crucially, **all document data is encrypted client-side** using AES-GCM 256-bit keys derived from the room password via PBKDF2 (100,000 iterations). The Cloudflare relay only ever sees opaque Base64 ciphertext — it acts as a zero-knowledge relay and persistence layer.`,
        codeSnippet: {
          language: 'text',
          title: 'Relay Architecture (WebSocket Hub-and-Spoke)',
          code: `[Browser Peer A] <==== Encrypted WebSocket ====> [Cloudflare DO Room]
[Browser Peer B] <==== Encrypted WebSocket ====>  (SQLite persistence)
[Browser Peer C] <==== Encrypted WebSocket ====> [Cloudflare DO Room]

All payloads: Base64(AES-GCM-256(Yjs binary update))
Cloudflare sees: zero plaintext — purely a zero-knowledge relay`
        }
      },
      {
        id: 'e2e-encryption',
        title: '2. Zero-Knowledge E2E Encryption via Web Crypto API',
        content: `The room password never leaves the client. On room creation or join, PBKDF2 (SHA-256, 100,000 iterations) derives a 256-bit AES-GCM \`CryptoKey\` from the password and a salt derived from the room ID. This key is never serialised or sent anywhere.

Every Yjs binary update is encrypted before being sent, and decrypted immediately after receiving. A unique 12-byte IV is generated per message and prepended to the ciphertext. If a peer connects with the wrong password, decryption throws a \`PayloadDecryptionError\` and the connection is closed — both for live updates and for the historical updates replayed from the Durable Object's SQLite store on join.`,
        codeSnippet: {
          language: 'typescript',
          title: 'crypto.ts — Key Derivation & AES-GCM Encrypt/Decrypt',
          code: `// Derive AES-GCM 256-bit key from room password + room-ID-derived salt
export async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const passwordKey = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(password),
    { name: 'PBKDF2' }, false, ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    false, ['encrypt', 'decrypt']
  );
}

// Encrypt: prepend random 12-byte IV to ciphertext
export async function encryptPayload(data: Uint8Array, key: CryptoKey): Promise<Uint8Array> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data));
  const result = new Uint8Array(12 + cipher.length);
  result.set(iv, 0);
  result.set(cipher, 12);
  return result;
}

// Decrypt: slice IV, then decrypt; throws PayloadDecryptionError on wrong key
export async function decryptPayload(data: Uint8Array, key: CryptoKey): Promise<Uint8Array> {
  const iv = data.slice(0, 12);
  const cipher = data.slice(12);
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipher)
    .catch(() => { throw new PayloadDecryptionError(); });
  return new Uint8Array(plain);
}`
        }
      },
      {
        id: 'crdt-yjs-sync',
        title: '3. Conflict Resolution using Yjs CRDTs & the Sync Protocol',
        content: `When two developers type at line 42 at the exact same millisecond, standard string concatenation produces corrupted states.

We use **Yjs**, an open-source Conflict-free Replicated Data Type (CRDT) framework. Yjs models documents as a tree of immutable items with unique client IDs and logical clocks. When edits arrive out-of-order, Yjs deterministically converges all clients to the exact same document state without a central server authority.

To handle late-joining peers, the provider implements the **y-protocols sync handshake**: on connect (and on every \`peer-joined\` event), the client sends a \`sync-step-1\` message containing its current state vector. Any peer that holds updates the newcomer is missing replies with a \`sync-step-2\` containing those incremental updates — all encrypted. The Durable Object's SQLite store also replays its persisted updates on join via the \`room-init\` message, so a new peer catches up to the full document history even when joining an empty room.

Local edits use the provider instance as the Yjs update \`origin\` to prevent re-broadcasting updates that were received from remote peers.`,
        codeSnippet: {
          language: 'typescript',
          title: 'webrtc.ts — Local update handler & sync-step-1 handshake',
          code: `// Encrypt and broadcast every local Yjs update to the room.
// origin === this means the update came from a remote peer — skip to avoid echo.
private async handleLocalDocUpdate(update: Uint8Array, origin: any) {
  if (origin === this) return;

  const encrypted = await encryptPayload(update, this.cryptoKey);
  this.send({
    type: 'sync-update',
    peerId: this.localPeerId,
    payload: buffer.toBase64(encrypted),
  });

  // Every 50 local updates, send a full snapshot so the DO can compact its SQLite log
  if (++this.localUpdatesSinceSnapshot >= 50) {
    this.localUpdatesSinceSnapshot = 0;
    this.sendFullSnapshot();
  }
}

// On connect and on peer-joined: broadcast our state vector so peers can diff
private async sendSyncStep1() {
  const encoder = encoding.createEncoder();
  encoding.writeVarUint(encoder, 0); // messageSync
  syncProtocol.writeSyncStep1(encoder, this.doc);
  const encrypted = await encryptPayload(encoding.toUint8Array(encoder), this.cryptoKey);
  this.send({ type: 'sync-step-1', peerId: this.localPeerId, payload: buffer.toBase64(encrypted) });
}`
        }
      },
      {
        id: 'cloudflare-relay',
        title: '4. Zero-Cost WebSocket Relay with Cloudflare Durable Objects',
        content: `Each collaboration room is a single **Cloudflare Durable Object** instance. Peers connect to it via WebSocket at \`/api/collab/:roomId?peerId=<uuid>\`.

The DO uses the **WebSocket Hibernation API** (\`this.ctx.acceptWebSocket(server)\`): idle WebSockets consume zero CPU, making thousands of concurrent rooms essentially free. It wakes up only when a message arrives.

On connect, the DO sends a \`room-init\` message containing the list of already-connected peers and all encrypted updates stored in SQLite — allowing the new peer to reconstruct the full document history immediately. On subsequent updates, it broadcasts \`sync-update\` messages to all peers in the room and persists a running log of encrypted snapshots. When a snapshot is received, older update entries are compacted.

Ping/pong heartbeats (every 20 seconds, with a 10-second pong timeout) detect stale connections. If the pong timeout fires, the client triggers an exponential-backoff reconnect (up to 5 attempts, starting at 1s).`,
        codeSnippet: {
          language: 'typescript',
          title: 'EncryptedCollabProvider — Connection & Heartbeat',
          code: `export class EncryptedCollabProvider {
  private ws: WebSocket | null = null;
  private autoRetryCount = 0;

  // MAX_AUTO_RETRIES = 5, BASE_BACKOFF_MS = 1000
  // HEARTBEAT_INTERVAL_MS = 20000, PONG_TIMEOUT_MS = 10000

  public connect() {
    const wsUrl = \`wss://\${host}/api/collab/\${this.roomId}?peerId=\${this.localPeerId}\`;
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      this.autoRetryCount = 0;
      this.startHeartbeat();
      this.flushQueue();      // replay messages queued while offline
      this.sendSyncStep1();   // request any updates we missed
      this.broadcastLocalAwareness();
    };

    this.ws.onclose = () => {
      this.cleanupHeartbeat();
      if (!this.intentionalDisconnect) this.handleUnexpectedDisconnect();
    };
  }

  private handleUnexpectedDisconnect() {
    if (this.autoRetryCount < 5) {
      const delay = 1000 * Math.pow(2, this.autoRetryCount++); // 1s, 2s, 4s, 8s, 16s
      this.setState('RECONNECTING');
      this.reconnectTimer = setTimeout(() => this.connect(), delay);
    } else {
      this.setState('FAILED');
    }
  }
}`
        }
      }
    ]
  },
  {
    slug: 'browser-ai-background-removal',
    title: 'Running AI Background Removal Client-Side using WebGPU, WASM & ONNX Runtime',
    description: 'Discover how DevPantry processes high-resolution image background removal 100% in the user browser using ONNX Runtime Web, WebGPU, WebAssembly, and zero server upload APIs.',
    category: 'AI & WASM',
    readingTime: '6 min read',
    publishedDate: 'September 20, 2026',
    updatedDate: 'September 20, 2026',
    author: {
      name: 'DevPantry Engineering',
      role: 'Client Machine Learning & WebGPU',
    },
    matchingToolUrl: '/tools/background-remover',
    matchingToolName: 'AI Background Remover',
    tags: ['AI', 'WebGPU', 'WebAssembly', 'ONNX Runtime', 'Computer Vision', 'Canvas API'],
    keyTakeaways: [
      'In-browser ML execution eliminates cloud GPU server costs ($0.05/image saved per process).',
      'ONNX Runtime Web automatically selects WebGPU acceleration when available, falling back to multi-threaded WASM.',
      'User images never leave local memory, providing absolute privacy for sensitive documents or personal photos.',
      'OffscreenCanvas API keeps the main UI thread responsive during heavy tensor matrix calculations.'
    ],
    sections: [
      {
        id: 'why-client-side-ai',
        title: '1. Why Client-Side AI is the Future of Developer Utilities',
        content: `Most background removal services upload your images to a remote cloud server processing images via Python/PyTorch API endpoints. This introduces:
1. **Privacy Concerns**: Your private photos are stored on third-party servers.
2. **Bandwidth Latency**: Uploading 15MB camera images takes time.
3. **High Infrastructure Costs**: GPU instances (Nvidia T4/A10G) cost hundreds of dollars monthly.

DevPantry runs the machine learning model (\`@imgly/background-removal\`) **entirely inside the client browser memory**.`,
        codeSnippet: {
          language: 'typescript',
          title: 'Client-side Background Removal Execution',
          code: `import { removeBackground } from '@imgly/background-removal';

export async function processImage(imageFile: File): Promise<Blob> {
  // Configured to load quantized ONNX weights from local public assets
  const blob = await removeBackground(imageFile, {
    publicPath: '/models/',
    device: 'gpu', // Attempts WebGPU first, falls back to WASM
    progress: (key: string, current: number, total: number) => {
      console.log(\`Model execution: \${key} (\${Math.round((current / total) * 100)}%)\`);
    }
  });

  return blob;
}`
        }
      },
      {
        id: 'webgpu-wasm-fallback',
        title: '2. WebGPU & WASM Execution Pipeline',
        content: `Modern web browsers expose hardware GPU acceleration through the **WebGPU API**. When a user uploads an image:

1. **Pre-processing**: The image is scaled to model input dimensions (512x512) on an \`OffscreenCanvas\`.
2. **Tensor Inference**: ONNX Runtime Web executes deep neural network matrix multiplications using WebGPU shaders.
3. **Alpha Mask Generation**: The output tensor generates a 1-channel alpha mask prediction.
4. **Post-processing**: The alpha mask is composited back onto the original high-resolution image canvas to preserve full detail.`,
        codeSnippet: {
          language: 'typescript',
          title: 'Offscreen Canvas Compositing Pipeline',
          code: `const canvas = new OffscreenCanvas(width, height);
const ctx = canvas.getContext('2d')!;

// Draw original high-res image
ctx.drawImage(originalImage, 0, 0);

// Apply predicted alpha mask composite
const imageData = ctx.getImageData(0, 0, width, height);
for (let i = 0; i < imageData.data.length; i += 4) {
  // Multiply alpha channel by neural net mask prediction
  imageData.data[i + 3] = (imageData.data[i + 3] * maskBuffer[i / 4]) / 255;
}
ctx.putImageData(imageData, 0, 0);`
        }
      }
    ]
  },
  {
    slug: 'zero-leak-jwt-inspector',
    title: 'Why Server-Side JWT Decoders Are Security Risks & How Zero-Leak Inspection Works',
    description: 'Understand the security vulnerabilities of third-party JWT debugging websites and how DevPantry inspects, validates, and verifies OAuth/OIDC tokens 100% in client memory.',
    category: 'Security & Privacy',
    readingTime: '5 min read',
    publishedDate: 'September 20, 2026',
    updatedDate: 'September 20, 2026',
    author: {
      name: 'DevPantry Security',
      role: 'Application Security & Cryptography',
    },
    matchingToolUrl: '/tools/jwt-decoder',
    matchingToolName: 'Zero-Leak JWT Inspector',
    tags: ['Security', 'JWT', 'OAuth2', 'OIDC', 'Cryptography', 'Base64URL'],
    keyTakeaways: [
      'Pasting production JWT tokens into public web tools risks exposing sensitive session cookies, user PII, and API secrets.',
      'DevPantry decodes and validates tokens 100% client-side without sending HTTP POST requests to any backend server.',
      'Native Base64URL parsing and Web Crypto API handle HMAC (HS256) signature verification locally.',
      'Supports expiration countdown timers and algorithm header inspection without network overhead.'
    ],
    sections: [
      {
        id: 'jwt-security-risks',
        title: '1. The Hidden Risks of Public JWT Inspection Tools',
        content: `JSON Web Tokens (JWTs) carry critical authorization claims: user IDs, email addresses, tenant IDs, scope permissions, and expiration timestamps.

Many popular online JWT decoders process tokens on the server or send telemetry tracking requests. If an engineer pastes a production bearer token into a public tool:
- Server logs may store the bearer token in plain text.
- Malicious third-party analytics scripts can exfiltrate tokens.
- Active session tokens can be reused for unauthorized API access before expiration.`,
        codeSnippet: {
          language: 'typescript',
          title: 'Pure Client-Side Base64URL Decoder',
          code: `export function decodeJwtPart(part: string): Record<string, any> {
  // Normalize Base64URL encoding to standard Base64
  let base64 = part.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  
  const jsonString = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  
  return JSON.parse(jsonString);
}`
        }
      }
    ]
  },
  {
    slug: 'browser-image-compression',
    title: 'High-Performance Client-Side Image Compression using HTML5 Canvas & WebP Encoding',
    description: 'Learn how to compress PNG, JPEG, and WebP images directly inside user browsers using HTML5 Canvas, bicubic scaling, and zero server bandwidth.',
    category: 'Media & Graphics',
    readingTime: '5 min read',
    publishedDate: 'September 20, 2026',
    updatedDate: 'September 20, 2026',
    author: {
      name: 'DevPantry Engineering',
      role: 'Frontend Optimization & Media Systems',
    },
    matchingToolUrl: '/tools/image-compressor',
    matchingToolName: 'Image Compressor & WebP Studio',
    tags: ['Canvas API', 'WebP', 'Image Compression', 'Web Workers', 'Performance'],
    keyTakeaways: [
      'HTML5 Canvas `toBlob("image/webp", quality)` provides native lossy and lossless compression in milliseconds.',
      'Processing images in browser memory guarantees zero upload latency and zero server disk storage costs.',
      'Web Workers prevent UI freezing when batch processing dozens of images concurrently.'
    ],
    sections: [
      {
        id: 'canvas-webp-encoding',
        title: '1. In-Browser Image Transcoding Architecture',
        content: `DevPantry's Image Studio utilizes the browser's native hardware image codecs. By drawing images onto temporary 2D canvas contexts, we gain precise control over dimensions, aspect ratios, and compression quality settings.`,
        codeSnippet: {
          language: 'typescript',
          title: 'Canvas WebP Compression Routine',
          code: `export function compressImage(
  imageElement: HTMLImageElement,
  quality: number = 0.8,
  outputType: string = 'image/webp'
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = imageElement.naturalWidth;
    canvas.height = imageElement.naturalHeight;

    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(imageElement, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Compression failed'));
      },
      outputType,
      quality
    );
  });
}`
        }
      }
    ]
  }
];
