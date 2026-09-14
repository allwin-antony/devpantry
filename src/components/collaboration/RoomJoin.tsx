import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { isValidRoomId } from '@/lib/collaboration/room';

interface RoomJoinProps {
  onJoin: (roomId: string, password: string) => void;
  onSwitchToCreate: () => void;
  error?: string;
  initialRoomId?: string;
}

export function RoomJoin({ onJoin, onSwitchToCreate, error, initialRoomId = '' }: RoomJoinProps) {
  const [roomId, setRoomId] = useState(initialRoomId);
  const [password, setPassword] = useState('');

  const handleJoin = () => {
    const upperRoomId = roomId.toUpperCase();
    if (!isValidRoomId(upperRoomId)) {
      alert("Invalid Room ID format. It should be 6 characters.");
      return;
    }
    if (password.trim() === '') {
      alert("Password is required.");
      return;
    }
    onJoin(upperRoomId, password);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleJoin();
  };

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md mx-auto border rounded-xl shadow-sm bg-card text-card-foreground">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="font-semibold leading-none tracking-tight">Join Collaboration Room</h3>
        <p className="text-sm text-muted-foreground">
          Enter the Room ID and Password provided by your colleague.
        </p>
      </div>
      <div className="p-6 pt-0 space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-md text-sm">
            {error}
          </div>
        )}
        <div className="space-y-2">
          <label className="text-sm font-medium">Room ID</label>
          <input 
            placeholder="e.g. K7P4X9" 
            value={roomId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRoomId(e.target.value.toUpperCase())}
            maxLength={6}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-mono tracking-widest text-lg"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <input 
            type="password" 
            placeholder="••••••••••" 
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>
      <div className="flex flex-col gap-3 p-6 pt-0">
        <button type="submit" className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 w-full">
          Join Room <ArrowRight className="ml-2" size={16} />
        </button>
        <button type="button" className="inline-flex items-center justify-center rounded-md text-sm font-medium underline-offset-4 hover:underline h-9 px-4 py-2 w-full text-muted-foreground" onClick={onSwitchToCreate}>
          Create a new room instead
        </button>
      </div>
    </form>
  );
}
