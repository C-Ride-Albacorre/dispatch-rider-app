import { createContext, useContext, useEffect, useState } from 'react';

import { useAuthStore } from '@/store/auth-store';
import {
  connectDriverSocket,
  disconnectSocket,
} from '@/services/socket/driver';
import { Socket } from 'socket.io-client';

const SocketContext = createContext<Socket | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);

  const authStatus = useAuthStore((s) => s.authStatus);
  const accessToken = useAuthStore((s) => s.accessToken);
  const driverId = useAuthStore((s) => s.driverId);

  useEffect(() => {
    console.log('SOCKET PROVIDER', {
      authStatus,
      hasToken: !!accessToken,
      driverId,
    });

    if (authStatus === 'AUTHENTICATED' && accessToken && driverId) {
      console.log('CONNECTING SOCKET');

      const driverSocket = connectDriverSocket(accessToken, driverId);

      setSocket(driverSocket);
    }

    return () => {
      disconnectSocket();
      setSocket(null);
    };
  }, [authStatus, accessToken, driverId]);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
