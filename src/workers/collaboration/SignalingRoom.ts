import { DurableObject } from "cloudflare:workers";

interface Env {
  SIGNALING_ROOM: DurableObjectNamespace<SignalingRoom>;
}

export class SignalingRoom extends DurableObject {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
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
    // Use the hibernation API to store the peer ID on the socket itself,
    // so it survives across Durable Object hibernation cycles!
    server.serializeAttachment({ id: peerId });

    // 1. Notify EXISTING peers that a new peer joined
    this.broadcast(JSON.stringify({ type: 'peer-joined', peerId }), server);

    // 2. Notify the NEW peer about every existing peer already in the room.
    for (const ws of this.ctx.getWebSockets()) {
      if (ws !== server) {
        try {
          const info = ws.deserializeAttachment() as { id: string };
          server.send(JSON.stringify({ type: 'peer-joined', peerId: info.id }));
        } catch {
          // Ignore
        }
      }
    }

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
    try {
      const info = ws.deserializeAttachment() as { id: string };
      if (info && info.id) {
        this.broadcast(JSON.stringify({ type: 'peer-left', peerId: info.id }));
      }
    } catch (e) {
      // Ignore
    }
  }

  webSocketError(ws: WebSocket, error: unknown) {
    try {
      const info = ws.deserializeAttachment() as { id: string };
      if (info && info.id) {
        this.broadcast(JSON.stringify({ type: 'peer-left', peerId: info.id }));
      }
    } catch (e) {
      // Ignore
    }
  }

  private broadcast(message: string, exclude?: WebSocket) {
    for (const ws of this.ctx.getWebSockets()) {
      if (ws !== exclude) {
        try {
          ws.send(message);
        } catch (e) {
          // Ignore
        }
      }
    }
  }

  private sendTo(peerId: string, message: string) {
    for (const ws of this.ctx.getWebSockets()) {
      try {
        const info = ws.deserializeAttachment() as { id: string };
        if (info && info.id === peerId) {
          ws.send(message);
          break;
        }
      } catch (e) {
        // Ignore
      }
    }
  }
}
