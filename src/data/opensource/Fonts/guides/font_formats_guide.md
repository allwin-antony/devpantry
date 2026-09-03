# Open-Source Font Formats & Technical Reference

Typography files come in several standard formats depending on whether they are intended for operating system installation, desktop design, mobile apps, or web delivery.

---

## 1. Font File Formats

### **TTF (TrueType Font) & OTF (OpenType Font)**
- **Best For**: Desktop OS installation (Linux `/usr/share/fonts`, macOS Font Book, Windows), graphic design tools (Figma, Photoshop, Illustrator), video rendering, native mobile apps (Flutter, React Native, Android/iOS).
- **Features**: Supports rich typography features like ligatures, stylistic alternates (`salt`), tabular figures (`tnum`), fractions (`frac`), and kerning pairs.

### **WOFF2 (Web Open Font Format 2.0)**
- **Best For**: Modern Web Applications (`@font-face` in CSS).
- **Features**: Utilizes Brotli compression. Typically **30% to 50% smaller** than raw TTF/OTF. Universally supported by modern browsers (Chrome, Firefox, Safari, Edge).

### **WOFF (Web Open Font Format 1.0)**
- **Best For**: Legacy browser compatibility (Internet Explorer 11, older mobile browsers). Uses zlib/gzip compression.

---

## 2. Static Fonts vs. Variable Fonts (VF)

### Static Fonts
- A separate file for every weight/style combination (e.g. `Inter-Regular.ttf`, `Inter-Medium.ttf`, `Inter-Bold.ttf`, `Inter-Italic.ttf`).
- Traditional format; supported everywhere.

### Variable Fonts
- A **single font file** that contains continuous interpolation axes (e.g. `Inter-VariableFont_opsz,wght.ttf`).
- **Standard OpenType Axes**:
  - `wght` (Weight): 100 to 900 (e.g., `font-variation-settings: 'wght' 450;` allows custom in-between weights)
  - `wdth` (Width): Condensed to Expanded
  - `slnt` (Slant): Oblique angle
  - `ital` (Italic): Continuous roman-to-italic transition
  - `opsz` (Optical Size): Optimized glyph contrast depending on font rendering size

---

## 3. Web Usage Examples

### Loading via CSS `@font-face`
```css
@font-face {
  font-family: 'Inter';
  src: url('./fonts/Inter-VariableFont_slnt,wght.woff2') format('woff2-variations'),
       url('./fonts/Inter-VariableFont_slnt,wght.ttf') format('truetype');
  font-weight: 100 900;
  font-style: oblique 0deg 10deg;
  font-display: swap;
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-variation-settings: 'wght' 400;
}
```

### Self-Hosting via NPM / Fontsource
If you are building a Node/React/Next.js/Vite application:
```bash
npm install @fontsource-variable/inter
```
```js
// In your main entry file (index.js or App.tsx)
import '@fontsource-variable/inter';
```
