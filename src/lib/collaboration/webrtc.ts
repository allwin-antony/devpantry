import * as Y from 'yjs';
import * as syncProtocol from 'y-protocols/sync';
import * as encoding from 'lib0/encoding';
import * as decoding from 'lib0/decoding';
import { SignalingClient, SignalingMessage } from './signaling';
import { encryptPayload, decryptPayload, PayloadDecryptionError } from './crypto';

const MESSAGE_SYNC = 0;
const MESSAGE_AWARENESS = 1;
const MESSAGE_AUTH = 2;

// Public STUN + TURN servers for NAT traversal.
// Multiple STUN servers improve candidate gathering reliability.
// The Metered free-tier TURN servers are more reliable than the old openrelay ones.
const ICE_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
  { urls: 'stun:global.stun.twilio.com:3478' },
  {
    urls: 'turn:a.relay.metered.ca:80',
    username: 'e8dd65b92f6eae1f404b4bfe',
    credential: '5VfBSMfeOvGfLxoN'
  },
  {
    urls: 'turn:a.relay.metered.ca:80?transport=tcp',
    username: 'e8dd65b92f6eae1f404b4bfe',
    credential: '5VfBSMfeOvGfLxoN'
  },
  {
    urls: 'turn:a.relay.metered.ca:443',
    username: 'e8dd65b92f6eae1f404b4bfe',
    credential: '5VfBSMfeOvGfLxoN'
  },
  {
    urls: 'turn:a.relay.metered.ca:443?transport=tcp',
    username: 'e8dd65b92f6eae1f404b4bfe',
    credential: '5VfBSMfeOvGfLxoN'
  },
  {
    urls: 'turns:a.relay.metered.ca:443?transport=tcp',
    username: 'e8dd65b92f6eae1f404b4bfe',
    credential: '5VfBSMfeOvGfLxoN'
  }
];

const MAX_ICE_RESTART_ATTEMPTS = 2;

type ConnectionState = 'INITIALIZING' | 'CONNECTING' | 'SIGNALING' | 'CONNECTING_PEER' | 'CONNECTED' | 'DISCONNECTED' | 'RECONNECTING' | 'FAILED';

export class EncryptedWebRTCProvider {
  private peerConnections = new Map<string, RTCPeerConnection>();
  private connectionIds = new Map<string, string>();
  private dataChannels = new Map<string, RTCDataChannel>();
  private pendingCandidates = new Map<string, RTCIceCandidateInit[]>();
  private signaling: SignalingClient;
  private authenticatedPeers = new Set<string>();
  private authenticationTimers = new Map<string, ReturnType<typeof setTimeout>>();
  private iceRestartAttempts = new Map<string, number>();
  private destroyed = false;
  public state: ConnectionState = 'INITIALIZING';
  public onStateChange?: (state: ConnectionState, peerId?: string, peersCount?: number) => void;
  public onAuthFailed?: (peerId: string) => void;

  constructor(
    private roomId: string,
    private localPeerId: string,
    private doc: Y.Doc,
    private cryptoKey: CryptoKey,
    private isCreator: boolean = false
  ) {
    this.signaling = new SignalingClient(
      roomId,
      localPeerId,
      this.handleSignalingMessage.bind(this),
      this.handleSignalingDisconnect.bind(this)
    );

    // Surface auto-reconnection attempts to the UI
    this.signaling.onReconnecting = (_attempt, _max) => {
      this.setState('RECONNECTING');
    };
    this.signaling.onReconnectFailed = () => {
      this.setState('FAILED');
    };
    
    // Listen for local document changes to broadcast to peers
    this.doc.on('update', this.handleLocalUpdate.bind(this));
  }

  connect() {
    this.destroyed = false;
    this.setState('CONNECTING');
    this.signaling.connect();
    this.setState('SIGNALING');
  }

  disconnect() {
    this.destroyed = true;
    this.signaling.disconnect();
    for (const pc of this.peerConnections.values()) {
      pc.close();
    }
    this.peerConnections.clear();
    this.dataChannels.clear();
    this.pendingCandidates.clear();
    for (const timer of this.authenticationTimers.values()) {
      clearTimeout(timer);
    }
    this.authenticationTimers.clear();
    this.authenticatedPeers.clear();
    this.setState('DISCONNECTED');
  }

