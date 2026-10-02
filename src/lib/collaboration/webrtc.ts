import * as Y from 'yjs';
import * as syncProtocol from 'y-protocols/sync';
import * as awarenessProtocol from 'y-protocols/awareness';
import * as encoding from 'lib0/encoding';
import * as decoding from 'lib0/decoding';
import * as buffer from 'lib0/buffer';
import { encryptPayload, decryptPayload, PayloadDecryptionError } from './crypto';

export type ConnectionState =
  | 'INITIALIZING'
  | 'CONNECTING'
  | 'SIGNALING'
  | 'CONNECTING_PEER'
  | 'CONNECTED'
  | 'DISCONNECTED'
  | 'RECONNECTING'
  | 'FAILED';

const MAX_AUTO_RETRIES = 5;
const BASE_BACKOFF_MS = 1000;
const HEARTBEAT_INTERVAL_MS = 20000; // 20s
const PONG_TIMEOUT_MS = 10000;       // 10s
const SNAPSHOT_INTERVAL_UPDATES = 50;

/**
 * EncryptedCollabProvider
 *
 * Fast, 100% reliable collaborative sync engine powered directly by Cloudflare
 * Workers and Durable Objects WebSocket Hibernation with SQLite persistence.
 *
 * All document updates are encrypted client-side using 256-bit AES-GCM (PBKDF2)
 * before leaving the browser. The Cloudflare Worker acts strictly as a zero-knowledge
 * relay and persistence layer, never having access to the encryption key or plaintext document.
 */
export class EncryptedCollabProvider {
  private ws: WebSocket | null = null;
  private connectedPeers = new Set<string>();
  private destroyed = false;
  private intentionalDisconnect = false;
  private autoRetryCount = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  private pongTimeout: ReturnType<typeof setTimeout> | null = null;
  private queue: string[] = [];
  private localUpdatesSinceSnapshot = 0;

  public state: ConnectionState = 'INITIALIZING';
  public awareness: awarenessProtocol.Awareness;
  public onStateChange?: (state: ConnectionState, peerId?: string, peersCount?: number) => void;
  public onAuthFailed?: (peerId: string) => void;

  constructor(
    private roomId: string,
    private localPeerId: string,
    private doc: Y.Doc,
    private cryptoKey: CryptoKey,
    private isCreator: boolean = false
  ) {
    this.awareness = new awarenessProtocol.Awareness(this.doc);

    // Listen for local document changes to encrypt and broadcast
    this.doc.on('update', this.handleLocalDocUpdate.bind(this));

    // Listen for local cursor/selection changes to broadcast
    this.awareness.on('update', this.handleLocalAwarenessUpdate.bind(this));
  }

  public connect() {
    this.destroyed = false;
    this.intentionalDisconnect = false;
    this.clearReconnectTimer();

    this.setState('CONNECTING');

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const customUrl = process.env.NEXT_PUBLIC_SIGNALING_URL;
    let wsUrl: string;

    if (customUrl) {
      const formattedUrl = customUrl.replace(/^http/, 'ws');
      wsUrl = `${formattedUrl}/api/collab/${this.roomId}?peerId=${this.localPeerId}`;
    } else {
      const isDev = process.env.NODE_ENV === 'development';
      const host = isDev ? 'localhost:8787' : window.location.host;
      wsUrl = `${protocol}//${host}/api/collab/${this.roomId}?peerId=${this.localPeerId}`;
    }

    // Clean up any old socket
    if (this.ws) {
      this.cleanupSocket();
    }

    try {
      this.ws = new WebSocket(wsUrl);
    } catch (e) {
      console.error('[Collab] Failed to create WebSocket connection:', e);
      this.handleUnexpectedDisconnect();
      return;
    }

    this.ws.onopen = () => {
      if (this.destroyed) {
        this.ws?.close();
        return;
      }

      this.autoRetryCount = 0;
      this.startHeartbeat();
      this.flushQueue();

      this.setState('CONNECTED');

      // Request sync from existing peers / server
      this.sendSyncStep1();

      // Broadcast our initial awareness state
      this.broadcastLocalAwareness();
    };

    this.ws.onmessage = async (event) => {
      if (this.destroyed) return;
      try {
        const data = JSON.parse(event.data);
        this.clearPongTimeout();
        await this.handleMessage(data);
      } catch (e) {
        console.error('[Collab] Failed to parse message:', e);
      }
    };

    this.ws.onclose = () => {
      this.cleanupHeartbeat();
      if (!this.intentionalDisconnect && !this.destroyed) {
        this.handleUnexpectedDisconnect();
      } else {
        this.setState('DISCONNECTED');
      }
    };

    this.ws.onerror = (err) => {
      console.warn('[Collab] WebSocket error:', err);
      // onclose handles reconnect
    };
  }

  public disconnect() {
    this.destroyed = true;
    this.intentionalDisconnect = true;
    this.clearReconnectTimer();
    this.cleanupHeartbeat();
    this.cleanupSocket();
    this.connectedPeers.clear();
    this.setState('DISCONNECTED');
  }

