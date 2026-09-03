# UI Theme Support Rule (Mandatory Dark & Light Mode)

## Principle
All UI components, pages, layouts, modals, and utilities created or modified must **strictly support both Dark Mode and Light Mode** out of the box, unless the user explicitly specifies otherwise.

## Guidelines
1. **Never Hardcode Fixed Backgrounds or Foreground Colors**:
   - Avoid hardcoded dark values (e.g. `bg-[#090e18]`, `bg-slate-900`, `text-white`) or hardcoded light values (e.g. `bg-white`, `text-black`) on top-level panels and cards without appropriate dual-theme handling.
   - Use CSS Custom Properties (e.g. `bg-[var(--bg-panel)]`, `text-[var(--text-primary)]`, `border-[var(--border-dev)]`) or Tailwind dark variant classes (e.g. `bg-slate-100 dark:bg-slate-900`, `text-slate-900 dark:text-slate-100`).

2. **Contrast & Readability**:
   - In **Light Mode**: Use crisp surfaces (`#ffffff`, `#f1f5f9`), dark readable typography (`#0f172a`, `#475569`), and subtle borders (`rgba(0, 0, 0, 0.1)`).
   - In **Dark Mode**: Use deep carbon/slate tones (`#06090f`, `#0d131f`), vibrant light typography (`#f8fafc`, `#94a3b8`), and subtle glowing borders (`rgba(255, 255, 255, 0.08)`).
   - Ensure interactive accents (badges, icons, toggles, buttons) maintain WCAG-compliant contrast ratios against both light and dark backdrops.

3. **Code & Terminal Blocks**:
   - Monospaced code blocks, JSON viewers, and terminal panes may retain high-contrast dark backdrops with vivid syntax highlighting in both modes for optimal developer readability, while surrounding containers and toolbars adapt to the active theme.

4. **Persistence & Syncing**:
   - When introducing theme switches, persist the selection in `localStorage` and synchronize the `dark` / `light` class on the root HTML element (`<html class="dark">` / `<html class="light">`).
