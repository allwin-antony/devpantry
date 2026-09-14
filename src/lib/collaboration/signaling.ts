export type SignalingMessage =
  | { type: 'peer-joined'; peerId: string }
  | { type: 'peer-left'; peerId: string }
  | { type: 'offer'; peerId: string; targetPeerId: string; sdp: RTCSessionDescriptionInit }
  | { type: 'answer'; peerId: string; targetPeerId: string; sdp: RTCSessionDescriptionInit }
  | { type: 'ice-candidate'; peerId: string; targetPeerId: string; candidate: RTCIceCandidateInit }
  | { type: 'ping' }
  | { type: 'pong' };

export class SignalingClient {
  private ws: WebSocket | null = null;
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  private queue: string[] = [];
  
  constructor(
    private roomId: string,
    private localPeerId: string,
    private onMessage: (msg: SignalingMessage) => void,
    private onDisconnect: () => void
  ) {}

  connect() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    // In development, the Next.js server (3000) doesn't run the Cloudflare Worker.
    // We direct the WebSocket to the local Wrangler dev server (usually 8787).
    const isDev = process.env.NODE_ENV === 'development';
    const host = isDev ? 'localhost:8787' : window.location.host;
    const wsUrl = `${protocol}//${host}/api/collab/${this.roomId}?peerId=${this.localPeerId}`;
    
    this.ws = new WebSocket(wsUrl);
    
    this.ws.onopen = () => {
      this.startHeartbeat();
      this.flushQueue();
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as SignalingMessage;
        this.onMessage(data);
      } catch (e) {
        console.error('Failed to parse signaling message', e);
      }
    };

    this.ws.onclose = () => {
      this.cleanup();
      this.onDisconnect();
    };

    this.ws.onerror = () => {
      this.cleanup();
      this.onDisconnect();
    };
  }

  send(msg: Omit<SignalingMessage, 'peerId'> & { peerId?: string }) {
    const fullMsg = { ...msg, peerId: this.localPeerId };
    const payload = JSON.stringify(fullMsg);

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

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
    this.cleanup();
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.send({ type: 'ping' });
    }, 15000); // 15 seconds
  }

  private cleanup() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    this.ws = null;
  }
}
