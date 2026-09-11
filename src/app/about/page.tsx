import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About DevPantry — Free Developer Utilities',
  description: 'DevPantry is an open-source, browser-based utility suite for developers and engineers. Learn about our mission to provide fast, private tools.',
  alternates: {
    canonical: 'https://devpantry.com/about',
  },
};

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About DevPantry',
    description: 'DevPantry is a fast, high-density developer suite consolidating essential utilities.',
    url: 'https://devpantry.com/about',
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg-app)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-3xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold mb-6">About DevPantry</h1>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg text-[var(--text-secondary)] mb-8">
            DevPantry is a fast, high-density developer suite consolidating the essential image editing utilities, edge-case mock data generators, open-source typography catalogs, vector icons, and real-world API fixtures developers need every single day.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
          <p className="mb-4">
            We believe developer tools should be fast, reliable, and respect your privacy. That's why every tool on DevPantry runs <strong>100% client-side in your browser</strong>. There are no server uploads, no accounts required, and no hidden tracking.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Open Source</h2>
          <p className="mb-4">
            DevPantry is built with Next.js, React, TypeScript, and Tailwind CSS. We rely on incredible open-source projects like Lucide, Fontsource, Transformers.js, and many more.
          </p>
          <p className="mb-4">
            The entire DevPantry suite is completely open-source! You can view the source code, report issues, or contribute on our <a href="https://github.com/allwin-antony/devpantry" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-blue)] hover:underline font-medium">GitHub Repository</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
