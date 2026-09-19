export interface ToolItem {
  slug: string;
  name: string;
  description: string;
  category: 'Developer' | 'Media' | 'Mocking' | 'Collaboration';
  icon: string; // lucide icon name (as string) or similar representation, handled in UI
}

const toolsData: ToolItem[] = [
  {
    slug: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Decode, inspect, and validate JSON Web Tokens securely right in your browser.',
    category: 'Developer',
    icon: 'Key',
  },
  {
    slug: 'image-compressor',
    name: 'Image Compressor',
    description: 'Compress PNG, JPEG, and WebP images instantly in the browser without losing quality.',
    category: 'Media',
    icon: 'ImageIcon',
  },
  {
    slug: 'image-resizer',
    name: 'Image Resizer',
    description: 'Resize images for social media, avatars, and web use without server uploads.',
    category: 'Media',
    icon: 'Maximize',
  },
  {
    slug: 'background-remover',
    name: 'Background Remover',
    description: 'Remove backgrounds from images using local machine learning models.',
    category: 'Media',
    icon: 'Eraser',
  },
  {
    slug: 'mock-data',
    name: 'Mock Data Generator',
    description: 'Generate massive datasets of realistic fake data for your APIs and databases.',
    category: 'Mocking',
    icon: 'Database',
  },
  {
    slug: 'social-preview',
    name: 'Social Preview Tester',
    description: 'Test how your website looks when shared on Twitter, Slack, Discord, and LinkedIn.',
    category: 'Developer',
    icon: 'Globe',
  },
  {
    slug: 'api-templates',
    name: 'API Templates',
    description: 'Mock REST API templates with standard responses for OAuth, CRUD, and Webhooks.',
    category: 'Mocking',
    icon: 'Webhook',
  },
  {
    slug: 'collab',
    name: 'Live Collaboration',
    description: 'Real-time collaborative whiteboard and code sharing.',
    category: 'Collaboration',
    icon: 'Users',
  },
];

export function getAllTools(): ToolItem[] {
  return toolsData;
}

export function getToolBySlug(slug: string): ToolItem | null {
  return toolsData.find((t) => t.slug === slug) || null;
}
