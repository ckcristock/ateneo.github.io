import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { Pagination } from '@shared/interfaces/global.interface';
import { SwalService } from '../../informacion-base/services/swal.service';
import { AutomaticSearchComponent } from '../../../../shared/components/automatic-search/automatic-search.component';
import { ActionEditComponent } from '../../../../shared/components/standard-components/action-edit/action-edit.component';
import { DropdownActionsComponent } from '../../../../shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { TableComponent } from '../../../../shared/components/standard-components/table/table.component';
import { AddButtonComponent } from '../../../../shared/components/standard-components/add-button/add-button.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';

@Component({
  selector: 'app-tiposervicios',
  templateUrl: './tiposervicios.component.html',
  styleUrls: ['./tiposervicios.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    AddButtonComponent,
    RouterLink,
    TableComponent,
    DropdownActionsComponent,
    ActionEditComponent,
    AutomaticSearchComponent,
  ],
})
export class TiposerviciosComponent implements OnInit {
  public servicios: any[];
  confirmacionSwal: any;

  public Cargando: boolean = true;
  public Lista_Servicios: any = [];
  public Lista_Tipo_Soporte = [];

  pagination: Pagination = {
    page: 1,
    pageSize: 5,
    length: 0,
  };

  filters: any = {
    cod: '',
    tipo: '',
  };

  loading = false;

  globales = environment;

  constructor(
    private http: HttpClient,
    readonly urlFiltersService: UrlFiltersService,
    private readonly swalService: SwalService,
  ) {
    this.ListarTipoServicio();
  }

  ngOnInit() {
    this.getUrlFilters();
    this.http
      .get(this.globales.base_url + '/php/lista_generales.php', {
        params: { modulo: 'Tipo_Servicio' },
      })
      .subscribe((data: any) => {
        this.servicios = data;
      });
  }

  private getUrlFilters(): void {
    this.pagination = this.urlFiltersService.currentPagination;
    this.filters = this.urlFiltersService.currentFilters;
  }

  ListarTipoServicio() {
    this.Cargando = true;

    const params = {
      ...this.pagination,
      ...this.filtros,
    };

    this.http
      .get(this.globales.ruta + '/php/configuracion/lista_tipo_servicio.php', { params })
      .subscribe((data: any) => {
        this.Cargando = false;
        this.Lista_Servicios = data.Servicios;
        this.pagination.length = data.numReg;
      });
    this.urlFiltersService.setUrlFilters(params);
  }

  EliminarTipoServicio(id) {
    const request = () => {
      let datos = new FormData();
      datos.append('modulo', 'Tipo_Servicio');
      datos.append('id', id);
      this.http
        .post(this.globales.ruta + 'php/genericos/eliminar_generico.php', datos)
        .subscribe((data: any) => {
          this.servicios = data;
          data.icon = data.type;
          Swal.fire(data);
        });
    };
    this.swalService.swalLoading(
      'Se dispone a eliminar este tipo de servicio, esta acción no se puede revertir',
      request,
    );
  }

  filtros() {
    this.Cargando = true;
    if (this.filters.cod || this.filters.tipo) {
      this.ListarTipoServicio();
    } else {
      this.http
        .get(this.globales.ruta + '/php/configuracion/lista_tipo_servicio.php')
        .subscribe((data: any) => {
          this.Cargando = false;
          this.Lista_Servicios = data.Servicios;
          this.pagination.length = data.numReg;
        });
    }
  }
}
