
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function connectDriverSocket(
  token: string,
  driverId: string,
) {
  if (socket) return socket;

  socket = io(
    'https://backend-service-1rc7.onrender.com/driver',
    {
      query: {
        driverId,
      },
      auth: {
        token,
      },
      transports: ['websocket'],
    },
  );

  return socket;
}

export function disconnectDriverSocket() {
  socket?.disconnect();
  socket = null;
}