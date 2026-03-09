// src/contexts/NetworkContext.js
import { createContext, useContext } from 'react';
import { useNetwork } from '../hooks/useNetwork';

const NetworkContext = createContext();

export const NetworkProvider = ({ children }) => {
  const network = useNetwork();

  return (
    <NetworkContext.Provider value={network}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetworkContext = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetworkContext must be used within NetworkProvider');
  }
  return context;
};