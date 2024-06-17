import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VerViaticosService {
  constructor(private http: HttpClient) {}

  getAllViaticos(id: string) {
    return this.http.get(`${environment.base_url}/travel-expense/${id}`);
  }

  download(id: string, company_id: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(`${environment.base_url}/travel-expense/pdf/${id}/${company_id}`, {
      headers,
      responseType: 'blob' as 'json',
    });
  }
}
