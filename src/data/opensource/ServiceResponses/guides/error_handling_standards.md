# API Error Handling & Resilience Best Practices

Modern enterprise services and open-source APIs return structured machine-readable error responses. Standardizing your client-side parsing prevents silent failures and crashes.

---

## 1. Standard Error Formats by Service

| Service / Architecture | Error Format Standard | Sample JSON Signature |
| :--- | :--- | :--- |
| **RFC 7807 Standard** | Problem Details | `{"type": "...", "title": "...", "status": 422, "detail": "..."}` |
| **OAuth 2.0 / OIDC** | RFC 6749 | `{"error": "invalid_grant", "error_description": "..."}` |
| **Stripe** | Stripe Error Object | `{"error": {"type": "card_error", "code": "card_declined", "message": "..."}}` |
| **PostgREST / Supabase** | Postgres Error Code | `{"code": "23505", "message": "duplicate key value", "details": "..."}` |
| **Strapi CMS** | Strapi v4/v5 Format | `{"data": null, "error": {"status": 400, "name": "ValidationError", "message": "..."}}` |
| **GraphQL APIs (Shopify)** | GraphQL Error Array | `{"errors": [{"message": "...", "locations": [...], "path": [...]}]}` |

---

## 2. Handling HTTP 429 (Rate Limits) & Retries

Always inspect standard rate limiting headers:
- `Retry-After`: Seconds to wait before attempting another request (e.g. `Retry-After: 30`).
- `X-RateLimit-Remaining`: Remaining request quota.
- `X-RateLimit-Reset`: UTC epoch timestamp when the current window resets.

### Exponential Backoff Pattern (TypeScript / JS)
```typescript
async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3): Promise<Response> {
  let attempt = 0;
  while (attempt < maxRetries) {
    const res = await fetch(url, options);
    if (res.status !== 429 && res.status < 500) {
      return res;
    }
    
    const retryAfter = res.headers.get('Retry-After');
    const delayMs = retryAfter ? parseInt(retryAfter, 10) * 1000 : Math.pow(2, attempt) * 1000;
    
    console.warn(`[HTTP ${res.status}] Retrying in ${delayMs}ms... (Attempt ${attempt + 1}/${maxRetries})`);
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    attempt++;
  }
  throw new Error(`Max retries reached for ${url}`);
}
```
