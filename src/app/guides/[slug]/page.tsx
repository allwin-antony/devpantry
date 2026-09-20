import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { GUIDES_DATA, GuideArticle } from '@/lib/guidesData';
import { BookOpen, Calendar, Clock, User, ArrowLeft, ArrowRight, CheckCircle2, Code, Terminal, Share2 } from 'lucide-react';

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return GUIDES_DATA.map((guide) => ({
    slug: guide.slug,
  }));
}

export async function generateMetadata(props: GuidePageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const guide = GUIDES_DATA.find((g) => g.slug === slug);

  if (!guide) {
    return {
      title: 'Guide Not Found | DevPantry',
    };
  }

  return {
    title: `${guide.title} | DevPantry Engineering Guides`,
    description: guide.description,
    openGraph: {
      title: `${guide.title} | DevPantry`,
      description: guide.description,
      type: 'article',
      url: `https://devpantry.com/guides/${guide.slug}`,
      publishedTime: new Date(guide.publishedDate).toISOString(),
      authors: [guide.author.name],
      tags: guide.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.title,
      description: guide.description,
    },
  };
}

function renderFormattedContent(text: string) {
  // Split paragraphs by double newline
  const paragraphs = text.split('\n\n');

  return paragraphs.map((para, pIdx) => {
    // Split by ** for bold formatting
    const boldParts = para.split('**');

    return (
      <p key={pIdx} className="leading-relaxed">
        {boldParts.map((part, bIdx) => {
          const isBold = bIdx % 2 === 1;

          // Process inline `code` blocks within each part
          const codeParts = part.split('`');

          const renderedPart = codeParts.map((subPart, cIdx) => {
            const isCode = cIdx % 2 === 1;
            if (isCode) {
              return (
                <code
                  key={cIdx}
                  className="px-1.5 py-0.5 rounded bg-[var(--bg-panel)] font-mono text-xs text-rose-500 border border-[var(--border-dev)]"
                >
                  {subPart}
                </code>
              );
            }
            return subPart;
          });

          if (isBold) {
            return (
              <strong key={bIdx} className="font-bold text-[var(--text-primary)]">
                {renderedPart}
              </strong>
            );
          }

          return <React.Fragment key={bIdx}>{renderedPart}</React.Fragment>;
        })}
      </p>
    );
  });
}

export default async function GuideDetailPage(props: GuidePageProps) {
  const { slug } = await props.params;
  const guide = GUIDES_DATA.find((g) => g.slug === slug);

  if (!guide) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: guide.title,
    description: guide.description,
    author: {
      '@type': 'Organization',
      name: guide.author.name,
      url: 'https://devpantry.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'DevPantry',
      url: 'https://devpantry.com',
    },
    datePublished: new Date(guide.publishedDate).toISOString(),
    dateModified: new Date(guide.updatedDate).toISOString(),
    mainEntityOfPage: `https://devpantry.com/guides/${guide.slug}`,
    keywords: guide.tags.join(', '),
  };

  return (
    <article className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-8 font-mono">
      {/* Inject JSON-LD Structured Data Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Back Link */}
      <div>
        <Link
          href="/guides"
          className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-rose-500 transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to All Engineering Guides</span>
        </Link>
      </div>

      {/* Article Header */}
      <header className="flex flex-col gap-4 border-b border-[var(--border-dev)] pb-8">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 font-semibold border border-rose-500/20">
            {guide.category}
          </span>
          <span className="text-[var(--text-muted)] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {guide.readingTime}
          </span>
          <span className="text-[var(--text-muted)] flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> {guide.publishedDate}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold text-[var(--text-primary)] tracking-tight leading-tight">
          {guide.title}
        </h1>

        <p className="text-sm sm:text-base text-[var(--text-secondary)] font-sans leading-relaxed">
          {guide.description}
        </p>

        {/* Author Badge */}
        <div className="flex items-center gap-3 pt-2 text-xs">
          <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-500 font-bold">
            <User className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[var(--text-primary)]">{guide.author.name}</span>
            <span className="text-[11px] text-[var(--text-muted)]">{guide.author.role}</span>
          </div>
        </div>
      </header>

      {/* Live Tool Banner Callout */}
      <div className="p-5 sm:p-6 rounded-xl bg-gradient-to-r from-rose-950/20 via-[var(--bg-panel)] to-cyan-950/20 border border-rose-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Code className="w-6 h-6 text-rose-500 shrink-0" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[var(--text-primary)]">
              Interactive Tool Implementation
            </span>
            <span className="text-xs text-[var(--text-secondary)] font-sans">
              Test this exact engineering implementation live in your browser.
            </span>
          </div>
        </div>

        <Link
          href={guide.matchingToolUrl}
          className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors shrink-0 flex items-center gap-2"
        >
          <span>Open {guide.matchingToolName}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Key Takeaways Box */}
      <div className="p-6 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-dev)] flex flex-col gap-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4" />
          <span>Key Architectural Takeaways</span>
        </h3>
        <ul className="flex flex-col gap-2 font-sans text-xs sm:text-sm text-[var(--text-primary)]">
          {guide.keyTakeaways.map((takeaway, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-rose-500 font-bold font-mono">0{idx + 1}.</span>
              <span className="leading-relaxed">{takeaway}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Guide Content Sections */}
      <div className="flex flex-col gap-10 py-4">
        {guide.sections.map((section) => (
          <section key={section.id} id={section.id} className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-[var(--text-primary)] border-b border-[var(--border-dev)] pb-2">
              {section.title}
            </h2>

            <div className="font-sans text-sm text-[var(--text-secondary)] leading-relaxed space-y-4">
              {renderFormattedContent(section.content)}
            </div>

            {section.codeSnippet && (
              <div className="flex flex-col rounded-lg border border-[var(--border-dev)] bg-[#0d1117] overflow-hidden my-2">
                {section.codeSnippet.title && (
                  <div className="px-4 py-2 bg-[#161b22] border-b border-[#30363d] text-[11px] font-mono text-slate-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-rose-400" />
                      {section.codeSnippet.title}
                    </span>
                    <span className="uppercase text-[10px] text-slate-500 font-bold">
                      {section.codeSnippet.language}
                    </span>
                  </div>
                )}
                <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
                  <code>{section.codeSnippet.code}</code>
                </pre>
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Tags Footer */}
      <div className="pt-6 border-t border-[var(--border-dev)] flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[var(--text-muted)]">Tags:</span>
          {guide.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded bg-[var(--bg-panel)] border border-[var(--border-dev)] text-[var(--text-secondary)]"
            >
              #{tag}
            </span>
          ))}
        </div>

        <Link
          href={guide.matchingToolUrl}
          className="font-bold text-rose-500 hover:underline flex items-center gap-1"
        >
          <span>Launch {guide.matchingToolName}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
}
