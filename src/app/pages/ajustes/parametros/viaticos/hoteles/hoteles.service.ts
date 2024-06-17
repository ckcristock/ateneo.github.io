import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HotelesService {
  constructor(private http: HttpClient) {}

  getCities() {
    return this.http.get(`${environment.base_url}/municipalities`);
  }

  getHotels(params = {}) {
    return this.http.get(`${environment.base_url}/paginateHotels`, { params });
  }

  getAccommodation() {
    return this.http.get(`${environment.base_url}/accommodations`);
  }

  getAccommodationPaginate(params) {
    return this.http.get(`${environment.base_url}/paginate-accommodations`, { params });
  }

  createHotel(data: any) {
    return this.http.post(`${environment.base_url}/hotels`, data);
  }

  createUpdateAccomodation(data: any) {
    return this.http.post(`${environment.base_url}/accommodations`, data);
  }

  deleteAccommodation(data: any) {
    //este es un borrado lógico (lo mismo que un desactivar)
    return this.http.delete(`${environment.base_url}/accommodations/${data}`);
  }

  restoreAccommodation(data: any) {
    return this.http.post(`${environment.base_url}/restore-accommodation`, { data });
  }
}
