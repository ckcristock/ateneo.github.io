import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'payrollStatus',
  standalone: true,
})
export class PayrollStatusPipe implements PipeTransform {
  transform(value: string): string {
    if (value == 'rejected') {
      return 'Rechazado';
    }
    if (value == 'deleted') {
      return 'Anulado';
    }
    if (value == 'remplazed') {
      return 'Remplazado';
    }
    if (value == 'succeded') {
      return 'Aceptado';
    }
    return 'Pendiente';
  }
}
