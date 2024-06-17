import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { environment } from 'src/environments/environment';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-actividad',
  templateUrl: './actividad.component.html',
  styleUrls: ['./actividad.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor],
})
export class ActividadComponent implements OnInit, OnChanges {
  ngOnChanges(changes: SimpleChanges): void {}

  @Input() Modulo;
  @Input() Actividades;

  globales = environment;
  constructor() {}

  ngOnInit() {}
}
