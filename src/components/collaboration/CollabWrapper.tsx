"use client";

import dynamic from 'next/dynamic';

const CollabClient = dynamic(
  () => import('./CollabClient').then(mod => mod.CollabClient),
  { ssr: false, loading: () => <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground animate-pulse">Loading collaborative workspace...</div> }
);

export function CollabWrapper() {
  return <CollabClient />;
}
