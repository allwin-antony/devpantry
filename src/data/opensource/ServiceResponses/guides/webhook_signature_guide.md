# Webhook Signature Verification Guide (Shopify, Stripe, GitHub, Resend)

When receiving asynchronous webhook callbacks from third-party services, **never process a webhook without verifying its cryptographic signature header** to prevent man-in-the-middle attacks or spoofed payloads.

---

## 1. Signature Verification Cheat Sheet

| Service | Header Name | Algorithm | Secret Location |
| :--- | :--- | :--- | :--- |
| **Shopify** | `X-Shopify-Hmac-Sha256` | HMAC-SHA256 (Base64) | Shopify App Client Secret |
| **Stripe** | `Stripe-Signature` | HMAC-SHA256 (Hex + Timestamp) | Stripe Dashboard (`whsec_...`) |
| **GitHub** | `X-Hub-Signature-256` | HMAC-SHA256 (Hex with `sha256=` prefix) | GitHub Webhook Secret |
| **Resend / Svix** | `svix-signature` | HMAC-SHA256 (Base64 + Timestamp) | Resend Webhook Signing Secret |

---

## 2. Implementation Snippets

### Shopify Webhook Verification (Python)
```python
import hmac
import hashlib
import base64

def verify_shopify_webhook(raw_body: bytes, hmac_header: str, secret: str) -> bool:
    digest = hmac.new(secret.encode('utf-8'), raw_body, hashlib.sha256).digest()
    calculated_hmac = base64.b64encode(digest).decode('utf-8')
    return hmac.compare_digest(calculated_hmac, hmac_header)
```

### Stripe Webhook Verification (Node.js)
```javascript
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export function handleStripeWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // IMPORTANT: req.body MUST be the raw unparsed Buffer/string
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    // Fulfill customer purchase
  }

  res.json({ received: true });
}
```

### GitHub Webhook Verification (Python)
```python
import hmac
import hashlib

def verify_github_webhook(raw_body: bytes, signature_header: str, secret: str) -> bool:
    if not signature_header or not signature_header.startswith("sha256="):
        return False
    expected_sig = "sha256=" + hmac.new(secret.encode('utf-8'), raw_body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected_sig, signature_header)
```
