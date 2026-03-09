// src/hooks/useSocket.js
import { useContext } from 'react';
import { SocketContext } from '../contexts/SocketContext';
export default function useSocket() { return useContext(SocketContext); }
