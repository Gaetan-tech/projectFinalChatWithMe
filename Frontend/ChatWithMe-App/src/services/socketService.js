// src/services/socketService.js
import Constants from 'expo-constants';
import { io } from 'socket.io-client';

const getSocketUrl = () => {
  if (__DEV__) {
    return 'http://192.168.1.108:5000'; // Host machine IP on Wi-Fi network
  } else {
    return Constants.expoConfig?.extra?.socketUrl || 'https://api.chatflags.com';
  }
};

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(userId, token) {
    if (this.socket?.connected) return;

    this.socket = io(getSocketUrl(), {
      transports: ['websocket'],
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.setupListeners(userId);
  }

  setupListeners(userId) {
    this.socket.on('connect', () => {
      console.log('✅ Socket connecté');
      this.isConnected = true;
      this.socket.emit('authenticate', { userId });
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket déconnecté');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Erreur Socket:', error.message);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // ... autres méthodes
}

export default new SocketService();