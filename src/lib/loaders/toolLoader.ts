export interface ToolItem {
  slug: string;
  name: string;
  description: string;
  seoTitle?: string;
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
    seoTitle: 'Free Background Remover — No Uploads or Signup',
    heroTagline: 'Remove image backgrounds with on-device AI.',
    description: 'Remove backgrounds from images using local machine learning models. Zero uploads, unlimited use.',
    category: 'Media',
    icon: 'Sparkles',
    badge: 'Edge AI',
    featured: false,
  },
  {
    slug: 'image-to-pdf',
    name: 'Image to PDF Converter',
    seoTitle: 'JPG & PNG to PDF — Free Browser-Based Converter',
    heroTagline: 'Combine JPEG and PNG images into a PDF on your device.',
    description: 'Turn JPEG and PNG images into a single PDF in selection order. No file uploads, account, or watermark.',
    category: 'Media',
    icon: 'FileText',
    badge: 'Privacy',
    featured: false,
  },
  {
    slug: 'image-compressor',
    name: 'Image Compressor & WebP Studio',
    seoTitle: 'Image Compressor — Target KB Size, JPEG, PNG & WebP',
    description: 'Reduce image file size in your browser. Choose JPEG, PNG, or WebP, set a target KB budget, and preview the quality and dimensions before downloading.',
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
    seoTitle: 'PDF Compressor — Local Structural Optimization',
    description: 'Optimize PDF object streams and clear document metadata locally. Compare input and output sizes; embedded images are not downsampled.',
    category: 'Media',
    icon: 'Settings',
    badge: 'Privacy',
    featured: false,
  },
  {
    slug: 'passport-photo-maker',
    name: 'Passport Photo Maker',
    description: 'Resize a photo to chosen pixel dimensions and compress it toward a KB limit. Preview the actual output size before using it in a form.',
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
    featured: false,
  },
  {
    slug: 'exif-stripper',
    name: 'Image Metadata Stripper',
    heroTagline: 'Analyze and strip EXIF / GPS data entirely in your browser',
    description: 'Drop an image to reveal hidden GPS coordinates and camera specs, then instantly strip all metadata for safe sharing.',
    category: 'Media',
    icon: 'ImageMinus',
    badge: 'Beta',
    featured: false,
  },
  {
    slug: 'png-to-webp',
    name: 'PNG to WebP Converter',
    heroTagline: 'Prepare a WebP image for your website without uploading the source.',
    description: 'Convert PNG or JPEG to WebP in your browser. WebP output is preselected; preview the result and choose an optional file-size budget.',
    category: 'Media',
    icon: 'HardDrive',
    badge: 'Offline WebP',
    featured: false,
  },
  {
    slug: 'strip-gps-from-photo',
    name: 'Strip GPS & EXIF from Photo',
    heroTagline: 'Remove location coordinates and camera metadata from your photos before sharing.',
    description: 'Inspect and strip GPS latitude/longitude, camera device info, and private EXIF data from JPEG/PNG images completely offline.',
    category: 'Media',
    icon: 'ImageMinus',
    badge: 'GPS Remover',
    featured: false,
  },

  // ── Developer ──────────────────────────────────────────────────────────────
  {
    slug: 'jwt-decoder',
    name: 'JWT Decoder & Inspector',
    seoTitle: 'JWT Decoder — Inspect Claims & Test Token Failures',
    heroTagline: 'Understand a token and reproduce authentication edge cases.',
    description: 'Decode, inspect, and validate JSON Web Tokens securely in your browser. Includes RFC claim hints and auth chaos simulation.',
    category: 'Developer',
    icon: 'Key',
    badge: 'Zero Leak',
    featured: true,
  },
  {
    slug: 'json-to-ts-zod',
    name: 'JSON to TS & Zod',
    heroTagline: 'Instantly convert JSON API responses into strict TypeScript interfaces and Zod schemas.',
    seoTitle: 'JSON to TypeScript & Zod — Free Schema Generator',
    description: 'Convert JSON into TypeScript types and Zod schemas in your browser. Handle nested objects, mixed arrays, and optional fields; copy the generated code.',
    category: 'Developer',
    icon: 'Braces',
    badge: 'AST Parser',
    featured: true,
  },
  {
    slug: 'json-to-zod',
    name: 'JSON to Zod Schema Generator',
    heroTagline: 'Generate TypeScript Zod validation schemas directly from JSON payloads.',
    seoTitle: 'JSON to Zod — Generate Validation Schemas Online',
    description: 'Paste JSON to generate a Zod validation schema locally. Preview Zod output first, infer nested objects and mixed arrays, and copy the schema into your app.',
    category: 'Developer',
    icon: 'Braces',
    badge: 'Zod Generator',
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
    featured: false,
  },
  {
    slug: 'mcp-registry',
    name: 'AI MCP & Tools Registry',
    heroTagline: 'Search over 4,000 open-source Model Context Protocol (MCP) servers for AI agents.',
    description: 'A searchable collective list of free open-source MCP servers for Claude Desktop, Cursor, and custom AI agents.',
    category: 'Developer',
    icon: 'Blocks',
    badge: '4,000+ Servers',
    featured: false,
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
    name: 'Mock Data Generator',
    seoTitle: 'Mock Data Generator — JSON, CSV & Edge-Case Test Data',
    heroTagline: 'Find UI and validation bugs with realistic and deliberately messy data.',
    description: 'Generate users, orders, invoices, and difficult strings. Adjust the amount of messy data, build a custom schema, and export JSON or CSV locally.',
    category: 'Mocking',
    icon: 'Flame',
    badge: 'Presets',
    featured: true,
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
    name: 'Encrypted Collaborative Editor',
    description: 'Edit code together with Yjs and encrypted WebSocket sync. Document updates are encrypted in the browser, relayed and stored by Cloudflare, and cached locally.',
    category: 'Collaboration',
    icon: 'Users',
    badge: 'Beta',
    featured: false,
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
