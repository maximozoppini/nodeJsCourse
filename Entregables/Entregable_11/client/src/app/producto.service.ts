import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, of } from 'rxjs';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  constructor(private httpClient: HttpClient) {
    //this.socket.connect();
  }

  save(producto: any): void {
    //this.socket.emit('producto', producto);
  }

  get(): Observable<any> {
    return of();
    // return this.socket.fromEvent('productos');
  }

  getTestProducts(): Observable<any> {
    return this.httpClient.get(`${environment.serverurl}productos-test/`, {
      withCredentials: true,
    });
  }
}
