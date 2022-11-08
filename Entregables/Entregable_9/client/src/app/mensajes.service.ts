import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map, Observable } from 'rxjs';
import { denormalize, schema } from 'normalizr';

@Injectable({
  providedIn: 'root',
})
export class MensajesService {
  constructor(private socket: Socket) {}

  get(): Observable<any> {
    return this.socket.fromEvent('mensajes').pipe(
      map((data: any) => {
        const authorSchemaNmlz = new schema.Entity('author', undefined, {
          idAttribute: 'email',
        });
        const messageSchemaNmlz = new schema.Entity('message', {
          author: authorSchemaNmlz,
        });
        const messagesSchemaNmlz = { messages: [messageSchemaNmlz] };

        let denorm = denormalize(
          data.result,
          messagesSchemaNmlz,
          data.entities
        );

        console.log(denorm);
        return denorm.messages.map((msg: any) => {
          return {
            email: msg._doc.author.email,
            mensaje: msg._doc.text,
            fecha: msg._doc.timeStamp,
          };
        });
      })
    );
  }

  sendMensaje(data: any): void {
    this.socket.emit('mensaje', data);
  }
}