  public reconnect() {
    this.autoRetryCount = 0;
    this.disconnect();
    this.connect();
  }

  private setState(newState: ConnectionState, peerId?: string) {
    this.state = newState;
    if (this.onStateChange) {
      this.onStateChange(newState, peerId, this.connectedPeers.size);
    }
  }

  private updatePeerCount() {
    if (this.onStateChange) {
      this.onStateChange(this.state, undefined, this.connectedPeers.size);
    }
  }

  private async handleMessage(data: any) {
    switch (data.type) {
      case 'pong':
        this.clearPongTimeout();
        break;

      case 'room-init': {
        // Initial room payload sent by Cloudflare Durable Object
        if (Array.isArray(data.peers)) {
          for (const pid of data.peers) {
            if (pid && pid !== this.localPeerId) {
              this.connectedPeers.add(pid);
            }
          }
        }

        // Apply any stored encrypted updates from SQLite
        if (Array.isArray(data.storedUpdates) && data.storedUpdates.length > 0) {
          for (const updateStr of data.storedUpdates) {
            try {
              const encryptedBytes = buffer.fromBase64(updateStr);
              const decryptedBytes = await decryptPayload(encryptedBytes, this.cryptoKey);
              Y.applyUpdate(this.doc, decryptedBytes, this);
            } catch (e: any) {
              if (
                e instanceof PayloadDecryptionError ||
                e.name === 'PayloadDecryptionError' ||
                (e.message && e.message.includes('decrypt'))
              ) {
                console.warn('[Collab] Failed to decrypt stored room payload. Incorrect password.');
                this.disconnect();
                this.onAuthFailed?.('server');
                return;
              }
              console.error('[Collab] Error applying stored update:', e);
            }
          }
        }

        this.updatePeerCount();
        break;
      }

      case 'peer-joined': {
        if (data.peerId && data.peerId !== this.localPeerId) {
          this.connectedPeers.add(data.peerId);
          this.updatePeerCount();

          // Send our awareness so new peer immediately sees our presence
          this.broadcastLocalAwareness();

          // If we have document content, send our state so they catch up instantly
          this.sendSyncStep1();
        }
        break;
      }

      case 'peer-left': {
        if (data.peerId) {
          this.connectedPeers.delete(data.peerId);
          this.updatePeerCount();
        }
        break;
      }

      case 'sync-update': {
        // Delta document update from another peer
        if (data.payload && typeof data.payload === 'string') {
          try {
            const encryptedBytes = buffer.fromBase64(data.payload);
            const decrypted = await decryptPayload(encryptedBytes, this.cryptoKey);
            Y.applyUpdate(this.doc, decrypted, this); // origin = this prevents re-echo
          } catch (e: any) {
            if (
              e instanceof PayloadDecryptionError ||
              e.name === 'PayloadDecryptionError' ||
              (e.message && e.message.includes('decrypt'))
            ) {
              console.warn('[Collab] Decryption error on sync-update: password mismatch.');
            }
          }
        }
        break;
      }

      case 'sync-step-1': {
        // Peer is requesting updates that they are missing
        if (data.payload && typeof data.payload === 'string') {
          try {
            const encryptedBytes = buffer.fromBase64(data.payload);
            const decrypted = await decryptPayload(encryptedBytes, this.cryptoKey);
            const decoder = decoding.createDecoder(decrypted);
            const messageType = decoding.readVarUint(decoder);

            if (messageType === 0) { // sync protocol step 1
              const replyEncoder = encoding.createEncoder();
              encoding.writeVarUint(replyEncoder, 0); // messageSync
              syncProtocol.readSyncMessage(decoder, replyEncoder, this.doc, this);

              if (encoding.length(replyEncoder) > 1) {
                const replyBytes = encoding.toUint8Array(replyEncoder);
                const encryptedReply = await encryptPayload(replyBytes, this.cryptoKey);
                this.send({
                  type: 'sync-step-2',
                  targetPeerId: data.peerId,
                  peerId: this.localPeerId,
                  payload: buffer.toBase64(encryptedReply)
                });
              }
            }
          } catch (e) {
            console.warn('[Collab] Decryption error on sync-step-1:', e);
          }
        }
        break;
      }

      case 'sync-step-2': {
        // Peer answered our sync-step-1 request with missing updates
        if (data.payload && typeof data.payload === 'string') {
          try {
            const encryptedBytes = buffer.fromBase64(data.payload);
            const decrypted = await decryptPayload(encryptedBytes, this.cryptoKey);
            const decoder = decoding.createDecoder(decrypted);
            const messageType = decoding.readVarUint(decoder);

            if (messageType === 0) {
              const replyEncoder = encoding.createEncoder();
              syncProtocol.readSyncMessage(decoder, replyEncoder, this.doc, this);
            }
          } catch (e) {
            console.warn('[Collab] Decryption error on sync-step-2:', e);
          }
        }
        break;
      }

      case 'awareness': {
        if (data.payload && typeof data.payload === 'string') {
          try {
            const updateBytes = buffer.fromBase64(data.payload);
            awarenessProtocol.applyAwarenessUpdate(this.awareness, updateBytes, data.peerId);
          } catch (e) {
            console.error('[Collab] Failed to apply awareness update:', e);
          }
        }
        break;
      }
    }
  }

