import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Location, NgIf, NgFor, NgClass, DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import {
  NgbDropdown,
  NgbDropdownToggle,
  NgbDropdownMenu,
  NgbPagination,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-factura-administrativa',
  templateUrl: './factura-administrativa.component.html',
  styleUrls: ['./factura-administrativa.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    NgIf,
    NgFor,
    NgClass,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbPagination,
    DatePipe,
  ],
})
export class FacturaAdministrativaComponent implements OnInit {
  public filtro_cod_fact: string = '';
  public filtro_fecha_fact: any = '';
  public filtro_estado_fact: string = '';
  public filtro_facturador: string = '';
  public filtro_cliente: string = '';
  public filtro_tipo_fact: string = '';
  public page1 = 1;
  public maxSize = 15;
  public TotalItems1: number;
  public Cargando = false;
  public Facturas: any = [];
  public Servicios: any = [];

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private location: Location,
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
    this.Cargando = true;
    this.http
      .get(
        environment.ruta +
          '/php/factura_administrativa/get_facturas_administrativas.php?' +
          queryString,
      )
      .subscribe((data: any) => {
        this.Facturas = data.Facturas;
        this.TotalItems1 = data.numReg;
        this.Cargando = false;
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

    this.location.replaceState('/facturaadministrativa', queryString);
    this.Cargando = true;
    this.http
      .get(
        environment.ruta +
          '/php/factura_administrativa/get_facturas_administrativas.php?' +
          queryString,
      )
      .subscribe((data: any) => {
        this.Facturas = data.Facturas;
        this.TotalItems1 = data.numReg;
        this.Cargando = false;
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
        if (typeof this.filtro_fecha_fact == 'object') {
          this.filtro_fecha_fact = this.filtro_fecha_fact.formatted;
        }
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

      this.location.replaceState('/facturaadministrativa', queryString);
      this.Cargando = true;
      this.http
        .get(
          environment.ruta +
            'php/factura_administrativa/get_facturas_administrativas.php?' +
            queryString,
        )
        .subscribe((data: any) => {
          this.Facturas = data.Facturas;
          this.TotalItems1 = data.numReg;
          this.Cargando = false;
        });
    } else {
      this.location.replaceState('/facturaadministrativa', '');

      this.page1 = 1;
      this.filtro_fecha_fact = '';
      this.filtro_cod_fact = '';
      this.filtro_estado_fact = '';
      this.filtro_facturador = '';
      this.filtro_cliente = '';
      this.filtro_tipo_fact = '';
      this.Cargando = true;
      this.http
        .get(environment.ruta + 'php/factura_administrativa/get_facturas_administrativas.php?')
        .subscribe((data: any) => {
          this.Facturas = data.Facturas;
          this.TotalItems1 = data.numReg;
          this.Cargando = false;
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
    this.http
      .get(environment.ruta + 'php/dispensaciones/get_servicios.php')
      .subscribe((data: any) => {
        this.Servicios = data;
      });
  }
}
