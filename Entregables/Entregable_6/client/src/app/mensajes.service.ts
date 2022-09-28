import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MensajesService {
  constructor(private socket: Socket) {}

  get(): Observable<any> {
    return this.socket.fromEvent('mensajes').pipe(
      map((data) => {
        console.log(data);
        return data;
      })
    );
  }

  sendMensaje(data: any): void {
    this.socket.emit('mensaje', data);
  }
}
