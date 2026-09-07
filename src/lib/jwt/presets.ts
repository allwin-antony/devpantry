import { JwtPreset } from './types';
import { encodeJsonToBase64Url } from './codec';

/**
 * Builds a compact token with freshly calculated timestamps for presets.
 */
function createPresetToken(
  header: Record<string, unknown>,
  payloadGenerator: (nowSec: number) => Record<string, unknown>,
  fixedSignature: string
): string {
  const now = Math.floor(Date.now() / 1000);
  const payload = payloadGenerator(now);
  const hB64 = encodeJsonToBase64Url(header);
  const pB64 = encodeJsonToBase64Url(payload);
  return `${hB64}.${pB64}.${fixedSignature}`;
}

export function getJwtPresets(): JwtPreset[] {
  return [
    {
      id: 'supabase',
      name: 'Supabase Auth Session',
      provider: 'Supabase GoTrue',
      description: 'Standard Supabase PostgreSQL Row Level Security (RLS) authenticated user token with user_metadata.',
      sampleSecret: 'super-secret-supabase-jwt-token-key-32-chars-long',
      token: createPresetToken(
        { alg: 'HS256', typ: 'JWT' },
        now => ({
          aud: 'authenticated',
          exp: now + 3600,
          iat: now,
          iss: 'https://xyzcompany.supabase.co/auth/v1',
          sub: 'd3b07384-d113-4614-a957-c58066f12e2f',
          email: 'developer@failstate.dev',
          phone: '',
          app_metadata: {
            provider: 'email',
            providers: ['email'],
          },
          user_metadata: {
            full_name: 'Alex Developer',
            tier: 'enterprise',
            team_id: 'team_99182',
          },
          role: 'authenticated',
          session_id: 'sess_e9c8b7a6',
        }),
        'sUpAbAsE_sAmPlE_sIgNaTuRe_hS256_x92kM1pQ7'
      ),
    },
    {
      id: 'google',
      name: 'Google OAuth 2.0 / OIDC',
      provider: 'Google Identity',
      description: 'OpenID Connect (OIDC) ID token issued by Google Accounts with audience and email verification claims.',
      token: createPresetToken(
        { alg: 'RS256', kid: '4b9e761c5ef2a', typ: 'JWT' },
        now => ({
          iss: 'https://accounts.google.com',
          azp: '847291048201-failstate.apps.googleusercontent.com',
          aud: '847291048201-failstate.apps.googleusercontent.com',
          sub: '110293847561829304918',
          email: 'allwin.antony@example.com',
          email_verified: true,
          at_hash: '7xG9bVwK0aM2lQ5rT8yU1A',
          name: 'Allwin S Antony',
          picture: 'https://lh3.googleusercontent.com/a/default-user',
          given_name: 'Allwin',
          family_name: 'Antony',
          iat: now,
          exp: now + 3600,
        }),
        'gOoGlE_rS256_sIgNaTuRe_sAmPlE_k39Lm8vNpQr2'
      ),
    },
    {
      id: 'clerk-auth0',
      name: 'Auth0 / Clerk RBAC Session',
      provider: 'Auth0 / Clerk',
      description: 'Multi-tenant SaaS session token with RBAC roles, permissions, and organization identifiers.',
      sampleSecret: 'clerk-auth0-sample-signing-secret',
      token: createPresetToken(
        { alg: 'HS256', typ: 'JWT' },
        now => ({
          iss: 'https://auth.devplayground.io/',
          sub: 'usr_2b9xZ7c0PqLm4nR',
          aud: ['https://api.devplayground.io', 'https://billing.devplayground.io'],
          iat: now,
          exp: now + 7200,
          scope: 'openid profile email offline_access',
          roles: ['admin', 'billing_manager', 'editor'],
          permissions: ['users:read', 'users:write', 'invoices:manage', 'deploy:production'],
          org_id: 'org_987654321',
          org_role: 'owner',
        }),
        'aUtH0_cLeRk_sIgNaTuRe_sAmPlE_z89Lm2vNpQr4'
      ),
    },
    {
      id: 'github',
      name: 'GitHub App Installation Token',
      provider: 'GitHub Apps',
      description: 'Server-to-server JWT used to authenticate as a GitHub App (max 10-minute expiry).',
      token: createPresetToken(
        { alg: 'RS256', typ: 'JWT' },
        now => ({
          iat: now - 60,
          exp: now + 540,
          iss: '1049281',
        }),
        'gItHuB_aPp_sIgNaTuRe_sAmPlE_w19Xm4vLpQr7'
      ),
    },
    {
      id: 'm2m-service',
      name: 'Microservice M2M Bearer Token',
      provider: 'Internal Gateway',
      description: 'High-throughput machine-to-machine internal service token with explicit resource scopes.',
      sampleSecret: 'microservice-shared-cluster-key-2026',
      token: createPresetToken(
        { alg: 'HS256', typ: 'JWT' },
        now => ({
          iss: 'auth.internal.corp',
          sub: 'svc_order_processor',
          aud: 'https://api.internal.corp/v1/inventory',
          scope: 'inventory:read inventory:write telemetry:push',
          client_id: 'svc_order_processor_prod',
          iat: now,
          exp: now + 1800,
          jti: 'jti_991827364510',
        }),
        'mIcRoSeRvIcE_hS256_sIgNaTuRe_p39Km7vNpQr1'
      ),
    },
  ];
}
