import React, { useState } from 'react';
import { generateRoomId } from '@/lib/collaboration/room';
import { Copy, Plus, ArrowRight } from 'lucide-react';

interface RoomCreateProps {
  onJoin: (roomId: string, password: string) => void;
  onSwitchToJoin: () => void;
}

export function RoomCreate({ onJoin, onSwitchToJoin }: RoomCreateProps) {
  const [roomId, setRoomId] = useState(generateRoomId());
  const [password, setPassword] = useState('');

  const handleCreate = () => {
    if (password.trim() === '') {
      alert("Password is required to secure the room.");
      return;
    }
    onJoin(roomId, password);
  };

  return (
    <div className="w-full max-w-md mx-auto border rounded-xl shadow-sm bg-card text-card-foreground">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="font-semibold leading-none tracking-tight">Create Collaboration Room</h3>
        <p className="text-sm text-muted-foreground">
          Start a zero-knowledge P2P session. The document never touches our servers.
        </p>
      </div>
      <div className="p-6 pt-0 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Room ID</label>
          <div className="flex items-center gap-2">
            <input value={roomId} readOnly className="flex h-9 w-full rounded-md border border-input bg-muted px-3 py-1 text-sm shadow-sm font-mono text-center tracking-widest text-lg" />
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 w-9" onClick={() => setRoomId(generateRoomId())}>
              <Plus size={16} />
            </button>
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 w-9" onClick={() => navigator.clipboard.writeText(roomId)}>
              <Copy size={16} />
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <input 
            type="password" 
            placeholder="Choose a strong password" 
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
          <p className="text-xs text-muted-foreground">
            Share this Room ID and Password with your collaborators.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-3 p-6 pt-0">
        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 w-full" onClick={handleCreate}>
          Create Room <ArrowRight className="ml-2" size={16} />
        </button>
        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium underline-offset-4 hover:underline h-9 px-4 py-2 w-full text-muted-foreground" onClick={onSwitchToJoin}>
          Join an existing room instead
        </button>
      </div>
    </div>
  );
}
