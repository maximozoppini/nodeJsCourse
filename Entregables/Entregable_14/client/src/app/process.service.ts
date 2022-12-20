import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProcessService {
  constructor(private httpClient: HttpClient) {}

  getInfo(): Observable<any> {
    return this.httpClient.get('http://localhost:8081/info/', {
      withCredentials: true,
    });
  }
}
