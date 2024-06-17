import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  URL = environment.base_url;
  constructor(private clientHttp: HttpClient) {}
  institutions(term: string) {
    if (term === '') {
      return of([]);
    }
    return this.clientHttp
      .get<[any, string[]]>(this.URL + '/data', { params: { search: term } })
      .pipe(map((response: any) => response.data));
  }

  speciality(term: string) {
    if (term === '') {
      return of([]);
    }
    return this.clientHttp
      .get<[any, string[]]>(this.URL, { params: { search: term } })
      .pipe(map((response: any) => response.data));
  }
}
