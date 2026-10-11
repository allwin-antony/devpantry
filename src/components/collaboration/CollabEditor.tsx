"use client";

import React, { useEffect, useState, useMemo, forwardRef, useImperativeHandle, useRef } from 'react';
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { yCollab, yUndoManagerKeymap } from 'y-codemirror.next';
import { markdown } from '@codemirror/lang-markdown';
import { EditorView, keymap } from '@codemirror/view';
import * as Y from 'yjs';
import { useTheme } from '@/components/ThemeProvider';

export interface CollabEditorHandle {
  undo: () => void;
  redo: () => void;
  insertFormatting: (prefix: string, suffix?: string, defaultText?: string) => void;
  insertContent: (content: string, replaceAll?: boolean) => void;
  clearContent: () => void;
  getText: () => string;
}

interface CollabEditorProps {
  ytext: Y.Text;
  provider: any;
  username?: string;
  color?: string;
  onContentChange?: (text: string) => void;
}

const BASIC_SETUP = {
  lineNumbers: true,
  highlightActiveLineGutter: true,
  highlightSpecialChars: true,
  history: false, // Yjs handles undoManager and history via keymap.of(yUndoManagerKeymap)
  drawSelection: true,
  dropCursor: true,
  allowMultipleSelections: true,
  indentOnInput: true,
  syntaxHighlighting: true,
  bracketMatching: true,
  closeBrackets: true,
  autocompletion: true,
  rectangularSelection: true,
  crosshairCursor: true,
  highlightActiveLine: true,
  highlightSelectionMatches: true,
  closeBracketsKeymap: true,
  searchKeymap: true,
  foldKeymap: true,
  completionKeymap: true,
  lintKeymap: true,
} as const;

export const CollabEditor = forwardRef<CollabEditorHandle, CollabEditorProps>(function CollabEditor(
  { ytext, provider, onContentChange },
  ref
) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const cmRef = useRef<ReactCodeMirrorRef>(null);

  // Stable Y.UndoManager instance tied to ytext
  const undoManager = useMemo(() => new Y.UndoManager(ytext), [ytext]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Expose undo, redo, and formatting methods to parent toolbar
  useImperativeHandle(ref, () => ({
    undo: () => {
      undoManager.undo();
      cmRef.current?.view?.focus();
    },

    redo: () => {
      undoManager.redo();
      cmRef.current?.view?.focus();
    },

    insertFormatting: (prefix: string, suffix: string = '', defaultText: string = '') => {
      const view = cmRef.current?.view;
      if (!view) return;

      const { state } = view;
      const { from, to } = state.selection.main;
      const selectedText = state.sliceDoc(from, to);

      undoManager.stopCapturing();

      if (selectedText.length > 0) {
        // Wrap existing selection
        const replacement = `${prefix}${selectedText}${suffix}`;
        view.dispatch({
          changes: { from, to, insert: replacement },
          selection: { anchor: from + prefix.length, head: from + prefix.length + selectedText.length },
        });
      } else {
        // Insert with placeholder text and highlight placeholder
        const insertText = defaultText || 'text';
        const replacement = `${prefix}${insertText}${suffix}`;
        view.dispatch({
          changes: { from, to, insert: replacement },
          selection: { anchor: from + prefix.length, head: from + prefix.length + insertText.length },
        });
      }

      undoManager.stopCapturing();
      view.focus();
    },

    insertContent: (content: string, replaceAll: boolean = false) => {
      const view = cmRef.current?.view;
      if (!view) return;

      const { state } = view;
      const from = replaceAll ? 0 : state.selection.main.from;
      const to = replaceAll ? state.doc.length : state.selection.main.to;

      // Stop capturing before and after to ensure template insertion is an atomic undo step
      undoManager.stopCapturing();
      view.dispatch({
        changes: { from, to, insert: content },
        selection: { anchor: from + content.length },
      });
      undoManager.stopCapturing();
      view.focus();
    },

    clearContent: () => {
      const view = cmRef.current?.view;
      if (!view) return;

      const docLength = view.state.doc.length;
      if (docLength > 0) {
        undoManager.stopCapturing();
        view.dispatch({
          changes: { from: 0, to: docLength, insert: '' },
          selection: { anchor: 0 },
        });
        undoManager.stopCapturing();
      }
      view.focus();
    },

    getText: () => {
      return ytext.toString();
    },
  }), [undoManager, ytext]);

  const customTheme = useMemo(() => {
    return EditorView.theme({
      '&': {
        height: '100%',
        backgroundColor: 'var(--bg-panel)',
        color: 'var(--text-primary)',
      },
      '.cm-scroller': {
        fontFamily: 'var(--font-mono, monospace)',
        lineHeight: '1.65',
      },
      '.cm-content': {
        caretColor: 'var(--text-primary)',
        padding: '16px 0',
      },
      '.cm-line': {
        padding: '0 16px',
      },
      '.cm-gutters': {
        backgroundColor: 'var(--bg-panel)',
        color: 'var(--text-muted)',
        borderRight: '1px solid var(--border-dev)',
      },
      '.cm-activeLineGutter': {
        backgroundColor: 'var(--bg-sidebar)',
      },
      '.cm-activeLine': {
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
      },
      // y-codemirror remote cursor and selection label styling
      '.cm-ySelection': {
        opacity: '0.3',
      },
      '.cm-ySelectionInfo': {
        position: 'absolute',
        top: '-1.25em',
        left: '-1px',
        fontSize: '10px',
        fontFamily: 'var(--font-sans, sans-serif)',
        fontWeight: '600',
        lineHeight: 'normal',
        userSelect: 'none',
        color: '#ffffff !important',
        padding: '1px 5px',
        borderRadius: '4px',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        zIndex: '20',
        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
      },
    });
  }, []);

  const extensions = useMemo(() => {
    return [
      yCollab(ytext, provider?.awareness || null, {
        undoManager,
      }),
      keymap.of(yUndoManagerKeymap),
      markdown(),
      EditorView.lineWrapping,
      customTheme,
    ];
  }, [ytext, provider?.awareness, undoManager, customTheme]);

  // Keep parent notified when document updates
  useEffect(() => {
    const handleUpdate = () => {
      onContentChange?.(ytext.toString());
    };
    ytext.observe(handleUpdate);
    onContentChange?.(ytext.toString());

    return () => {
      ytext.unobserve(handleUpdate);
    };
  }, [ytext, onContentChange]);

  if (!mounted) return null;

  return (
    <div className="flex-1 w-full h-full overflow-hidden bg-[var(--bg-panel)] focus-within:ring-1 focus-within:ring-cyan-500/30 transition-all">
      <CodeMirror
        ref={cmRef}
        height="100%"
        theme={theme === 'dark' ? 'dark' : 'light'}
        extensions={extensions}
        basicSetup={BASIC_SETUP}
        className="h-full text-[13px] sm:text-[14px] font-mono [&>.cm-editor]:h-full [&>.cm-editor]:outline-none"
      />
    </div>
  );
});
