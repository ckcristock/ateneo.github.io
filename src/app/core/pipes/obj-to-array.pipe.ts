import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

const base_url = environment.base_url;

@Pipe({
  name: 'ObjToArrayPipe',
  standalone: true,
})
export class ObjToArrayPipe implements PipeTransform {
  transform(object: any = []): Array<any> {
    return Object.values(object);
  }
}
