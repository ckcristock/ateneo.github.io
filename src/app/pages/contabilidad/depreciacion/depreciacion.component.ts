import { Component, OnInit } from '@angular/core';
import { TabladepreciacionComponent } from './tabladepreciacion/tabladepreciacion.component';
import { CabeceraComponent } from '../../../components/cabecera/cabecera.component';

@Component({
  selector: 'app-depreciacion',
  templateUrl: './depreciacion.component.html',
  styleUrls: ['./depreciacion.component.scss'],
  standalone: true,
  imports: [CabeceraComponent, TabladepreciacionComponent],
})
export class DepreciacionComponent implements OnInit {
  public DatosCabecera = {
    Titulo: 'Depreciación de activos fijos',
    Fecha: new Date(),
    Codigo: '',
  };

  constructor() {}

  ngOnInit(): void {}
  estadoFiltros = false;
  mostrarFiltros() {
    this.estadoFiltros = !this.estadoFiltros;
  }
}
