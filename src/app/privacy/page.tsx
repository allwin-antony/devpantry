import type { Metadata } from 'next';
import { Cookie, EyeOff, HardDrive, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy — DevPantry',
  description: 'DevPantry respects your privacy. All tools run client-side. We do not store your data, images, or tokens.',
  alternates: {
    canonical: 'https://devpantry.com/privacy',
  },
};

export default function PrivacyPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Privacy Policy — DevPantry',
    description: 'DevPantry respects your privacy. All tools run client-side. We do not store your data, images, or tokens.',
    url: 'https://devpantry.com/privacy',
  };

  return (
    <div className="min-h-full bg-[var(--bg-app)] py-10 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-5xl mx-auto px-5 sm:px-6">
        <header className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-mono font-semibold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" /> Privacy by architecture
          </div>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">Your tool inputs stay on your device.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">
            DevPantry is designed for working with images, tokens, and test data without sending that content to a DevPantry application server.
          </p>
          <p className="mt-4 font-mono text-xs text-[var(--text-muted)]">Privacy policy · Last updated October 30, 2026</p>
        </header>

        <section className="mt-10 grid gap-4 sm:grid-cols-3" aria-label="Privacy summary">
          {[
            { icon: EyeOff, title: 'Tool inputs', text: 'Images, JWTs, schemas, and generated data are processed in your browser.' },
            { icon: Cookie, title: 'Usage analytics', text: 'Google Analytics and Cloudflare Web Analytics help us understand visits and tool usage. Tool inputs are not included in our custom events.' },
            { icon: HardDrive, title: 'Browser storage', text: 'The theme, collaboration drafts, and analytics identifiers may be stored in your browser.' },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-[var(--border-dev)] bg-[var(--bg-panel)] p-5 shadow-sm">
              <Icon className="h-5 w-5 text-emerald-500" />
              <h2 className="mt-4 font-semibold text-[var(--text-primary)]">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{text}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-2xl border border-[var(--border-dev)] bg-[var(--bg-panel)] p-6 sm:p-8">
          <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-[var(--text-primary)] prose-p:text-[var(--text-secondary)] prose-li:text-[var(--text-secondary)]">
            <h2>How DevPantry handles data</h2>
            <h3>What stays in the browser</h3>
            <p>Image editing, background removal, PDF processing, mock-data generation, JSON conversion, and JWT decoding process their inputs locally. These tools do not upload input files or tokens to a DevPantry processing API.</p>
            <h3>What we collect</h3>
            <p>No account is needed to use the tools. We use Google Analytics and Cloudflare Web Analytics to measure visits, device/browser information, referring sites, and tool usage. Our custom completion events contain a tool identifier and an action such as copy or download—not file contents, file names, JSON, JWTs, or generated output. Page URLs sent by our Google Analytics integration omit query strings and URL fragments. Advertising personalization and Google signals are disabled in that integration.</p>
            <p>Google Analytics may use cookies to distinguish visits. Google and Cloudflare also process technical request information to deliver their services. Our Google Analytics integration respects the browser’s Do Not Track setting. DevPantry currently serves no advertising.</p>
            <h3>Network features</h3>
            <p>Font and icon previews request assets from their providers. The social-preview URL fetch sends the URL you enter to our metadata-fetch service. The collaborative editor encrypts document updates in your browser, then relays and stores the encrypted updates through a Cloudflare Durable Object so other participants can synchronize. Its room key is derived locally from the password. These features need a network connection even though file editing and token processing happen locally.</p>
            <h3>Feedback</h3>
            <p>Feedback is submitted through Formspree, including your message and any optional contact details you provide.</p>
            <h3>Browser storage</h3>
            <p>The site stores interface preferences locally. The collaborative editor may save its document in IndexedDB for local persistence. Analytics cookies can also be present. Image processing and JWT inspection do not intentionally save their inputs to browser storage. Shared JSON links place the JSON in the URL fragment, so anyone you give that link to can read the payload.</p>
            <h3>Your choices</h3>
            <p>You can clear the theme preference through your browser’s site-data controls. Do not enter secrets into any web tool unless you trust the browser and device you are using.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
