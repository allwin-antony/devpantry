# Open-Source Icons: Web & Framework Integration Guide

---

## 1. React Integration (Lucide, Tabler, Heroicons, Iconoir)

### Lucide React
```bash
npm install lucide-react
```
```tsx
import { Camera, CheckCircle2, Sparkles } from 'lucide-react';

export function DashboardHeader() {
  return (
    <div className="flex items-center gap-2">
      <Sparkles className="w-5 h-5 text-indigo-500" />
      <h1 className="text-xl font-bold">Project Dashboard</h1>
      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
    </div>
  );
}
```

### Tabler Icons React
```bash
npm install @tabler/icons-react
```
```tsx
import { IconSettings, IconUser, IconDeviceAnalytics } from '@tabler/icons-react';

export function AnalyticsCard() {
  return <IconDeviceAnalytics size={28} stroke={1.5} color="#206bc4" />;
}
```

### Heroicons (Tailwind CSS)
```bash
npm install @heroicons/react
```
```tsx
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { HeartIcon } from '@heroicons/react/24/solid';
```

---

## 2. Vue 3 Integration

### Lucide Vue Next
```bash
npm install lucide-vue-next
```
```vue
<script setup>
import { Sparkles, ArrowRight } from 'lucide-vue-next';
</script>

<template>
  <button class="btn">
    Get Started <ArrowRight :size="18" />
  </button>
</template>
```

---

## 3. Svelte Integration

### Lucide Svelte
```bash
npm install lucide-svelte
```
```svelte
<script>
  import { Sparkles } from 'lucide-svelte';
</script>

<Sparkles size={20} color="currentColor" />
```

---

## 4. Raw SVG / Sprites / HTML Integration

### Fetching individual SVG on-demand:
```bash
python3 scripts/fetch_icon.py download lucide:sparkles --output ./public/icons/sparkles.svg
```

### Inlining or `<img />`:
```html
<!-- Direct Image Tag -->
<img src="/icons/sparkles.svg" width="24" height="24" alt="Sparkles Icon" />

<!-- Inlined SVG (Customizable with CSS currentColor) -->
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
</svg>
```
