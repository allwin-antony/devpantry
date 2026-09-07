// Service Responses Loader for OpenSourceDataset
import googleSso from '../../data/opensource/ServiceResponses/auth_and_sso/google_sso.json';
import githubOauth from '../../data/opensource/ServiceResponses/auth_and_sso/github_oauth.json';
import appleSignIn from '../../data/opensource/ServiceResponses/auth_and_sso/apple_sign_in.json';
import supabaseAuth from '../../data/opensource/ServiceResponses/auth_and_sso/supabase_auth.json';
import authjsNextauth from '../../data/opensource/ServiceResponses/auth_and_sso/authjs_nextauth.json';
import keycloakOidc from '../../data/opensource/ServiceResponses/auth_and_sso/keycloak_oidc.json';
import microsoftEntra from '../../data/opensource/ServiceResponses/auth_and_sso/microsoft_entra_sso.json';
import metaLogin from '../../data/opensource/ServiceResponses/auth_and_sso/facebook_meta_login.json';

import stripeBilling from '../../data/opensource/ServiceResponses/ecommerce_and_b2b/stripe_billing.json';
import shopifyAdmin from '../../data/opensource/ServiceResponses/ecommerce_and_b2b/shopify_admin_api.json';
import hubspotCrm from '../../data/opensource/ServiceResponses/ecommerce_and_b2b/hubspot_crm.json';
import salesforceCrm from '../../data/opensource/ServiceResponses/ecommerce_and_b2b/salesforce_crm.json';

import githubWebhooks from '../../data/opensource/ServiceResponses/developer_and_cloud/github_webhooks.json';
import postgrestSupabase from '../../data/opensource/ServiceResponses/developer_and_cloud/postgrest_supabase.json';
import resendEmail from '../../data/opensource/ServiceResponses/developer_and_cloud/resend_email_api.json';
import twilioMessaging from '../../data/opensource/ServiceResponses/developer_and_cloud/twilio_messaging.json';
import strapiCms from '../../data/opensource/ServiceResponses/developer_and_cloud/strapi_headless_cms.json';

import unifiedUserProfile from '../../data/opensource/ServiceResponses/schemas/unified_user_profile.json';
import errorResponseStandard from '../../data/opensource/ServiceResponses/schemas/error_response_standard.json';

export interface ServiceResponseItem {
  id: string;
  category: 'auth_and_sso' | 'ecommerce_and_b2b' | 'developer_and_cloud' | 'schemas';
  categoryTitle: string;
  service: string;
  provider: string;
  documentation_url?: string;
  endpoints?: Record<string, any>;
  responses?: Record<string, {
    description?: string;
    http_status?: number;
    content_type?: string;
    payload?: any;
    data_types?: Record<string, any>;
    headers?: Record<string, any>;
  }>;
  [key: string]: any;
}

export const ALL_SERVICE_RESPONSES: ServiceResponseItem[] = [
  // Auth & SSO
  { id: 'google-sso', category: 'auth_and_sso', categoryTitle: 'Auth & SSO', ...googleSso },
  { id: 'github-oauth', category: 'auth_and_sso', categoryTitle: 'Auth & SSO', ...githubOauth },
  { id: 'apple-sign-in', category: 'auth_and_sso', categoryTitle: 'Auth & SSO', ...appleSignIn },
  { id: 'supabase-auth', category: 'auth_and_sso', categoryTitle: 'Auth & SSO', ...supabaseAuth },
  { id: 'authjs-nextauth', category: 'auth_and_sso', categoryTitle: 'Auth & SSO', ...authjsNextauth },
  { id: 'keycloak-oidc', category: 'auth_and_sso', categoryTitle: 'Auth & SSO', ...keycloakOidc },
  { id: 'microsoft-entra', category: 'auth_and_sso', categoryTitle: 'Auth & SSO', ...microsoftEntra },
  { id: 'meta-login', category: 'auth_and_sso', categoryTitle: 'Auth & SSO', ...metaLogin },

  // E-Commerce & B2B
  { id: 'stripe-billing', category: 'ecommerce_and_b2b', categoryTitle: 'E-Commerce & B2B', ...stripeBilling },
  { id: 'shopify-admin', category: 'ecommerce_and_b2b', categoryTitle: 'E-Commerce & B2B', ...shopifyAdmin },
  { id: 'hubspot-crm', category: 'ecommerce_and_b2b', categoryTitle: 'E-Commerce & B2B', ...hubspotCrm },
  { id: 'salesforce-crm', category: 'ecommerce_and_b2b', categoryTitle: 'E-Commerce & B2B', ...salesforceCrm },

  // Developer & Cloud
  { id: 'github-webhooks', category: 'developer_and_cloud', categoryTitle: 'Developer & Cloud', ...githubWebhooks },
  { id: 'postgrest-supabase', category: 'developer_and_cloud', categoryTitle: 'Developer & Cloud', ...postgrestSupabase },
  { id: 'resend-email', category: 'developer_and_cloud', categoryTitle: 'Developer & Cloud', ...resendEmail },
  { id: 'twilio-messaging', category: 'developer_and_cloud', categoryTitle: 'Developer & Cloud', ...twilioMessaging },
  { id: 'strapi-cms', category: 'developer_and_cloud', categoryTitle: 'Developer & Cloud', ...strapiCms },

  // Schemas & Standards
  { id: 'unified-user-profile', category: 'schemas', categoryTitle: 'Schemas & Standards', service: 'Unified User Profile Standard', provider: 'OpenSourceDataset Schema', ...unifiedUserProfile },
  { id: 'error-response-standard', category: 'schemas', categoryTitle: 'Schemas & Standards', service: 'Standard RFC 7807 Error Response', provider: 'IETF RFC 7807 / OpenSourceDataset', ...errorResponseStandard }
];

export function getServiceResponseById(id: string): ServiceResponseItem | undefined {
  return ALL_SERVICE_RESPONSES.find(s => s.id === id);
}

export function getAllServiceResponseIds(): string[] {
  return ALL_SERVICE_RESPONSES.map(s => s.id);
}
