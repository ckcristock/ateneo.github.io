import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QueryAvailabilitySpacesService {
  public getPerson = new BehaviorSubject<any>(0);
  public getspeciality = new BehaviorSubject<any>(0);

  constructor() {}
}
