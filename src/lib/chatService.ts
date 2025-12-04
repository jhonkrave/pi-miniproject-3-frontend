import { io, Socket } from 'socket.io-client';

const CHAT_SERVER_URL = import.meta.env.VITE_CHAT_SERVER_URL || 'http://localhost:3001';

export interface ChatMessage {
  id?: string;
  meetingId: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: string;
}

export interface ChatEventData {
    roomId: string;
    message: string;
    senderId: string;
    senderName: string;
    timestamp: string;
    userId?: string;
    uid?: string;
    id?: string;
}

class ChatService {
  private socket: Socket | null = null;

  connect(token: string) {
    if (this.socket?.connected) return;

    this.socket = io(CHAT_SERVER_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to chat server');
    });

    this.socket.on('connect_error', (err) => {
      console.error('Chat connection error:', err);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinRoom(roomId: string, userId: string) {
    if (!this.socket) return;
    this.socket.emit('join-room', { roomId, userId });
  }

  leaveRoom(meetingId: string) {
    // Server might handle disconnect automatically, but if there's an event:
    // this.socket.emit('leave-room', meetingId); 
    // Based on provided docs, no explicit leave-room event documented, 
    // but usually disconnecting socket or just closing component is enough.
    if (meetingId) { /* placeholder to use variable */ }
  }

  sendMessage(roomId: string, message: string) {
    if (!this.socket) return;
    this.socket.emit('send-message', { roomId, message });
  }

  onMessage(callback: (message: ChatMessage) => void) {
    if (!this.socket) return;
    // Server sends 'receive-message' with payload matching ChatMessage interface approximately
    // Payload: { roomId, message, senderId, senderName, timestamp }
    // We map it to our ChatMessage interface: { content: message, ... }
    this.socket.on('receive-message', (data: ChatEventData) => {
        const chatMsg: ChatMessage = {
            meetingId: data.roomId,
            content: data.message,
            senderId: data.senderId,
            senderName: data.senderName,
            timestamp: data.timestamp
        };
        callback(chatMsg);
    });
  }

  offMessage(callback?: (message: ChatMessage) => void) {
    if (!this.socket) return;
    // Socket.io off requires the exact function reference if callback is provided.
    // However, since we wrap the callback in onMessage, we can't easily remove just one specific wrapper.
    // For this simple app, removing all listeners for 'receive-message' is acceptable when unmounting.
    this.socket.off('receive-message');
    if (callback) { /* placeholder to use variable */ }
  }

  onUserJoined(callback: (data: Partial<ChatEventData>) => void) {
      if (!this.socket) return;
      this.socket.on('userJoined', callback);
  }

  offUserJoined(callback?: (data: Partial<ChatEventData>) => void) {
    if (!this.socket) return;
    if (callback) {
        this.socket.off('userJoined', callback);
    } else {
        this.socket.off('userJoined');
    }
  }

    onUserLeft(callback: (data: Partial<ChatEventData>) => void) {
      if (!this.socket) return;
      this.socket.on('userLeft', callback);
  }

  offUserLeft(callback?: (data: Partial<ChatEventData>) => void) {
    if (!this.socket) return;
    if (callback) {
        this.socket.off('userLeft', callback);
    } else {
        this.socket.off('userLeft');
    }
  }
}

export const chatService = new ChatService();
