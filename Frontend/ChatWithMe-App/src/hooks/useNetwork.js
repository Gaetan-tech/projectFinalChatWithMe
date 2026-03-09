// src/hooks/useNetwork.js
import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

export const useNetwork = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [type, setType] = useState('unknown');

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      setType(state.type);
    });

    return () => unsubscribe();
  }, []);

  return { isConnected, type, isWifi: type === 'wifi' };
};