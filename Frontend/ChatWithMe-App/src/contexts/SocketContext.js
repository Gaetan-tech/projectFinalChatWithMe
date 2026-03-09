import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user, token, isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (isAuthenticated && user && token) {
      console.log('Socket: Utilisateur authentifié');
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  }, [isAuthenticated, user, token]);

  const value = {
    isConnected,
    onlineUsers,
    joinSubject: (subjectId) => {
      console.log('joinSubject:', subjectId);
    },
    leaveSubject: (subjectId) => {
      console.log('leaveSubject:', subjectId);
    },
    sendTyping: (subjectId) => {
      console.log('sendTyping:', subjectId);
    },
    sendStopTyping: (subjectId) => {
      console.log('sendStopTyping:', subjectId);
    },
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};