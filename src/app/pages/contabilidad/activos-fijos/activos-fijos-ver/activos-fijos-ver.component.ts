import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AdicionesActivoFijoComponent } from './adiciones-activo-fijo/adiciones-activo-fijo.component';
import { TablaActivoFijoComponent } from './tabla-activo-fijo/tabla-activo-fijo.component';
import { CabeceraComponent } from '../../../../components/cabecera/cabecera.component';

@Component({
  selector: 'app-activos-fijos-ver',
  templateUrl: './activos-fijos-ver.component.html',
  styleUrls: ['./activos-fijos-ver.component.scss'],
  standalone: true,
  imports: [CabeceraComponent, TablaActivoFijoComponent, AdicionesActivoFijoComponent],
})
export class ActivosFijosVerComponent implements OnInit {
  public Datos: any = {
    Titulo: 'Activo fijo',
    Fecha: new Date(),
  };
  public id = this.route.snapshot.params['id'];
  date: Date = new Date();
  constructor(
    private location: Location,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {}

  regresar() {
    this.location.back();
  }
}
