import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  standalone: true,
})
export class SearchPipe implements PipeTransform {
  transform(items: any[], searchTxt: string): any[] {
    if (!items || !items.length) return items;
    if (!searchTxt || !searchTxt.length) return items;
    return items.filter((item) => {
      console.log(item);
      if (item.text.toLowerCase().indexOf(searchTxt.toLowerCase()) > -1) {
        return item.value;
      }
    });
  }
}
