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
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
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
    <div className="flex flex-col h-screen max-h-screen">
      <header className="flex items-center justify-between p-4 border-b bg-background">
        <div className="flex items-center gap-4">
          <h1 className="font-bold text-lg">DevPantry Collab</h1>
          <ConnectionStatus state={connState} />
          <button 
            onClick={() => navigator.clipboard.writeText(window.location.href)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors ml-4 border px-3 py-1.5 rounded-full bg-secondary/50 hover:bg-secondary"
            title="Copy Invite Link"
          >
            <Copy size={14} />
            <span className="hidden sm:inline">Copy Invite Link</span>
          </button>
        </div>
        <div className="flex items-center gap-4">
          {/* For MVP we don't have exact participant count exposed yet, hardcode or calculate from provider state if we track it */}
          <ParticipantList count={connState === 'CONNECTED' ? 2 : 1} />
        </div>
      </header>
      <main className="flex-1 overflow-hidden p-4">
        {yjsManager && webrtcProvider && (
          <CollabEditor ytext={yjsManager.text} provider={webrtcProvider} />
        )}
      </main>
    </div>
  );
}
