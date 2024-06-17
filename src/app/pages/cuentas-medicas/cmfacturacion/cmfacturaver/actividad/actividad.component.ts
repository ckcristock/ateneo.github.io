import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
// import { Globales } from '../../globales/globales';
import { Globales } from 'src/app/pages/inventario/services/globales-datos';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatExpansionModule,
    NgbDropdownModule,
  ],
  providers: [],
  selector: 'app-actividad',
  templateUrl: './actividad.component.html',
  styleUrls: ['./actividad.component.scss'],
})
export class ActividadComponent implements OnInit, OnChanges {
  ngOnChanges(changes: SimpleChanges): void {}

  @Input() Modulo;
  @Input() Actividades;
  constructor(public globales: Globales) {}

  ngOnInit() {}
}
