import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getServiceResponseById, getAllServiceResponseIds } from '@/lib/datasetLoader';
import { ChaosTemplateDetailClient } from '@/components/clients/ChaosTemplateDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const ids = getAllServiceResponseIds();
  return ids.map(id => ({ id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const service = getServiceResponseById(id);

  if (!service) {
    return {
      title: 'API Template Not Found | FailState',
      description: 'The requested API chaos template could not be found.',
    };
  }

  return {
    title: `${service.service} Chaos Mock Data & Response Schema — FailState`,
    description: `Production ${service.provider} ${service.service} response schema injected with high-entropy dirty mock data (BLNS, Punycode, precision traps). Export TypeScript fixtures and test HTTP status codes.`,
    keywords: [
      `${service.service} mock data`,
      `${service.service} schema`,
      `${service.service} json response`,
      `${service.provider} api mock`,
      `${service.provider} typescript fixtures`,
      'chaos engineering',
      'naughty strings',
      'api testing',
      'failstate chaos templates'
    ],
    openGraph: {
      title: `${service.service} API Response & Chaos Sandbox — FailState`,
      description: `Interactive schema tester, high-entropy dirty test payloads, and TypeScript types for ${service.service}.`,
      type: 'website',
    },
  };
}

export default async function ChaosTemplateDetailPage({ params }: PageProps) {
  const { id } = await params;
  const service = getServiceResponseById(id);

  if (!service) {
    notFound();
  }

  return <ChaosTemplateDetailClient service={service} />;
}
