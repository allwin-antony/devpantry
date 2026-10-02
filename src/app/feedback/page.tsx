"use client";

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ShieldCheck, Send, Star, CheckCircle, MessageSquare, Loader2 } from 'lucide-react';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mbglvbbq';

const RATING_LABELS: Record<number, string> = {
  1: 'Needs a lot of work',
  2: 'Below expectations',
  3: 'Gets the job done',
  4: 'Really good!',
  5: 'Absolutely love it ✨',
};

function FeedbackForm() {
  const searchParams = useSearchParams();
  const initialRating = parseInt(searchParams.get('rating') ?? '0', 10);
  const clampedInitial = isNaN(initialRating) || initialRating < 1 || initialRating > 5 ? 0 : initialRating;

  const [rating, setRating] = useState(clampedInitial);
  const [hovered, setHovered] = useState(0);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const activeRating = hovered || rating;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    const form = e.currentTarget;
    const data = new FormData(form);
    data.set('rating', rating > 0 ? `${rating} / 5 — ${RATING_LABELS[rating]}` : 'Not provided');

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        setStatus('success');
      } else {
        const json = await res.json().catch(() => ({}));
        setErrorMsg((json as any)?.error || 'Something went wrong. Please try again.');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-24 flex flex-col items-center text-center gap-6 font-sans animate-fade-in-up">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-emerald-500" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
            Thanks for the feedback!
          </h1>
          <p className="text-[var(--text-secondary)] text-base leading-relaxed max-w-sm">
            Every message is read by our team. You're directly shaping what we build next.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] font-mono bg-[var(--bg-panel)] border border-[var(--border-dev)] px-4 py-2 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Submitted securely · No cookies · No IP tracking</span>
        </div>
        <button
          onClick={() => setStatus('idle')}
          className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline underline-offset-4 transition-colors"
        >
          Submit another response
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-20 flex flex-col gap-10 font-sans">

      {/* Header */}
      <div className="flex flex-col gap-4 text-center items-center animate-fade-in-up">
        <div className="flex items-center gap-2 text-xs font-semibold text-rose-500 uppercase tracking-widest font-mono">
          <MessageSquare className="w-4 h-4" />
          <span>User Feedback</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-[var(--text-primary)] tracking-tight leading-tight">
          How's DevPantry<br />
          <span className="text-rose-500">working for you?</span>
        </h1>
        <p className="text-base text-[var(--text-secondary)] leading-relaxed max-w-md">
          We're a small team building tools we actually use. Your input directly shapes what we build next — no account needed, no tracking.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-[var(--bg-panel)] border border-[var(--border-dev)] rounded-2xl p-6 sm:p-10 shadow-sm relative overflow-hidden animate-fade-in-up-delay-1">
        {/* Decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-sm h-24 bg-rose-500/10 blur-[80px] pointer-events-none" />

        <form onSubmit={handleSubmit} className="flex flex-col gap-8 relative z-10">

          {/* Star Rating */}
          <div className="flex flex-col gap-3 items-center">
            <label className="text-sm font-semibold text-[var(--text-primary)] text-center">
              How would you rate your overall experience?
            </label>
            <div
              className="flex gap-2"
              onMouseLeave={() => setHovered(0)}
              role="group"
              aria-label="Star rating"
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  id={`star-${star}`}
                  aria-label={`Rate ${star} out of 5`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  className="transition-transform hover:scale-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded"
                >
                  <Star
                    className={`w-9 h-9 transition-colors duration-100 ${
                      star <= activeRating
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-[var(--border-dev)] fill-[var(--bg-input)]'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p
              className="text-sm text-[var(--text-secondary)] h-5 transition-opacity"
              style={{ opacity: activeRating > 0 ? 1 : 0 }}
            >
              {activeRating > 0 ? RATING_LABELS[activeRating] : ''}
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-[var(--border-dev)]" />

          {/* Category + Email row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="category" className="text-sm font-semibold text-[var(--text-primary)]">
                What's this about?
              </label>
              <select
                name="category"
                id="category"
                className="dev-input w-full p-3 rounded-lg text-sm bg-[var(--bg-input)]"
                required
              >
                <option value="Feature Request">💡 Feature Request</option>
                <option value="Bug Report">🐛 Bug Report</option>
                <option value="UX Improvement">✨ UX / Design</option>
                <option value="Performance">⚡ Performance</option>
                <option value="Other">💬 Other</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-semibold text-[var(--text-primary)]">
                Email{' '}
                <span className="text-[var(--text-muted)] font-normal">(optional)</span>
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="you@example.com"
                className="dev-input w-full p-3 rounded-lg text-sm bg-[var(--bg-input)]"
              />
            </div>
          </div>

          {/* Message */}
          <div className="flex flex-col gap-2">
            <label htmlFor="message" className="text-sm font-semibold text-[var(--text-primary)]">
              Your message
            </label>
            <textarea
              name="message"
              id="message"
              rows={5}
              placeholder="What's working well? What's frustrating? What tool should we build next?"
              className="dev-input w-full p-4 rounded-lg text-sm bg-[var(--bg-input)] resize-y min-h-[140px]"
              required
            />
          </div>

          {/* Error message */}
          {status === 'error' && (
            <p className="text-sm text-rose-500 bg-rose-500/10 border border-rose-500/20 px-4 py-3 rounded-lg font-mono">
              {errorMsg}
            </p>
          )}

          {/* Footer row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-[var(--border-dev)]">
            <div className="flex items-center gap-2 text-xs text-emerald-500 font-mono bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero-tracking · No cookies · No IP log</span>
            </div>

            <button
              type="submit"
              id="submit-feedback"
              disabled={status === 'submitting'}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[var(--text-primary)] text-[var(--bg-app)] hover:opacity-85 disabled:opacity-50 transition-opacity font-semibold py-2.5 px-8 rounded-lg text-sm shadow-sm"
            >
              {status === 'submitting' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending…</span>
                </>
              ) : (
                <>
                  <span>Send Feedback</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Privacy footnote */}
      <p className="text-center text-[11px] text-[var(--text-muted)] font-mono animate-fade-in-up-delay-2">
        Submitted via Formspree · No account required · Responses visible only to the DevPantry team
      </p>
    </div>
  );
}

export default function FeedbackPage() {
  return (
    <Suspense>
      <FeedbackForm />
    </Suspense>
  );
}
