"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Star, X, ArrowRight, MessageSquare } from 'lucide-react';

const STORAGE_KEY = 'devpantry_nudge_dismissed_at';
const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const IDLE_TRIGGER_MS = 90_000; // 90s on a tool page

function shouldShow(): boolean {
  if (typeof window === 'undefined') return false;
  const dismissedAt = localStorage.getItem(STORAGE_KEY);
  if (!dismissedAt) return true;
  return Date.now() - parseInt(dismissedAt, 10) > COOLDOWN_MS;
}

function markDismissed() {
  localStorage.setItem(STORAGE_KEY, String(Date.now()));
}

const STAR_LABELS: Record<number, string> = {
  1: 'Needs work',
  2: 'Below expectations',
  3: 'Pretty decent',
  4: 'Really good!',
  5: 'Love it! ✨',
};

export function FeedbackNudge() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [hovered, setHovered] = useState(0);
  const [rating, setRating] = useState(0);
  const pathname = usePathname();
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(() => {
    if (dismissed || !shouldShow()) return;
    setVisible(true);
  }, [dismissed]);

  const dismiss = useCallback(() => {
    setVisible(false);
    setDismissed(true);
    markDismissed();
  }, []);

  // Listen for tool-success events dispatched by any tool
  useEffect(() => {
    const handler = () => show();
    window.addEventListener('devpantry:tool-success', handler);
    return () => window.removeEventListener('devpantry:tool-success', handler);
  }, [show]);

  // Idle trigger: show after 90s on a /tools/* page
  useEffect(() => {
    if (!pathname.startsWith('/tools')) return;

    idleTimer.current = setTimeout(() => {
      show();
    }, IDLE_TRIGGER_MS);

    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [pathname, show]);

  const handleRatingClick = (star: number) => {
    setRating(star);
    // Auto-navigate to /feedback with the rating pre-filled after a brief pause
    setTimeout(() => {
      window.location.href = `/feedback?rating=${star}`;
    }, 400);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Quick feedback"
      className="
        fixed bottom-6 right-4 sm:right-6 z-50
        w-[calc(100vw-2rem)] sm:w-80
        bg-[var(--bg-panel)] border border-[var(--border-dev)]
        rounded-2xl shadow-2xl shadow-black/40
        p-5 flex flex-col gap-4
        animate-fade-in-up
      "
    >
      {/* Dismiss */}
      <button
        id="nudge-dismiss"
        onClick={dismiss}
        aria-label="Dismiss feedback prompt"
        className="absolute top-3 right-3 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Header */}
      <div className="flex items-start gap-3 pr-5">
        <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
          <MessageSquare className="w-4 h-4 text-rose-500" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)] leading-snug">
            Enjoying DevPantry?
          </p>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Quick rating — takes 5 seconds.
          </p>
        </div>
      </div>

      {/* Stars */}
      <div className="flex flex-col gap-2">
        <div
          className="flex items-center gap-2 justify-center"
          onMouseLeave={() => setHovered(0)}
          role="group"
          aria-label="Star rating"
        >
          {[1, 2, 3, 4, 5].map((star) => {
            const active = star <= (hovered || rating);
            return (
              <button
                key={star}
                id={`nudge-star-${star}`}
                type="button"
                aria-label={`Rate ${star} out of 5`}
                onMouseEnter={() => setHovered(star)}
                onClick={() => handleRatingClick(star)}
                className="transition-transform hover:scale-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded"
              >
                <Star
                  className={`w-7 h-7 transition-colors duration-75 ${
                    active
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-[var(--border-dev)] fill-[var(--bg-input)]'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Label under stars */}
        <p
          className="text-center text-xs text-[var(--text-secondary)] h-4 transition-opacity"
          style={{ opacity: hovered || rating ? 1 : 0 }}
        >
          {STAR_LABELS[hovered || rating] ?? ''}
        </p>
      </div>

      {/* Detailed feedback link */}
      <div className="border-t border-[var(--border-dev)] pt-3 flex items-center justify-between">
        <span className="text-[10px] text-[var(--text-muted)] font-mono">
          No login · No tracking
        </span>
        <Link
          href="/feedback"
          onClick={dismiss}
          className="flex items-center gap-1 text-xs font-semibold text-rose-500 hover:text-rose-400 transition-colors"
        >
          <span>Leave a note</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
