import { Component, OnInit } from '@angular/core';
import { ArlComponent } from './components/arl/arl.component';
import { BancosComponent } from './components/bancos/bancos.component';
import { CajaCompensacionComponent } from './components/caja-compensacion/caja-compensacion.component';
import { EpsComponent } from './components/eps/eps.component';
import { FondoCesantiasComponent } from './components/fondo-cesantias/fondo-cesantias.component';
import { FondoPensionComponent } from './components/fondo-pension/fondo-pension.component';

@Component({
  selector: 'app-nomina',
  templateUrl: './nomina.component.html',
  styleUrls: ['./nomina.component.scss'],
  standalone: true,
  imports: [
    FondoPensionComponent,
    FondoCesantiasComponent,
    EpsComponent,
    CajaCompensacionComponent,
    BancosComponent,
    ArlComponent,
  ],
})
export class NominaComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
