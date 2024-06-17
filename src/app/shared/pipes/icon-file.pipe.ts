import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'iconFile',
  standalone: true,
})
export class IconFilePipe implements PipeTransform {
  transform(value: string): string {
    if (value.includes('pdf')) return 'pdf';
    else if (value.includes('image')) return 'image';
    return 'alt';
  }
}
