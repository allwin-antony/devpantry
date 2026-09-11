# Antigravity Project Guidelines - DevPantry

## UI Theme Support Rule (Mandatory Dark & Light Mode)

All UI components, pages, layouts, modals, and utilities created or modified must **strictly support both Dark Mode and Light Mode** out of the box, unless the user explicitly specifies otherwise.

### Implementation Requirements:
1. **Theme-Adaptive Tokens**:
   - Never hardcode fixed dark background hexes (like `bg-[#090e18]`, `bg-[#04060a]`, `text-white`) or fixed light values (like `bg-white`, `text-black`) on interactive surfaces.
   - Use CSS custom properties (`var(--bg-panel)`, `var(--bg-sidebar)`, `var(--border-dev)`, `var(--text-primary)`, `var(--text-secondary)`) or Tailwind theme classes (`dark:...`).
2. **Contrast Standards**:
   - Light mode must maintain strong, dark contrast for text (`#0f172a`, `#475569`) against light surfaces (`#ffffff`, `#f1f5f9`).
   - Dark mode must maintain bright contrast for text (`#f8fafc`, `#94a3b8`) against dark carbon surfaces (`#06090f`, `#0d131f`).
3. **State & Persistence**:
   - Themes must persist in `localStorage` and synchronize with the root HTML class (`html.dark` / `html.light`).

## SEO and Route Updates (Mandatory for New Tools/Pages)

Whenever a new page, tool, or route is created, you must strictly ensure the following SEO checklist is completed:

1. **Sitemaps (`src/app/sitemap.ts`)**: Add the new route to the appropriate sitemap partition (e.g., `core`, `tools`, etc.).
2. **Robots.txt (`src/app/robots.ts`)**: If a new sitemap partition was created in `sitemap.ts`, you MUST add the URL to the `sitemap:` array in `robots.ts`.
3. **Google Search Console Reminder**: You must explicitly remind the user in your response to log into Google Search Console and manually submit the new sitemap URL (e.g., `https://devpantry.com/sitemap/tools.xml`) to force a faster crawl queue.
