import { Injectable } from '@angular/core';
import { Select } from '@shared/interfaces/global.interface';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  /**
   * @constant property can only **be matched** by app.component
   */
  people$: BehaviorSubject<Readonly<Select>[]> = new BehaviorSubject([]);

  get getPeople$(): Observable<Readonly<Select>[]> {
    return this.people$.asObservable();
  }

  get getAllPeople$(): Observable<Readonly<Select>[]> {
    return this.people$.pipe(
      map((people) => {
        const all = [...people];
        if (people.length) all.unshift({ text: 'Todos', value: '' });
        return all;
      }),
    );
  }
}
