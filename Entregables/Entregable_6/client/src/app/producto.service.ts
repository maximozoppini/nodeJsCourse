import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  constructor(private socket: Socket) {
    this.socket.connect();
  }

  save(producto: any): void {
    this.socket.emit('producto', producto);
  }

  get(): Observable<any> {
    return this.socket.fromEvent('productos');
  }
}
