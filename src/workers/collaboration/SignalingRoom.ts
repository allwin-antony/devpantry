import { DurableObject } from "cloudflare:workers";

interface Env {
  SIGNALING_ROOM: DurableObjectNamespace<SignalingRoom>;
}

export class SignalingRoom extends DurableObject {
  private connections: Map<WebSocket, { id: string }>;

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    this.connections = new Map();
  }

  async fetch(request: Request): Promise<Response> {
    const upgradeHeader = request.headers.get('Upgrade');
    if (!upgradeHeader || upgradeHeader !== 'websocket') {
      return new Response('Expected Upgrade: websocket', { status: 426 });
    }

    const { 0: client, 1: server } = new WebSocketPair();
    const url = new URL(request.url);
    const peerId = url.searchParams.get('peerId');

    if (!peerId) {
      return new Response('Missing peerId', { status: 400 });
    }

    this.ctx.acceptWebSocket(server);
    this.connections.set(server, { id: peerId });

    // Notify others that a new peer joined
    this.broadcast(JSON.stringify({ type: 'peer-joined', peerId }), server);

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }

  webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
    if (typeof message !== 'string') return;

    try {
      const data = JSON.parse(message);
      
      // Handle Ping/Pong
      if (data.type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong' }));
        return;
      }

      // Route directed messages (SDP, ICE)
      if (data.targetPeerId) {
        this.sendTo(data.targetPeerId, message);
      } else {
        // Broadcast to everyone else
        this.broadcast(message, ws);
      }
    } catch (e) {
      console.error('Failed to parse message', e);
    }
  }

  webSocketClose(ws: WebSocket, code: number, reason: string, wasClean: boolean) {
    const conn = this.connections.get(ws);
    if (conn) {
      this.connections.delete(ws);
      this.broadcast(JSON.stringify({ type: 'peer-left', peerId: conn.id }));
    }
  }

  webSocketError(ws: WebSocket, error: unknown) {
    const conn = this.connections.get(ws);
    if (conn) {
      this.connections.delete(ws);
      this.broadcast(JSON.stringify({ type: 'peer-left', peerId: conn.id }));
    }
  }

  private broadcast(message: string, exclude?: WebSocket) {
    for (const ws of this.connections.keys()) {
      if (ws !== exclude) {
        try {
          ws.send(message);
        } catch (e) {
          // If a send fails, we'll wait for standard cleanup via webSocketClose/Error
        }
      }
    }
  }

  private sendTo(peerId: string, message: string) {
    for (const [ws, info] of this.connections.entries()) {
      if (info.id === peerId) {
        try {
          ws.send(message);
        } catch (e) {
          // Ignore
        }
        break;
      }
    }
  }
}
