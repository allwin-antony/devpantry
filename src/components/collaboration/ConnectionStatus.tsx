import React from 'react';
import { AlertCircle, CheckCircle2, Loader2, WifiOff } from 'lucide-react';

export type ConnectionState = 'INITIALIZING' | 'CONNECTING' | 'SIGNALING' | 'CONNECTING_PEER' | 'CONNECTED' | 'DISCONNECTED' | 'FAILED';

export function ConnectionStatus({ state }: { state: ConnectionState }) {
  if (state === 'CONNECTED') {
    return (
      <div className="flex items-center text-green-500 text-sm gap-2 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
        <CheckCircle2 size={16} />
        <span>P2P Connected</span>
      </div>
    );
  }

  if (state === 'FAILED' || state === 'DISCONNECTED') {
    return (
      <div className="flex items-center text-red-500 text-sm gap-2 bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20">
        <WifiOff size={16} />
        <span>Disconnected</span>
      </div>
    );
  }

  if (state === 'SIGNALING') {
    return (
      <div className="flex items-center text-amber-500 text-sm gap-2 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
        <Loader2 size={16} className="animate-spin" />
        <span>Waiting for peers...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center text-blue-500 text-sm gap-2 bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20">
      <Loader2 size={16} className="animate-spin" />
      <span>Connecting...</span>
    </div>
  );
}
