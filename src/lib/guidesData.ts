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
    slug: 'p2p-webrtc-collaboration',
    title: 'Building a Real-Time Collaborative Code Editor with WebRTC, Yjs CRDTs & Cloudflare Durable Objects',
    description: 'Learn how to build a zero-server-database, zero-latency real-time collaborative text editor using WebRTC P2P DataChannels, Yjs conflict-free replicated data types (CRDTs), and Cloudflare Workers Durable Objects for $0-cost signaling.',
    category: 'WebRTC & P2P',
    readingTime: '8 min read',
    publishedDate: 'September 20, 2026',
    updatedDate: 'September 20, 2026',
    author: {
      name: 'DevPantry Engineering',
      role: 'Systems & Real-time Architecture',
    },
    matchingToolUrl: '/tools/collab',
    matchingToolName: 'P2P Collaborative Editor',
    tags: ['WebRTC', 'Yjs', 'CRDT', 'Cloudflare Workers', 'Durable Objects', 'TypeScript', 'Web Crypto API'],
    keyTakeaways: [
      'Direct Peer-to-Peer data channels eliminate central server database bottleneck and reduce latency to sub-10ms.',
      'Yjs CRDTs automatically resolve concurrent document edits without requiring central lock servers or operational transformation.',
      'AES-GCM 256-bit client-side encryption via Web Crypto API ensures even signaling servers cannot read collaborative document contents.',
      'Cloudflare Durable Objects with WebSocket Hibernation API handle signaling for thousands of concurrent rooms at $0 cost.'
    ],
    sections: [
      {
        id: 'architecture-overview',
        title: '1. Architecture & Threat Model Overview',
        content: `Traditional collaborative platforms (like Google Docs or Notion) route every keystroke through a central database cluster. This incurs high server costs, database concurrency bottlenecks, and potential privacy risks.

DevPantry's collaborative editor takes a **Peer-to-Peer (P2P) approach**. Keystrokes, cursor positions, and selection states flow directly between peer browsers over encrypted **RTCDataChannel** connections.

Cloudflare Workers and Durable Objects are used exclusively for **signaling**—helping Peer A and Peer B exchange SDP offers and ICE candidates to establish their peer-to-peer connection. Once connected, signaling activity ceases and data flows 100% P2P.`,
        codeSnippet: {
          language: 'text',
          title: 'Peer-to-Peer Data Flow Architecture',
          code: `[Browser Peer A] <==== Encrypted RTCDataChannel (WebRTC P2P) ====> [Browser Peer B]
        \\                                                                /
         \\-- (Signaling only: SDP / ICE via Cloudflare Worker DO) ------/`
        }
      },
      {
        id: 'crdt-yjs-sync',
        title: '2. Conflict Resolution using Yjs CRDTs',
        content: `When two developers type at line 42 at the exact same millisecond, standard string concatenation produces corrupted states.

We use **Yjs**, an open-source Conflict-free Replicated Data Type (CRDT) framework. Yjs models documents as a tree of immutable items with unique client IDs and logical clocks. When edits arrive out-of-order, Yjs deterministically converges both clients to the exact same document state without a central server authority.`,
        codeSnippet: {
          language: 'typescript',
          title: 'Yjs Document Synchronization & Crypto Binding',
          code: `import * as Y from 'yjs';

// Create a local Yjs document
const doc = new Y.Doc();
const yText = doc.getText('codemirror');

// Observe local changes and broadcast encrypted binary update vectors
doc.on('update', (update: Uint8Array, origin: any) => {
  if (origin === 'remote') return; // Avoid echo back
  
  // Encrypt update vector with AES-GCM 256-bit key before sending over WebRTC
  const encryptedPayload = await encryptPayload(update, roomKey);
  dataChannel.send(encryptedPayload);
});`
        }
      },
      {
        id: 'webrtc-data-channel',
        title: '3. WebRTC DataChannel Setup & Robust Recovery',
        content: `Establishing WebRTC connections across complex firewalls and NATs requires robust candidate gathering. We configure multiple STUN servers for NAT mapping, combined with automatic ICE restarts when network conditions shift (e.g. switching from Wi-Fi to cellular data).

If a connection state drops to 'disconnected' or 'failed', our custom provider attempts up to 2 ICE restarts before falling back to automatic signaling reconnection.`,
        codeSnippet: {
          language: 'typescript',
          title: 'ICE Restart & Recovery Handler',
          code: `peerConnection.onconnectionstatechange = () => {
  const state = peerConnection.connectionState;
  
  if (state === 'failed') {
    console.warn('[WebRTC] Connection failed, attempting ICE restart...');
    this.attemptIceRestart(peerId);
  } else if (state === 'disconnected') {
    // Wait 8s for automatic network self-healing before triggering ICE restart
    setTimeout(() => {
      if (peerConnection.connectionState === 'disconnected') {
        this.attemptIceRestart(peerId);
      }
    }, 8000);
  }
};`
        }
      },
      {
        id: 'cloudflare-signaling',
        title: '4. Zero-Cost Signaling with Cloudflare Durable Objects',
        content: `Signaling servers usually incur high server costs due to long-lived WebSocket connections. By using Cloudflare Workers with **Durable Objects** and the **WebSocket Hibernation API** (\`this.ctx.acceptWebSocket(server)\`), idle WebSockets consume 0 CPU duration.

The Durable Object hibernates in memory when idle and wakes up instantly when a new peer joins or sends an SDP candidate.`,
        codeSnippet: {
          language: 'typescript',
          title: 'SignalingRoom.ts (Cloudflare Durable Object)',
          code: `export class SignalingRoom extends DurableObject {
  async fetch(request: Request): Promise<Response> {
    const { 0: client, 1: server } = new WebSocketPair();
    this.ctx.acceptWebSocket(server); // Hibernation API
    
    // Broadcast peer join to existing connections
    this.broadcast(JSON.stringify({ type: 'peer-joined', peerId }), server);
    return new Response(null, { status: 101, webSocket: client });
  }

  webSocketMessage(ws: WebSocket, message: string) {
    const data = JSON.parse(message);
    if (data.type === 'ping') {
      ws.send(JSON.stringify({ type: 'pong' }));
      return;
    }
    // Route directed SDP/ICE messages
    if (data.targetPeerId) this.sendTo(data.targetPeerId, message);
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
