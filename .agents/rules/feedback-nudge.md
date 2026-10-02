# Feedback Nudge Requirement (Mandatory for Tools)

## Principle
Whenever a new tool component is created or an existing one is modified, you must ensure it triggers the global feedback nudge upon successful user actions.

## Guidelines
1. **Utility Import**:
   - Always import the trigger utility:
     ```ts
     import { triggerFeedbackNudge } from '@/lib/feedbackNudge';
     ```
2. **Success Handlers**:
   - Call `triggerFeedbackNudge('<action-name>')` inside primary success handlers.
   - Examples of primary success handlers:
     - After generating or converting a file/document (e.g. `triggerFeedbackNudge('pdf-exam-kit-generate')`)
     - On file download (e.g. `triggerFeedbackNudge('bg-removal-download')`, `triggerFeedbackNudge('heic-download')`, `triggerFeedbackNudge('exif-stripper-download')`)
     - On copying generated payloads, codes, links, or tokens to clipboard (e.g. `triggerFeedbackNudge('jwt-copy')`, `triggerFeedbackNudge('chaos-data-copy')`, `triggerFeedbackNudge('collab-copy-invite')`)
3. **Non-Intrusive by Design**:
   - The underlying `FeedbackNudge` component handles cooldown periods (7 days), dismiss tracking, and non-intrusive positioning in localStorage. Calling `triggerFeedbackNudge` is always safe and idempotent.
