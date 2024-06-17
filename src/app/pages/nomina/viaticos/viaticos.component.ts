import { Component, OnInit } from '@angular/core';
import { CrearViaticosService } from './crear-viaticos/crear-viaticos.service';
import { PermissionService } from '../../../core/services/permission.service';
import { Permissions } from '../../../core/interfaces/permissions-interface';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TitleCasePipe, DatePipe, AsyncPipe, DecimalPipe } from '@angular/common';
import { LoadImageComponent } from '../../../shared/components/load-image/load-image.component';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AutocompleteMdlComponent } from '../../../components/autocomplete-mdl/autocomplete-mdl.component';
import { StandardModule } from '@shared/components/standard-components/standard.module';
import { AddButtonComponent } from '@shared/components/standard-components/add-button/add-button.component';
import { StatusBadgeComponent } from '@shared/components/status-badge/status-badge.component';
import { ActionViewComponent } from '@shared/components/standard-components/action-view/action-view.component';
import { ActionEditComponent } from '@shared/components/standard-components/action-edit/action-edit.component';
import { ActionActivateComponent } from '@shared/components/standard-components/action-activate/action-activate.component';
import { ActionDeactivateComponent } from '@shared/components/standard-components/action-deactivate/action-deactivate.component';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { Observable } from 'rxjs';
import { GlobalService } from '@shared/services/global.service';

@Component({
  selector: 'app-viaticos',
  templateUrl: './viaticos.component.html',
  styleUrls: ['./viaticos.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    AutocompleteMdlComponent,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    LoadImageComponent,
    RouterLinkActive,
    DecimalPipe,
    TitleCasePipe,
    DatePipe,
    AsyncPipe,
    StandardModule,
    AddButtonComponent,
    StatusBadgeComponent,
    ActionViewComponent,
    ActionEditComponent,
    ActionEditComponent,
    ActionActivateComponent,
    ActionDeactivateComponent,
  ],
})
export class ViaticosComponent implements OnInit {
  data: any[] = [];
  people$ = new Observable();
  loading: boolean = false;
  permission: Permissions = {
    menu: 'Viáticos',
    permissions: {
      approve: true,
    },
  };
  filtros: any = {
    person_id: '',
    creation_date: '',
    departure_date: '',
    state: '',
  };
  pagination = {
    page: 1,
    pageSize: 10,
    length: 0,
  };
  states: any = [
    { clave: 'Todos' },
    { clave: 'Pendiente' },
    { clave: 'Aprobado' },
    { clave: 'Legalizado' },
    /*  { clave: 'Activo' }, */
    { clave: 'Inactivo' },
  ];

  constructor(
    private _viaticos: CrearViaticosService,
    private _permission: PermissionService,
    private _swal: SwalService,
    private readonly globalService: GlobalService,
    readonly urlFiltersService: UrlFiltersService,
  ) {
    this.permission = this._permission.validatePermissions(this.permission);
  }

  ngOnInit(): void {
    this.people$ = this.globalService.getAllPeople$;
    this.getUrlFilters();
    this.getAll();
  }

  private getUrlFilters(): void {
    this.pagination = this.urlFiltersService.currentPagination;
    this.filtros = this.urlFiltersService.currentFilters;
  }

  estadoFiltros = false;
  mostrarFiltros() {
    this.estadoFiltros = !this.estadoFiltros;
  }

  tipo() {
    let value = this.filtros.person_id;
    if (typeof value == 'object') {
      this.filtros.person_id = value.value;
    } else {
      return;
    }
  }

  getAll() {
    let params = {
      ...this.pagination,
      ...this.filtros,
    };
    this.loading = true;
    this._viaticos.getAllViaticos(params).subscribe((r: any) => {
      this.data = r.data.data;
      this.pagination.length = r.data.total;
      this.loading = false;
    });
    this.urlFiltersService.setUrlFilters(params);
  }

  changeState(viatico, state) {
    const request = () => {
      let data = {
        id: viatico.id,
        state,
      };
      this._viaticos.changeState(data, data.id).subscribe((r: any) => {
        this.getAll();
        this._swal.show({
          icon: 'success',
          title: 'El viático ha sido ' + state,
          text: '¡' + state + '!',
          timer: 1000,
          showCancel: false,
        });
      });
    };
    this._swal.swalLoading(
      'El viático será ' + (state == 'inactivo' ? 'desactivado.' : 'aprobado'),
      request,
    );
  }
}
