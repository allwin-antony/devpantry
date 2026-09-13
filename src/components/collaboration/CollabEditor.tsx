import React, { useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { yCollab } from 'y-codemirror.next';
import * as Y from 'yjs';
import { useTheme } from 'next-themes';

interface CollabEditorProps {
  ytext: Y.Text;
  provider: any; // We pass the WebRTC provider here for awareness, though yCollab mainly needs the text
  username?: string;
  color?: string;
}

export function CollabEditor({ ytext, provider, username = 'Anonymous', color = '#30bced' }: CollabEditorProps) {
  const { resolvedTheme } = useTheme();
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
    <div className="flex-1 w-full h-full border rounded-md overflow-hidden bg-background">
      <CodeMirror
        value={ytext.toString()}
        height="100%"
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
        extensions={extensions}
        className="h-full text-base"
      />
    </div>
  );
}