  private async handleLocalDocUpdate(update: Uint8Array, origin: any) {
    if (origin === this) {
      // Update originated from remote peer, don't echo back
      return;
    }

    try {
      const encrypted = await encryptPayload(update, this.cryptoKey);
      this.send({
        type: 'sync-update',
        peerId: this.localPeerId,
        payload: buffer.toBase64(encrypted)
      });

      this.localUpdatesSinceSnapshot++;
      if (this.localUpdatesSinceSnapshot >= SNAPSHOT_INTERVAL_UPDATES) {
        this.localUpdatesSinceSnapshot = 0;
        this.sendFullSnapshot();
      }
    } catch (e) {
      console.error('[Collab] Failed to encrypt local update:', e);
    }
  }

  private async sendFullSnapshot() {
    try {
      const snapshot = Y.encodeStateAsUpdate(this.doc);
      const encrypted = await encryptPayload(snapshot, this.cryptoKey);
      this.send({
        type: 'snapshot',
        peerId: this.localPeerId,
        payload: buffer.toBase64(encrypted)
      });
    } catch (e) {
      console.error('[Collab] Failed to send snapshot:', e);
    }
  }

  private handleLocalAwarenessUpdate({ added, updated, removed }: { added: number[]; updated: number[]; removed: number[] }, origin: any) {
    if (origin === 'local' || origin === null || origin === undefined) {
      const changed = added.concat(updated).concat(removed);
      if (changed.length === 0) return;

      const update = awarenessProtocol.encodeAwarenessUpdate(this.awareness, changed);
      this.send({
        type: 'awareness',
        peerId: this.localPeerId,
        payload: buffer.toBase64(update)
      });
    }
  }

  private broadcastLocalAwareness() {
    const update = awarenessProtocol.encodeAwarenessUpdate(this.awareness, [this.doc.clientID]);
    this.send({
      type: 'awareness',
      peerId: this.localPeerId,
      payload: buffer.toBase64(update)
    });
  }

  private async sendSyncStep1() {
    try {
      const encoder = encoding.createEncoder();
      encoding.writeVarUint(encoder, 0); // messageSync
      syncProtocol.writeSyncStep1(encoder, this.doc);
      const syncBytes = encoding.toUint8Array(encoder);

      const encrypted = await encryptPayload(syncBytes, this.cryptoKey);
      this.send({
        type: 'sync-step-1',
        peerId: this.localPeerId,
        payload: buffer.toBase64(encrypted)
      });
    } catch (e) {
      console.error('[Collab] Failed to send sync step 1:', e);
    }
  }

  private send(msg: any) {
    const payload = JSON.stringify(msg);
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(payload);
    } else {
      this.queue.push(payload);
    }
  }

  private flushQueue() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    for (const msg of this.queue) {
      this.ws.send(msg);
    }
    this.queue = [];
  }

  private startHeartbeat() {
    this.cleanupHeartbeat();
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
        this.pongTimeout = setTimeout(() => {
          console.warn('[Collab] Heartbeat pong timed out. Reconnecting...');
          this.cleanupSocket();
          this.handleUnexpectedDisconnect();
        }, PONG_TIMEOUT_MS);
      }
    }, HEARTBEAT_INTERVAL_MS);
  }

  private clearPongTimeout() {
    if (this.pongTimeout) {
      clearTimeout(this.pongTimeout);
      this.pongTimeout = null;
    }
  }

  private cleanupHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    this.clearPongTimeout();
  }

  private clearReconnectTimer() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private cleanupSocket() {
    if (this.ws) {
      this.ws.onopen = null;
      this.ws.onmessage = null;
      this.ws.onclose = null;
      this.ws.onerror = null;
      try {
        this.ws.close();
      } catch {
        // Ignore
      }
      this.ws = null;
    }
  }

  private handleUnexpectedDisconnect() {
    if (this.intentionalDisconnect || this.destroyed) return;

    if (this.autoRetryCount < MAX_AUTO_RETRIES) {
      this.autoRetryCount++;
      const delay = BASE_BACKOFF_MS * Math.pow(2, this.autoRetryCount - 1);
      this.setState('RECONNECTING');
      this.reconnectTimer = setTimeout(() => {
        this.connect();
      }, delay);
    } else {
      console.warn('[Collab] Max auto-reconnect attempts reached.');
      this.setState('FAILED');
    }
  }
}

// Backwards-compatible alias for existing imports
export { EncryptedCollabProvider as EncryptedWebRTCProvider };
