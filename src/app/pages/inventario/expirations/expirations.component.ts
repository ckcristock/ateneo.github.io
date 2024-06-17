import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';

import { setFilters } from '@shared/functions/url-filter.function';

import { environment } from 'src/environments/environment';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { ExpirationsService } from './expirations.service';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';

@Component({
  selector: 'app-expirations',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatExpansionModule,
    CardComponent,
    TableComponent,
    NotDataComponent,
  ],
  templateUrl: './expirations.component.html',
  styleUrl: './expirations.component.scss',
})
export class ExpirationsComponent implements OnInit {
  currentYear = new Date().getFullYear();

  formFilter = new FormGroup({
    year: new FormControl(this.currentYear, [Validators.required]),
    tipo: new FormControl('', [Validators.required]),
    id_bodega_punto: new FormControl('', [Validators.required]),
  });

  years = [];

  wineries = [];

  months = [];

  loading = false;

  isExpirationData = false;

  constructor(private readonly expirationsService: ExpirationsService) {}

  ngOnInit(): void {
    this.setYears();
  }

  private setYears(): void {
    for (let i = 0; i < 5; i++) {
      this.years.push(new Date().getFullYear() + i);
    }
  }

  getWinery(): void {
    const { tipo } = this.formFilter.value;
    const params = { tipo };
    this.expirationsService.getWinery(params).subscribe({
      next: (res) => {
        this.wineries = res;
        this.wineries.unshift({
          Id: 'todos',
          Nombre: 'Todos',
        });
      },
    });
  }

  onDownloadExpiration(): void {
    const params = setFilters(this.formFilter.value);
    window.open(`${environment.ruta}php/vencimientos/descargar_excel.php${params}`, '_blank');
  }

  onGetExpirations(): void {
    this.loading = true;
    this.expirationsService.getExpirations(this.formFilter.value).subscribe({
      next: (res) => {
        this.loading = false;
        this.months = res;
        this.isExpirationData = this.months.some((data) => data.Productos.length);
      },
    });
  }
}
