import * as Y from 'yjs';
import { IndexeddbPersistence } from 'y-indexeddb';

export class YjsStateManager {
  public doc: Y.Doc;
  public text: Y.Text;
  private provider: IndexeddbPersistence;

  constructor(roomId: string) {
    this.doc = new Y.Doc();
    this.text = this.doc.getText('content');
    
    // Store data locally per room
    this.provider = new IndexeddbPersistence(roomId, this.doc);
    
    this.provider.on('synced', () => {
      console.log(`IndexedDB local state for room ${roomId} loaded.`);
    });
  }

  destroy() {
    this.provider.destroy();
    this.doc.destroy();
  }
}
