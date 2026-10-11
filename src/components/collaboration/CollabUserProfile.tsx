"use client";

import React, { useState, useEffect } from 'react';
import { User, Palette, Check } from 'lucide-react';

export const AVATAR_COLORS = [
  { name: 'Rose', hex: '#f43f5e' },
  { name: 'Indigo', hex: '#6366f1' },
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Amber', hex: '#f59e0b' },
  { name: 'Cyan', hex: '#06b6d4' },
  { name: 'Purple', hex: '#a855f7' },
  { name: 'Sky', hex: '#0ea5e9' },
  { name: 'Orange', hex: '#f97316' },
];

interface CollabUserProfileProps {
  provider: any;
  onProfileChange?: (name: string, color: string) => void;
}

export function CollabUserProfile({ provider, onProfileChange }: CollabUserProfileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('Anonymous');
  const [color, setColor] = useState('#06b6d4');

  // Load profile from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let savedName = localStorage.getItem('devpantry-collab-name');
    let savedColor = localStorage.getItem('devpantry-collab-color');

    if (!savedName) {
      const randomNum = Math.floor(100 + Math.random() * 900);
      savedName = `Developer ${randomNum}`;
      localStorage.setItem('devpantry-collab-name', savedName);
    }

    if (!savedColor) {
      const randomColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)].hex;
      savedColor = randomColor;
      localStorage.setItem('devpantry-collab-color', savedColor);
    }

    setName(savedName);
    setColor(savedColor);

    if (provider?.awareness) {
      provider.awareness.setLocalStateField('user', {
        name: savedName,
        color: savedColor,
      });
    }

    onProfileChange?.(savedName, savedColor);
  }, [provider]);

  const handleSave = (newName: string, newColor: string) => {
    setName(newName);
    setColor(newColor);
    localStorage.setItem('devpantry-collab-name', newName);
    localStorage.setItem('devpantry-collab-color', newColor);

    if (provider?.awareness) {
      provider.awareness.setLocalStateField('user', {
        name: newName,
        color: newColor,
      });
    }

    onProfileChange?.(newName, newColor);
  };

  const getInitials = (str: string) => {
    const parts = str.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return str.slice(0, 2).toUpperCase() || 'ME';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-[var(--border-dev)] bg-[var(--bg-panel)] hover:bg-[var(--bg-sidebar)] transition-all shadow-sm group"
        title="Edit your collaborator profile"
      >
        <span
          className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm ring-1 ring-black/10 transition-transform group-hover:scale-105"
          style={{ backgroundColor: color }}
        >
          {getInitials(name)}
        </span>
        <span className="text-xs font-medium text-[var(--text-primary)] max-w-[100px] truncate">
          {name}
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-72 p-4 rounded-xl border border-[var(--border-dev)] bg-[var(--bg-panel)] shadow-xl z-50 text-left animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border-dev)]">
              <span className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                <User size={14} className="text-cyan-500" />
                Collaborator Profile
              </span>
              <span className="text-[10px] text-[var(--text-muted)] font-mono">
                Visible to room
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-[var(--text-secondary)] block mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  value={name}
                  maxLength={24}
                  onChange={(e) => handleSave(e.target.value, color)}
                  className="w-full h-8 px-2.5 text-xs rounded-lg border border-[var(--border-dev)] bg-[var(--bg-app)] text-[var(--text-primary)] focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--text-secondary)] flex items-center gap-1.5 mb-2">
                  <Palette size={13} />
                  Cursor & Avatar Color
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {AVATAR_COLORS.map((c) => {
                    const isSelected = color === c.hex;
                    return (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => handleSave(name, c.hex)}
                        className={`h-7 rounded-lg flex items-center justify-center transition-all ${
                          isSelected
                            ? 'ring-2 ring-offset-2 ring-cyan-500 scale-105'
                            : 'hover:scale-105 opacity-80 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      >
                        {isSelected && <Check size={12} className="text-white drop-shadow" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[var(--border-dev)] flex justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 text-xs font-medium rounded-md bg-cyan-500 hover:bg-cyan-600 text-white transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
