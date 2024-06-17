import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  constructor(private http: HttpClient) {}

  show(id) {
    return this.http.get(`${environment.base_url}/product2/${id}`);
  }

  paginate(params = {}) {
    return this.http.get(`${environment.base_url}/product2-paginate`, { params });
  }

  getDataCreate() {
    return this.http.get(`${environment.base_url}/product-create-data`);
  }

  getVariablesCat(id) {
    return this.http.get(`${environment.base_url}/variables-category/${id}`);
  }

  getVariablesSubCat(id) {
    return this.http.get(`${environment.base_url}/variables-subcategory/${id}`);
  }

  save(data: any) {
    return this.http.post(`${environment.base_url}/product2`, data);
  }
}
