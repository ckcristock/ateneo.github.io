import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../../core/services/search.service';
import { OpenAgendaService } from '../open-agenda.service';
import { WaitingListService } from './waiting-list.service';
import { TopWaitingComponent } from './top-waiting/top-waiting.component';
import { RouterLink } from '@angular/router';
import { MatOptionModule } from '@angular/material/core';
import { NgFor, DecimalPipe, DatePipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { StandardModule } from '@shared/components/standard-components/standard.module';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { AutocompleteMdlComponent } from '@app/components/autocomplete-mdl/autocomplete-mdl.component';
import { AutomaticSearchComponent } from '@shared/components/automatic-search/automatic-search.component';
import { SwalService } from '@app/pages/ajustes/informacion-base/services/swal.service';
@Component({
  selector: 'app-lista-espera',
  templateUrl: './lista-espera.component.html',
  styleUrls: ['./lista-espera.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    RouterLink,
    TopWaitingComponent,
    DecimalPipe,
    DatePipe,
    NgFor,
    StandardModule,
    AutocompleteMdlComponent,
    AutomaticSearchComponent,
  ],
})
export class ListaEsperaComponent implements OnInit {
  loading = false;
  pagination = {
    pageSize: 15,
    page: 1,
    length: 0,
  };
  filters: any = {
    date: '',
    institution: '',
    patient: '',
    speciality: '',
  };
  specialties: any = [];
  waitingList = [];
  companies = [];
  reasons: Object = {};

  constructor(
    public _search: SearchService,
    private _openAgendaService: OpenAgendaService,
    private _openS: OpenAgendaService,
    private _waiting: WaitingListService,
    private readonly swalService: SwalService,
    readonly urlFiltersService: UrlFiltersService,
  ) {}
  ngOnInit(): void {
    this.getUrlFilters();
    this.getWaitingList();
    this.getSpecialties();
    this.getCompanies();
    this.getReasons();
  }

  private getUrlFilters(): void {
    this.pagination = this.urlFiltersService.currentPagination;
    this.filters = this.urlFiltersService.currentFilters;
  }

  public getReasons() {
    this.reasons = {
      1: 'Paciente Fallecido',
      2: 'Cita Asignada por otra modalidad',
      3: 'Lista de Espera Erronea',
      4: 'Otra Causa',
    };
  }

  getCompanies() {
    this._openS.getIps('1').subscribe((r: any) => {
      this.companies = r.data;
      this.companies.unshift({
        value: '',
        text: 'TODOS',
      });
    });
  }

  getSpecialties() {
    this._openAgendaService.getSpecialties('0', '0').subscribe((resp: any) => {
      this.specialties = resp.data;
      this.specialties.unshift({
        value: '',
        text: 'TODOS',
      });
    });
  }

  getWaitingList() {
    this.loading = true;
    let params: any = Object.assign({}, this.pagination, this.filters);
    this._waiting.getWaitingList(params).subscribe((r: any) => {
      this.loading = false;
      this.pagination.length = r.data.total;
      this.waitingList = r.data.data;
    });
    this.urlFiltersService.setUrlFilters(params);
  }

  AnularEspera(IdCita) {
    this.swalService
      .customAlert({
        icon: 'info',
        title:
          'Se dispone a anular una Lista de Espera, escoja una razón para realizar esta acción',
        input: 'select',
        showCancelButton: true,
        inputOptions: this.reasons,
        inputPlaceholder: 'Seleccione una',
      })
      .then((res) => {
        const request = () => {
          this._waiting.cancellApointment(res.value, IdCita).subscribe((r: any) => {
            if (!r.data) {
              console.log('No se pudo completa la opracion');
              return false;
            }
            this.swalService.show({
              icon: 'success',
              title: '',
              text: 'Lista de Espera Anulada Correctamente',
              showCancel: false,
              timer: 2000,
            });
            this.getWaitingList();
          });
        };
        if (res.isConfirmed && res.value)
          this.swalService.swalLoading('Confirmar anulación', request);
      });
  }
}
