import { Component, Input, OnInit } from '@angular/core';
import { NgFor, NgIf, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-seguridad-social-resumen',
  templateUrl: './seguridad-social-resumen.component.html',
  styleUrls: ['./seguridad-social-resumen.component.scss'],
  standalone: true,
  imports: [NgFor, NgIf, CurrencyPipe],
})
export class SeguridadSocialResumenComponent implements OnInit {
  @Input('seguridadDatos') seguridadDatos;
  @Input('ibcSeguridad') ibcSeguridad;
  @Input('porcentajesDatos') porcentajesDatos;

  seguridad: any[] = [];
  parafiscales: any[] = [];
  ibc: any = {};
  constructor() {}

  ngOnInit(): void {
    this.crearObjetoIbc();
    this.organizarDatos(this.seguridadDatos.seguridad_social, this.seguridad);
    this.organizarDatos(this.seguridadDatos.parafiscales, this.parafiscales);
  }

  crearObjetoIbc() {
    this.ibc.salud = this.ibcSeguridad;
    this.ibc.pension = this.ibcSeguridad;
    if (!Object.keys(this.seguridadDatos).length) return;
    this.ibc.riesgos = this.seguridadDatos.ibc_riesgos['IBC Riesgos'];
    this.ibc.sena = this.seguridadDatos.ibc_parafiscales['IBC Parafiscales'];
    this.ibc.icbf = this.seguridadDatos.ibc_parafiscales['IBC Parafiscales'];
    this.ibc.caja_compensacion = this.seguridadDatos.ibc_parafiscales['IBC Parafiscales'];
  }

  obtenerPrefijo(prefijo, objeto = {}) {
    for (let propiedad in objeto) {
      let prefijoPropiedad = propiedad.slice(0, 4).toLowerCase();
      if (prefijoPropiedad === prefijo) {
        return objeto[propiedad];
      }
    }
  }

  organizarDatos(objetoSeguridad, arrayAllenar = []) {
    for (let prop in objetoSeguridad) {
      let objeto = Object.create(null);
      let prefijo = prop.slice(0, 4).toLowerCase();
      objeto['porcentaje'] = this.obtenerPrefijo(prefijo, this.porcentajesDatos);
      objeto['ibc'] = this.obtenerPrefijo(prefijo, this.ibc);
      objeto['concepto'] = prop;
      objeto['valor'] = objetoSeguridad[prop];
      arrayAllenar.push(objeto);
    }
  }
}
