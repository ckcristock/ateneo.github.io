import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

// import { Globales } from '../../globales/globales';
import { environment } from 'src/environments/environment';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-actividad',
  templateUrl: './actividad.component.html',
  styleUrls: ['./actividad.component.scss'],
})
export class ActividadComponent implements OnInit, OnChanges {
  ngOnChanges(changes: SimpleChanges): void {}

  @Input() Modulo: any;
  @Input() Actividades: any;
  @Input() Cargando: boolean = false;
  public environment: any;

  constructor() {}

  ngOnInit() {
    this.environment = environment;
  }
}
