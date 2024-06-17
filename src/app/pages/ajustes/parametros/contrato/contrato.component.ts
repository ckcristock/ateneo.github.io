import { Component, OnInit } from '@angular/core';
import { TiposTerminoComponent } from './components/tipos-termino/tipos-termino.component';
import { TiposSalarioComponent } from './components/tipos-salario/tipos-salario.component';
import { TiposDocumentoComponent } from './components/tipos-documento/tipos-documento.component';
import { TiposContratoComponent } from './components/tipos-contrato/tipos-contrato.component';

@Component({
  selector: 'app-contrato',
  templateUrl: './contrato.component.html',
  styleUrls: ['./contrato.component.scss'],
  standalone: true,
  imports: [
    TiposContratoComponent,
    TiposDocumentoComponent,
    TiposSalarioComponent,
    TiposTerminoComponent,
  ],
})
export class ContratoComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
