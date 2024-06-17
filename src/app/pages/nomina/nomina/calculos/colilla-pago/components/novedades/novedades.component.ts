import { Component, Input, OnInit } from '@angular/core';
import { NgFor, NgIf, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-novedades',
  templateUrl: './novedades.component.html',
  styleUrls: ['./novedades.component.scss'],
  standalone: true,
  imports: [NgFor, NgIf, CurrencyPipe],
})
export class NovedadesComponent implements OnInit {
  @Input('novedadesDatos') novedadesDatos;
  @Input('datosEmpresa') datosEmpresa;
  @Input('funcionario') funcionario;
  @Input('brand') brand;
  novedades: any = {};
  arrayNovedades: any = [];
  existeIncapacidad = false;
  constructor() {}

  ngOnInit(): void {
    this.novedades = this.novedadesDatos;
    this.organizarNovedades();
  }

  organizarNovedades() {
    for (let prop in this.novedades.novedades_totales) {
      if (prop.split(' ')[0] == 'Incapacidad') {
        this.existeIncapacidad = true;
      }
      this.arrayNovedades.push({
        concepto: prop,
        valor: this.novedades.novedades_totales[prop],
        dias: this.novedades.novedades[prop],
      });
    }
  }

  get salaryProm() {
    return Math.round(this.datosEmpresa.base_salary / 30);
  }
}
