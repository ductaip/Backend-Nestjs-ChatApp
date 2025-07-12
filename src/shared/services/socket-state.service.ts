import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class SocketStateService {
  private users = new Map<number, Socket>();

  add(userId: number, socket: Socket) {
    this.users.set(userId, socket);
  }

  remove(userId: number) {
    this.users.delete(userId);
  }

  get(userId: number): Socket | undefined {
    return this.users.get(userId);
  }

  isConnected(userId: number): boolean {
    return this.users.has(userId);
  }
}
