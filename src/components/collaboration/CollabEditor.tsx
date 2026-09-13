import React, { useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { yCollab } from 'y-codemirror.next';
import * as Y from 'yjs';
import { useTheme } from '@/components/ThemeProvider';

interface CollabEditorProps {
  ytext: Y.Text;
  provider: any; // We pass the WebRTC provider here for awareness, though yCollab mainly needs the text
  username?: string;
  color?: string;
}

export function CollabEditor({ ytext, provider, username = 'Anonymous', color = '#30bced' }: CollabEditorProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const extensions = [
    yCollab(ytext, provider.awareness || null, {
      undoManager: new Y.UndoManager(ytext)
    })
  ];

  if (!mounted) return null;

  return (
    <div className="flex-1 w-full h-full border border-[var(--border-dev)] rounded-xl overflow-hidden shadow-sm focus-within:border-[var(--border-focus)] transition-colors duration-300">
      <CodeMirror
        value={ytext.toString()}
        height="100%"
        theme={theme === 'dark' ? 'dark' : 'light'}
        extensions={extensions}
        className="h-full text-[14px] sm:text-[15px] font-mono [&>.cm-editor]:h-full [&>.cm-editor]:bg-[var(--bg-panel)] [&>.cm-editor]:outline-none"
      />
    </div>
  );
}
