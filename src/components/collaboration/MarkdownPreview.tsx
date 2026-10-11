"use client";

import React, { useMemo, useEffect, useRef } from 'react';
import { marked } from 'marked';
import { FileText } from 'lucide-react';

interface MarkdownPreviewProps {
  content: string;
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Configure marked for GitHub Flavored Markdown
  const htmlContent = useMemo(() => {
    if (!content.trim()) return '';

    try {
      return marked.parse(content, {
        gfm: true,
        breaks: true,
        async: false,
      }) as string;
    } catch (e) {
      console.error('Error parsing markdown:', e);
      return `<p class="text-rose-500">Error rendering markdown</p>`;
    }
  }, [content]);

  // Attach copy listeners to code blocks inside the rendered preview
  useEffect(() => {
    if (!containerRef.current) return;

    const preElements = containerRef.current.querySelectorAll('pre');
    preElements.forEach((pre) => {
      // Check if button already exists
      if (pre.querySelector('.preview-copy-btn')) return;

      pre.style.position = 'relative';

      const btn = document.createElement('button');
      btn.className =
        'preview-copy-btn absolute top-2 right-2 px-2 py-1 text-[11px] font-mono font-medium rounded-md border border-[var(--border-dev)] bg-[var(--bg-panel)] hover:bg-[var(--bg-sidebar)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all shadow-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100';
      btn.innerHTML = `<span>Copy</span>`;

      pre.classList.add('group');

      btn.addEventListener('click', () => {
        const code = pre.querySelector('code');
        const textToCopy = code ? code.innerText : pre.innerText;
        navigator.clipboard.writeText(textToCopy);
        btn.innerHTML = `<span class="text-emerald-500 font-semibold">Copied!</span>`;
        setTimeout(() => {
          btn.innerHTML = `<span>Copy</span>`;
        }, 2000);
      });

      pre.appendChild(btn);
    });
  }, [htmlContent]);

  if (!content.trim()) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center text-[var(--text-muted)] bg-[var(--bg-panel)] select-none">
        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4 text-cyan-500">
          <FileText size={26} />
        </div>
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">
          Live Markdown Preview
        </h3>
        <p className="text-xs max-w-sm text-[var(--text-secondary)] leading-relaxed">
          Start typing in the collaborative editor or insert a starter template to see your rendered document live in real time.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-full w-full overflow-y-auto p-6 lg:p-8 bg-[var(--bg-panel)] text-[var(--text-primary)] selection:bg-cyan-500/20"
    >
      <div
        className="markdown-preview max-w-none text-sm sm:text-base leading-relaxed
          [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-[var(--text-primary)] [&_h1]:border-b [&_h1]:border-[var(--border-dev)] [&_h1]:pb-2 [&_h1]:mb-4 [&_h1]:mt-2
          [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[var(--text-primary)] [&_h2]:mt-6 [&_h2]:mb-3
          [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[var(--text-primary)] [&_h3]:mt-4 [&_h3]:mb-2
          [&_p]:leading-relaxed [&_p]:text-[var(--text-secondary)] [&_p]:my-2.5
          [&_strong]:font-bold [&_strong]:text-[var(--text-primary)]
          [&_b]:font-bold [&_b]:text-[var(--text-primary)]
          [&_em]:italic [&_em]:text-[var(--text-secondary)]
          [&_a]:text-cyan-500 hover:[&_a]:underline [&_a]:font-medium
          [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ul]:text-[var(--text-secondary)]
          [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_ol]:text-[var(--text-secondary)]
          [&_li]:my-1 [&_li]:leading-relaxed [&_li]:text-[var(--text-secondary)]
          [&_li_strong]:text-[var(--text-primary)]
          [&_li:has(input[type='checkbox'])]:list-none [&_li:has(input[type='checkbox'])]:-ml-4
          [&_input[type='checkbox']]:mr-2 [&_input[type='checkbox']]:accent-cyan-500 [&_input[type='checkbox']]:align-middle
          [&_blockquote]:border-l-4 [&_blockquote]:border-l-cyan-500 [&_blockquote]:bg-[var(--bg-sidebar)]/60 [&_blockquote]:py-2 [&_blockquote]:px-4 [&_blockquote]:rounded-r-xl [&_blockquote]:text-[var(--text-secondary)] [&_blockquote]:my-3 [&_blockquote]:not-italic
          [&_code]:font-mono [&_code]:text-xs [&_code]:bg-[var(--bg-app)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:border [&_code]:border-[var(--border-dev)] [&_code]:text-cyan-600 dark:[&_code]:text-cyan-400
          [&_pre]:bg-[var(--bg-app)] [&_pre]:border [&_pre]:border-[var(--border-dev)] [&_pre]:rounded-xl [&_pre]:p-4 [&_pre]:my-3 [&_pre]:overflow-x-auto
          [&_pre_code]:border-0 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-[var(--text-primary)]
          [&_img]:inline-block [&_img]:my-1 [&_img]:mr-1.5 [&_img]:align-middle [&_img]:rounded-md
          [&_table]:border-collapse [&_table]:w-full [&_table]:my-4 [&_table]:border [&_table]:border-[var(--border-dev)] [&_table]:rounded-xl [&_table]:overflow-hidden
          [&_th]:bg-[var(--bg-sidebar)] [&_th]:border [&_th]:border-[var(--border-dev)] [&_th]:p-2.5 [&_th]:text-xs [&_th]:font-semibold [&_th]:text-[var(--text-primary)] [&_th]:text-left
          [&_td]:border [&_td]:border-[var(--border-dev)] [&_td]:p-2.5 [&_td]:text-xs [&_td]:text-[var(--text-secondary)]
          [&_hr]:border-[var(--border-dev)] [&_hr]:my-5"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
}
