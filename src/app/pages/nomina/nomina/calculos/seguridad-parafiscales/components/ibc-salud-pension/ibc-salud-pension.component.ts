import { Component, Input, OnInit } from '@angular/core';
import { NgFor, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-ibc-salud-pension',
  templateUrl: './ibc-salud-pension.component.html',
  styleUrls: ['./ibc-salud-pension.component.scss'],
  standalone: true,
  imports: [NgFor, CurrencyPipe],
})
export class IbcSaludPensionComponent implements OnInit {
  @Input('retencionesDatos') retencionesDatos;
  retenciones: any = {};
  ibc: any[] = [];

  constructor() {}
  ngOnInit(): void {
    this.retenciones = this.retencionesDatos;
    this.organizarIbc();
  }
  organizarIbc() {
    for (let prop in this.retenciones.retenciones) {
      if (this.retenciones.retenciones[prop] > 0) {
        this.ibc.push({
          concepto: prop,
          valor: this.retenciones.retenciones[prop],
        });
      }
    }
  }
}
