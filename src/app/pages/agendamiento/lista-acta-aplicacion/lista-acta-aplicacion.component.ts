import { Component, OnInit, ViewChild } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import Swal from 'sweetalert2';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { StandardModule } from '@shared/components/standard-components/standard.module';
import { ActionDeactivateComponent } from '@shared/components/standard-components/action-deactivate/action-deactivate.component';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { ViewMoreComponent } from '@shared/components/view-more/view-more.component';
import { AutomaticSearchComponent } from '@shared/components/automatic-search/automatic-search.component';
import { SwalService } from '@app/pages/ajustes/informacion-base/services/swal.service';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { ModalService } from 'src/app/core/services/modal.service';
import { ActaAplicacionService } from '../acta-aplicacion.service';

@Component({
  selector: 'app-lista-acta-aplicacion',
  templateUrl: './lista-acta-aplicacion.component.html',
  styleUrls: ['./lista-acta-aplicacion.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    NgIf,
    NgFor,
    DatePipe,
    StandardModule,
    ViewMoreComponent,
    ActionDeactivateComponent,
    AutomaticSearchComponent,
    ModalComponent,
  ],
})
export class ListaActaAplicacionComponent implements OnInit {
  @ViewChild('modalDetail') modalDetail: any;

  listMinutes: any = [];

  listProducts: any = [];

  filters: any = {
    patient: '',
    date: '',
    state: '',
  };

  pagination = {
    pageSize: 15,
    page: 1,
    length: 0,
  };

  loading = false;

  constructor(
    private _acta: ActaAplicacionService,
    private modalBD: ModalService,
    readonly urlFiltersService: UrlFiltersService,
    private readonly swalService: SwalService,
  ) {}

  ngOnInit(): void {
    this.getUrlFilters();
    this.filtersCertificates();
  }

  private getUrlFilters(): void {
    this.pagination = this.urlFiltersService.currentPagination;
    this.filters = this.urlFiltersService.currentFilters;
  }

  filtersCertificates() {
    const params = {
      ...this.pagination,
      ...this.filters,
    };
    this.loading = true;
    this._acta.getActas(params).subscribe((r: any) => {
      this.listMinutes = r.data.data;
      this.pagination.length = r.data.total;
      this.loading = false;
    });
    this.urlFiltersService.setUrlFilters(params);
  }

  cancelCertificates(id) {
    const request = () => {
      this._acta.setCertificates({ id, data: { state: 'Anulada' } }).subscribe((r: any) => {
        if (r.code == 200) {
          Swal.fire({
            title: 'Opersación exitosa',
            text: 'Se ha cancelado el acta',
            icon: 'success',
            allowOutsideClick: false,
            allowEscapeKey: false,
          });
          this.filtersCertificates();
        } else {
          Swal.fire({
            title: 'Operación denegada',
            text: r.err,
            icon: 'error',
            allowOutsideClick: false,
            allowEscapeKey: false,
          });
        }
      });
    };
    this.swalService.swalLoading('Va a anular esta acta', request);
  }

  detailCertificates(modal) {
    /* this.modalDetail.show() */
    this.modalBD.openLg(modal);
  }
}
