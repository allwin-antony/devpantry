import { DurableObject } from "cloudflare:workers";

interface Env {
  SIGNALING_ROOM: DurableObjectNamespace<SignalingRoom>;
}

interface StoredUpdateRow {
  [key: string]: string;
  payload: string;
}

export class SignalingRoom extends DurableObject {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    this.ctx.blockConcurrencyWhile(async () => {
      this.ctx.storage.sql.exec(
        `CREATE TABLE IF NOT EXISTS updates (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          payload TEXT NOT NULL,
          created_at INTEGER NOT NULL
        );`
      );
    });
  }

  async fetch(request: Request): Promise<Response> {
    const upgradeHeader = request.headers.get('Upgrade');
    if (!upgradeHeader || upgradeHeader.toLowerCase() !== 'websocket') {
      return new Response('Expected Upgrade: websocket', { status: 426 });
    }

    const { 0: client, 1: server } = new WebSocketPair();
    const url = new URL(request.url);
    const peerId = url.searchParams.get('peerId') || crypto.randomUUID();

    // 1. Get all currently active peers (excluding the joining socket)
    const MAX_ROOM_PEERS = 25;
    const activeSockets = this.ctx.getWebSockets().filter(ws => ws.readyState === 1 && ws !== server);
    if (activeSockets.length >= MAX_ROOM_PEERS) {
      return new Response('Room capacity reached (max 25 peers)', { status: 429 });
    }

    this.ctx.acceptWebSocket(server);
    server.serializeAttachment({ id: peerId, msgCount: 0, windowStart: Date.now() });

    const existingPeerIds: string[] = [];
    for (const ws of activeSockets) {
      try {
        const info = ws.deserializeAttachment() as { id: string } | null;
        if (info && info.id) {
          existingPeerIds.push(info.id);
        }
      } catch {
        // Ignore attachment read errors
      }
    }

    // 2. Notify EXISTING active peers that this peer joined
    this.broadcast(JSON.stringify({ type: 'peer-joined', peerId }), server);

    // 3. Retrieve stored encrypted document updates from SQLite (if any)
    let storedUpdates: string[] = [];
    try {
      const cursor = this.ctx.storage.sql.exec<StoredUpdateRow>(
        "SELECT payload FROM updates ORDER BY id ASC"
      );
      storedUpdates = cursor.toArray().map(r => r.payload);
    } catch (e) {
      console.error('Failed to load stored updates from SQLite:', e);
    }

    // 4. Send initial room state to the newly connected peer
    try {
      server.send(JSON.stringify({
        type: 'room-init',
        peerId,
        peers: existingPeerIds,
        storedUpdates
      }));

      // Also send peer-joined for backwards compatibility with any cached sessions
      for (const existingId of existingPeerIds) {
        server.send(JSON.stringify({ type: 'peer-joined', peerId: existingId }));
      }
    } catch (e) {
      console.error('Failed to send room-init to new peer:', e);
    }

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }

  webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
    if (typeof message !== 'string') return;

    // Hard payload limit: max 64 KB per message to protect memory and storage
    const MAX_MESSAGE_BYTES = 64 * 1024;
    if (message.length > MAX_MESSAGE_BYTES) {
      return;
    }

    // Rate limiting: max 60 messages per second per peer
    const now = Date.now();
    try {
      const attachment = ws.deserializeAttachment() as { id: string; msgCount?: number; windowStart?: number } | null;
      let msgCount = attachment?.msgCount ?? 0;
      let windowStart = attachment?.windowStart ?? now;

      if (now - windowStart > 1000) {
        msgCount = 1;
        windowStart = now;
      } else {
        msgCount++;
        if (msgCount > 60) {
          // Drop message if burst exceeds rate limit
          return;
        }
      }
      ws.serializeAttachment({ id: attachment?.id ?? '', msgCount, windowStart });
    } catch {
      // Ignore attachment errors
    }

    try {
      const data = JSON.parse(message);
      
      // Ping / Pong heartbeat
      if (data.type === 'ping') {
        try {
          ws.send(JSON.stringify({ type: 'pong' }));
        } catch {
          // Ignore
        }
        return;
      }

      // Live delta sync update (encrypted Yjs update from a typing user)
      if (data.type === 'sync-update') {
        if (typeof data.payload === 'string') {
          // Check payload size individually as well
          if (data.payload.length > MAX_MESSAGE_BYTES) return;
          try {
            this.ctx.storage.sql.exec(
              "INSERT INTO updates (payload, created_at) VALUES (?, ?)",
              data.payload,
              Date.now()
            );

            // Bound SQLite update log to max 500 rows if snapshots aren't generated
            const countCursor = this.ctx.storage.sql.exec<{ count: number }>("SELECT COUNT(*) as count FROM updates");
            const totalRows = countCursor.toArray()[0]?.count ?? 0;
            if (totalRows > 500) {
              this.ctx.storage.sql.exec(
                "DELETE FROM updates WHERE id IN (SELECT id FROM updates ORDER BY id ASC LIMIT ?)",
                totalRows - 250
              );
            }
          } catch (e) {
            console.error('Failed to persist sync update to SQLite:', e);
          }
        }
        // Broadcast the update to all OTHER active peers
        this.broadcast(message, ws);
        return;
      }

      // Compact snapshot (full encrypted doc state).
      // Clears older deltas to keep SQLite storage minimal and fast.
      if (data.type === 'snapshot') {
        if (typeof data.payload === 'string') {
          if (data.payload.length > MAX_MESSAGE_BYTES * 4) return; // Snapshots capped at 256 KB
          try {
            this.ctx.storage.sql.exec("DELETE FROM updates;");
            this.ctx.storage.sql.exec(
              "INSERT INTO updates (payload, created_at) VALUES (?, ?)",
              data.payload,
              Date.now()
            );
          } catch (e) {
            console.error('Failed to persist snapshot to SQLite:', e);
          }
        }
        this.broadcast(message, ws);
        return;
      }

      // Directed message (e.g. sync-step-2 directly targeted to a peer)
      if (data.targetPeerId) {
        this.sendTo(data.targetPeerId, message);
        return;
      }

      // Broadcast all other messages (sync-step-1, awareness, auth challenges)
      this.broadcast(message, ws);
    } catch (e) {
      console.error('Failed to parse or route message:', e);
    }
  }

  webSocketClose(ws: WebSocket, _code: number, _reason: string, _wasClean: boolean) {
    this.handlePeerDisconnect(ws);
  }

  webSocketError(ws: WebSocket, _error: unknown) {
    this.handlePeerDisconnect(ws);
  }

  private handlePeerDisconnect(ws: WebSocket) {
    try {
      const info = ws.deserializeAttachment() as { id: string } | null;
      if (info && info.id) {
        this.broadcast(JSON.stringify({ type: 'peer-left', peerId: info.id }), ws);
      }
    } catch {
      // Ignore
    }
  }

  private broadcast(message: string, exclude?: WebSocket) {
    for (const ws of this.ctx.getWebSockets()) {
      if (ws !== exclude && ws.readyState === 1) { // 1 = WebSocket.OPEN
        try {
          ws.send(message);
        } catch {
          // Socket closed or degraded
        }
      }
    }
  }

  private sendTo(targetPeerId: string, message: string) {
    for (const ws of this.ctx.getWebSockets()) {
      if (ws.readyState === 1) {
        try {
          const info = ws.deserializeAttachment() as { id: string } | null;
          if (info && info.id === targetPeerId) {
            ws.send(message);
          }
        } catch {
          // Ignore
        }
      }
    }
  }
}
