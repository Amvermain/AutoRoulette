// roulette.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  namespace: '/roulette', // 클라이언트에서 /roulette 네임스페이스로 연결
  cors: {
    origin: '*',
  },
})
export class RouletteGateway {
  @WebSocketServer()
  server: Server;

  emitDonation(payload: { nickname: string; amount: number; message?: string }) {
    this.server.emit('donation', payload);
  }
}
