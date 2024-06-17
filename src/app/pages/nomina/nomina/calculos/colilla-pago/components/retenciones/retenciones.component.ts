import { Component, Input, OnInit } from '@angular/core';
import { NgFor, DecimalPipe, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-retenciones',
  templateUrl: './retenciones.component.html',
  styleUrls: ['./retenciones.component.scss'],
  standalone: true,
  imports: [NgFor, DecimalPipe, CurrencyPipe],
})
export class RetencionesComponent implements OnInit {
  @Input('retencionesDatos') retencionesDatos;
  @Input('brand') brand;
  @Input('datosEmpresa') datosEmpresa;
  @Input('nominaSeguridadFuncionario') nominaSeguridadFuncionario;
  constructor() {}

  retenciones: any;
  factorRetenciones: any[] = [];
  totalRetenciones: any[] = [];
  totalPorcentajes: any[] = [];
  factorDeConversion = 100;

  ngOnInit(): void {
    this.retenciones = this.retencionesDatos;
    this.organizarDatos(this.retenciones.retenciones, this.factorRetenciones);
    this.organizarDatos(this.retenciones.total_retenciones, this.totalRetenciones);
    this.organizarDatos(this.retenciones.porcentajes, this.totalPorcentajes);
  }

  organizarDatos(objeto, arrayAllenar) {
    for (let prop in objeto) {
      if (objeto[prop] > 0) {
        arrayAllenar.push({ concepto: prop, valor: objeto[prop] });
      }
    }
  }
}
