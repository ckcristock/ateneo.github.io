import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

export interface DatePicker {
  start_date: string;
  end_date: string;
}

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss',
})
export class DatePickerComponent implements OnInit {
  @Input() label: string = 'Rango de fechas';

  @Input() value!: DatePicker;

  @Output() dateChange = new EventEmitter();

  datePipe = new DatePipe('es-CO');

  formRange = new FormGroup({
    start_date: new FormControl<Date | string>(''),
    end_date: new FormControl<Date | string>(''),
  });

  ngOnInit(): void {
    this.setFormRange();
  }

  private setFormRange() {
    const formatDate = (date: string) => new Date(date.split('-').join('/'));
    if (this.value?.end_date && this.value?.start_date) {
      let startDate: string | Date = String(this.value.start_date);
      let endDate: string | Date = String(this.value.end_date);
      if (startDate.includes('-')) startDate = formatDate(startDate);
      if (endDate.includes('-')) endDate = formatDate(endDate);
      this.formRange.patchValue({
        start_date: startDate,
        end_date: endDate,
      });
    }
  }

  clearFilters() {
    if (this.formRange.get('start_date').value && this.formRange.get('end_date').value) {
      this.formRange.setValue({
        start_date: '',
        end_date: '',
      });
      this.dateChange.emit(this.formRange.value);
    }
  }

  onDateChange() {
    const { start_date, end_date } = this.formRange.value;
    const dates: DatePicker = {
      start_date: this.datePipe.transform(start_date, 'yyyy-MM-dd'),
      end_date: this.datePipe.transform(end_date, 'yyyy-MM-dd'),
    };
    this.dateChange.emit(dates);
  }
}
