# Design System: DevPantry (Professional Redesign)

## 1. Visual Theme & Atmosphere
A highly restrained, professional, and trustworthy interface. The atmosphere is akin to a serious enterprise data terminal or a well-lit modern engineering workstation. It removes the playful, "vibe-coded" neon glows and gradients in favor of sharp lines, high contrast typography, and structural clarity. It communicates reliability, security, and precision.

## 2. Color Palette & Roles
- **Canvas Dark** (#09090B) — Primary background surface for the application.
- **Pure Surface** (#18181B) — Card and container fill for content areas.
- **Off-White Text** (#FAFAFA) — Primary text, headings, and crucial data.
- **Muted Steel** (#A1A1AA) — Secondary text, descriptions, metadata, and labels.
- **Structural Border** (rgba(255, 255, 255, 0.1)) — Card borders, 1px structural lines, table borders.
- **Enterprise Blue** (#2563EB) — Single accent for CTAs, active states, focus rings, and primary interactions.

## 3. Typography Rules
- **Display:** Satoshi — Sharp, legible, clean. Track-tight, controlled scale, weight-driven hierarchy. No massive fonts.
- **Body:** Satoshi — Relaxed leading, 65ch max-width, neutral secondary color for high readability.
- **Mono:** JetBrains Mono — For code, metadata, timestamps, high-density numbers, and tags.
- **Banned:** Inter, playful serifs, rounded fonts.

## 4. Component Stylings
* **Buttons:** Flat, geometric, 4px border-radius (subtly rounded). Tactile -1px translate on active state. Solid accent fill for primary, ghost/outline with border for secondary. No outer glows or neon dropshadows.
* **Cards:** Subtly rounded corners (8px). Flat colors with 1px border. No diffused colored shadows. Used only when elevation serves hierarchy. 
* **Inputs:** Minimal. Label above, focus ring in solid accent color. Clean 1px border. No floating labels.
* **Badges/Tags:** Clean outline borders or very subtle low-opacity backgrounds. No neon pills.

## 5. Layout Principles
Grid-first responsive architecture. Clean, predictable, symmetric splits. Elements are aligned sharply. Every element occupies its own clear spatial zone. Generous internal padding within cards to ensure breathability despite the serious tone.
Max-width containment (1200px max) for the main layout.

## 6. Motion & Interaction
Extremely restrained. Instant visual feedback on hover (color shift, border change). No bouncing, floating, or continuous micro-loops. Serious, instantaneous hardware-accelerated transforms. 

## 7. Anti-Patterns (Banned)
- No emojis anywhere.
- No Inter font.
- No neon glows, glowing orbs, or ambient background gradient meshes.
- No oversaturated rainbow color palettes.
- No AI copywriting clichés ("Elevate", "Unleash").
- No pure black (#000000) for large surfaces.
- No overlapping elements — clean spatial separation always.