  /**
   * Tear down all stale peer connections and re-establish the signaling
   * connection from scratch. Called by the UI "Retry Connection" button.
   */
  reconnect() {
    // Close every existing peer connection so we start fresh
    for (const pc of this.peerConnections.values()) {
      pc.ondatachannel = null;
      pc.onicecandidate = null;
      pc.onconnectionstatechange = null;
      pc.oniceconnectionstatechange = null;
      pc.onsignalingstatechange = null;
      pc.onicegatheringstatechange = null;
      pc.close();
    }
    this.peerConnections.clear();
    this.dataChannels.clear();
    this.pendingCandidates.clear();
    this.connectionIds.clear();
    for (const timer of this.authenticationTimers.values()) {
      clearTimeout(timer);
    }
    this.authenticationTimers.clear();
    this.authenticatedPeers.clear();

    this.destroyed = false;
    this.setState('RECONNECTING');
    this.signaling.reconnect();
  }

  private updateOverallState() {
    if (this.destroyed) return;
    if (this.authenticatedPeers.size > 0) {
      this.setState('CONNECTED');
    } else if (this.peerConnections.size > 0) {
      this.setState('CONNECTING_PEER');
    } else {
      this.setState('SIGNALING');
    }
  }

  private setState(newState: ConnectionState, peerId?: string) {
    this.state = newState;
    if (this.onStateChange) {
      this.onStateChange(newState, peerId, this.authenticatedPeers.size);
    }
  }

  private async handleSignalingMessage(msg: SignalingMessage) {
    if (this.destroyed) return;
    switch (msg.type) {
      case 'peer-joined':
        // Prevent glare by ensuring only one peer initiates the connection.
        // Both peers receive 'peer-joined' (the joiner receives it for existing peers,
        // and existing peers receive it for the joiner). We use lexicographical
        // comparison of peer IDs to deterministically pick the initiator.
        if (this.localPeerId < msg.peerId) {
          await this.initiateConnection(msg.peerId);
        } else {
          console.log(`[WebRTC] Peer ${msg.peerId.slice(0, 8)} joined, but they have a smaller ID. Waiting for their offer.`);
        }
        break;
      case 'peer-left':
        this.closeConnection(msg.peerId);
        break;
      case 'offer':
        await this.handleOffer(msg.peerId, msg.sdp);
        break;
      case 'answer':
        await this.handleAnswer(msg.peerId, msg.sdp);
        break;
      case 'ice-candidate':
        await this.handleIceCandidate(msg.peerId, msg.candidate);
        break;
    }
  }

  private handleSignalingDisconnect() {
    // The signaling client now handles auto-reconnection internally.
    // We only set DISCONNECTED if this was a final failure (all retries
    // exhausted), which the signaling client signals by calling this
    // callback. So we just update state here.
    if (!this.destroyed) {
      this.setState('DISCONNECTED');
    }
  }

  private getOrCreatePeerConnection(peerId: string): RTCPeerConnection {
    const existingPc = this.peerConnections.get(peerId);
    if (existingPc) return existingPc;

    let connectionId = this.connectionIds.get(peerId);
    if (!connectionId) {
      connectionId = Math.random().toString(36).substring(2, 8);
      this.connectionIds.set(peerId, connectionId);
    }

    console.log(`[WebRTC ${connectionId}] Creating connection to ${peerId.slice(0, 8)}`);
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.signaling.send({
          type: 'ice-candidate',
          targetPeerId: peerId,
          candidate: event.candidate.toJSON()
        } as any);
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log(`[WebRTC ${connectionId}] ICE connection:`, pc.iceConnectionState);
      // Some browsers fire ICE 'failed' without firing connection 'failed'.
      // Attempt an ICE restart in those cases too.
      if (pc.iceConnectionState === 'failed') {
        this.attemptIceRestart(peerId, pc, connectionId!);
      }
    };

    pc.onconnectionstatechange = () => {
      console.log(`[WebRTC ${connectionId}] Connection:`, pc.connectionState);
      if (pc.connectionState === 'connected') {
        // Connection recovered — reset ICE restart counter
        this.iceRestartAttempts.delete(peerId);
        this.updateOverallState();
      } else if (pc.connectionState === 'failed') {
        // Try an ICE restart before giving up
        this.attemptIceRestart(peerId, pc, connectionId!);
      } else if (pc.connectionState === 'closed') {
        this.closeConnection(peerId);
      } else if (pc.connectionState === 'disconnected') {
        // Soft disconnect: WebRTC might self-recover. Wait 8 seconds, then
        // try an ICE restart rather than killing the connection outright.
        setTimeout(() => {
          const currentPc = this.peerConnections.get(peerId);
          if (currentPc && currentPc.connectionState === 'disconnected') {
            console.log(`[WebRTC ${connectionId}] Still disconnected after 8s, attempting ICE restart.`);
            this.attemptIceRestart(peerId, currentPc, connectionId!);
          }
        }, 8000);
      }
    };

