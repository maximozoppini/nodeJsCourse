import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient) {}

  login(username: string): Observable<any> {
    return this.httpClient.post(
      'http://localhost:8081/api/login',
      {
        username,
      },
      {
        withCredentials: true,
      }
    );
  }

  isLogged(): Observable<any> {
    return this.httpClient.get('http://localhost:8081/api/login', {
      withCredentials: true,
    });
  }

  logout(): Observable<any> {
    return this.httpClient.get('http://localhost:8081/api/logout', {
      withCredentials: true,
    });
  }
}
