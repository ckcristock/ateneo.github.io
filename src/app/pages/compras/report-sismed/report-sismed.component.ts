import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';

import { QuarterlyReportComponent } from './components/quarterly-report/quarterly-report.component';
import { setFilters } from '@shared/functions/url-filter.function';
import { environment } from 'src/environments/environment';
import { CardComponent } from '@shared/components/standard-components/card/card.component';

@Component({
  selector: 'app-report-sismed',
  standalone: true,
  imports: [
    CommonModule,
    QuarterlyReportComponent,
    ReactiveFormsModule,
    CardComponent,
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonModule,
  ],
  templateUrl: './report-sismed.component.html',
  styleUrl: './report-sismed.component.scss',
})
export class ReportSismedComponent {
  range = new FormGroup({
    start: new FormControl<Date | string | null>(null, [Validators.required]),
    end: new FormControl<Date | string | null>(null, [Validators.required]),
  });

  onDownloadSalesReport(): void {
    const { start, end } = this.range.value;
    const transformDate = (date: string) => new Date(date).toISOString().split('T')[0];
    const params = {
      fini: transformDate(start as string),
      ffin: transformDate(end as string),
    };
    const filters = setFilters(params);
    window.open(
      `${environment.base_url}/php/reporte_sismed/reporte_ventas.php${filters}`,
      '_blank',
    );
  }
}
