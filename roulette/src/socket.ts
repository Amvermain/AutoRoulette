import { io, Socket } from 'socket.io-client';

export interface DonationPayload {
  nickname: string;
  amount: number;
  message?: string;
}

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io('http://localhost:3000/roulette', {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('[socket] connected', socket?.id);
    });

    socket.on('donation', (object) => {
      console.log(object);
    })

    socket.on('disconnect', () => {
      console.log('[socket] disconnected');
    });
  }
  return socket;
}