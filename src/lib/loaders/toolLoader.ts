export interface ToolItem {
  slug: string;
  name: string;
  description: string;
  heroTagline?: string; // Short punchy tagline for hero cards
  category: 'Developer' | 'Media' | 'Mocking' | 'Collaboration';
  icon: string; // lucide icon name
  badge?: string; // Label shown on cards (e.g. "Edge AI", "Zero Leak")
  featured?: boolean; // Pinned as hero card at the top of /tools
}

const toolsData: ToolItem[] = [
  // ── Media ──────────────────────────────────────────────────────────────────
  {
    slug: 'background-remover',
    name: 'AI Background Remover',
    heroTagline: 'Remove backgrounds instantly — 100% in your browser via WebGPU.',
    description: 'Remove backgrounds from images using local machine learning models. Zero uploads, unlimited use.',
    category: 'Media',
    icon: 'Sparkles',
    badge: 'Edge AI',
    featured: true,
  },
  {
    slug: 'image-to-pdf',
    name: 'PDF Exam & Photo Kit',
    heroTagline: 'Convert, merge, compress, and prep PDFs client-side — nothing leaves your machine.',
    description: 'Convert images to PDF, merge documents, compress to exact KB limits, and make passport photos. Fully private.',
    category: 'Media',
    icon: 'FileText',
    badge: 'Privacy',
    featured: true,
  },
  {
    slug: 'image-compressor',
    name: 'Image Compressor & WebP Studio',
    description: 'Compress PNG, JPEG, and WebP images instantly in the browser without losing quality. Target file-size budgeting.',
    category: 'Media',
    icon: 'HardDrive',
    badge: 'Budgeting',
    featured: false,
  },
  {
    slug: 'image-resizer',
    name: 'Image Resizer & Artboard Studio',
    description: 'Resize images for social media, avatars, and web use with artboard padding and aspect ratio control.',
    category: 'Media',
    icon: 'Maximize',
    badge: 'Artboard',
    featured: false,
  },
  {
    slug: 'merge-pdf',
    name: 'Merge PDF',
    description: 'Combine multiple PDF files into one document entirely locally. No uploads, no watermarks.',
    category: 'Media',
    icon: 'FileText',
    badge: 'Privacy',
    featured: false,
  },
  {
    slug: 'compress-pdf',
    name: 'Compress PDF',
    description: 'Optimize PDF files to reduce file size for portals and forms. Structural lossless compression in browser.',
    category: 'Media',
    icon: 'Settings',
    badge: 'Privacy',
    featured: false,
  },
  {
    slug: 'passport-photo-maker',
    name: 'Passport Photo Maker',
    description: 'Resize and compress photos to exact dimensions and KB limits for official forms and visa applications.',
    category: 'Media',
    icon: 'Scissors',
    badge: 'Privacy',
    featured: false,
  },
  {
    slug: 'heic-converter',
    name: 'HEIC to JPG Converter',
    description: 'Convert iPhone HEIC photos to widely supported JPG format entirely locally in your browser. Fast and private.',
    category: 'Media',
    icon: 'Image',
    badge: 'Local',
    featured: true,
  },
  {
    slug: 'exif-stripper',
    name: 'Image Metadata Stripper',
    heroTagline: 'Analyze and strip EXIF / GPS data entirely in your browser',
    description: 'Drop an image to reveal hidden GPS coordinates and camera specs, then instantly strip all metadata for safe sharing.',
    category: 'Media',
    icon: 'ImageMinus',
    badge: 'Beta',
    featured: true,
  },

  // ── Developer ──────────────────────────────────────────────────────────────
  {
    slug: 'jwt-decoder',
    name: 'JWT Inspector & Chaos Tamperer',
    heroTagline: 'Decode, validate, and chaos-tamper JWTs — 100% in-memory, zero leaks.',
    description: 'Decode, inspect, and validate JSON Web Tokens securely in your browser. Includes RFC claim hints and auth chaos simulation.',
    category: 'Developer',
    icon: 'Key',
    badge: 'Zero Leak',
    featured: false,
  },
  {
    slug: 'json-to-ts-zod',
    name: 'JSON to TS & Zod',
    heroTagline: 'Instantly convert JSON API responses into strict TypeScript interfaces and Zod schemas.',
    description: 'Paste your API responses and get typed interfaces and Zod schemas instantly. 100% client-side AST parsing, completely private.',
    category: 'Developer',
    icon: 'Braces',
    badge: 'AST Parser',
    featured: false,
  },
  {
    slug: 'public-apis',
    name: 'Public APIs Registry',
    heroTagline: 'Search over 3,000 free public APIs for software and web development.',
    description: 'Searchable registry of 3,000+ free public APIs for software and web development. Filter by CORS, Auth & HTTPS.',
    category: 'Developer',
    icon: 'Globe',
    badge: '3,000+ APIs',
    featured: true,
  },
  {
    slug: 'mcp-registry',
    name: 'AI MCP & Tools Registry',
    heroTagline: 'Search over 4,000 open-source Model Context Protocol (MCP) servers for AI agents.',
    description: 'A searchable collective list of free open-source MCP servers for Claude Desktop, Cursor, and custom AI agents.',
    category: 'Developer',
    icon: 'Blocks',
    badge: '4,000+ Servers',
    featured: true,
  },
  {
    slug: 'social-preview',
    name: 'Social Share Preview & OG Checker',
    description: 'Test how your website looks when shared on Twitter/X, Slack, Discord, LinkedIn, Facebook & WhatsApp.',
    category: 'Developer',
    icon: 'Share2',
    badge: '6 Platforms',
    featured: false,
  },

  // ── Mocking ────────────────────────────────────────────────────────────────
  {
    slug: 'mock-data',
    name: 'Chaos Data Studio',
    heroTagline: 'Generate high-entropy, dirty mock datasets across real-world domains — one click.',
    description: 'Generate massive dirty datasets across curated domains (E-Commerce, Users, Invoicing, BLNS) with multi-format export.',
    category: 'Mocking',
    icon: 'Flame',
    badge: 'Presets',
    featured: false,
  },
  {
    slug: 'mock-data#schema-builder',
    name: 'Custom Schema Builder',
    description: 'Visually compose custom dirty data schemas with 13+ field types and per-column chaos sliders. No code required.',
    category: 'Mocking',
    icon: 'Layers',
    badge: 'Visual Builder',
    featured: false,
  },
  {
    slug: 'api-templates',
    name: 'API Chaos Templates & Mock Vault',
    description: 'Real-world response fixtures for Stripe, Supabase, Google SSO, GitHub OAuth, and 13+ more APIs.',
    category: 'Mocking',
    icon: 'Radio',
    badge: '17 APIs',
    featured: false,
  },

  // ── Collaboration ──────────────────────────────────────────────────────────
  {
    slug: 'collab',
    name: 'P2P Collaborative Editor',
    description: 'Zero-knowledge, real-time collaborative code editor powered by WebRTC & Yjs CRDTs. No server, no database.',
    category: 'Collaboration',
    icon: 'Users',
    badge: 'Beta',
    featured: true,
  },
];

export function getAllTools(): ToolItem[] {
  // Filter out virtual sub-utility slugs (e.g. "mock-data#schema-builder")
  // they exist as discovery cards on /tools but don't have their own routes
  return toolsData.filter((t) => !t.slug.includes('#'));
}

// Full list including virtual sub-utility entries — used for the /tools listing page
export function getAllToolsForDisplay(): ToolItem[] {
  return toolsData;
}

export function getFeaturedTools(): ToolItem[] {
  return toolsData.filter((t) => t.featured);
}

export function getToolBySlug(slug: string): ToolItem | null {
  return toolsData.find((t) => t.slug === slug && !t.slug.includes('#')) || null;
}

export function getToolsByCategory(category: ToolItem['category']): ToolItem[] {
  return toolsData.filter((t) => t.category === category);
}

export const TOOL_CATEGORIES: ToolItem['category'][] = [
  'Developer',
  'Media',
  'Mocking',
  'Collaboration',
];

