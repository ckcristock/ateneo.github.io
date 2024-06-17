import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TabladireccionamientosComponent } from './tabladireccionamientos/tabladireccionamientos.component';
import {
  NgbNav,
  NgbNavItem,
  NgbNavItemRole,
  NgbNavLinkButton,
  NgbNavLinkBase,
  NgbNavContent,
  NgbNavOutlet,
} from '@ng-bootstrap/ng-bootstrap';
import { AutomaticSearchComponent } from '../../../shared/components/automatic-search/automatic-search.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-direccionamientos',
  templateUrl: './direccionamientos.component.html',
  styleUrls: ['./direccionamientos.component.scss'],
  standalone: true,
  imports: [
    MatExpansionModule,
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    AutomaticSearchComponent,
    NgbNav,
    NgbNavItem,
    NgbNavItemRole,
    NgbNavLinkButton,
    NgbNavLinkBase,
    NgbNavContent,
    TabladireccionamientosComponent,
    NgbNavOutlet,
  ],
})
export class DireccionamientosComponent implements OnInit {
  @ViewChild(TabladireccionamientosComponent) tableDir: TabladireccionamientosComponent;

  formRange = new FormGroup({
    start: new FormControl<Date | string | null>(null),
    end: new FormControl<Date | string | null>(null),
  });

  Filtros: any = {
    paciente: '',
    fecha: '',
    NoPrescripcion: '',
    Dispensacion: '',
  };

  active = 1;

  constructor() {}

  ngOnInit() {}

  onFilterDate(): void {
    const formatDate = (date: string) => new Date(date).toISOString().split('T')[0];
    this.Filtros.fecha = `${formatDate(this.formRange.value.start as string)} - ${formatDate(
      this.formRange.value.end as string,
    )}`;
    this.onFilter();
  }

  onFilter(): void {
    this.tableDir.ConsultaFiltrada();
  }
}
