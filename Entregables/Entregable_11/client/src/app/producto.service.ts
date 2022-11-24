import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  constructor(private socket: Socket, private httpClient: HttpClient) {
    this.socket.connect();
  }

  save(producto: any): void {
    this.socket.emit('producto', producto);
  }

  get(): Observable<any> {
    return this.socket.fromEvent('productos');
  }

  getTestProducts(): Observable<any> {
    return this.httpClient.get('http://localhost:8081/productos-test/', {
      withCredentials: true,
    });
  }
}
