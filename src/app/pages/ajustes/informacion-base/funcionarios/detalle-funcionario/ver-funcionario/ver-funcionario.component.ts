import { Component, OnInit } from '@angular/core';
import { SalarioComponent } from './salario/salario.component';
import { AfiliacionesComponent } from './afiliaciones/afiliaciones.component';
import { DatosEmpresaComponent } from './datos-empresa/datos-empresa.component';
import { DatosBasicosComponent } from './datos-basicos/datos-basicos.component';

@Component({
  selector: 'app-ver-funcionario',
  templateUrl: './ver-funcionario.component.html',
  styleUrls: ['./ver-funcionario.component.scss'],
  standalone: true,
  imports: [DatosBasicosComponent, DatosEmpresaComponent, AfiliacionesComponent, SalarioComponent],
})
export class VerFuncionarioComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
