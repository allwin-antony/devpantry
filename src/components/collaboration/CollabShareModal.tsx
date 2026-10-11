"use client";

import React, { useState, useEffect } from 'react';
import { Copy, Check, X, Shield, Lock, ExternalLink, Share2, Sparkles } from 'lucide-react';
import { triggerFeedbackNudge } from '@/lib/feedbackNudge';

interface CollabShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  password?: string;
}

export function CollabShareModal({ isOpen, onClose, roomId, password = '' }: CollabShareModalProps) {
  const [includePassword, setIncludePassword] = useState(true);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  if (!isOpen) return null;

  const basePath = `/tools/collab?room=${roomId}`;
  const fullUrl = includePassword && password
    ? `${origin}${basePath}#pwd=${encodeURIComponent(password)}`
    : `${origin}${basePath}`;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    triggerFeedbackNudge('collab-copy-invite');
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const inviteMessage = `🚀 Join my zero-knowledge collaborative editor on DevPantry!
Room ID: ${roomId}
${password ? `Password: ${password}\n` : ''}Direct Link: ${fullUrl}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl border border-[var(--border-dev)] bg-[var(--bg-panel)] shadow-2xl p-6 z-10 text-left animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-dev)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500">
              <Share2 size={16} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                Share Collaborative Session
              </h3>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Invite teammates to pair program and edit in real time
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-sidebar)] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="py-4 space-y-4">
          {/* Room ID row */}
          <div>
            <label className="text-xs font-medium text-[var(--text-secondary)] block mb-1.5">
              Room ID
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={roomId}
                className="flex-1 h-9 px-3 rounded-lg border border-[var(--border-dev)] bg-[var(--bg-app)] text-[var(--text-primary)] font-mono text-sm tracking-widest text-center select-all"
              />
              <button
                type="button"
                onClick={() => handleCopy(roomId, 'room-id')}
                className="h-9 px-3 rounded-lg border border-[var(--border-dev)] bg-[var(--bg-sidebar)] hover:bg-[var(--bg-panel)] text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5 transition-colors shadow-xs"
              >
                {copiedType === 'room-id' ? (
                  <>
                    <Check size={14} className="text-emerald-500" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 1-Click invite link row */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-[var(--text-secondary)]">
                Invite Link
              </label>
              {password && (
                <label className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includePassword}
                    onChange={(e) => setIncludePassword(e.target.checked)}
                    className="rounded border-[var(--border-dev)] text-cyan-500 focus:ring-cyan-500"
                  />
                  <span>Include password in link</span>
                </label>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={fullUrl}
                className="flex-1 h-9 px-3 rounded-lg border border-[var(--border-dev)] bg-[var(--bg-app)] text-[var(--text-primary)] text-xs font-mono truncate select-all"
              />
              <button
                type="button"
                onClick={() => handleCopy(fullUrl, 'link')}
                className="h-9 px-3.5 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
              >
                {copiedType === 'link' ? (
                  <>
                    <Check size={14} />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>

            {includePassword && password && (
              <p className="mt-1.5 text-[10px] text-emerald-500 dark:text-emerald-400 flex items-center gap-1">
                <Shield size={11} className="shrink-0" />
                Zero-knowledge safe: Passwords in URL hashes (#) are never sent to any server.
              </p>
            )}
          </div>

          {/* Quick template copy for Chat */}
          <div className="pt-2 border-t border-[var(--border-dev)]">
            <button
              type="button"
              onClick={() => handleCopy(inviteMessage, 'full-invite')}
              className="w-full py-2 px-3 rounded-xl border border-[var(--border-dev)] bg-[var(--bg-sidebar)] hover:bg-[var(--bg-panel)] text-xs font-medium text-[var(--text-primary)] flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              {copiedType === 'full-invite' ? (
                <>
                  <Check size={14} className="text-emerald-500" />
                  <span className="text-emerald-500 font-semibold">Invitation Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} className="text-amber-500" />
                  <span>Copy Formatted Invite (for Slack / Discord / Teams)</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="pt-3 border-t border-[var(--border-dev)] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-[var(--border-dev)] bg-[var(--bg-sidebar)] hover:bg-[var(--bg-panel)] text-xs font-medium text-[var(--text-secondary)] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
