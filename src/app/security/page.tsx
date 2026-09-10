import type { Metadata } from 'next';
import { BadgeCheck, KeyRound, Laptop, ShieldAlert, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Security Architecture — DevPantry',
  description: 'Learn how DevPantry secures your data through client-side processing, WebCrypto, and zero-leak architectures.',
  alternates: {
    canonical: 'https://devpantry.com/security',
  },
};

export default function SecurityPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Security Architecture — DevPantry',
    description: 'Learn how DevPantry secures your data through client-side processing, WebCrypto, and zero-leak architectures.',
    url: 'https://devpantry.com/security',
  };

  return (
    <div className="min-h-full bg-[var(--bg-app)] py-10 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-5xl mx-auto px-5 sm:px-6">
        <header className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-[11px] font-mono font-semibold uppercase tracking-[0.16em] text-sky-600 dark:text-sky-400">
            <ShieldCheck className="h-3.5 w-3.5" /> Security architecture
          </div>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">Built to keep sensitive work local.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">
            DevPantry reduces exposure by running its utilities in the browser. This page explains the protections we rely on—and the limits you should understand before using any web application.
          </p>
          <p className="mt-4 font-mono text-xs text-[var(--text-muted)]">Security architecture · Last updated September 9, 2026</p>
        </header>

        <section className="mt-10 grid gap-4 md:grid-cols-3" aria-label="Security controls">
          {[
            { icon: Laptop, title: 'On-device execution', text: 'Tool inputs are processed by browser APIs instead of a DevPantry processing backend.' },
            { icon: KeyRound, title: 'In-memory token work', text: 'JWT inspection and signing use browser memory and WebCrypto where supported.' },
            { icon: BadgeCheck, title: 'No account surface', text: 'There is no account, password, or saved workspace to protect.' },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-[var(--border-dev)] bg-[var(--bg-panel)] p-5 shadow-sm">
              <Icon className="h-5 w-5 text-sky-500" />
              <h2 className="mt-4 font-semibold text-[var(--text-primary)]">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{text}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-2xl border border-[var(--border-dev)] bg-[var(--bg-panel)] p-6 sm:p-8">
            <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-[var(--text-primary)] prose-p:text-[var(--text-secondary)] prose-li:text-[var(--text-secondary)]">
              <h2>How the tools are isolated</h2>
              <p>Image tools use browser-side APIs, WebAssembly, and supported GPU capabilities to transform images locally. The JWT Decoder parses token data in browser memory and uses the Web Crypto API for supported cryptographic operations. Mock-data tools generate data in the active browser session.</p>
              <p>DevPantry does not provide an API endpoint for uploading tool inputs. It also does not intentionally persist JWTs, images, custom schemas, or generated records in browser storage.</p>
              <h2>Security boundaries</h2>
              <p>Client-side processing protects data from being sent to DevPantry for tool execution. It cannot protect a compromised device, a malicious browser extension, copied output, or data shared with another website after export. Review sensitive output before saving or sharing it.</p>
            </div>
          </div>
          <aside className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-6">
            <ShieldAlert className="h-5 w-5 text-amber-500" />
            <h2 className="mt-4 font-semibold text-[var(--text-primary)]">Reporting a vulnerability</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Do not include tokens, private files, or exploit details in a public issue. Send security reports to <a className="font-medium text-[var(--accent-blue)] hover:underline" href="mailto:security@devpantry.com">security@devpantry.com</a>.</p>
          </aside>
        </section>
      </div>
    </div>
  );
}
