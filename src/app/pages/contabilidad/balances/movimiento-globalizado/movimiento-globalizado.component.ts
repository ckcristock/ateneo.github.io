import { Component, OnInit } from '@angular/core';
import { MovimientoGlobalizadoModel } from './MovimientoGlobalizadoModel';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { NgFor } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CabeceraComponent } from '../../../../components/cabecera/cabecera.component';

@Component({
  selector: 'app-movimiento-globalizado',
  templateUrl: './movimiento-globalizado.component.html',
  styleUrls: ['./movimiento-globalizado.component.scss'],
  standalone: true,
  imports: [
    CabeceraComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    NgFor,
    NgbTypeahead,
  ],
})
export class MovimientoGlobalizadoComponent implements OnInit {
  public datosCabecera: any = {
    Titulo: 'Movimientos globalizados',
    Fecha: new Date(),
  };

  public MovimientoGlobalizadoModel: MovimientoGlobalizadoModel = new MovimientoGlobalizadoModel();
  queryParams: string;
  public listaTiposDocumentos: any = [];
  public TerceroSeleccionado: any;
  private _rutaBase: string = environment.base_url + '/php/terceros/';
  terceros: any[] = [];
  constructor(
    private http: HttpClient,
    private _swal: SwalService,
  ) {}

  ngOnInit() {
    this.tiposDocumentos('Normal');
    this.FiltrarTerceros().subscribe((data: any) => {
      this.terceros = data;
    });
  }

  search_tercero = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map((term) =>
        term.length < 4
          ? []
          : this.terceros
              .filter((v) => v.Nombre.toLowerCase().indexOf(term.toLowerCase()) > -1)
              .slice(0, 10),
      ),
    );

  FiltrarTerceros(): Observable<any> {
    // let p = {coincidencia:match};
    return this.http.get(this._rutaBase + 'filtrar_terceros.php');
  }

  formatter_tercero = (x: { Nombre_Tercero: string }) => x.Nombre_Tercero;

  AsignarTercero(model) {
    if (typeof model == 'object') {
      this.MovimientoGlobalizadoModel.Nit = model.Nit;
    } else {
      this.MovimientoGlobalizadoModel.Nit = '';
    }

    this.setQueryParams();
  }

  setQueryParams() {
    let params: any = {};

    if (this.MovimientoGlobalizadoModel.Fecha_Inicial != '') {
      params.Fecha_Inicial = this.MovimientoGlobalizadoModel.Fecha_Inicial;
    }
    if (this.MovimientoGlobalizadoModel.Fecha_Corte != '') {
      params.Fecha_Corte = this.MovimientoGlobalizadoModel.Fecha_Corte;
    }
    if (this.MovimientoGlobalizadoModel.Nit != '') {
      params.Nit = this.MovimientoGlobalizadoModel.Nit;
    }
    if (this.MovimientoGlobalizadoModel.Fuente != '') {
      params.Fuente = this.MovimientoGlobalizadoModel.Fuente;
    }
    if (this.MovimientoGlobalizadoModel.Estado != '') {
      params.Estado = this.MovimientoGlobalizadoModel.Estado;
    }

    this.queryParams = Object.keys(params)
      .map((key) => key + '=' + params[key])
      .join('&');
  }

  tiposDocumentos(tipo) {
    let p: any = tipo != null && tipo != undefined ? { Tipo: 'Normal' } : {};
    this.http
      .get(environment.base_url + '/php/contabilidad/tipos_documentos.php', { params: p })
      .subscribe((data: any) => {
        this.listaTiposDocumentos = data;
      });
  }

  generarReporte() {
    if (
      Object.keys(this.MovimientoGlobalizadoModel)
        .filter((key) => key != 'Estado')
        .every((key) => this.MovimientoGlobalizadoModel[key])
    ) {
      window.open(
        environment.base_url +
          '/php/contabilidad/movimientoglobalizado/generar_reporte.php?' +
          this.queryParams,
        '_blank',
      );
    } else {
      this._swal.show({
        icon: 'error',
        title: 'Error',
        text: 'Completa toda la información.',
        showCancel: false,
      });
    }
  }
}
