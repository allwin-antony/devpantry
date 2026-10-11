"use client";

import React, { useState, useEffect, useRef } from 'react';
import { RoomCreate } from './RoomCreate';
import { RoomJoin } from './RoomJoin';
import { ConnectionStatus, ConnectionState } from './ConnectionStatus';
import { ParticipantList } from './ParticipantList';
import { CollabUserProfile } from './CollabUserProfile';
import { CollabToolbar, ViewMode } from './CollabToolbar';
import { MarkdownPreview } from './MarkdownPreview';
import { CollabShareModal } from './CollabShareModal';
import { CollabEditor, CollabEditorHandle } from './CollabEditor';
import { YjsStateManager } from '@/lib/collaboration/yjs';
import { EncryptedWebRTCProvider } from '@/lib/collaboration/webrtc';
import { deriveKey } from '@/lib/collaboration/crypto';
import { useSearchParams } from 'next/navigation';
import { Share2, RefreshCw, LogOut, ShieldCheck, FileText } from 'lucide-react';
import { triggerFeedbackNudge } from '@/lib/feedbackNudge';
import { marked } from 'marked';

type ViewState = 'SETUP' | 'EDITOR';

export function CollabClient() {
  const searchParams = useSearchParams();
  const roomIdParam = searchParams.get('room') || '';

  const [view, setView] = useState<ViewState>('SETUP');
  const [setupMode, setSetupMode] = useState<'CREATE' | 'JOIN'>(roomIdParam ? 'JOIN' : 'CREATE');
  const [error, setError] = useState<string>('');

  const [yjsManager, setYjsManager] = useState<YjsStateManager | null>(null);
  const [webrtcProvider, setWebrtcProvider] = useState<EncryptedWebRTCProvider | null>(null);

  const [connState, setConnState] = useState<ConnectionState>('INITIALIZING');
  const [participantCount, setParticipantCount] = useState<number>(1);
  const [activeRoomId, setActiveRoomId] = useState<string>('');
  const [activePassword, setActivePassword] = useState<string>('');

  // Workspace View Mode & Content state
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [docContent, setDocContent] = useState<string>('');
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Editor imperative ref
  const editorRef = useRef<CollabEditorHandle>(null);

  // Use refs so cleanup callbacks don't capture stale closure values
  const providerRef = useRef<EncryptedWebRTCProvider | null>(null);
  const managerRef = useRef<YjsStateManager | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      providerRef.current?.disconnect();
      managerRef.current?.destroy();
    };
  }, []);

  // Global Undo / Redo keydown listener so Ctrl+Z / Ctrl+Y works seamlessly even if focus shifted
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const isMod = e.ctrlKey || e.metaKey;
      if (!isMod) return;

      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.closest('.cm-editor') ||
          target.closest('.cm-content'))
      ) {
        // Let CodeMirror's internal keymap handle the keystroke directly to prevent duplicate undo
        return;
      }

      if (e.key === 'z' || e.key === 'Z') {
        e.preventDefault();
        if (e.shiftKey) {
          editorRef.current?.redo();
        } else {
          editorRef.current?.undo();
        }
      } else if (e.key === 'y' || e.key === 'Y') {
        e.preventDefault();
        editorRef.current?.redo();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);

  const handleCreateRoom = async (roomId: string, password: string) => {
    try {
      const encoder = new TextEncoder();
      const salt = encoder.encode(roomId.padEnd(16, '0').slice(0, 16));

      const key = await deriveKey(password, salt);
      sessionStorage.setItem(`collab-role-${roomId}`, 'creator');
      setActivePassword(password);
      initCollaboration(roomId, key, true);

      window.history.replaceState(null, '', `?room=${roomId}`);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleJoinRoom = async (roomId: string, password: string) => {
    try {
      const encoder = new TextEncoder();
      const salt = encoder.encode(roomId.padEnd(16, '0').slice(0, 16));

      const key = await deriveKey(password, salt);

      // Check if they previously created this room in this session
      const savedRole = sessionStorage.getItem(`collab-role-${roomId}`);
      const isCreator = savedRole === 'creator';
      if (!isCreator) {
        sessionStorage.setItem(`collab-role-${roomId}`, 'participant');
      }

      setActivePassword(password);
      initCollaboration(roomId, key, isCreator);

      window.history.replaceState(null, '', `?room=${roomId}`);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const initCollaboration = (roomId: string, key: CryptoKey, isCreator: boolean) => {
    // Clean up any existing session first
    providerRef.current?.disconnect();
    managerRef.current?.destroy();

    const manager = new YjsStateManager(roomId);

    // Generate an ephemeral peer ID for this session
    const localPeerId = crypto.randomUUID();

    const provider = new EncryptedWebRTCProvider(
      roomId,
      localPeerId,
      manager.doc,
      key,
      isCreator
    );

    provider.onStateChange = (state, _peerId, count) => {
      setConnState(state);
      if (count !== undefined) {
        setParticipantCount(count + 1); // +1 for self
      }
    };

    provider.onAuthFailed = (_failedPeerId: string) => {
      setError('❌ Unable to decrypt room. The password may be incorrect.');
      setView('SETUP');
      setSetupMode('JOIN');
      provider.disconnect();
      manager.destroy();
      providerRef.current = null;
      managerRef.current = null;
      setWebrtcProvider(null);
      setYjsManager(null);
    };

    providerRef.current = provider;
    managerRef.current = manager;
    setYjsManager(manager);
    setWebrtcProvider(provider);
    setActiveRoomId(roomId);
    setView('EDITOR');

    provider.connect();
  };

  const handleLeaveRoom = () => {
    if (!window.confirm('Are you sure you want to leave this collaboration session?')) {
      return;
    }

    providerRef.current?.disconnect();
    managerRef.current?.destroy();
    providerRef.current = null;
    managerRef.current = null;
    setWebrtcProvider(null);
    setYjsManager(null);
    setActiveRoomId('');
    setActivePassword('');
    setDocContent('');
    setView('SETUP');

    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  const handleExport = (type: 'download-md' | 'copy-md' | 'copy-html') => {
    const text = docContent || yjsManager?.text.toString() || '';

    if (type === 'download-md') {
      const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeRoomId || 'collab'}-document.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      triggerFeedbackNudge('collab-download-markdown');
    } else if (type === 'copy-md') {
      navigator.clipboard.writeText(text);
      triggerFeedbackNudge('collab-copy-markdown');
    } else if (type === 'copy-html') {
      try {
        const html = marked.parse(text, { gfm: true, breaks: true, async: false }) as string;
        navigator.clipboard.writeText(html);
        triggerFeedbackNudge('collab-copy-html');
      } catch (e) {
        console.error('Failed to parse html:', e);
      }
    }
  };

  const handleClear = () => {
    if (window.confirm('Clear all document content for everyone in this room? This action cannot be undone.')) {
      editorRef.current?.clearContent();
      triggerFeedbackNudge('collab-clear-document');
    }
  };

  if (view === 'SETUP') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 bg-[var(--bg-app)]">
        {setupMode === 'CREATE' ? (
          <RoomCreate
            onJoin={handleCreateRoom}
            onSwitchToJoin={() => { setSetupMode('JOIN'); setError(''); }}
          />
        ) : (
          <RoomJoin
            initialRoomId={roomIdParam}
            onJoin={handleJoinRoom}
            onSwitchToCreate={() => { setSetupMode('CREATE'); setError(''); }}
            error={error}
          />
        )}
      </div>
    );
  }

  const handleRetry = () => {
    if (webrtcProvider) {
      setConnState('RECONNECTING');
      webrtcProvider.reconnect();
    }
  };

  const showRetryButton = connState === 'DISCONNECTED' || connState === 'FAILED';

  // Compute document statistics
  const trimmed = docContent.trim();
  const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;
  const charCount = docContent.length;
  const lineCount = docContent ? docContent.split('\n').length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] max-h-screen bg-[var(--bg-app)]">
      {/* Top Header */}
      <header className="flex flex-wrap items-center justify-between p-3 sm:px-6 border-b border-[var(--border-dev)] bg-[var(--bg-panel)] shadow-xs gap-3">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <h1 className="font-bold text-base sm:text-lg text-[var(--text-primary)] font-sans flex items-center gap-2">
              <span className="bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded text-xs font-mono tracking-wider border border-rose-500/20">
                LIVE
              </span>
              Collab Studio
              <span className="hidden sm:inline ml-2 text-xs text-[var(--text-secondary)] font-mono font-normal opacity-80 bg-[var(--bg-sidebar)] px-2 py-0.5 rounded border border-[var(--border-dev)]">
                {activeRoomId && `Room: ${activeRoomId}`}
              </span>
            </h1>
          </div>
          <div className="hidden sm:block h-5 w-px bg-[var(--border-dev)] mx-1" />
          <ConnectionStatus state={connState} />
          {showRetryButton && (
            <button
              onClick={handleRetry}
              className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-500 hover:text-amber-400 transition-colors border border-amber-500/30 hover:border-amber-400/50 px-2.5 py-1 rounded-full bg-amber-500/10 shadow-xs"
              title="Retry Connection"
            >
              <RefreshCw size={13} />
              <span>Retry</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* User profile with cursor/avatar color picker */}
          {webrtcProvider && (
            <CollabUserProfile provider={webrtcProvider} />
          )}

          {/* Active participants list & avatars */}
          <ParticipantList count={participantCount} provider={webrtcProvider} />

          {/* Share Modal Trigger */}
          <button
            onClick={() => setShareModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 transition-colors border border-cyan-500/30 hover:border-cyan-500/60 px-3 py-1.5 rounded-lg bg-cyan-500/10 shadow-xs"
            title="Share Room & Invite Collaborators"
          >
            <Share2 size={14} />
            <span className="hidden sm:inline">Share</span>
          </button>

          {/* Leave room */}
          <button
            onClick={handleLeaveRoom}
            className="p-1.5 text-[var(--text-secondary)] hover:text-rose-500 hover:bg-rose-500/10 rounded-lg border border-[var(--border-dev)] transition-colors shadow-xs"
            title="Leave Session"
          >
            <LogOut size={15} />
          </button>
        </div>
      </header>

      {/* Formatting & Productivity Toolbar */}
      <CollabToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onInsertFormatting={(prefix, suffix, defaultText) => {
          editorRef.current?.insertFormatting(prefix, suffix, defaultText);
        }}
        onInsertTemplate={(templateContent) => {
          if (
            docContent.trim().length > 0 &&
            !window.confirm('Insert template and replace current document? You can undo this anytime with Ctrl+Z.')
          ) {
            return;
          }
          editorRef.current?.insertContent(templateContent, true);
        }}
        onExport={handleExport}
        onClear={handleClear}
        onUndo={() => editorRef.current?.undo()}
        onRedo={() => editorRef.current?.redo()}
      />

      {/* Main Workspace (Editor + Live Preview) */}
      <main className="flex-1 overflow-hidden relative">
        <div className="w-full h-full">
          {yjsManager && webrtcProvider && (
            <div className="w-full h-full flex flex-col md:flex-row overflow-hidden">
              {/* Editor Pane */}
              <div
                className={`h-full overflow-hidden transition-all duration-200 ${
                  viewMode === 'split'
                    ? 'w-full md:w-1/2 border-b md:border-b-0 md:border-r border-[var(--border-dev)]'
                    : viewMode === 'editor'
                    ? 'w-full'
                    : 'hidden'
                }`}
              >
                <CollabEditor
                  ref={editorRef}
                  ytext={yjsManager.text}
                  provider={webrtcProvider}
                  onContentChange={setDocContent}
                />
              </div>

              {/* Preview Pane */}
              <div
                className={`h-full overflow-hidden transition-all duration-200 ${
                  viewMode === 'split'
                    ? 'w-full md:w-1/2'
                    : viewMode === 'preview'
                    ? 'w-full'
                    : 'hidden'
                }`}
              >
                <MarkdownPreview content={docContent} />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Document Stats & Security Status Footer */}
      <footer className="flex flex-wrap items-center justify-between px-4 py-1.5 border-t border-[var(--border-dev)] bg-[var(--bg-panel)] text-[11px] text-[var(--text-secondary)] font-mono select-none">
        <div className="flex items-center gap-2">
          <ShieldCheck size={13} className="text-emerald-500" />
          <span>Zero-Knowledge AES-GCM Encrypted · Pure P2P Sync</span>
        </div>
        <div className="flex items-center gap-3">
          <span>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
          <span>·</span>
          <span>{charCount} chars</span>
          <span>·</span>
          <span>{lineCount} lines</span>
          <span>·</span>
          <span>~{readingTime} min read</span>
        </div>
      </footer>

      {/* Share Modal Dialog */}
      <CollabShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        roomId={activeRoomId}
        password={activePassword}
      />
    </div>
  );
}
