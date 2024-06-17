import { Component, Input, OnInit } from '@angular/core';
import { NgIf, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-extras-recargos',
  templateUrl: './extras-recargos.component.html',
  styleUrls: ['./extras-recargos.component.scss'],
  standalone: true,
  imports: [NgIf, CurrencyPipe],
})
export class ExtrasRecargosComponent implements OnInit {
  @Input('horasExtrasDatos') horasExtrasDatos;
  @Input('porcentajesExtrasDatos') porcentajesExtrasDatos;
  @Input('funcionario') funcionario;

  constructor() {}

  ngOnInit(): void {}
}
