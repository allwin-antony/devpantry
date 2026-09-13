"use client";

import React, { useState, useEffect } from 'react';
import { RoomCreate } from './RoomCreate';
import { RoomJoin } from './RoomJoin';
import { ConnectionStatus, ConnectionState } from './ConnectionStatus';
import { ParticipantList } from './ParticipantList';
import { YjsStateManager } from '@/lib/collaboration/yjs';
import { EncryptedWebRTCProvider } from '@/lib/collaboration/webrtc';
import { deriveKey } from '@/lib/collaboration/crypto';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Copy } from 'lucide-react';

const CollabEditor = dynamic(() => import('./CollabEditor').then(mod => mod.CollabEditor), { ssr: false });

type ViewState = 'SETUP' | 'EDITOR';

export function CollabClient() {
  const searchParams = useSearchParams();
  const roomIdParam = searchParams.get('room') || '';

  const [view, setView] = useState<ViewState>('SETUP');
  const [setupMode, setSetupMode] = useState<'CREATE' | 'JOIN'>(roomIdParam ? 'JOIN' : 'CREATE');
  const [error, setError] = useState<string>('');
  
  const [yjsManager, setYjsManager] = useState<YjsStateManager | null>(null);
  const [webrtcProvider, setWebrtcProvider] = useState<EncryptedWebRTCProvider | null>(null);
  
  const [connState, setConnState] = useState<ConnectionState>('INITIALIZING');
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      webrtcProvider?.disconnect();
      yjsManager?.destroy();
    };
  }, [webrtcProvider, yjsManager]);

  const handleCreateRoom = async (roomId: string, password: string) => {
    try {
      // In a real app, salt should be deterministic based on roomId to avoid needing to sync it,
      // or we sync it during a plaintext handshake. For MVP, we'll derive the key simply 
      // by using the roomId itself as the salt (padded/hashed) to ensure both sides get the same key.
      const encoder = new TextEncoder();
      const salt = encoder.encode(roomId.padEnd(16, '0').slice(0, 16));
      
      const key = await deriveKey(password, salt);
      initCollaboration(roomId, key);
      
      // Update URL so it's easy to share
      window.history.replaceState(null, '', `?room=${roomId}`);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleJoinRoom = async (roomId: string, password: string) => {
    try {
      const encoder = new TextEncoder();
      const salt = encoder.encode(roomId.padEnd(16, '0').slice(0, 16));
      
      const key = await deriveKey(password, salt);
      initCollaboration(roomId, key);
      
      // Update URL so it's easy to share
      window.history.replaceState(null, '', `?room=${roomId}`);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const initCollaboration = (roomId: string, key: CryptoKey) => {
    const manager = new YjsStateManager(roomId);
    
    // Generate an ephemeral peer ID for this session
    const localPeerId = crypto.randomUUID();
    
    const provider = new EncryptedWebRTCProvider(
      roomId,
      localPeerId,
      manager.doc,
      key
    );

    provider.onStateChange = (state) => {
      setConnState(state);
    };

    provider.onAuthFailed = () => {
      setError('❌ Unable to decrypt room. The password may be incorrect.');
      setView('SETUP');
      setSetupMode('JOIN');
      provider.disconnect();
      manager.destroy();
      setWebrtcProvider(null);
      setYjsManager(null);
    };

    setYjsManager(manager);
    setWebrtcProvider(provider);
    setView('EDITOR');
    
    provider.connect();
  };

  if (view === 'SETUP') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 bg-[var(--bg-app)]">
        {setupMode === 'CREATE' ? (
          <RoomCreate 
            onJoin={handleCreateRoom} 
            onSwitchToJoin={() => { setSetupMode('JOIN'); setError(''); }} 
          />
        ) : (
          <RoomJoin 
            initialRoomId={roomIdParam}
            onJoin={handleJoinRoom} 
            onSwitchToCreate={() => { setSetupMode('CREATE'); setError(''); }}
            error={error}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] max-h-screen bg-[var(--bg-app)]">
      <header className="flex flex-wrap items-center justify-between p-4 sm:px-6 border-b border-[var(--border-dev)] bg-[var(--bg-panel)] shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <h1 className="font-bold text-lg text-[var(--text-primary)] font-sans flex items-center gap-2">
              <span className="bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded text-xs font-mono tracking-wider border border-rose-500/20">BETA</span>
              P2P Collab Editor
            </h1>
          </div>
          <div className="hidden sm:block h-6 w-px bg-[var(--border-dev)] mx-2"></div>
          <ConnectionStatus state={connState} />
        </div>
        <div className="flex items-center gap-4">
          <ParticipantList count={connState === 'CONNECTED' ? 2 : 1} />
          <button 
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('Invite link copied to clipboard!');
            }}
            className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--text-secondary)] hover:text-cyan-500 transition-colors border border-[var(--border-dev)] hover:border-cyan-500/50 px-4 py-2 rounded-lg bg-[var(--bg-sidebar)] shadow-sm"
            title="Copy Invite Link"
          >
            <Copy size={14} />
            <span className="hidden sm:inline">Copy Invite Link</span>
          </button>
        </div>
      </header>
      <main className="flex-1 overflow-hidden p-4 sm:p-6 lg:p-8">
        <div className="w-full h-full flex flex-col">
          {yjsManager && webrtcProvider && (
            <CollabEditor ytext={yjsManager.text} provider={webrtcProvider} />
          )}
        </div>
      </main>
    </div>
  );
}
