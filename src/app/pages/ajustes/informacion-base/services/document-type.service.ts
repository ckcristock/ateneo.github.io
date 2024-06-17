import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DocumentTypeService {
  constructor(private http: HttpClient) {}

  getDocumentTypes() {
    return this.http.get(`${environment.base_url}/documentTypes`);
  }
}
