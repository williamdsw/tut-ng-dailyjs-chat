import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as socketIo from 'socket.io-client';

import { Message } from '../model/message';

import { SocketEvent } from '../enums/socket-event.enum';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket;

  public initSocket(): void {
    this.socket = socketIo(environment.serverUrl);
  }

  public send(message: Message): void {
    this.socket.emit('message', message);
  }

  public onMessage(): Observable<Message> {
    return new Observable<Message>(observable$ => {
      this.socket.on('message', (data: Message) => observable$.next (data));
    });
  }

  public onEvent(event: SocketEvent): Observable<any> {
    return new Observable<SocketEvent>(observable$ => {
      this.socket.on(event, () => observable$.next());
    });
  }
}
