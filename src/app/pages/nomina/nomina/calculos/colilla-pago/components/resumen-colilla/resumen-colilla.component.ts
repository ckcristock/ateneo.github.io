import { Component, Input, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-resumen-colilla',
  templateUrl: './resumen-colilla.component.html',
  styleUrls: ['./resumen-colilla.component.scss'],
  standalone: true,
  imports: [DecimalPipe],
})
export class ResumenColillaComponent implements OnInit {
  @Input('salarioDatos') salarioDatos: any;
  @Input('horasExtrasDatos') horasExtrasDatos: any;
  @Input('novedadesDatos') novedadesDatos: any;
  @Input('ingresosDatos') ingresosDatos: any;
  @Input('retencionesDatos') retencionesDatos: any;
  @Input('deduccionesDatos') deduccionesDatos: any;
  @Input('netoApagar') netoApagar: any;

  constructor() {}

  ngOnInit(): void {}
}
