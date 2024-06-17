import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TiposActivoFijoService {
  constructor(private http: HttpClient) {}

  getFixedAssetType(params = {}) {
    return this.http.get(`${environment.base_url}/paginateFixedAssetType`, { params });
  }

  updateOrCreateFixedAssetType(data: any) {
    return this.http.post(`${environment.base_url}/fixed_asset_type`, data);
  }

  getAccountPlan() {
    return this.http.get(`${environment.base_url}/account-plan`);
  }
}
