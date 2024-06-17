import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'viewMore',
  standalone: true,
})
export class ViewMorePipe implements PipeTransform {
  transform(value: string, length: number): string {
    return value.slice(0, length ?? 200);
  }
}
