import { Component, Input, OnInit } from '@angular/core';
import { NgIf, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-salario',
  templateUrl: './salario.component.html',
  styleUrls: ['./salario.component.scss'],
  standalone: true,
  imports: [NgIf, CurrencyPipe],
})
export class SalarioComponent implements OnInit {
  @Input('funcionario') funcionario;
  @Input('salarioDatos') salarioDatos;
  @Input('datosEmpresa') datosEmpresa;
  @Input('brand') brand;

  constructor() {}

  ngOnInit(): void {}
}
