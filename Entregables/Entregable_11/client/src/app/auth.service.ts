import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient) {}

  login(user: any): Observable<any> {
    return this.httpClient.post(
      `${environment.serverurl}login`,
      {
        username: user.username,
        password: user.password,
      },
      {
        withCredentials: true,
      }
    );
  }

  isLogged(): Observable<any> {
    return this.httpClient.get(`${environment.serverurl}login`, {
      withCredentials: true,
    });
  }

  logout(): Observable<any> {
    return this.httpClient.get(`${environment.serverurl}logout`, {
      withCredentials: true,
    });
  }

  signUp(user: any): Observable<any> {
    return this.httpClient.post(
      `${environment.serverurl}register`,
      {
        username: user.username,
        password: user.password,
      },
      {
        withCredentials: true,
      }
    );
  }
}
