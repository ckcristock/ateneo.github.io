import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TiposervicioService } from '../tiposervicio.service';
import { CommonModule, DatePipe, Location } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { DropdownActionsComponent } from '@shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { ActionButtonComponent } from '@shared/components/standard-components/action-button/action-button.component';
import { ActionViewComponent } from '@shared/components/standard-components/action-view/action-view.component';
import { ModalactaentregaComponent } from '../../dispensaciones/modalactaentrega/modalactaentrega.component';

@Component({
  standalone: true,
  imports: [
    ModalactaentregaComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatExpansionModule,
    NgbDropdownModule,
    RouterModule,
    NgbPaginationModule,
    MatIconModule,
    MatNativeDateModule,
    MatButtonModule,
    CardComponent,
    TableComponent,
    DropdownActionsComponent,
    ActionButtonComponent,
    ActionViewComponent,
  ],
  providers: [],
  selector: 'app-tablafacturacion',
  templateUrl: './tablafacturacion.component.html',
  styleUrls: ['./tablafacturacion.component.scss'],
})
export class TablafacturacionComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  public filtro_cod_fact: string = '';
  public filtro_fecha_fact: any = '';
  public filtro_estado_fact: string = '';
  public filtro_facturador: string = '';
  public filtro_cliente: string = '';
  public filtro_tipo_fact: string = '';

  public Cargando = false;
  public Facturas: any = [];
  public Servicios: any = [];
  public environment: any;
  range = new FormGroup({
    start: new FormControl<Date | string | null>(null),
    end: new FormControl<Date | string | null>(null),
  });
  datePipe = new DatePipe('es-CO');

  pagination = {
    page: 1,
    pageSize: 10,
    length: 0,
  };

  // myDateRangePickerOptions1: IMyDrpOptions = {
  //   width: '120px',
  //   height: '21px',
  //   selectBeginDateTxt: 'Inicio',
  //   selectEndDateTxt: 'Fin',
  //   selectionTxtFontSize: '10px',
  //   dateFormat: 'yyyy-mm-dd',
  // };
  constructor(
    private http: HttpClient,
    // public globales: Globales,
    private route: ActivatedRoute,
    private location: Location,
    private _tiposervicio: TiposervicioService,
  ) {
    this.getServicios();
  }

  ngOnInit() {
    this.ListarDetallesFacturacion();
    this.environment = environment;
    this.range.valueChanges.subscribe((r) => {
      if (r.start && r.end) {
        this.selectedDate(r.start, r.end);
      }
    });
  }

  ListarDetallesFacturacion() {
    let params = this.route.snapshot.queryParams;

    let queryString = '';

    if (Object.keys(params).length > 0) {
      // Si existe parametros o filtros
      // actualizando la variables con los valores de los paremetros.
      this.filtro_cod_fact = params.cod_fact ? params.cod_fact : '';
      this.filtro_fecha_fact = params.fecha_fact ? params.fecha_fact : '';
      this.filtro_estado_fact = params.estado_fact ? params.estado_fact : '';
      this.filtro_facturador = params.facturador ? params.facturador : '';
      this.filtro_cliente = params.cliente ? params.cliente : '';

      queryString =
        '?' +
        Object.keys(params)
          .map((key) => key + '=' + params[key])
          .join('&');
    }

    this.http
      .get(environment.ruta + 'php/tablero_jefe_facturacion/lista_facturas.php' + queryString)
      .subscribe((data: any) => {
        this.Facturas = data.Facturas;
        this.pagination.length = data.numReg;
      });
  }

  paginacion() {
    let params: any = {
      pag: this.pagination.length,
    };

    if (this.filtro_cod_fact != '') {
      params.cod_fact = this.filtro_cod_fact;
    }
    if (this.filtro_fecha_fact != '' && this.filtro_fecha_fact != null) {
      params.fecha_fact = this.filtro_fecha_fact;
    }
    if (this.filtro_estado_fact != '') {
      params.estado_fact = this.filtro_estado_fact;
    }
    if (this.filtro_facturador != '') {
      params.facturador = this.filtro_facturador;
    }
    if (this.filtro_cliente != '') {
      params.cliente = this.filtro_cliente;
    }
    if (this.filtro_tipo_fact != '') {
      params.tipo = this.filtro_tipo_fact;
    }

    let queryString = Object.keys(params)
      .map((key) => key + '=' + params[key])
      .join('&');

    this.location.replaceState('/cmfacturacion', queryString);

    this.http
      .get(environment.ruta + 'php/tablero_jefe_facturacion/lista_facturas.php?' + queryString)
      .subscribe((data: any) => {
        this.Facturas = data.Facturas;
        this.pagination.length = data.numReg;
      });
  }
  filtros1() {
    let params: any = {};

    if (
      this.filtro_cod_fact != '' ||
      this.filtro_fecha_fact != '' ||
      this.filtro_estado_fact != '' ||
      this.filtro_facturador != '' ||
      this.filtro_cliente != '' ||
      this.filtro_tipo_fact != ''
    ) {
      params.pag = this.pagination.length;

      if (this.filtro_cod_fact != '') {
        params.cod_fact = this.filtro_cod_fact;
      }
      if (this.filtro_fecha_fact != '' && this.filtro_fecha_fact != null) {
        params.fecha_fact = this.filtro_fecha_fact;
      }
      if (this.filtro_estado_fact != '') {
        params.estado_fact = this.filtro_estado_fact;
      }
      if (this.filtro_facturador != '') {
        params.facturador = this.filtro_facturador;
      }
      if (this.filtro_cliente != '') {
        params.cliente = this.filtro_cliente;
      }
      if (this.filtro_tipo_fact != '') {
        params.tipo = this.filtro_tipo_fact;
      }

      let queryString = Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&');

      this.location.replaceState('/cmfacturacion', queryString);

      this.http
        .get(environment.ruta + 'php/tablero_jefe_facturacion/lista_facturas.php?' + queryString)
        .subscribe((data: any) => {
          this.Facturas = data.Facturas;
          this.pagination.length = data.numReg;
        });
    } else {
      this.location.replaceState('/cmfacturacion', '');

      this.filtro_fecha_fact = '';
      this.filtro_cod_fact = '';
      this.filtro_estado_fact = '';
      this.filtro_facturador = '';
      this.filtro_cliente = '';
      this.filtro_tipo_fact = '';

      this.http
        .get(environment.ruta + 'php/tablero_jefe_facturacion/lista_facturas.php')
        .subscribe((data: any) => {
          this.Facturas = data.Facturas;
          this.pagination.length = data.numReg;
        });
    }
  }

  dateRangeChanged1(event) {
    if (event.formatted != '') {
      this.filtro_fecha_fact = event.formatted;
    } else {
      this.filtro_fecha_fact = '';
    }
    this.filtros1();
  }

  selectedDate(start, end) {
    if (start && end) {
      this.filtro_fecha_fact =
        this.datePipe.transform(start, 'yyyy-MM-dd') +
        ' - ' +
        this.datePipe.transform(end, 'yyyy-MM-dd');
    } else this.filtro_fecha_fact = '';
    this.filtros1();
  }

  getServicios() {
    this._tiposervicio.GetServiciosTipoServicio().subscribe((data: any) => {
      this.Servicios = data;
    });
  }

  matPanel = false;
  openClose() {
    if (this.matPanel == false) {
      this.accordion.openAll();
      this.matPanel = true;
    } else {
      this.accordion.closeAll();
      this.matPanel = false;
    }
  }

  borrarFechas() {
    if (this.range.get('start').value && this.range.get('end').value) {
      this.range.setValue({
        start: null,
        end: null,
      });
      this.selectedDate(null, null);
    }
  }
}
