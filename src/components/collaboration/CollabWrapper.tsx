"use client";

import dynamic from 'next/dynamic';

const CollabClient = dynamic(
  () => import('./CollabClient').then(mod => mod.CollabClient),
  { ssr: false, loading: () => <div className="flex w-full h-full min-h-[580px] items-center justify-center text-[var(--text-muted)] font-mono text-xs animate-pulse">Loading collaborative workspace...</div> }
);

export function CollabWrapper() {
  return <CollabClient />;
}
