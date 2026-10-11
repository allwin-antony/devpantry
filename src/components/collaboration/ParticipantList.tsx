"use client";

import React, { useState, useEffect } from 'react';
import { Users, Circle } from 'lucide-react';

interface ParticipantInfo {
  clientId: number;
  name: string;
  color: string;
  isSelf: boolean;
}

interface ParticipantListProps {
  count: number;
  provider?: any;
}

export function ParticipantList({ count, provider }: ParticipantListProps) {
  const [participants, setParticipants] = useState<ParticipantInfo[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!provider?.awareness) return;

    const awareness = provider.awareness;

    const updateParticipants = () => {
      const states = awareness.getStates();
      const list: ParticipantInfo[] = [];
      const localClientId = awareness.doc?.clientID;

      states.forEach((state: any, clientId: number) => {
        const user = state?.user || {};
        list.push({
          clientId,
          name: user.name || `User ${clientId.toString().slice(-4)}`,
          color: user.color || '#06b6d4',
          isSelf: clientId === localClientId,
        });
      });

      // Sort so local user is first
      list.sort((a, b) => (b.isSelf ? 1 : 0) - (a.isSelf ? 1 : 0));
      setParticipants(list);
    };

    updateParticipants();
    awareness.on('change', updateParticipants);

    return () => {
      awareness.off('change', updateParticipants);
    };
  }, [provider]);

  const displayCount = participants.length > 0 ? participants.length : count;

  const getInitials = (str: string) => {
    const parts = str.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return str.slice(0, 2).toUpperCase() || 'U';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 text-xs text-[var(--text-secondary)] bg-[var(--bg-panel)] hover:bg-[var(--bg-sidebar)] px-2.5 py-1.5 rounded-lg border border-[var(--border-dev)] shadow-sm transition-colors group"
        title="View connected collaborators"
      >
        {/* Avatars preview (up to 3) */}
        {participants.length > 0 ? (
          <div className="flex -space-x-1.5 items-center">
            {participants.slice(0, 3).map((p) => (
              <span
                key={p.clientId}
                className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white ring-2 ring-[var(--bg-panel)] shadow-xs"
                style={{ backgroundColor: p.color }}
                title={`${p.name}${p.isSelf ? ' (You)' : ''}`}
              >
                {getInitials(p.name)}
              </span>
            ))}
            {participants.length > 3 && (
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-semibold text-[var(--text-muted)] bg-[var(--bg-sidebar)] ring-2 ring-[var(--bg-panel)]">
                +{participants.length - 3}
              </span>
            )}
          </div>
        ) : (
          <Users size={14} className="text-cyan-500" />
        )}

        <span className="font-medium text-[var(--text-primary)]">
          {displayCount} {displayCount === 1 ? 'Online' : 'Online'}
        </span>
      </button>

      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-64 p-3 rounded-xl border border-[var(--border-dev)] bg-[var(--bg-panel)] shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--border-dev)]">
              <span className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                <Users size={13} className="text-cyan-500" />
                Active Collaborators ({displayCount})
              </span>
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto">
              {participants.length > 0 ? (
                participants.map((p) => (
                  <div
                    key={p.clientId}
                    className="flex items-center justify-between px-2 py-1.5 rounded-lg text-xs hover:bg-[var(--bg-sidebar)] transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0 shadow-xs"
                        style={{ backgroundColor: p.color }}
                      >
                        {getInitials(p.name)}
                      </span>
                      <span className="truncate text-[var(--text-primary)] font-medium">
                        {p.name}
                      </span>
                    </div>
                    {p.isSelf ? (
                      <span className="text-[10px] font-mono font-medium text-cyan-500 px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                        You
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-500 font-mono">
                        <Circle size={6} fill="currentColor" />
                        Live
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-xs text-[var(--text-muted)] py-2 text-center">
                  {displayCount} connected peer(s)
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
