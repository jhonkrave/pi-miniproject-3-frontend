import Peer from "simple-peer/simplepeer.min.js";
import { io, Socket } from "socket.io-client";

// URLs and credentials for WebRTC and ICE servers
const serverWebRTCUrl: string | undefined = import.meta.env.VITE_WEBRTC_URL;
const iceServerUrl: string | undefined = import.meta.env.VITE_ICE_SERVER_URL;
const iceServerUsername: string | undefined = import.meta.env.VITE_ICE_SERVER_USERNAME;
const iceServerCredential: string | undefined = import.meta.env.VITE_ICE_SERVER_CREDENTIAL;

interface PeerConnection {
  peerConnection: InstanceType<typeof Peer>;
  isConnecting?: boolean;
  isConnected?: boolean;
  userId: string;
  socketId: string;
}

interface RoomPeer {
  socketId: string;
  userId: string;
}

interface WebRTCSignalPayload {
  roomId: string;
  signal: any;
  fromUserId: string;
  fromSocketId: string;
}

interface PeerJoinedPayload {
  roomId: string;
  userId: string;
  socketId: string;
}

interface PeerLeftPayload {
  roomId: string;
  userId: string;
  socketId: string;
}

interface RoomPeersPayload {
  roomId: string;
  peers: RoomPeer[];
}

// Callbacks for remote streams
type OnRemoteStreamCallback = (userId: string, stream: MediaStream) => void;
type OnPeerDisconnectedCallback = (userId: string) => void;
type OnErrorCallback = (error: Error) => void;

/**
 * StreamService - Handles WebRTC signaling using Simple-peer
 * Adapted to work with the signaling backend that uses events:
 * - join-room, leave-room
 * - webrtc-signal (instead of signal)
 * - peer-joined, peer-left, room-peers
 */
class StreamService {
  private socket: Socket | null = null;
  private peers: Record<string, PeerConnection> = {};
  private localMediaStream: MediaStream | null = null;
  private currentRoomId: string | null = null;
  private currentUserId: string | null = null;
  
  // Callbacks
  private onRemoteStreamCallback: OnRemoteStreamCallback | null = null;
  private onPeerDisconnectedCallback: OnPeerDisconnectedCallback | null = null;
  private onErrorCallback: OnErrorCallback | null = null;

  /**
   * Configures ICE servers (STUN/TURN)
   * @returns Array of RTCIceServer configurations
   */
  private getIceServers(): RTCIceServer[] {
    const iceServers: RTCIceServer[] = [];

    // Default Google STUN server
    iceServers.push({
      urls: 'stun:stun.l.google.com:19302'
    });

    // If there's a custom TURN server configuration
    if (iceServerUrl) {
      const turnServer: RTCIceServer = {
        urls: iceServerUrl
      };

      if (iceServerUsername && iceServerCredential) {
        turnServer.username = iceServerUsername;
        turnServer.credential = iceServerCredential;
      }

      iceServers.push(turnServer);
    }

    return iceServers;
  }

