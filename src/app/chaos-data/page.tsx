import type { Metadata } from 'next';
import { ChaosDataClient } from '@/components/clients/ChaosDataClient';

export const metadata: Metadata = {
  title: 'Chaos Mock Data Synthesizer & Visual Schema Builder',
  description: 'Generate high-entropy edge-case mock records across E-Commerce, B2B Users, Invoicing, and 100+ Naughty Strings. Design custom schemas with 13+ field types and per-column chaos sliders.',
  keywords: [
    'chaos mock data',
    'edge case data generator',
    'naughty strings',
    'blns generator',
    'custom schema builder',
    'dirty mock data',
    'floating point traps',
    'typescript interface generator',
    'zod schema generator',
    'sql insert generator'
  ],
  openGraph: {
    title: 'Chaos Mock Data Synthesizer & Visual Schema Builder | DevPlayground',
    description: 'High-entropy edge-case testing: 100+ BLNS naughty strings, custom schemas, 13+ field types, and 5 export formats.',
  }
};

export default function ChaosDataPage() {
  return <ChaosDataClient />;
}
