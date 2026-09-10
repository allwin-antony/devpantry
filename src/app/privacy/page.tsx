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
          <p className="mt-4 font-mono text-xs text-[var(--text-muted)]">Privacy policy · Last updated September 9, 2026</p>
        </header>

        <section className="mt-10 grid gap-4 sm:grid-cols-3" aria-label="Privacy summary">
          {[
            { icon: EyeOff, title: 'Tool inputs', text: 'Images, JWTs, schemas, and generated data are processed in your browser.' },
            { icon: Cookie, title: 'Accounts & ads', text: 'No account is required and DevPantry does not serve advertising or behavioral trackers.' },
            { icon: HardDrive, title: 'Local storage', text: 'The theme preference may be stored locally by your browser.' },
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
            <p>Image editing, background removal, mock-data generation, and JWT decoding run in the browser. Inputs used by these tools are not submitted to a DevPantry API for processing or retained in a DevPantry database.</p>
            <h3>What we collect</h3>
            <p>DevPantry does not ask for a name, email address, or account to use its tools. The application does not currently load advertising or behavioural-analytics scripts. A hosting provider may process standard technical request data, such as an IP address and request time, to deliver the website; that does not include the content entered into a tool.</p>
            <h3>Browser storage</h3>
            <p>The site uses local storage for a non-sensitive interface preference: dark or light theme. DevPantry does not intentionally write images, JWTs, schemas, or generated mock data to local storage, session storage, or cookies.</p>
            <h3>Your choices</h3>
            <p>You can clear the theme preference through your browser’s site-data controls. Do not enter secrets into any web tool unless you trust the browser and device you are using.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
