/**
 * feedbackNudge.ts
 *
 * Lightweight utility for dispatching non-intrusive feedback nudge triggers.
 * Import `triggerFeedbackNudge` in any tool component after a successful action
 * (file downloaded, conversion complete, etc.) to signal the global FeedbackNudge
 * component to appear.
 *
 * The nudge component itself enforces a 7-day cooldown so this is safe to call
 * freely — it will silently no-op if the user has already seen it recently.
 */
export function triggerFeedbackNudge(source?: string) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent('devpantry:tool-success', { detail: { source } })
  );
}
