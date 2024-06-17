import { Component, Input, OnInit } from '@angular/core';
import { NgFor, NgClass, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-ibc-riesgos',
  templateUrl: './ibc-riesgos.component.html',
  styleUrls: ['./ibc-riesgos.component.scss'],
  standalone: true,
  imports: [NgFor, NgClass, CurrencyPipe],
})
export class IbcRiesgosComponent implements OnInit {
  @Input('ibcRiesgos') ibcRiesgos;
  @Input('datosEmpresa') datosEmpresa;

  riesgos: any[] = [];
  ibc: any[] = [];
  //CSS
  bold: 'bold';
  constructor() {}

  ngOnInit(): void {
    this.riesgos = this.ibcRiesgos;
    this.organizarRiesgos();
  }
  organizarRiesgos() {
    for (let prop in this.riesgos) {
      if (this.riesgos[prop] > 0) {
        this.ibc.push({ concepto: prop, valor: this.riesgos[prop] });
      }
    }
  }
}
