import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Location, NgFor, NgIf, NgClass, DatePipe } from '@angular/common';
import { FacturaMedicamentosService } from '../factura-medicamentos.service';
import { environment } from 'src/environments/environment';
import { NgbDropdown, NgbDropdownToggle, NgbDropdownMenu } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tabla-facturacion',
  templateUrl: './tabla-facturacion.component.html',
  styleUrls: ['./tabla-facturacion.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    NgFor,
    NgIf,
    NgClass,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    RouterLink,
    DatePipe,
  ],
})
export class TablaFacturacionComponent implements OnInit {
  public filtro_cod_fact: string = '';
  public filtro_fecha_fact: any = '';
  public filtro_estado_fact: string = '';
  public filtro_facturador: string = '';
  public filtro_cliente: string = '';
  public filtro_tipo_fact: string = '';
  public page1 = 1;
  public maxSize = 20;
  public TotalItems1: number;
  public Cargando = false;
  public Facturas: any = [];
  public Servicios: any = [];

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private location: Location,
    private _tiposervicio: FacturaMedicamentosService,
  ) {
    this.getServicios();
  }

  ngOnInit() {
    this.ListarDetallesFacturacion();
  }

  ListarDetallesFacturacion() {
    let params = this.route.snapshot.queryParams;

    let queryString = '';

    if (Object.keys(params).length > 0) {
      // Si existe parametros o filtros
      // actualizando la variables con los valores de los paremetros.
      this.page1 = params.pag ? params.pag : 1;
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
      .get(environment.ruta + '/php/tablero_jefe_facturacion/lista_facturas.php' + queryString)
      .subscribe((data: any) => {
        this.Facturas = data.Facturas;
        this.TotalItems1 = data.numReg;
      });
  }

  paginacion() {
    let params: any = {
      pag: this.page1,
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
      .get(environment.ruta + '/php/tablero_jefe_facturacion/lista_facturas.php?' + queryString)
      .subscribe((data: any) => {
        this.Facturas = data.Facturas;
        this.TotalItems1 = data.numReg;
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
      this.page1 = 1;
      params.pag = this.page1;

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
        .get(environment.ruta + '/php/tablero_jefe_facturacion/lista_facturas.php?' + queryString)
        .subscribe((data: any) => {
          this.Facturas = data.Facturas;
          this.TotalItems1 = data.numReg;
        });
    } else {
      this.location.replaceState('/cmfacturacion', '');

      this.page1 = 1;
      this.filtro_fecha_fact = '';
      this.filtro_cod_fact = '';
      this.filtro_estado_fact = '';
      this.filtro_facturador = '';
      this.filtro_cliente = '';
      this.filtro_tipo_fact = '';

      this.http
        .get(environment.ruta + '/php/tablero_jefe_facturacion/lista_facturas.php')
        .subscribe((data: any) => {
          this.Facturas = data.Facturas;
          this.TotalItems1 = data.numReg;
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
  getServicios() {
    this._tiposervicio.GetServiciosTipoServicio().subscribe((data: any) => {
      this.Servicios = data;
    });
  }
}
