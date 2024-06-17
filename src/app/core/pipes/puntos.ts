import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'puntos',
  standalone: true,
})
export class PuntosPipe implements PipeTransform {
  transform(value: string, args: any[]): string {
    if (value) {
      return value.replace(/\,/g, '.');
    }
    return '';
  }
}
