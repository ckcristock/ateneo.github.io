import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BoardsService {
  constructor(private http: HttpClient) {}

  getBoards(params = {}) {
    return this.http.get(`${environment.base_url}/board`, { params });
  }

  setBoards(personId, board) {
    return this.http.post(`${environment.base_url}/person/set-board/${personId}/${board}`, board);
  }

  getPersonBoards(personId) {
    return this.http.get(`${environment.base_url}/person/get-boards/${personId}`);
  }
}
