import * as Y from 'yjs';
import * as syncProtocol from 'y-protocols/sync';
import * as encoding from 'lib0/encoding';
import * as decoding from 'lib0/decoding';
import { SignalingClient, SignalingMessage } from './signaling';
import { encryptPayload, decryptPayload } from './crypto';

const MESSAGE_SYNC = 0;
const MESSAGE_AWARENESS = 1;

// Use public STUN servers for MVP. TURN is deferred.
const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:global.stun.twilio.com:3478' }
];

type ConnectionState = 'INITIALIZING' | 'CONNECTING' | 'SIGNALING' | 'CONNECTING_PEER' | 'CONNECTED' | 'DISCONNECTED' | 'FAILED';

export class EncryptedWebRTCProvider {
  private peerConnections = new Map<string, RTCPeerConnection>();
  private dataChannels = new Map<string, RTCDataChannel>();
  private signaling: SignalingClient;
  public state: ConnectionState = 'INITIALIZING';
  public onStateChange?: (state: ConnectionState, peerId?: string) => void;
  public onAuthFailed?: () => void;

  constructor(
    private roomId: string,
    private localPeerId: string,
    private doc: Y.Doc,
    private cryptoKey: CryptoKey
  ) {
    this.signaling = new SignalingClient(
      roomId,
      localPeerId,
      this.handleSignalingMessage.bind(this),
      this.handleSignalingDisconnect.bind(this)
    );
    
    // Listen for local document changes to broadcast to peers
    this.doc.on('update', this.handleLocalUpdate.bind(this));
  }

  connect() {
    this.setState('CONNECTING');
    this.signaling.connect();
    this.setState('SIGNALING');
  }

  disconnect() {
    this.signaling.disconnect();
    for (const pc of this.peerConnections.values()) {
      pc.close();
    }
    this.peerConnections.clear();
    this.dataChannels.clear();
    this.setState('DISCONNECTED');
  }

  private setState(newState: ConnectionState, peerId?: string) {
    this.state = newState;
    if (this.onStateChange) {
      this.onStateChange(newState, peerId);
    }
  }

  private async handleSignalingMessage(msg: SignalingMessage) {
    switch (msg.type) {
      case 'peer-joined':
        this.initiateConnection(msg.peerId);
        break;
      case 'peer-left':
        this.closeConnection(msg.peerId);
        break;
      case 'offer':
        this.handleOffer(msg.peerId, msg.sdp);
        break;
      case 'answer':
        this.handleAnswer(msg.peerId, msg.sdp);
        break;
      case 'ice-candidate':
        this.handleIceCandidate(msg.peerId, msg.candidate);
        break;
    }
  }

  private handleSignalingDisconnect() {
    this.setState('DISCONNECTED');
  }

  private createPeerConnection(peerId: string): RTCPeerConnection {
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

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'connected') {
        this.setState('CONNECTED', peerId);
      } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        this.closeConnection(peerId);
      }
    };

    this.peerConnections.set(peerId, pc);
    return pc;
  }

  private async initiateConnection(peerId: string) {
    this.setState('CONNECTING_PEER', peerId);
    const pc = this.createPeerConnection(peerId);
    
    // Create Data Channel for Yjs Sync
    const dc = pc.createDataChannel('yjs-sync');
    this.setupDataChannel(peerId, dc);

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    
    this.signaling.send({
      type: 'offer',
      targetPeerId: peerId,
      sdp: pc.localDescription!
    } as any);
  }

  private async handleOffer(peerId: string, sdp: RTCSessionDescriptionInit) {
    this.setState('CONNECTING_PEER', peerId);
    const pc = this.createPeerConnection(peerId);
    
    pc.ondatachannel = (event) => {
      this.setupDataChannel(peerId, event.channel);
    };

    await pc.setRemoteDescription(new RTCSessionDescription(sdp));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    this.signaling.send({
      type: 'answer',
      targetPeerId: peerId,
      sdp: pc.localDescription!
    } as any);
  }

  private async handleAnswer(peerId: string, sdp: RTCSessionDescriptionInit) {
    const pc = this.peerConnections.get(peerId);
    if (pc) {
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
    }
  }

  private async handleIceCandidate(peerId: string, candidate: RTCIceCandidateInit) {
    const pc = this.peerConnections.get(peerId);
    if (pc) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.error('Error adding ICE candidate', e);
      }
    }
  }

  private closeConnection(peerId: string) {
    const pc = this.peerConnections.get(peerId);
    if (pc) {
      pc.close();
      this.peerConnections.delete(peerId);
    }
    this.dataChannels.delete(peerId);
    
    if (this.peerConnections.size === 0) {
      this.setState('SIGNALING');
    } else {
      this.setState('CONNECTED');
    }
  }

  private setupDataChannel(peerId: string, dc: RTCDataChannel) {
    dc.binaryType = 'arraybuffer';
    this.dataChannels.set(peerId, dc);

    dc.onopen = () => {
      this.syncStep1(dc);
    };

    dc.onmessage = async (event) => {
      try {
        const encryptedData = new Uint8Array(event.data);
        const decryptedData = await decryptPayload(encryptedData, this.cryptoKey);
        
        const decoder = decoding.createDecoder(decryptedData);
        const encoder = encoding.createEncoder();
        
        while (decoding.hasContent(decoder)) {
          const messageType = decoding.readVarUint(decoder);
          
          if (messageType === MESSAGE_SYNC) {
            encoding.writeVarUint(encoder, MESSAGE_SYNC);
            syncProtocol.readSyncMessage(decoder, encoder, this.doc, this);
          } else if (messageType === MESSAGE_AWARENESS) {
            // handle awareness if needed
          }
        }
        
        if (encoding.length(encoder) > 0) {
          this.sendEncrypted(dc, encoding.toUint8Array(encoder));
        }
      } catch (e: any) {
        console.error('Error handling data channel message:', e);
        if (e.message && e.message.includes('decrypt')) {
          if (this.onAuthFailed) this.onAuthFailed();
          this.disconnect();
        }
      }
    };
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
