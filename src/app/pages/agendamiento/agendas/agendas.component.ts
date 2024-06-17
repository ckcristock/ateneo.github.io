import { Component, OnInit, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ListaTrabajoService } from './lista-trabajo.service';
import { PermissionService } from '../../../core/services/permission.service';
import Swal from 'sweetalert2';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { DetailStatsComponent } from './detail-stats/detail-stats.component';
import { StatsComponent } from '../../../components/stats/stats.component';
import { NgClass, DatePipe, NgFor } from '@angular/common';
import { StandardModule } from '@shared/components/standard-components/standard.module';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { LoadImageComponent } from '@shared/components/load-image/load-image.component';
import { AutocompleteMdlComponent } from '@app/components/autocomplete-mdl/autocomplete-mdl.component';
import { ActionViewComponent } from '@shared/components/standard-components/action-view/action-view.component';
import { ActionDeactivateComponent } from '@shared/components/standard-components/action-deactivate/action-deactivate.component';
import { FilterSchedulingComponent } from '../filter-scheduling/filter-scheduling.component';

@Component({
  selector: 'app-agendas',
  templateUrl: './agendas.component.html',
  styleUrls: ['./agendas.component.scss'],
  standalone: true,
  imports: [
    NgFor,
    NgClass,
    RouterLink,
    StatsComponent,
    DetailStatsComponent,
    NotDataComponent,
    DatePipe,
    StandardModule,
    LoadImageComponent,
    AutocompleteMdlComponent,
    ActionViewComponent,
    ActionDeactivateComponent,
    FilterSchedulingComponent,
  ],
})
export class AgendasComponent implements OnInit {
  public configComponent: any = {
    menu: 'Lista de Agendas',
    permissions: {
      show_all_data: false,
    },
  };

  statData: any;
  showDeitalStat = new EventEmitter<any>();
  loading = false;

  pagination = {
    pageSize: 15,
    page: 1,
    length: 0,
  };

  filters: any = {
    appointmentId: '',
    subappointmentId: '',
    speciality: '',
    person: '',
    ipsId: '',
    sede: '',
  };
  agendas = [];

  constructor(
    private _workList: ListaTrabajoService,
    private _permission: PermissionService,
    readonly urlFiltersService: UrlFiltersService,
  ) {
    this.configComponent = this._permission.validatePermissions(this.configComponent);
  }
  getStatics(params) {
    this._workList.getStatistics(params).subscribe((r) => {
      this.statData = r.data;
    });
  }

  getAgendamientos(filters?: any) {
    this.loading = true;
    // this.filters.show_all_data = this.configComponent.permissions.show_all_data;

    let params: any = Object.assign({}, this.pagination, this.filters, filters);

    this.getStatics(this.filters);
    this._workList.getAgendamientos(params).subscribe((d) => {
      this.pagination.length = d.total;
      this.agendas = d.data;
      this.loading = false;
    });
    this.urlFiltersService.setUrlFilters(params);
  }
  ngOnInit(): void {
    this.getUrlFilters();
    this.getAgendamientos();
  }

  private getUrlFilters(): void {
    this.pagination = this.urlFiltersService.currentPagination;
    this.filters = this.urlFiltersService.currentFilters;
  }

  cancel(id) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success mx-2',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: '¿está seguro?',
        text: 'Se dispone cancelar la agenda',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, ¡Hazlo !',
        cancelButtonText: 'No, ¡dejeme comprobar!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this._workList.cancelAppointment({ id }).subscribe((r: any) => {
            Swal.fire(
              'Operacion procesada',
              r.code == 200 ? r.data : r.err,
              r.code == 200 ? 'success' : 'error',
            );
            r.code == 200 ? this.getAgendamientos() : '';
          });
        }
      });
  }
  searchDetailStat(stat) {
    let params: any = this.filters;
    params.status = stat.status;

    this.showDeitalStat.emit(params);
  }
}
