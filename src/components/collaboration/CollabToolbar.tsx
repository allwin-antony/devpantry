"use client";

import React, { useState } from 'react';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  CheckSquare,
  Link as LinkIcon,
  Table,
  Minus,
  FileCode,
  Download,
  Copy,
  Code2,
  Columns,
  Eye,
  Edit3,
  FileText,
  Trash2,
  ChevronDown,
  Sparkles,
  Check,
  Undo,
  Redo
} from 'lucide-react';
import { triggerFeedbackNudge } from '@/lib/feedbackNudge';

export type ViewMode = 'editor' | 'split' | 'preview';

interface CollabToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onInsertFormatting: (prefix: string, suffix?: string, defaultText?: string) => void;
  onInsertTemplate: (content: string) => void;
  onExport: (type: 'download-md' | 'copy-md' | 'copy-html') => void;
  onClear: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
}

const TEMPLATES = [
  {
    id: 'meeting',
    title: 'Meeting Notes & Actions',
    description: 'Agenda, discussion points, decisions, and action items',
    content: `# 📝 Meeting Notes: [Project Name]

**Date:** ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}  
**Attendees:** @participant1, @participant2  
**Goal:** Align on sprint priorities and architecture decisions.

---

## 📌 Agenda
1. Architecture review for upcoming features
2. Open blocker discussion
3. Sprint assignments & timeline

## 💬 Discussion & Decisions
- **Decision 1:** Use WebRTC DataChannels + Yjs for real-time collaboration.
- **Decision 2:** Client-side zero-knowledge AES-GCM encryption for all document state.

## ✅ Action Items
- [ ] @dev1 finalize P2P signaling infrastructure
- [ ] @dev2 implement Markdown live preview & cursor tags
- [ ] @qa verify cross-browser WebRTC connection stability
`
  },
  {
    id: 'rfc',
    title: 'Architecture RFC / Tech Spec',
    description: 'Technical context, design, data flow, and trade-offs',
    content: `# 📐 RFC: [Feature / Architecture Name]

**Author:** [Your Name]  
**Status:** In Review  
**Created:** ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}

---

## 1. Summary
Briefly explain the high-level concept, motivation, and problem statement.

## 2. Background & Motivation
Why are we building this? What are the limitations of the current design?

## 3. Detailed Design

\`\`\`
[Client A] <--- (WebRTC DataChannel) ---> [Client B]
     |                                          |
     +------------ [Yjs CRDT Doc] --------------+
\`\`\`

### Data Models & Contracts
| Field | Type | Description |
| :--- | :--- | :--- |
| \`id\` | \`string\` | Unique 256-bit identifier |
| \`payload\` | \`Uint8Array\` | Encrypted binary update |

## 4. Trade-offs & Alternatives Considered
- **Option A:** Central database (rejected due to privacy and server costs).
- **Option B (Selected):** P2P WebRTC CRDT sync with zero-knowledge keys.

## 5. Security & Privacy
Explain the threat model and cryptographic guarantees.
`
  },
  {
    id: 'readme',
    title: 'Project README',
    description: 'Standard open-source project documentation',
    content: `# 🚀 [Project Name]

> A blazingly fast, zero-knowledge collaborative developer workspace.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)](https://www.typescriptlang.org/)

---

## ✨ Features
- **P2P Collaboration:** Sub-millisecond latency via WebRTC DataChannels.
- **Zero-Knowledge Privacy:** 256-bit client-side AES-GCM encryption.
- **Live Markdown Preview:** Real-time dual-pane rendering with GitHub Flavored Markdown.
- **Conflict-Free:** Powered by Yjs CRDTs.

## 📦 Quick Start

\`\`\`bash
# Clone the repository
git clone https://github.com/example/project.git

# Install dependencies
npm install

# Start local development server
npm run dev
\`\`\`

## 🛠️ Tech Stack
- Next.js (App Router)
- CodeMirror 6 + Yjs
- Tailwind CSS v4
`
  },
  {
    id: 'scratchpad',
    title: 'Pair Programming Scratchpad',
    description: 'Problem definition, test cases, and solution code',
    content: `# 🐞 Pair Programming Scratchpad

**Topic:** [Problem Name / Bug ID]  
**Collaborators:** Alice & Bob  

---

## 🎯 Problem Statement
Explain what needs to be solved or the bug being investigated.

## 🧪 Edge Cases & Test Inputs
- Input: \`[1, 2, 3]\` -> Expected: \`true\`
- Input: \`[]\` -> Expected: \`false\`
- Input: \`null\` -> Expected: \`throws Error\`

## 💻 Working Implementation

\`\`\`typescript
function solveProblem(inputs: number[]): boolean {
  if (!inputs.length) return false;
  
  // TODO: implement optimal solution
  return true;
}
\`\`\`
`
  }
];

