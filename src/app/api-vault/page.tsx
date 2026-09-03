import type { Metadata } from 'next';
import { ApiVaultClient } from '@/components/clients/ApiVaultClient';

export const metadata: Metadata = {
  title: 'Real-World API & SSO Responses Vault',
  description: 'Production API response payloads for Google SSO, GitHub OAuth, Apple Sign-in, Stripe Billing, Supabase, Resend, and Twilio. Inspect schemas, generate TypeScript interfaces, and test error handling.',
  keywords: [
    'api response vault',
    'sso response fixtures',
    'google sso mock payload',
    'github oauth token payload',
    'apple sign in response',
    'stripe webhook payload',
    'supabase auth fixture',
    'typescript interface generator from api',
    'rfc 7807 error responses'
  ],
  openGraph: {
    title: 'Real-World API & SSO Responses Vault | DevPlayground',
    description: '17 production API and SSO response fixtures with payload inspection, schema tables, TypeScript interface generator, and cURL snippets.',
  }
};

export default function ApiVaultPage() {
  return <ApiVaultClient />;
}
