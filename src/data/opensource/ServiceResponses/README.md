# 🌐 Developer Service API Response Schemas & SSO Datasets

A comprehensive offline reference dataset of **standard API response payloads, JWT claims, webhook schemas, and developer outputs** for popular SSO, E-Commerce, B2B SaaS, and Open-Source backend services.

Developers often need to know the exact field names, data types, and token payloads returned by services like **Google SSO, Microsoft Entra ID, Shopify, Stripe, GitHub, Supabase, and Keycloak** without having to trigger live test webhooks or set up sandbox OAuth clients.

---

## 📂 Directory Layout

```
ServiceResponses/
├── README.md                          # Master documentation & quickstart guide
├── auth_and_sso/                      # Authentication & Identity Provider Responses
│   ├── google_sso.json                # Google OAuth 2.0 / OIDC tokens, decoded JWT claims, userinfo
│   ├── microsoft_entra_sso.json       # Microsoft Entra ID (Azure AD), MSAL JWT claims, Graph /me
│   ├── github_oauth.json              # GitHub OAuth token exchange, /user profile, /user/emails
│   ├── supabase_auth.json             # Supabase GoTrue session, auth.users object, JWT claims
│   ├── keycloak_oidc.json             # Keycloak Open Source IAM token, roles & RBAC claims
│   └── authjs_nextauth.json           # Auth.js / NextAuth standard session object
├── ecommerce_and_b2b/                 # Commerce & B2B SaaS API Outputs
│   ├── shopify_admin_api.json         # Shopify Customer, Order, Product, and orders/create Webhook
│   ├── stripe_billing.json            # Stripe PaymentIntent, Customer, Subscription, Webhooks
│   ├── hubspot_crm.json               # HubSpot CRM v3 Contacts and Deals
│   └── salesforce_crm.json            # Salesforce SOQL query and SObject Lead responses
├── developer_and_cloud/               # Developer Tooling & Open Source Cloud Services
│   ├── github_webhooks.json           # GitHub push, pull_request webhook payloads
│   ├── strapi_headless_cms.json       # Strapi v4/v5 standardized REST response & pagination
│   ├── resend_email_api.json          # Resend transactional email response & delivery webhooks
│   └── postgrest_supabase.json        # PostgREST database query outputs & SQL error format
├── schemas/                           # Universal Developer Schemas
│   ├── unified_user_profile.json      # Universal user schema mapping across all SSO providers
│   └── error_response_standard.json   # RFC 7807 Problem Details standard error schema
├── scripts/                           # Developer CLI Tools
│   ├── inspect_response.py            # Search and view schemas/payloads across all services
│   └── normalize_user.py              # Working Python adapter mapping SSO payloads to a single User schema
└── guides/                            # Security & Implementation References
    ├── sso_token_validation.md        # Cryptographic JWT verification guide (JWKS, issuer, aud)
    ├── webhook_signature_guide.md     # Webhook HMAC-SHA256 signature verification cheat sheet
    └── error_handling_standards.md    # Handling RFC 7807, 429 rate limits, and exponential retries
```

---

## ⚡ Quick Reference: Service Response Summary

| Service Category | Service Name | Key Endpoints / Payloads Documented | Primary Identifiers |
| :--- | :--- | :--- | :--- |
| **SSO / Identity** | **Google Identity** | Token Exchange, ID Token JWT, UserInfo | `sub` (Google User ID), `email`, `picture` |
| **SSO / Identity** | **Microsoft Entra** | MSAL Token, ID Token Claims, Graph `/v1.0/me` | `oid` (User GUID), `tid` (Tenant GUID), `preferred_username` |
| **SSO / Identity** | **GitHub OAuth** | Access Token, `/user` profile, `/user/emails` | `id`, `login`, `email`, `avatar_url` |
| **SSO / Identity** | **Supabase Auth** | Session, `auth.users`, Postgres RLS JWT | `id` (UUID), `role`, `user_metadata` |
| **SSO / Identity** | **Keycloak IAM** | OIDC Token, Realm Roles, Client Access | `sub`, `realm_access.roles`, `preferred_username` |
| **E-Commerce** | **Shopify Admin** | Customer, Order (`#1042`), `orders/create` Webhook | `id`, `financial_status`, `line_items` |
| **Payments / B2B**| **Stripe** | `PaymentIntent`, `Customer`, `Subscription`, `checkout.session.completed` | `pi_...`, `cus_...`, `sub_...`, `status` |
| **CRM / B2B** | **HubSpot** | Contacts v3, Deals v3 | `id`, `properties.email`, `properties.amount` |
| **CRM / B2B** | **Salesforce** | SOQL `Account` Query, `Lead` Creation | `Id`, `attributes.type`, `records` |
| **Webhooks** | **GitHub Events** | `push` event, `pull_request` event | `ref`, `commits`, `pull_request.id` |
| **Headless CMS** | **Strapi CMS** | Standardized `{ data, meta }` collection response | `data[].attributes`, `meta.pagination` |
| **Cloud Email** | **Resend** | Send Email response, `email.delivered` Webhook | `id`, `from`, `to`, `created_at` |
| **Database** | **PostgREST** | Filtered JSON Arrays, SQL Error Codes (`23505`) | `code`, `message`, `details` |

---

## 🚀 Quickstart CLI Tool Usage

The included CLI scripts run with standard Python 3 (`python3`) with zero external dependencies:

### 1. List All Available Schemas
```bash
python3 scripts/inspect_response.py list
```

### 2. View Service Responses & Decoded JWT Claims
```bash
# View Google SSO response structure
python3 scripts/inspect_response.py view google_sso

# View Microsoft Entra ID Token claims
python3 scripts/inspect_response.py view microsoft_entra_sso --field id_token_decoded_jwt_claims

# View Shopify Order payload
python3 scripts/inspect_response.py view shopify_admin_api --field order_object

# View Stripe PaymentIntent
python3 scripts/inspect_response.py view stripe_billing --field payment_intent_object

# View only the exact data types for all responses or a specific payload
python3 scripts/inspect_response.py view google_sso --types
python3 scripts/inspect_response.py view shopify_admin_api --field customer_object --types
```

### 3. Search Payloads for Specific Fields
```bash
# Search for any payload containing 'customer' or 'sub'
python3 scripts/inspect_response.py search "customer"
python3 scripts/inspect_response.py search "sub"
```

### 4. Normalize SSO Payloads to a Unified Schema
```bash
python3 scripts/normalize_user.py
```

---

## 🛡️ Implementation & Security Guides
- [sso_token_validation.md](guides/sso_token_validation.md): Cryptographic JWT verification guide with JWKS endpoints.
- [webhook_signature_guide.md](guides/webhook_signature_guide.md): Verification cheat sheet for Shopify HMAC, Stripe Signatures, GitHub Webhooks, and Resend.
- [error_handling_standards.md](guides/error_handling_standards.md): Handling RFC 7807 problem details, rate limits, and exponential backoff.
