import { Component, OnInit } from '@angular/core';
import { TurnoRotativoComponent } from './turno-rotativo/turno-rotativo.component';
import { TurnoFijoComponent } from './turno-fijo/turno-fijo.component';

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.scss'],
  standalone: true,
  imports: [TurnoFijoComponent, TurnoRotativoComponent],
})
export class TurnosComponent implements OnInit {
  active = 1;
  constructor() {}

  ngOnInit(): void {}
}
