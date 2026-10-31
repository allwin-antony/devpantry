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
        <h1 className="text-3xl font-bold mb-6 text-[var(--text-primary)]">About DevPantry</h1>
        <div className="prose dark:prose-invert max-w-none prose-headings:text-[var(--text-primary)] prose-p:text-[var(--text-secondary)] prose-strong:text-[var(--text-primary)] text-[var(--text-secondary)]">
          <p className="text-lg text-[var(--text-secondary)] mb-8">
            DevPantry helps frontend developers build and test web apps: inspect authentication tokens, generate edge-case test data, turn JSON into types, and prepare images, fonts, and icons for an interface.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
          <p className="mb-4">
            File editing, token inspection, and data generation run <strong>in your browser</strong>, with no account required. Network features such as social-preview fetching and collaboration are explained in our <a href="/privacy">privacy policy</a>, along with the usage analytics that help us improve the tools.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Open Source</h2>
          <p className="mb-4">
            DevPantry is built by <a href="https://github.com/allwin-antony" target="_blank" rel="noopener noreferrer">Allwin S Antony</a> using Next.js, React, TypeScript, and Tailwind CSS. It builds on projects including Lucide, Fontsource, pdf-lib, Yjs, and IMG.LY’s background-removal library.
          </p>
          <p className="mb-4">
            The entire DevPantry suite is completely open-source! You can view the source code, report issues, or contribute on our <a href="https://github.com/allwin-antony/devpantry" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-blue)] hover:underline font-medium">GitHub Repository</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
