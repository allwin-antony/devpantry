import type { Metadata } from 'next';
import FeedbackClient from '@/components/clients/FeedbackClient';

export const metadata: Metadata = {
  title: 'Feedback — Help Improve DevPantry',
  description: 'Report a broken tool, suggest an improvement, or share how DevPantry fits your development workflow.',
  alternates: { canonical: 'https://devpantry.com/feedback' },
  openGraph: {
    title: 'Help Improve DevPantry',
    description: 'Report a broken tool or suggest an improvement.',
    url: 'https://devpantry.com/feedback',
  },
};

export default function FeedbackPage() {
  return <>
    <header className="max-w-2xl mx-auto w-full px-4 sm:px-6 pt-10 pb-8 text-center">
      <h1 className="text-3xl sm:text-4xl font-bold">How is DevPantry working for you?</h1>
      <p className="mt-4 text-[var(--text-secondary)]">Report a problem or suggest the next improvement. Include the tool name and what you were trying to do.</p>
    </header>
    <FeedbackClient />
  </>;
}
