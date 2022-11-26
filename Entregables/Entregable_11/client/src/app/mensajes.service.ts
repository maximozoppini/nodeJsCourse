import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map, Observable, of } from 'rxjs';
import { denormalize, schema } from 'normalizr';

@Injectable({
  providedIn: 'root',
})
export class MensajesService {
  constructor() {}

  get(): Observable<any> {
    return of();
  }

  sendMensaje(data: any): void {
    //this.socket.emit('mensaje', data);
  }
}
