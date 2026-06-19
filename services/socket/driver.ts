import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const connectDriverSocket = (
  token?: string | null,
  driverId?: string | null,
) => {
  if (socket?.connected) return socket;

  socket = io('https://backend-service-1rc7.onrender.com/driver', {
    transports: ['websocket'],
    auth: {
      token,
    },
    query: {
      driverId,
    },
  });

  console.log('SOCKET INIT', {
    driverId,
    hasToken: !!token,
  });

  socket.on('connect', () => {
    console.log('DRIVER SOCKET CONNECTED');
  });

  socket.on('disconnect', () => {
    console.log('DRIVER SOCKET DISCONNECTED');
  });

  socket.on('connect_error', (err) => {
    console.log('SOCKET ERROR', err);
  });

  socket.onAny((event, payload) => {
    console.log('SOCKET EVENT:', event, payload);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};
