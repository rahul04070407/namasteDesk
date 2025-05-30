import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  // private baseUrl = 'http://192.168.13.62:8080/v-query/api/open/';
    private baseUrl = 'https://app.vareli.co.in/v-query/api/open/';
  private getEndpoint = 'findByAllActiveQuestion';
  private addEndpoint = 'addQuery';

  constructor(private http: HttpClient) { }

  getAllActiveQuestions(): Observable<any> {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });

    const params = new HttpParams().set('name', 'BIOGRENETECH');
    const url = `${this.baseUrl}${this.getEndpoint}`;

    return this.http.get<any>(url, { headers, params });
  }

  addQuery(payload: any): Observable<any> {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });

    const url = `${this.baseUrl}${this.addEndpoint}`;
    return this.http.post<any>(url, payload, { headers });
  }
}
