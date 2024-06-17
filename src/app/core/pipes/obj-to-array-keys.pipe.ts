import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

const base_url = environment.base_url;

@Pipe({
  name: 'ObjToArrayKeysPipe',
  standalone: true,
})
export class ObjToArraykeysPipe implements PipeTransform {
  transform(object: any = []): Array<any> {
    return Object.keys(object);
  }
}
