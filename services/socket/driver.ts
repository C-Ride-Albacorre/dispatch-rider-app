// import { io, Socket } from 'socket.io-client';

// let socket: Socket | null = null;

// export const connectDriverSocket = (
//   token?: string | null,
//   driverId?: string | null,
// ) => {
//   if (socket?.connected) return socket;

//   socket = io('https://backend-service-1rc7.onrender.com/driver', {
//     transports: ['websocket'],
//     auth: {
//       token,
//     },
//     query: {
//       driverId,
//     },
//   });

//   console.log('SOCKET INIT', {
//     driverId,
//     hasToken: !!token,
//   });

//   socket.on('connect', () => {
//     console.log('DRIVER SOCKET CONNECTED');
//   });

//   socket.on('disconnect', () => {
//     console.log('DRIVER SOCKET DISCONNECTED');
//   });

//   socket.on('connect_error', (err) => {
//     console.log('SOCKET ERROR', err);
//   });

//   socket.onAny((event, payload) => {
//     console.log('SOCKET EVENT:', event, payload);
//   });

//   socket.on('connect', () => {
//     console.log('DRIVER SOCKET CONNECTED');
//     console.log('SOCKET ID', socket?.id);
//   });

//   socket.on('connect_error', (err) => {
//     console.log('CONNECT ERROR');
//     console.log(err.message);
//     console.log(JSON.stringify(err, null, 2));
//   });

//   socket.on('exception', (payload) => {
//     console.log('SOCKET EXCEPTION');
//     console.log(JSON.stringify(payload, null, 2));
//   });

//   socket.on('new-order-request', (payload) => {
//     console.log(
//       '🔥 NEW ORDER REQUEST RECEIVED',
//       JSON.stringify(payload, null, 2),
//     );
//   });

//   return socket;
// };

// export const getSocket = () => socket;

// export const disconnectSocket = () => {
//   socket?.disconnect();
//   socket = null;
// };

// services/socket/driver.ts
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