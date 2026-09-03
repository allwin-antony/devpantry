// Dataset Loaders for OpenSourceDataset (Fonts, Icons, ServiceResponses)

import fontshareCatalogRaw from '../data/opensource/Fonts/catalogs/fontshare_catalog.json';
import fontReposRaw from '../data/opensource/Fonts/catalogs/github_repositories.json';
import fontsourceCatalogRaw from '../data/opensource/Fonts/catalogs/fontsource_catalog.json';

import iconLibrariesRaw from '../data/opensource/Icons/catalogs/featured_libraries.json';
import iconCollectionsRaw from '../data/opensource/Icons/catalogs/icon_collections.json';
import iconPackagesRaw from '../data/opensource/Icons/catalogs/npm_packages.json';

// Service Responses Raw Imports
import googleSso from '../data/opensource/ServiceResponses/auth_and_sso/google_sso.json';
import githubOauth from '../data/opensource/ServiceResponses/auth_and_sso/github_oauth.json';
import appleSignIn from '../data/opensource/ServiceResponses/auth_and_sso/apple_sign_in.json';
import supabaseAuth from '../data/opensource/ServiceResponses/auth_and_sso/supabase_auth.json';
import authjsNextauth from '../data/opensource/ServiceResponses/auth_and_sso/authjs_nextauth.json';
import keycloakOidc from '../data/opensource/ServiceResponses/auth_and_sso/keycloak_oidc.json';
import microsoftEntra from '../data/opensource/ServiceResponses/auth_and_sso/microsoft_entra_sso.json';
import metaLogin from '../data/opensource/ServiceResponses/auth_and_sso/facebook_meta_login.json';

import stripeBilling from '../data/opensource/ServiceResponses/ecommerce_and_b2b/stripe_billing.json';
import shopifyAdmin from '../data/opensource/ServiceResponses/ecommerce_and_b2b/shopify_admin_api.json';
import hubspotCrm from '../data/opensource/ServiceResponses/ecommerce_and_b2b/hubspot_crm.json';
import salesforceCrm from '../data/opensource/ServiceResponses/ecommerce_and_b2b/salesforce_crm.json';

import githubWebhooks from '../data/opensource/ServiceResponses/developer_and_cloud/github_webhooks.json';
import postgrestSupabase from '../data/opensource/ServiceResponses/developer_and_cloud/postgrest_supabase.json';
import resendEmail from '../data/opensource/ServiceResponses/developer_and_cloud/resend_email_api.json';
import twilioMessaging from '../data/opensource/ServiceResponses/developer_and_cloud/twilio_messaging.json';
import strapiCms from '../data/opensource/ServiceResponses/developer_and_cloud/strapi_headless_cms.json';

import unifiedUserProfile from '../data/opensource/ServiceResponses/schemas/unified_user_profile.json';
import errorResponseStandard from '../data/opensource/ServiceResponses/schemas/error_response_standard.json';

// ── Types ──

export interface FontItem {
  id: string;
  name: string;
  slug: string;
  version?: string;
  license_type: string;
  is_sil_ofl: boolean;
  category: string;
  styles_count: number;
  weights: number[];
  styles: string[];
  designers: string[];
  publisher: string;
  provider: 'google' | 'fontshare' | 'github' | 'fontsource';
  web_url?: string;
  download_url?: string;
  github_repo?: string;
  stars?: number;
  npm_package?: string;
  css_font_family: string;
  cdn_stylesheet_url?: string;
  subsets?: string[];
  variable?: boolean;
}

export interface IconLibraryItem {
  id: string;
  name: string;
  tagline: string;
  total_icons: string;
  license: string;
  license_note: string;
  website: string;
  github: string;
  releases_url?: string;
  npm_packages: Record<string, string>;
  cdn_svg_template?: string;
  api_prefix?: string;
  primary_package?: string;
}

export interface IconCollectionItem {
  prefix: string;
  name: string;
  total_icons: number;
  version?: string | null;
  author: string;
  author_url?: string;
  license: string;
  license_spdx?: string;
  license_url?: string;
  category: string;
  samples: string[];
  svg_endpoint: string;
  json_endpoint: string;
}

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

// ── Font Helpers ──

export function getFontCdnStylesheet(font: { name: string; slug: string; provider: string; weights?: number[] }): string {
  if (font.provider === 'fontshare') {
    return `https://api.fontshare.com/v2/css?f[]=${font.slug}@400,500,600,700&display=swap`;
  }
  const weightStr = (font.weights && font.weights.length > 0) ? font.weights.join(';') : '400;600;700';
  const familyEscaped = encodeURIComponent(font.name);
  return `https://fonts.googleapis.com/css2?family=${familyEscaped}:wght@${weightStr}&display=swap`;
}

// Memoized all fonts
let cachedFonts: FontItem[] | null = null;

