# DevPantry data handling

The public policy is maintained in `src/app/privacy/page.tsx`.

- Image/PDF processing, token inspection, JSON conversion, and data generation operate on the user's device.
- Fonts, icons, and sample images are loaded from their providers. Local processing is not a claim that the entire site makes no network requests.
- Social preview sends the requested URL to `/api/og-fetch`. The Worker retrieves and caches public metadata.
- Collaboration encrypts document updates client-side, sends them through a WebSocket relay, and stores encrypted updates in a Cloudflare Durable Object. IndexedDB stores the local document state.
- Google Analytics and Cloudflare Web Analytics measure usage. The custom `tool_complete` event contains a tool identifier and a coarse action, never input/output content or filenames. The GA integration strips query strings and fragments from page locations and sends only the referrer's origin. Google signals and advertising personalization are disabled. GA may use cookies.
- Shared JSON links deliberately encode their payload in the fragment. Anyone receiving a share link can read that payload.

See `docs/search-recovery.md` for the analytics stream settings and verification steps required after deployment.
