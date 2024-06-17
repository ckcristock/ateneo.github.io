import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  getCategories(params = {}) {
    return this.http.get(`${environment.base_url}/category`, { params });
  }
  getSubCategories(id) {
    return this.http.get(`${environment.base_url}/subcategory/${id}`);
  }

  getSubCategoryEdit(Id_Prodcuto, Id_Subcategoria) {
    return this.http.get(
      `${environment.base_url}/subcategory-edit/${Id_Prodcuto}/${Id_Subcategoria}`,
    );
  }

  getDinamicVariables(Id_Subcategoria) {
    return this.http.get(`${environment.base_url}/subcategory-field/${Id_Subcategoria}`);
  }

  getField(id) {
    return this.http.get(`${environment.base_url}/subcategory-field/${id}`);
  }

  save(data: any) {
    return this.http.post(`${environment.base_url}/product`, data);
  }

  updateProduct(data, id) {
    return this.http.put(`${environment.base_url}/product/${id}`, data);
  }

  getProducts(params) {
    return this.http.get(`${environment.base_url}/product`, { params });
  }
  getData(params = {}) {
    return this.http.get(`${environment.base_url}/product`, { params });
  }

  getDotationType() {
    return this.http.get(`${environment.base_url}/dotations-type`);
  }
}
