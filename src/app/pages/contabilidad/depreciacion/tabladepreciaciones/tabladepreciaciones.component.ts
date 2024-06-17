import { Component, OnInit, ViewChild } from '@angular/core';
// import { IMyDrpOptions } from 'mydaterangepicker';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import {
  NgbDropdown,
  NgbDropdownToggle,
  NgbDropdownMenu,
  NgbPagination,
} from '@ng-bootstrap/ng-bootstrap';
import { NgIf, NgFor, NgClass, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-tabladepreciaciones',
  templateUrl: './tabladepreciaciones.component.html',
  styleUrls: ['./tabladepreciaciones.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    NgIf,
    NgFor,
    NgClass,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbPagination,
    NotDataComponent,
    DatePipe,
  ],
})
export class TabladepreciacionesComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
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
  enviromen: any;
  public Cargando: boolean = false;
  public Filtros: any = {
    codigo_acta: '',
    codigo_orden: '',
    fechas_acta: '',
    fechas_orden: '',
    facturas: '',
    proveedor: '',
  };
  public Depreciaciones: Array<any> = [];

  //Paginación
  public maxSize = 5;
  public pageSize = 10;
  public TotalItems: number;
  public page = 1;
  public InformacionPaginacion: any = {
    desde: 0,
    hasta: 0,
    total: 0,
  };

  // public myDateRangePickerOptions: IMyDrpOptions = {
  //   width: '250px',
  //   height: '28px',
  //   selectBeginDateTxt: 'Inicio',
  //   selectEndDateTxt: 'Fin',
  //   selectionTxtFontSize: '10px',
  //   dateFormat: 'yyyy-mm-dd',
  // };
  constructor(private http: HttpClient) {
    this.ConsultaFiltrada();
  }

  ngOnInit() {
    this.enviromen = environment;
  }
  estadoFiltros = false;
  mostrarFiltros() {
    this.estadoFiltros = !this.estadoFiltros;
  }
  SetFiltros(paginacion: boolean) {
    let params: any = {};

    params.tam = this.pageSize;

    if (paginacion === true) {
      params.pag = this.page;
    } else {
      this.page = 1; // Volver a la página 1 al filtrar
      params.pag = this.page;
    }

    if (this.Filtros.codigo_acta.trim() != '') {
      params.codigo_acta = this.Filtros.codigo_acta;
    }

    if (this.Filtros.codigo_orden.trim() != '') {
      params.codigo_orden = this.Filtros.codigo_orden;
    }

    if (this.Filtros.fechas_acta.trim() != '') {
      params.fechas_acta = this.Filtros.fechas_acta;
    }

    if (this.Filtros.fechas_orden.trim() != '') {
      params.fechas_orden = this.Filtros.fechas_orden;
    }

    if (this.Filtros.proveedor.trim() != '') {
      params.proveedor = this.Filtros.proveedor;
    }

    if (this.Filtros.facturas.trim() != '') {
      params.facturas = this.Filtros.facturas;
    }

    return params;
  }

  ConsultaFiltrada(paginacion: boolean = false) {
    var params = this.SetFiltros(paginacion);

    if (params === '') {
      this.ResetValues();
      return;
    }

    this.Cargando = true;
    this.http
      .get(environment.base_url + '/php/depreciacion/get_depreciaciones.php', { params })
      .subscribe((data: any) => {
        if (data.codigo == 'success') {
          this.Depreciaciones = data.query_result;
          this.TotalItems = data.numReg;
        } else {
          this.Depreciaciones = [];
        }
        this.Cargando = false;
        this.SetInformacionPaginacion();
      });
  }

  ResetValues() {
    this.Filtros = {
      codigo_acta: '',
      codigo_orden: '',
      fechas_acta: '',
      fechas_orden: '',
      facturas: '',
      proveedor: '',
    };
  }
  SetInformacionPaginacion() {
    var calculoHasta = this.page * this.pageSize;
    var desde = calculoHasta - this.pageSize + 1;
    var hasta = calculoHasta > this.TotalItems ? this.TotalItems : calculoHasta;

    this.InformacionPaginacion['desde'] = desde;
    this.InformacionPaginacion['hasta'] = hasta;
    this.InformacionPaginacion['total'] = this.TotalItems;
  }

  fechita: any;
  fechitaF(event) {
    this.fechita = event.target.value;
    if (this.fechita2 != null) {
      this.Filtros.fechas_acta = this.fechita + ' - ' + this.fechita2;
      this.ConsultaFiltrada();
    }
  }
  fechita2: any;
  fechitaF2(event) {
    this.fechita2 = event.target.value;
    if (this.fechita != null) {
      this.Filtros.fechas_acta = this.fechita + ' - ' + this.fechita2;
      this.ConsultaFiltrada();
    }
  }

  /*   public OnDateRangeChanged( event:any){
      if (event.formatted != "") {
        this.Filtros.fechas_acta = event.formatted;
      } else {
        this.Filtros.fechas_acta = '';
      }
        this.ConsultaFiltrada();

    } */
}
