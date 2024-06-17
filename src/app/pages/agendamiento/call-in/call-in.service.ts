import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class CallInService {
  constructor(private http?: HttpClient) {}

  getCalls = (data = {}) => {
    return this.http.post(environment.base_url + `/get-call-by-identifier`, data);
  };

  chargeFields = (data = {}) => {
    return this.http.post(environment.base_url + `/get-call-by-identifier`, data);
  };
}
