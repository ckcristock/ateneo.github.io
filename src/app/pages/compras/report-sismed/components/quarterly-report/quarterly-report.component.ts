import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { environment } from 'src/environments/environment';
import { CardComponent } from '@shared/components/standard-components/card/card.component';

@Component({
  selector: 'app-quarterly-report',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardComponent, MatFormFieldModule, MatSelectModule],
  templateUrl: './quarterly-report.component.html',
  styleUrl: './quarterly-report.component.scss',
})
export class QuarterlyReportComponent implements OnInit {
  @Input() reportType: 'Ventas' | 'Compras' = 'Ventas';

  formQuarterly = new FormGroup({
    Ano: new FormControl(''),
    Tipo_Consulta: new FormControl(''),
    Trimestre: new FormControl('', [Validators.required]),
  });

  years = [];

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    for (let year = 2024; year <= currentYear; year++) {
      this.years.push(year);
    }
  }

  onDownloadExcel(): void {
    const { Trimestre, Ano } = this.formQuarterly.value;
    window.open(
      `${environment.base_url}/php/reporte_sismed/reporte_sismed${
        this.reportType === 'Compras' ? '_compra' : ''
      }.php?meses=${Trimestre}&ano=${Ano}`,
      '_blank',
    );
  }

  onDownloadFlat(): void {
    const { Trimestre, Ano, Tipo_Consulta } = this.formQuarterly.value;
    window.open(
      `${environment.base_url}/php/reporte_sismed/reporte_sismed_plano${
        this.reportType === 'Compras' ? '_compra' : ''
      }.php?meses=${Trimestre}&ano=${Ano}&tipo=${Tipo_Consulta}`,
      '_blank',
    );
  }
}
