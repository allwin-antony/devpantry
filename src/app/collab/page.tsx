import { Metadata } from 'next';
import { CollabWrapper } from '@/components/collaboration/CollabWrapper';

export const metadata: Metadata = {
  title: 'DevPantry Collaborative Editor',
  description: 'Zero-knowledge P2P real-time code collaboration.',
};

export default function CollabPage() {
  return (
    <div className="min-h-screen bg-background">
      <CollabWrapper />
    </div>
  );
}
