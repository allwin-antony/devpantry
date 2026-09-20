export type SignalingMessage =
  | { type: 'peer-joined'; peerId: string }
  | { type: 'peer-left'; peerId: string }
  | { type: 'offer'; peerId: string; targetPeerId: string; sdp: RTCSessionDescriptionInit }
  | { type: 'answer'; peerId: string; targetPeerId: string; sdp: RTCSessionDescriptionInit }
  | { type: 'ice-candidate'; peerId: string; targetPeerId: string; candidate: RTCIceCandidateInit }
  | { type: 'ping' }
  | { type: 'pong' };

const MAX_AUTO_RETRIES = 5;
const BASE_BACKOFF_MS = 1000; // 1 second, doubles each retry

export class SignalingClient {
  private ws: WebSocket | null = null;
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  private pongTimeout: ReturnType<typeof setTimeout> | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private queue: string[] = [];
  private intentionalDisconnect = false;
  private autoRetryCount = 0;
  /** True once the WebSocket has successfully opened at least once in this session. */
  private hasConnectedOnce = false;

  public onReconnecting?: (attempt: number, maxAttempts: number) => void;
  public onReconnectFailed?: () => void;
  
  constructor(
    private roomId: string,
    private localPeerId: string,
    private onMessage: (msg: SignalingMessage) => void,
    private onDisconnect: () => void
  ) {}

  connect() {
    this.intentionalDisconnect = false;
    this.clearReconnectTimer();

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const customUrl = process.env.NEXT_PUBLIC_SIGNALING_URL;
    let wsUrl: string;

    if (customUrl) {
      // Ensure protocol is wss:// or ws://
      const formattedUrl = customUrl.replace(/^http/, 'ws');
      wsUrl = `${formattedUrl}/api/collab/${this.roomId}?peerId=${this.localPeerId}`;
    } else {
      const isDev = process.env.NODE_ENV === 'development';
      const host = isDev ? 'localhost:8787' : window.location.host;
      wsUrl = `${protocol}//${host}/api/collab/${this.roomId}?peerId=${this.localPeerId}`;
    }
    
    // Clean up any lingering socket before opening a new one
    if (this.ws) {
      this.ws.onopen = null;
      this.ws.onmessage = null;
      this.ws.onclose = null;
      this.ws.onerror = null;
      try { this.ws.close(); } catch { /* ignore */ }
      this.ws = null;
    }

    this.ws = new WebSocket(wsUrl);
    
    this.ws.onopen = () => {
      this.hasConnectedOnce = true;
      this.autoRetryCount = 0; // reset on successful connection
      this.startHeartbeat();
      this.flushQueue();
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as SignalingMessage;
        // Clear the pending pong timeout on any incoming message
        this.clearPongTimeout();
        this.onMessage(data);
      } catch (e) {
        console.error('Failed to parse signaling message', e);
      }
    };

    this.ws.onclose = () => {
      this.cleanupConnection();
      this.handleUnexpectedDisconnect();
    };

    this.ws.onerror = () => {
      // onclose will also fire after onerror, so we only clean up here
      this.cleanupConnection();
    };
  }

  /**
   * Manually trigger a reconnection, resetting the retry counter.
   * Called by the UI "Retry Connection" button.
   */
  reconnect() {
    this.autoRetryCount = 0;
    this.cleanupConnection();
    this.connect();
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

  /** Intentional teardown — no automatic reconnection. */
  disconnect() {
    this.intentionalDisconnect = true;
    this.clearReconnectTimer();
    if (this.ws) {
      this.ws.close();
    }
    this.cleanupConnection();
  }

  private handleUnexpectedDisconnect() {
    if (this.intentionalDisconnect) return;

    // Only auto-retry if the signaling socket had connected successfully before.
    // If the very first attempt fails, we still auto-retry (ICE/TURN servers
    // may take a moment), but cap it.
    if (this.autoRetryCount < MAX_AUTO_RETRIES) {
      this.autoRetryCount++;
      const delay = BASE_BACKOFF_MS * Math.pow(2, this.autoRetryCount - 1);
      console.log(`[Signaling] Auto-reconnecting in ${delay}ms (attempt ${this.autoRetryCount}/${MAX_AUTO_RETRIES})`);
      this.onReconnecting?.(this.autoRetryCount, MAX_AUTO_RETRIES);
      this.reconnectTimer = setTimeout(() => {
        this.connect();
      }, delay);
    } else {
      console.warn('[Signaling] Max auto-reconnect attempts reached.');
      this.onReconnectFailed?.();
      this.onDisconnect();
    }
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatInterval = setInterval(() => {
      this.send({ type: 'ping' });
      // Expect a pong or any message within 10s, otherwise consider the
      // connection dead and force-close so the reconnect logic kicks in.
      this.expectPong();
    }, 15000); // 15 seconds
  }

  private expectPong() {
    this.clearPongTimeout();
    this.pongTimeout = setTimeout(() => {
      console.warn('[Signaling] No response to heartbeat, forcing reconnect.');
      if (this.ws) {
        this.ws.close(); // will trigger onclose → handleUnexpectedDisconnect
      }
    }, 10000);
  }

  private clearPongTimeout() {
    if (this.pongTimeout) {
      clearTimeout(this.pongTimeout);
      this.pongTimeout = null;
    }
  }

  private stopHeartbeat() {
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

  private cleanupConnection() {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.onopen = null;
      this.ws.onmessage = null;
      this.ws.onclose = null;
      this.ws.onerror = null;
      this.ws = null;
    }
  }
}
