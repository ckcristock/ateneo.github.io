import { Component, OnInit } from '@angular/core';
import { Globales } from '../../globales';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CabeceraComponent } from '../../../../components/cabecera/cabecera.component';

@Component({
  selector: 'app-resumenretenciones',
  templateUrl: './resumenretenciones.component.html',
  styleUrls: ['./resumenretenciones.component.scss'],
  standalone: true,
  imports: [
    CabeceraComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
  ],
})
export class ResumenretencionesComponent implements OnInit {
  public datosCabecera: any = {
    Titulo: 'Resumen de retenciones',
    Fecha: new Date(),
  };
  public model: any = {
    Fecha_Inicio: '',
    Fecha_Fin: '',
    Tipo_Retencion: 'Retefuente',
    Tipo_Reporte: 'Pcga',
  };
  queryParams: string;

  constructor(
    private globales: Globales,
    private http: HttpClient,
  ) {}

  ngOnInit() {}

  setQueryParams() {
    let params: any = {};

    for (const key in this.model) {
      params[key] = this.model[key];
    }

    this.queryParams = Object.keys(params)
      .map((key) => key + '=' + params[key])
      .join('&');
  }

  generarResumen() {
    window.open(
      environment.ruta + 'php/contabilidad/resumenretenciones/reporte.php?' + this.queryParams,
      '_blank',
    );
  }
}