export function CollabToolbar({
  viewMode,
  onViewModeChange,
  onInsertFormatting,
  onInsertTemplate,
  onExport,
  onClear,
  onUndo,
  onRedo,
}: CollabToolbarProps) {
  const [templateOpen, setTemplateOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [copiedAction, setCopiedAction] = useState<string | null>(null);

  const handleExportClick = (type: 'download-md' | 'copy-md' | 'copy-html') => {
    onExport(type);
    setCopiedAction(type);
    setTimeout(() => setCopiedAction(null), 2000);
    setExportOpen(false);
  };

  const handleTemplateSelect = (templateContent: string) => {
    onInsertTemplate(templateContent);
    triggerFeedbackNudge('collab-insert-template');
    setTemplateOpen(false);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2 border-b border-[var(--border-dev)] bg-[var(--bg-panel)] select-none">
      {/* Left: History & Markdown formatting buttons */}
      <div className="flex items-center gap-0.5 flex-wrap">
        {/* Undo & Redo */}
        {onUndo && (
          <button
            onClick={onUndo}
            className="p-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-sidebar)] transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo size={15} />
          </button>
        )}
        {onRedo && (
          <button
            onClick={onRedo}
            className="p-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-sidebar)] transition-colors"
            title="Redo (Ctrl+Y)"
          >
            <Redo size={15} />
          </button>
        )}

        {(onUndo || onRedo) && <div className="h-4 w-px bg-[var(--border-dev)] mx-1" />}

        {/* Headings */}
        <button
          onClick={() => onInsertFormatting('# ', '', 'Heading 1')}
          className="p-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-sidebar)] transition-colors"
          title="Heading 1"
        >
          <Heading1 size={15} />
        </button>
        <button
          onClick={() => onInsertFormatting('## ', '', 'Heading 2')}
          className="p-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-sidebar)] transition-colors"
          title="Heading 2"
        >
          <Heading2 size={15} />
        </button>
        <button
          onClick={() => onInsertFormatting('### ', '', 'Heading 3')}
          className="p-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-sidebar)] transition-colors"
          title="Heading 3"
        >
          <Heading3 size={15} />
        </button>

        <div className="h-4 w-px bg-[var(--border-dev)] mx-1" />

        {/* Text styling */}
        <button
          onClick={() => onInsertFormatting('**', '**', 'bold text')}
          className="p-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-sidebar)] transition-colors"
          title="Bold (Ctrl+B)"
        >
          <Bold size={15} />
        </button>
        <button
          onClick={() => onInsertFormatting('*', '*', 'italic text')}
          className="p-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-sidebar)] transition-colors"
          title="Italic (Ctrl+I)"
        >
          <Italic size={15} />
        </button>
        <button
          onClick={() => onInsertFormatting('~~', '~~', 'strikethrough text')}
          className="p-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-sidebar)] transition-colors"
          title="Strikethrough"
        >
          <Strikethrough size={15} />
        </button>
        <button
          onClick={() => onInsertFormatting('`', '`', 'code')}
          className="p-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-sidebar)] transition-colors"
          title="Inline Code"
        >
          <Code size={15} />
        </button>

        <div className="h-4 w-px bg-[var(--border-dev)] mx-1" />

        {/* Lists & Quotes */}
        <button
          onClick={() => onInsertFormatting('- ', '', 'List item')}
          className="p-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-sidebar)] transition-colors"
          title="Bulleted List"
        >
          <List size={15} />
        </button>
        <button
          onClick={() => onInsertFormatting('1. ', '', 'List item')}
          className="p-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-sidebar)] transition-colors"
          title="Numbered List"
        >
          <ListOrdered size={15} />
        </button>
        <button
          onClick={() => onInsertFormatting('- [ ] ', '', 'Task item')}
          className="p-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-sidebar)] transition-colors"
          title="Task Checklist"
        >
          <CheckSquare size={15} />
        </button>
        <button
          onClick={() => onInsertFormatting('> ', '', 'Quote text')}
          className="p-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-sidebar)] transition-colors"
          title="Blockquote"
        >
          <Quote size={15} />
        </button>

        <div className="h-4 w-px bg-[var(--border-dev)] mx-1" />

        {/* Inserts: Link, Code block, Table, Divider */}
        <button
          onClick={() => onInsertFormatting('[', '](https://example.com)', 'link text')}
          className="p-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-sidebar)] transition-colors"
          title="Insert Link"
        >
          <LinkIcon size={15} />
        </button>
        <button
          onClick={() => onInsertFormatting('```\n', '\n```', 'code block')}
          className="p-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-sidebar)] transition-colors"
          title="Code Block"
        >
          <FileCode size={15} />
        </button>
        <button
          onClick={() => onInsertFormatting('| Header 1 | Header 2 |\n| :--- | :--- |\n| Cell 1 | Cell 2 |\n', '')}
          className="p-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-sidebar)] transition-colors"
          title="Insert Table"
        >
          <Table size={15} />
        </button>
        <button
          onClick={() => onInsertFormatting('\n---\n\n', '')}
          className="p-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-sidebar)] transition-colors"
          title="Horizontal Rule"
        >
          <Minus size={15} />
        </button>

        {/* Templates dropdown */}
        <div className="relative ml-1">
          <button
            onClick={() => setTemplateOpen(!templateOpen)}
            className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-sidebar)] border border-transparent hover:border-[var(--border-dev)] transition-colors"
            title="Insert Starter Template"
          >
            <Sparkles size={13} className="text-amber-500" />
            <span className="hidden sm:inline">Templates</span>
            <ChevronDown size={12} />
          </button>

          {templateOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setTemplateOpen(false)} />
              <div className="absolute left-0 top-full mt-1.5 w-64 p-1.5 rounded-xl border border-[var(--border-dev)] bg-[var(--bg-panel)] shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-1.5 text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  Starter Templates
                </div>
                {TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => handleTemplateSelect(tmpl.content)}
                    className="w-full text-left px-2.5 py-2 rounded-lg text-xs hover:bg-[var(--bg-sidebar)] transition-colors group flex flex-col"
                  >
                    <span className="font-semibold text-[var(--text-primary)] group-hover:text-cyan-500 transition-colors">
                      {tmpl.title}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)] line-clamp-1">
                      {tmpl.description}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right: View mode toggles & Export/Clear */}
      <div className="flex items-center gap-1.5">
        {/* Layout View Modes */}
        <div className="flex items-center bg-[var(--bg-sidebar)] p-0.5 rounded-lg border border-[var(--border-dev)]">
          <button
            onClick={() => onViewModeChange('editor')}
            className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md transition-all ${
              viewMode === 'editor'
                ? 'bg-[var(--bg-panel)] text-[var(--text-primary)] shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
            title="Editor Only"
          >
            <Edit3 size={13} />
            <span className="hidden md:inline">Editor</span>
          </button>
          <button
            onClick={() => onViewModeChange('split')}
            className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md transition-all ${
              viewMode === 'split'
                ? 'bg-[var(--bg-panel)] text-[var(--text-primary)] shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
            title="Split Mode (Editor & Preview)"
          >
            <Columns size={13} />
            <span className="hidden md:inline">Split</span>
          </button>
          <button
            onClick={() => onViewModeChange('preview')}
            className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md transition-all ${
              viewMode === 'preview'
                ? 'bg-[var(--bg-panel)] text-[var(--text-primary)] shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
            title="Preview Only"
          >
            <Eye size={13} />
            <span className="hidden md:inline">Preview</span>
          </button>
        </div>

        <div className="h-4 w-px bg-[var(--border-dev)] mx-0.5" />

        {/* Export Dropdown */}
        <div className="relative">
          <button
            onClick={() => setExportOpen(!exportOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-sidebar)] hover:bg-[var(--bg-panel)] border border-[var(--border-dev)] shadow-xs transition-colors"
            title="Export or Copy Document"
          >
            <Download size={13} />
            <span className="hidden sm:inline">Export</span>
            <ChevronDown size={12} />
          </button>

          {exportOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setExportOpen(false)} />
              <div className="absolute right-0 top-full mt-1.5 w-52 p-1.5 rounded-xl border border-[var(--border-dev)] bg-[var(--bg-panel)] shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <button
                  onClick={() => handleExportClick('download-md')}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-[var(--bg-sidebar)] transition-colors flex items-center justify-between text-[var(--text-primary)]"
                >
                  <span className="flex items-center gap-2">
                    <Download size={13} className="text-cyan-500" />
                    Download Markdown (.md)
                  </span>
                  {copiedAction === 'download-md' && <Check size={13} className="text-emerald-500" />}
                </button>
                <button
                  onClick={() => handleExportClick('copy-md')}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-[var(--bg-sidebar)] transition-colors flex items-center justify-between text-[var(--text-primary)]"
                >
                  <span className="flex items-center gap-2">
                    <Copy size={13} className="text-cyan-500" />
                    Copy Raw Markdown
                  </span>
                  {copiedAction === 'copy-md' && <Check size={13} className="text-emerald-500" />}
                </button>
                <button
                  onClick={() => handleExportClick('copy-html')}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-[var(--bg-sidebar)] transition-colors flex items-center justify-between text-[var(--text-primary)]"
                >
                  <span className="flex items-center gap-2">
                    <Code2 size={13} className="text-cyan-500" />
                    Copy Rendered HTML
                  </span>
                  {copiedAction === 'copy-html' && <Check size={13} className="text-emerald-500" />}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Clear document */}
        <button
          onClick={onClear}
          className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-colors"
          title="Clear Document"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