export function getAllFonts(): FontItem[] {
  if (cachedFonts) return cachedFonts;

  const seenSlugs = new Set<string>();
  const list: FontItem[] = [];

  // 1. Fontshare (high-grade display & sans fonts)
  for (const f of (fontshareCatalogRaw as any[])) {
    const slug = f.slug || f.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    if (seenSlugs.has(slug)) continue;
    seenSlugs.add(slug);

    const isOfl = f.is_sil_ofl || f.license_type?.includes('ofl');
    const licenseType = f.license_type === 'itf_ffl' ? 'ITF Free Font' : (isOfl ? 'SIL OFL 1.1' : 'Free Commercial');
    const cat = f.category || 'Sans';

    list.push({
      id: slug,
      name: f.name,
      slug,
      version: f.version || '1.0',
      license_type: licenseType,
      is_sil_ofl: !!isOfl,
      category: cat.charAt(0).toUpperCase() + cat.slice(1),
      styles_count: f.styles_count || 1,
      weights: [400, 600, 700],
      styles: ['normal'],
      designers: f.designers || [f.publisher || 'Indian Type Foundry'],
      publisher: f.publisher || 'Fontshare / ITF',
      provider: 'fontshare',
      web_url: f.web_url || `https://www.fontshare.com/fonts/${slug}`,
      download_url: f.download_url,
      npm_package: `@fontsource/${slug}`,
      css_font_family: `'${f.name}', ${cat.toLowerCase() === 'serif' ? 'serif' : (cat.toLowerCase().includes('mono') ? 'monospace' : 'sans-serif')}`,
      cdn_stylesheet_url: `https://api.fontshare.com/v2/css?f[]=${slug}@400,600,700&display=swap`
    });
  }

  // 2. GitHub Top Repos (Inter, JetBrains Mono, Fira Code, etc.)
  for (const r of (fontReposRaw as any[])) {
    const fontName = r.family || r.name || 'Untitled Font';
    const slug = fontName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    if (seenSlugs.has(slug)) continue;
    seenSlugs.add(slug);

    const isMono = (r.category || '').toLowerCase().includes('mono');
    const isSerif = (r.category || '').toLowerCase().includes('serif') && !isMono;
    const cat = isMono ? 'Monospace' : (isSerif ? 'Serif' : 'Sans');

    list.push({
      id: slug,
      name: fontName,
      slug,
      version: 'Latest',
      license_type: r.license || 'SIL OFL 1.1',
      is_sil_ofl: true,
      category: cat,
      styles_count: r.variable ? 9 : 4,
      weights: [300, 400, 500, 600, 700, 800],
      styles: ['normal'],
      designers: [r.owner || 'Community'],
      publisher: r.owner || 'Open Source',
      provider: 'github',
      web_url: r.repository || r.github_url,
      github_repo: r.repository || r.github_url,
      download_url: r.direct_zip_url,
      npm_package: `@fontsource/${slug}`,
      css_font_family: `'${fontName}', ${isMono ? 'monospace' : 'sans-serif'}`,
      cdn_stylesheet_url: `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;600;700&display=swap`,
      variable: !!r.variable
    });
  }

  // 3. Fontsource Catalog (2,100+ Google and Open Source fonts)
  for (const fs of (fontsourceCatalogRaw as any[])) {
    const fontName = fs.family || fs.id;
    const slug = fs.id || fontName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    if (seenSlugs.has(slug)) continue;
    seenSlugs.add(slug);

    let cat = 'Sans';
    const rawCat = (fs.category || '').toLowerCase();
    if (rawCat.includes('mono')) cat = 'Monospace';
    else if (rawCat.includes('serif') && !rawCat.includes('sans')) cat = 'Serif';
    else if (rawCat.includes('display') || rawCat.includes('handwriting')) cat = 'Display';

    const weights = Array.isArray(fs.weights) && fs.weights.length > 0 ? fs.weights : [400, 700];

    list.push({
      id: slug,
      name: fontName,
      slug,
      version: fs.lastModified || '1.0',
      license_type: fs.license || 'SIL OFL 1.1',
      is_sil_ofl: (fs.license || '').includes('OFL') || true,
      category: cat,
      styles_count: (fs.styles?.length || 1) * weights.length,
      weights: weights,
      styles: fs.styles || ['normal'],
      designers: [fs.type === 'google' ? 'Google Fonts' : 'Open Source'],
      publisher: fs.type === 'google' ? 'Google Fonts' : 'Fontsource Community',
      provider: fs.type === 'google' ? 'google' : 'fontsource',
      web_url: `https://fontsource.org/fonts/${slug}`,
      npm_package: `@fontsource/${slug}`,
      css_font_family: `'${fontName}', ${cat === 'Serif' ? 'serif' : (cat === 'Monospace' ? 'monospace' : 'sans-serif')}`,
      cdn_stylesheet_url: `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@${weights.filter((w: number) => [300, 400, 600, 700, 800].includes(w)).join(';') || '400;700'}&display=swap`,
      subsets: fs.subsets,
      variable: !!fs.variable
    });
  }

  cachedFonts = list;
  return list;
}

export function getFontBySlug(slug: string): FontItem | undefined {
  const fonts = getAllFonts();
  return fonts.find(f => f.slug === slug || f.id === slug);
}

export function getAllFontSlugs(): string[] {
  return getAllFonts().map(f => f.slug);
}

// ── Icon Helpers ──

export function getAllIconLibraries(): IconLibraryItem[] {
  return (iconLibrariesRaw as any[]).map(lib => ({
    ...lib,
    primary_package: lib.npm_packages?.react || lib.npm_packages?.vanilla || Object.values(lib.npm_packages || {})[0] || ''
  }));
}

export function getAllIconCollections(): IconCollectionItem[] {
  return iconCollectionsRaw as IconCollectionItem[];
}

export function getIconCollectionByPrefix(prefix: string): IconCollectionItem | undefined {
  return (iconCollectionsRaw as IconCollectionItem[]).find(c => c.prefix === prefix);
}

export function getAllIconPrefixes(): string[] {
  return (iconCollectionsRaw as IconCollectionItem[]).map(c => c.prefix);
}

export function getIconNpmPackages(): any {
  return iconPackagesRaw;
}

// ── Service Responses Vault ──

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
