# DevPantry Privacy Policy & Zero-Tracking Guarantee

DevPantry is designed with a **client-first architecture**. We believe that developer tools should not require uploading your proprietary assets, sensitive API responses, or company tokens to remote servers.

## 100% Client-Side Tools (No Network Transmission)

The following tools process data entirely within your browser's sandbox. Data never leaves your machine.

* **Image Processing**: AI Background Remover (WebGPU), Image Resizer, Image Compressor, PDF Tools, EXIF Stripper, HEIC Converter.
* **Tokens & Data**: JWT Inspector, JSON to TS & Zod Converter.
* **Generators**: Chaos Mock Data Synthesizer, Custom Schema Builder.
* **Design**: Fonts Studio testing, Icons Studio customization.

## Tools Requiring Network Access

Certain features fundamentally require network access to operate. We guarantee these are built with privacy in mind.

* **Social Share Preview & OG Checker**: Uses a stateless Cloudflare edge fetcher (`/api/og-fetch`) to retrieve metadata from public URLs. **Zero logs & zero storage.**
* **P2P Collaborative Editor**: Uses a lightweight Cloudflare Durable Object for WebRTC signaling (exchanging connection details). Your actual document data and keystrokes are transmitted peer-to-peer and are encrypted end-to-end.
