# SSO & OpenID Connect (OIDC) Token Verification Guide

When implementing Single Sign-On (SSO) with **Google**, **Microsoft Entra ID**, **Keycloak**, or **Supabase**, your backend server must cryptographically verify the incoming `id_token` or `access_token` JWT before granting access.

---

## 1. The 5 Mandatory JWT Validation Steps

1. **Verify Signature via JWKS**: Fetch the provider's JSON Web Key Set (`.well-known/jwks.json`) and verify the signature using the matching key ID (`kid`).
2. **Verify Issuer (`iss`)**:
   - Google: `https://accounts.google.com` or `accounts.google.com`
   - Microsoft: `https://login.microsoftonline.com/{tenant_id}/v2.0`
   - Keycloak: `https://<auth-domain>/realms/<realm-name>`
3. **Verify Audience (`aud`)**: Must exactly match your registered OAuth Client ID / Application ID.
4. **Verify Expiration (`exp`) & Not Before (`nbf`)**: Reject expired tokens (`exp < current_time`). Allow a 60-second clock skew tolerance.
5. **Extract User Identifier**:
   - Google: `sub` (Google User ID)
   - Microsoft: `oid` (Enterprise User GUID) or `sub`
   - Keycloak: `sub`
   - Supabase: `sub` (PostgreSQL Auth User UUID)

---

## 2. Public Discovery & JWKS Endpoints

| Provider | OpenID Discovery URL | JWKS Certificate URI |
| :--- | :--- | :--- |
| **Google** | `https://accounts.google.com/.well-known/openid-configuration` | `https://www.googleapis.com/oauth2/v3/certs` |
| **Microsoft Entra** | `https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration` | `https://login.microsoftonline.com/common/discovery/v2.0/keys` |
| **Keycloak** | `https://<host>/realms/<realm>/.well-known/openid-configuration` | `https://<host>/realms/<realm>/protocol/openid-connect/certs` |
| **Supabase** | `https://<project-ref>.supabase.co/auth/v1` | Supabase JWT Secret (HMAC-SHA256) or JWKS |

---

## 3. Node.js & Python Verification Examples

### Node.js (`jose` or `jsonwebtoken`)
```javascript
import { createRemoteJWKSet, jwtVerify } from 'jose';

const GOOGLE_JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'));

export async function verifyGoogleToken(idToken, expectedClientId) {
  const { payload } = await jwtVerify(idToken, GOOGLE_JWKS, {
    issuer: ['https://accounts.google.com', 'accounts.google.com'],
    audience: expectedClientId,
  });

  return {
    userId: payload.sub,
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
  };
}
```

### Python (`google-auth` / `PyJWT`)
```python
import jwt
from jwt import PyJWKClient

jwks_client = PyJWKClient("https://login.microsoftonline.com/common/discovery/v2.0/keys")

def verify_microsoft_token(id_token: str, client_id: str):
    signing_key = jwks_client.get_signing_key_from_jwt(id_token)
    payload = jwt.decode(
        id_token,
        signing_key.key,
        algorithms=["RS256"],
        audience=client_id,
        options={"verify_exp": True}
    )
    return payload
```
