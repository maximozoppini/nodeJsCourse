import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient) {}

  login(user: any): Observable<any> {
    return this.httpClient.post(
      'http://localhost:8081/login',
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
    return this.httpClient.get('http://localhost:8081/login', {
      withCredentials: true,
    });
  }

  logout(): Observable<any> {
    return this.httpClient.get('http://localhost:8081/logout', {
      withCredentials: true,
    });
  }

  signUp(user: any): Observable<any> {
    return this.httpClient.post(
      'http://localhost:8081/register',
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
