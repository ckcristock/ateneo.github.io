import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoriasService {
  categoryFields = [];

  constructor(private http: HttpClient) {}

  paginacionCategorias(params = {}) {
    return this.http.get(`${environment.base_url}/category-paginate`, { params });
    /* return this.http.get(`${environment.base_url}/php/categoria_nueva/detalle_categoria_nueva_general.php`, {params}) */
  }

  getCategorias() {
    return this.http.get(`${environment.base_url}/category`);
  }

  listarCategorias(params = {}) {
    return this.http.get(`${environment.base_url}/list-categories`, { params });
  }

  getCampos(id: any, params?: any) {
    return this.http.get(`${environment.base_url}/category-field/${id}`, { params });
  }

  changeActive(id: any, data: any) {
    return this.http.put(`${environment.base_url}/category-active/${id}`, data);
  }

  saveCategoria(data: any) {
    return this.http.post(`${environment.base_url}/category`, data);
  }

  deleteVariable(id) {
    return this.http.delete(`${environment.base_url}/category-variable/${id}`);
  }
}