  /**
   * Connects to the Socket.io signaling server
   * @param {string} token - Authentication token for the signaling server
   * @throws {Error} If VITE_WEBRTC_URL is not configured
   * @returns {Promise<void>} Resolves when connected
   */
  async connect(token: string): Promise<void> {
    if (this.socket?.connected) {
      console.log('StreamService: Already connected');
      return;
    }

    if (!serverWebRTCUrl) {
      throw new Error('VITE_WEBRTC_URL is not configured in environment variables');
    }

    return new Promise((resolve, reject) => {
      try {
        this.socket = io(serverWebRTCUrl, {
          auth: {
            token: token
          },
          transports: ['websocket', 'polling']
        });

        this.socket.on('connect', () => {
          console.log('StreamService: Connected to signaling server');
          this.setupSocketListeners();
          resolve();
        });

        this.socket.on('connect_error', (error) => {
          console.error('StreamService: Connection error', error);
          reject(error);
        });

        this.socket.on('error', (error: { message: string }) => {
          console.error('StreamService: Server error', error);
          if (this.onErrorCallback) {
            this.onErrorCallback(new Error(error.message));
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Sets up socket event listeners
   * @private
   */
  private setupSocketListeners(): void {
    if (!this.socket) return;

    // Event when a new peer joins the room
    // If someone else joins, we (who were already there) are the initiator
    this.socket.on('peer-joined', (payload: PeerJoinedPayload) => {
      console.log('StreamService: Peer joined', payload);
      if (payload.userId !== this.currentUserId && payload.roomId === this.currentRoomId) {
        this.createPeerConnection(payload.userId, payload.socketId, true);
      }
    });

    // Event when a peer leaves the room
    this.socket.on('peer-left', (payload: PeerLeftPayload) => {
      console.log('StreamService: Peer left', payload);
      this.removePeer(payload.userId);
      if (this.onPeerDisconnectedCallback) {
        this.onPeerDisconnectedCallback(payload.userId);
      }
    });

    // Event with the list of existing peers in the room
    // If we just joined and there are other peers, we are the initiator
    this.socket.on('room-peers', (payload: RoomPeersPayload) => {
      console.log('StreamService: Peers in room', payload);
      if (payload.roomId === this.currentRoomId) {
        payload.peers.forEach(peer => {
          if (peer.userId !== this.currentUserId) {
            this.createPeerConnection(peer.userId, peer.socketId, true);
          }
        });
      }
    });

    // WebRTC signal event
    this.socket.on('webrtc-signal', (payload: WebRTCSignalPayload) => {
      console.log('StreamService: WebRTC signal received', payload);
      if (payload.roomId === this.currentRoomId && payload.fromUserId !== this.currentUserId) {
        const peerConn = this.peers[payload.fromUserId];
        if (peerConn && peerConn.peerConnection) {
          peerConn.peerConnection.signal(payload.signal);
        }
      }
    });
  }

  /**
   * Initializes the local media stream (audio/video)
   * @param {boolean} audio - Whether to request audio track
   * @param {boolean} video - Whether to request video track
   * @throws {Error} If media access fails
   * @returns {Promise<void>} Resolves when stream is initialized
   */
  async initializeMediaStream(audio: boolean = true, video: boolean = true): Promise<void> {
    try {
      const constraints: MediaStreamConstraints = {
        audio: audio,
        video: video ? {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        } : false
      };

      this.localMediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('StreamService: Local stream initialized', {
        audio: this.localMediaStream.getAudioTracks().length > 0,
        video: this.localMediaStream.getVideoTracks().length > 0
      });
    } catch (error) {
      console.error('StreamService: Error getting local stream', error);
      throw new Error(`Could not access media: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Joins a video conference room
   * @param {string} roomId - The room ID to join
   * @param {string} userId - The current user's ID
   * @throws {Error} If not connected to signaling server or stream not initialized
   */
  joinRoom(roomId: string, userId: string): void {
    if (!this.socket?.connected) {
      throw new Error('No connection to signaling server');
    }

    if (!this.localMediaStream) {
      throw new Error('Local stream is not initialized. Call initializeMediaStream first.');
    }

    this.currentRoomId = roomId;
    this.currentUserId = userId;

    console.log(`StreamService: Joining room ${roomId} as user ${userId}`);

    this.socket.emit('join-room', {
      roomId: roomId,
      userId: userId
    });
  }

  /**
   * Leaves a video conference room
   * @param {string} roomId - The room ID to leave
   */
  leaveRoom(roomId: string): void {
    if (!this.socket?.connected) {
      return;
    }

    console.log(`StreamService: Leaving room ${roomId}`);

    // Remove all peer connections
    Object.keys(this.peers).forEach(userId => {
      this.removePeer(userId);
    });

    this.socket.emit('leave-room', { roomId });

    this.currentRoomId = null;
    this.currentUserId = null;
  }

  /**
   * Creates a Peer connection with another user
   * @param {string} userId - The user ID to connect with
   * @param {string} socketId - The socket ID of the peer
   * @param {boolean} isInitiator - Whether this peer is the initiator
   * @private
   */
  private createPeerConnection(userId: string, socketId: string, isInitiator: boolean): void {
    // Avoid creating duplicate connections
    if (this.peers[userId]) {
      console.log(`StreamService: Connection already exists with ${userId}`);
      return;
    }

    if (!this.localMediaStream) {
      console.error('StreamService: No local stream to create connection');
      return;
    }

    console.log(`StreamService: Creating Peer connection with ${userId} (initiator: ${isInitiator})`);

    const iceServers = this.getIceServers();
    
    const peer = new Peer({
      initiator: isInitiator,
      trickle: false,
      stream: this.localMediaStream,
      config: {
        iceServers: iceServers
      }
    });

    const peerConn: PeerConnection = {
      peerConnection: peer,
      isConnecting: true,
      isConnected: false,
      userId: userId,
      socketId: socketId
    };

    this.peers[userId] = peerConn;

    // When the signal is ready, send it to the server
    peer.on('signal', (signal: any) => {
      console.log(`StreamService: Signal generated for ${userId}`, signal);
      if (this.socket?.connected && this.currentRoomId) {
        this.socket.emit('webrtc-signal', {
          roomId: this.currentRoomId,
          signal: signal,
          targetUserId: userId
        });
      }
    });

    // When remote stream is received
    peer.on('stream', (remoteStream: MediaStream) => {
      console.log(`StreamService: Remote stream received from ${userId}`);
      peerConn.isConnected = true;
      peerConn.isConnecting = false;
      
      if (this.onRemoteStreamCallback) {
        this.onRemoteStreamCallback(userId, remoteStream);
      }
    });

    // Error handling
    peer.on('error', (error: Error) => {
      console.error(`StreamService: Error in Peer connection with ${userId}`, error);
      peerConn.isConnecting = false;
      
      if (this.onErrorCallback) {
        this.onErrorCallback(error);
      }
    });

    // When connection closes
    peer.on('close', () => {
      console.log(`StreamService: Connection closed with ${userId}`);
      this.removePeer(userId);
    });
  }

  /**
   * Removes a Peer connection
   * @param {string} userId - The user ID to remove
   * @private
   */
  private removePeer(userId: string): void {
    const peerConn = this.peers[userId];
    if (peerConn) {
      try {
        peerConn.peerConnection.destroy();
      } catch (error) {
        console.error(`StreamService: Error destroying connection with ${userId}`, error);
      }
      delete this.peers[userId];
      console.log(`StreamService: Peer ${userId} removed`);
    }
  }

  /**
   * Enables outgoing stream (audio/video)
   */
  enableOutgoingStream(): void {
    if (!this.localMediaStream) {
      console.warn('StreamService: No local stream to enable');
      return;
    }

    this.localMediaStream.getAudioTracks().forEach(track => {
      track.enabled = true;
    });

    this.localMediaStream.getVideoTracks().forEach(track => {
      track.enabled = true;
    });

    console.log('StreamService: Outgoing stream enabled');
  }

  /**
   * Disables outgoing stream (audio/video)
   */
  disableOutgoingStream(): void {
    if (!this.localMediaStream) {
      console.warn('StreamService: No local stream to disable');
      return;
    }

    this.localMediaStream.getAudioTracks().forEach(track => {
      track.enabled = false;
    });

    this.localMediaStream.getVideoTracks().forEach(track => {
      track.enabled = false;
    });

    console.log('StreamService: Outgoing stream disabled');
  }

  /**
   * Enables audio only
   */
  enableAudio(): void {
    if (!this.localMediaStream) {
      console.warn('StreamService: No local stream to enable audio');
      return;
    }

    this.localMediaStream.getAudioTracks().forEach(track => {
      track.enabled = true;
    });

    console.log('StreamService: Audio enabled');
  }

  /**
   * Disables audio only
   */
  disableAudio(): void {
    if (!this.localMediaStream) {
      console.warn('StreamService: No local stream to disable audio');
      return;
    }

    this.localMediaStream.getAudioTracks().forEach(track => {
      track.enabled = false;
    });

    console.log('StreamService: Audio disabled');
  }

  /**
   * Enables video only
   */
  enableVideo(): void {
    if (!this.localMediaStream) {
      console.warn('StreamService: No local stream to enable video');
      return;
    }

    this.localMediaStream.getVideoTracks().forEach(track => {
      track.enabled = true;
    });

    console.log('StreamService: Video enabled');
  }

  /**
   * Disables video only
   */
  disableVideo(): void {
    if (!this.localMediaStream) {
      console.warn('StreamService: No local stream to disable video');
      return;
    }

    this.localMediaStream.getVideoTracks().forEach(track => {
      track.enabled = false;
    });

    console.log('StreamService: Video disabled');
  }

  /**
   * Gets the local stream (to display in own video)
   * @returns {MediaStream | null} The local media stream or null if not initialized
   */
  getLocalStream(): MediaStream | null {
    return this.localMediaStream;
  }

  /**
   * Sets up callback for when a remote stream is received
   * @param {OnRemoteStreamCallback} callback - Callback function to handle remote streams
   */
  onRemoteStream(callback: OnRemoteStreamCallback): void {
    this.onRemoteStreamCallback = callback;
  }

  /**
   * Sets up callback for when a peer disconnects
   * @param {OnPeerDisconnectedCallback} callback - Callback function to handle peer disconnections
   */
  onPeerDisconnected(callback: OnPeerDisconnectedCallback): void {
    this.onPeerDisconnectedCallback = callback;
  }

  /**
   * Sets up callback for errors
   * @param {OnErrorCallback} callback - Callback function to handle errors
   */
  onError(callback: OnErrorCallback): void {
    this.onErrorCallback = callback;
  }

  /**
   * Removes all callbacks
   */
  removeCallbacks(): void {
    this.onRemoteStreamCallback = null;
    this.onPeerDisconnectedCallback = null;
    this.onErrorCallback = null;
  }

  /**
   * Disconnects from server and cleans up resources
   */
  disconnect(): void {
    console.log('StreamService: Disconnecting...');

    // Remove all peers
    Object.keys(this.peers).forEach(userId => {
      this.removePeer(userId);
    });

    // Stop local stream
    if (this.localMediaStream) {
      this.localMediaStream.getTracks().forEach(track => {
        track.stop();
      });
      this.localMediaStream = null;
    }

    // Disconnect socket
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }

    // Clear callbacks
    this.removeCallbacks();

    this.currentRoomId = null;
    this.currentUserId = null;

    console.log('StreamService: Disconnected');
  }
}

// Create singleton instance
export const streamService = new StreamService();
