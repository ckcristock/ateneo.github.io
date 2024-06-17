import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DotacionService {
  constructor(private http: HttpClient) {}

  getInventary(params = {}) {
    return this.http.get(`${environment.base_url}/inventary-dotation`, { params });
  }
  getInventaryGroupByCategory(params = {}) {
    return this.http.get(`${environment.base_url}/inventary-dotation-by-category`, { params });
  }

  getProductDotationTypes(params = {}) {
    return this.http.get(`${environment.base_url}/product-dotation-types`, { params });
  }
  saveProductDotationTypes(data) {
    return this.http.post(`${environment.base_url}/product-dotation-types`, data);
  }

  getCuantityDispatched(params) {
    return this.http.get(`${environment.base_url}/inventary-dotation-statistics`, { params });
  }

  getStok(params) {
    return this.http.get(`${environment.base_url}/inventary-dotation-stock`, { params });
    // .pipe(
    //   map((data:any) =>{
    //     data.data.forEach(element => {
    //      element.stock = element.inventary.reduce((acc, el) => {return acc + el.stock},0)

    //      element.inventary.forEach(e => {
    //       e.apartada = e.dotacion_producto.reduce((acc, el) => {return acc + el.quantity},0)

    //     })
    //     });

    //     return data;
    //   })
    //   );
  }

  getTotatInventary(params = {}) {
    return this.http.get(`${environment.base_url}/get-total-inventary`, { params });
  }

  getSelected(params = {}) {
    return this.http.get(`${environment.base_url}/get-selected`, { params });
  }

  getStokEpp(params = {}) {
    return this.http.get(`${environment.base_url}/inventary-dotation-stock-epp`, { params }).pipe(
      map((data: any) => {
        data.data.forEach((element) => {
          element.stock = element.inventary.reduce((acc, el) => {
            return acc + el.stock;
          }, 0);
          element.show = false;
        });
        return data;
      }),
    );
  }

  saveDotation(data) {
    return this.http.post(`${environment.base_url}/dotations`, data);
  }

  getDotations(params = {}) {
    return this.http.get(`${environment.base_url}/dotations`, { params });
  }

  // getDotationsProduct(params = {}) {
  getDotationsProduct({ params }) {
    return this.http.get(`${environment.base_url}/dotations-list-product`, { params });
  }

  setDotation({ id, data }) {
    return this.http.post(`${environment.base_url}/dotations-update/${id}`, data);
  }

  updateStock(data) {
    return this.http.post(`${environment.base_url}/dotations-update-stock`, data);
  }

  approveDotation({ id, data }) {
    return this.http.post(`${environment.base_url}/dotations-approve/${id}`, data);
  }

  getDotationTotalByCategory(params) {
    return this.http.get(`${environment.base_url}/dotations-total-types`, { params });
  }

  DownloadInventoryDotation(params = {}) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(`${environment.base_url}/inventary-dotation-download`, {
      params,
      headers,
      responseType: 'blob' as 'json',
    });
  }

  downloadDeliveries(date1, date2, params = {}) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(`${environment.base_url}/downloadeliveries/download/${date1}/${date2}`, {
      params,
      headers,
      responseType: 'blob' as 'json',
    });
  }

  removeCategory(id: number): Observable<any> {
    return this.http.delete(`${environment.base_url}/product-dotation-types/${id}`);
  }

  getPDF(id) {
    return this.http.get(`${environment.base_url}/dotations-download/${id}`, {
      responseType: 'blob' as 'json',
    });
  }
}
