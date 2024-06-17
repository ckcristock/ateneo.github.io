import { Component, OnInit } from '@angular/core';
import { TiposVisaComponent } from './components/tipos-visa/tipos-visa.component';
import { LicenciaConduccionComponent } from './components/licencia-conduccion/licencia-conduccion.component';

@Component({
  selector: 'app-vacantes',
  templateUrl: './vacantes.component.html',
  styleUrls: ['./vacantes.component.scss'],
  standalone: true,
  imports: [LicenciaConduccionComponent, TiposVisaComponent],
})
export class VacantesComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