    pc.onsignalingstatechange = () => {
      console.log(`[WebRTC ${connectionId}] Signaling:`, pc.signalingState);
    };

    pc.onicegatheringstatechange = () => {
      console.log(`[WebRTC ${connectionId}] ICE gathering:`, pc.iceGatheringState);
    };

    this.peerConnections.set(peerId, pc);
    return pc;
  }

  /**
   * Called when we receive 'peer-joined' from signaling.
   * We are the INITIATOR: we create the DataChannel and send an offer.
   */
  private async initiateConnection(peerId: string) {
    if (this.destroyed) return;
    this.setState('CONNECTING_PEER', peerId);
    const pc = this.getOrCreatePeerConnection(peerId);

    // If this PC already has a local description (we already sent an offer),
    // don't create another one — we'd get duplicate DataChannels.
    if (pc.signalingState !== 'stable' && pc.signalingState !== 'closed') {
      console.log(`[WebRTC] Already negotiating with ${peerId.slice(0, 8)}, skipping duplicate initiate.`);
      return;
    }
    
    // Create Data Channel for Yjs Sync
    const dc = pc.createDataChannel('yjs-sync');
    this.setupDataChannel(peerId, dc);

    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      
      this.signaling.send({
        type: 'offer',
        targetPeerId: peerId,
        sdp: pc.localDescription!
      } as any);
    } catch (e) {
      console.error('[WebRTC] Error initiating connection', e);
    }
  }

  /**
   * Called when we receive an offer from a remote peer.
   * We are the RESPONDER: we wait for their DataChannel via ondatachannel.
   */
  private async handleOffer(peerId: string, sdp: RTCSessionDescriptionInit) {
    if (this.destroyed) return;
    this.setState('CONNECTING_PEER', peerId);
    const pc = this.getOrCreatePeerConnection(peerId);

    // Perfect Negotiation: determine politeness by peer ID comparison
    const polite = this.localPeerId < peerId;
    const glare = pc.signalingState !== 'stable';

    if (glare) {
      if (!polite) {
        // I'm impolite and I already have a pending offer — ignore theirs.
        console.log(`[WebRTC] Glare detected. I am impolite, ignoring offer from ${peerId.slice(0, 8)}`);
        return;
      }
      // I'm polite — rollback my offer and accept theirs.
      console.log(`[WebRTC] Glare detected. I am polite, rolling back my offer to ${peerId.slice(0, 8)}`);
      try {
        await pc.setLocalDescription({ type: 'rollback' });
      } catch (e) {
        console.error('[WebRTC] Error rolling back during glare', e);
        return;
      }
    }
    
    // Set up the ondatachannel handler BEFORE setRemoteDescription, so we
    // don't miss a channel that fires synchronously.
    pc.ondatachannel = (event) => {
      this.setupDataChannel(peerId, event.channel);
    };

    try {
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      
      const candidates = this.pendingCandidates.get(peerId) || [];
      for (const candidate of candidates) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.error('[WebRTC] Error adding queued ICE candidate', e);
        }
      }
      this.pendingCandidates.delete(peerId);

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      this.signaling.send({
        type: 'answer',
        targetPeerId: peerId,
        sdp: pc.localDescription!
      } as any);
    } catch (e) {
      console.error('[WebRTC] Error handling offer', e);
    }
  }

  private async handleAnswer(peerId: string, sdp: RTCSessionDescriptionInit) {
    const pc = this.peerConnections.get(peerId);
    if (pc) {
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
        
        const candidates = this.pendingCandidates.get(peerId) || [];
        for (const candidate of candidates) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (e) {
            console.error('[WebRTC] Error adding queued ICE candidate', e);
          }
        }
        this.pendingCandidates.delete(peerId);
      } catch (e) {
        console.error('[WebRTC] Error handling answer', e);
      }
    }
  }

  private async handleIceCandidate(peerId: string, candidate: RTCIceCandidateInit) {
    const pc = this.peerConnections.get(peerId);
    if (!pc || !pc.remoteDescription) {
      if (!this.pendingCandidates.has(peerId)) {
        this.pendingCandidates.set(peerId, []);
      }
      this.pendingCandidates.get(peerId)!.push(candidate);
    } else {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.error('[WebRTC] Error adding ICE candidate', e);
      }
    }
  }

  /**
   * Attempt an ICE restart for a degraded peer connection.
   * If we've already exhausted MAX_ICE_RESTART_ATTEMPTS, close the connection
   * entirely (which will trigger updateOverallState → reconnect flow).
   */
  private async attemptIceRestart(peerId: string, pc: RTCPeerConnection, connectionId: string) {
    if (this.destroyed) return;

    const attempts = (this.iceRestartAttempts.get(peerId) || 0) + 1;
    this.iceRestartAttempts.set(peerId, attempts);

    if (attempts > MAX_ICE_RESTART_ATTEMPTS) {
      console.warn(`[WebRTC ${connectionId}] ICE restart attempts exhausted (${MAX_ICE_RESTART_ATTEMPTS}), closing connection to ${peerId.slice(0, 8)}.`);
      this.closeConnection(peerId);
      return;
    }

    console.log(`[WebRTC ${connectionId}] Attempting ICE restart ${attempts}/${MAX_ICE_RESTART_ATTEMPTS} for ${peerId.slice(0, 8)}`);

    try {
      // restartIce() tells the browser to gather new ICE candidates on the
      // next createOffer call with iceRestart: true.
      pc.restartIce();

      const offer = await pc.createOffer({ iceRestart: true });
      await pc.setLocalDescription(offer);

      this.signaling.send({
        type: 'offer',
        targetPeerId: peerId,
        sdp: pc.localDescription!
      } as any);
    } catch (e) {
      console.error(`[WebRTC ${connectionId}] ICE restart failed:`, e);
      this.closeConnection(peerId);
    }
  }

  private closeConnection(peerId: string) {
    const pc = this.peerConnections.get(peerId);
    if (pc) {
      pc.ondatachannel = null;
      pc.onicecandidate = null;
      pc.onconnectionstatechange = null;
      pc.oniceconnectionstatechange = null;
      pc.onsignalingstatechange = null;
      pc.onicegatheringstatechange = null;
      pc.close();
      this.peerConnections.delete(peerId);
    }
    const dc = this.dataChannels.get(peerId);
    if (dc) {
      dc.onopen = null;
      dc.onmessage = null;
      dc.onclose = null;
      dc.onerror = null;
      this.dataChannels.delete(peerId);
    }
    this.pendingCandidates.delete(peerId);
    this.authenticatedPeers.delete(peerId);
    this.connectionIds.delete(peerId);
    this.iceRestartAttempts.delete(peerId);
    const authenticationTimer = this.authenticationTimers.get(peerId);
    if (authenticationTimer) {
      clearTimeout(authenticationTimer);
      this.authenticationTimers.delete(peerId);
    }
    
    this.updateOverallState();
  }

  /**
   * Sets up the DataChannel event handlers for a peer.
   * This may be called more than once per peer during glare resolution —
   * if a previous DataChannel existed, we clean it up first.
   */
  private setupDataChannel(peerId: string, dc: RTCDataChannel) {
    // If we already have a functioning authenticated channel for this peer, skip.
    const existingDc = this.dataChannels.get(peerId);
    if (existingDc && existingDc !== dc && this.authenticatedPeers.has(peerId)) {
      console.log(`[WebRTC] [${peerId.slice(0, 8)}] Already have authenticated channel, closing duplicate.`);
      dc.close();
      return;
    }

    // Clean up old channel if it exists
    if (existingDc && existingDc !== dc) {
      existingDc.onopen = null;
      existingDc.onmessage = null;
      existingDc.onclose = null;
      existingDc.onerror = null;
    }

    // Clear any existing auth timer for this peer
    const existingTimer = this.authenticationTimers.get(peerId);
    if (existingTimer) {
      clearTimeout(existingTimer);
      this.authenticationTimers.delete(peerId);
    }

    dc.binaryType = 'arraybuffer';
    this.dataChannels.set(peerId, dc);

    const handleChannelOpen = () => {
      console.log(`[WebRTC] [${peerId.slice(0, 8)}] DataChannel open, sending auth challenge.`);
      this.sendAuthChallenge(dc);
      const timer = setTimeout(() => {
        if (!this.authenticatedPeers.has(peerId) && this.dataChannels.get(peerId) === dc) {
          console.warn(`[WebRTC] [${peerId.slice(0, 8)}] Authentication timed out after 10s.`);
          this.closeConnection(peerId);
          if (!this.isCreator && this.authenticatedPeers.size === 0) {
            this.onAuthFailed?.(peerId);
          }
        }
      }, 10000);
      this.authenticationTimers.set(peerId, timer);
    };

    // If the channel is already open (common for the responder side), fire immediately.
    if (dc.readyState === 'open') {
      handleChannelOpen();
    } else {
      dc.onopen = handleChannelOpen;
    }

    dc.onclose = () => {
      console.log(`[WebRTC] [${peerId.slice(0, 8)}] DataChannel closed.`);
      this.closeConnection(peerId);
    };

    dc.onerror = (e) => {
      console.error(`[WebRTC] [${peerId.slice(0, 8)}] DataChannel error:`, e);
      this.closeConnection(peerId);
    };

    dc.onmessage = async (event) => {
      if (this.destroyed) return;
      try {
        const encryptedData = new Uint8Array(event.data);
        const decryptedData = await decryptPayload(encryptedData, this.cryptoKey);
        
        // Successful decryption = this peer has the correct password
        if (!this.authenticatedPeers.has(peerId)) {
          console.log(`[WebRTC] [${peerId.slice(0, 8)}] Peer authenticated successfully.`);
          this.authenticatedPeers.add(peerId);
          // Clear the auth timeout since they're authenticated
          const timer = this.authenticationTimers.get(peerId);
          if (timer) {
            clearTimeout(timer);
            this.authenticationTimers.delete(peerId);
          }
          this.updateOverallState();
        }
        
        const decoder = decoding.createDecoder(decryptedData);
        while (decoding.hasContent(decoder)) {
          const messageType = decoding.readVarUint(decoder);
          
          if (messageType === MESSAGE_AUTH) {
            const challenge = decoding.readVarString(decoder);
            if (challenge === 'auth-challenge') {
              // Authentication succeeded, now we can safely start Yjs sync protocol
              this.syncStep1(dc);
            }
          } else if (messageType === MESSAGE_SYNC) {
            const replyEncoder = encoding.createEncoder();
            encoding.writeVarUint(replyEncoder, MESSAGE_SYNC);
            syncProtocol.readSyncMessage(decoder, replyEncoder, this.doc, this);
            if (encoding.length(replyEncoder) > 1) {
              this.sendEncrypted(dc, encoding.toUint8Array(replyEncoder));
            }
          } else if (messageType === MESSAGE_AWARENESS) {
            // handle awareness if needed
          }
        }
      } catch (e: any) {
        if (
          e instanceof PayloadDecryptionError ||
          e.name === 'PayloadDecryptionError' ||
          (e.message && e.message.includes('decrypt'))
        ) {
          console.warn(`[WebRTC] [${peerId.slice(0, 8)}] Authentication failed (wrong password). Closing only this peer.`);
          
          this.closeConnection(peerId);
          
          // Only the joining client (non-creator) who has zero authenticated peers
          // should interpret this as "I entered the wrong password".
          // The creator just silently drops the bad peer.
          if (!this.isCreator && this.authenticatedPeers.size === 0) {
            this.onAuthFailed?.(peerId);
          }
          return;
        } else {
          console.error(`[WebRTC] [${peerId.slice(0, 8)}] Error handling data channel message:`, e);
        }
      }
    };
  }

  private async sendAuthChallenge(dc: RTCDataChannel) {
    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, MESSAGE_AUTH);
    encoding.writeVarString(encoder, 'auth-challenge');
    await this.sendEncrypted(dc, encoding.toUint8Array(encoder));
  }

  private async syncStep1(dc: RTCDataChannel) {
    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, MESSAGE_SYNC);
    syncProtocol.writeSyncStep1(encoder, this.doc);
    await this.sendEncrypted(dc, encoding.toUint8Array(encoder));
  }

  private handleLocalUpdate(update: Uint8Array, origin: any) {
    if (origin !== this) {
      const encoder = encoding.createEncoder();
      encoding.writeVarUint(encoder, MESSAGE_SYNC);
      syncProtocol.writeUpdate(encoder, update);
      const payload = encoding.toUint8Array(encoder);
      
      this.broadcastEncrypted(payload);
    }
  }

  private async sendEncrypted(dc: RTCDataChannel, payload: Uint8Array) {
    if (dc.readyState === 'open') {
      try {
        const encrypted = await encryptPayload(payload, this.cryptoKey);
        dc.send(encrypted as any);
      } catch (e) {
        console.error('Failed to send encrypted message', e);
      }
    }
  }

  private async broadcastEncrypted(payload: Uint8Array) {
    const encrypted = await encryptPayload(payload, this.cryptoKey);
    for (const dc of this.dataChannels.values()) {
      if (dc.readyState === 'open') {
        dc.send(encrypted as any);
      }
    }
  }
}
