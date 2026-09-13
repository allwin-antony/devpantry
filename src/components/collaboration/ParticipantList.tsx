import React from 'react';
import { Users } from 'lucide-react';

interface ParticipantListProps {
  count: number;
}

export function ParticipantList({ count }: ParticipantListProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border">
      <Users size={16} />
      <span>{count} {count === 1 ? 'Participant' : 'Participants'}</span>
    </div>
  );
}
