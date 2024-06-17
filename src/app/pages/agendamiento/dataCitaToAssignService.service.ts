import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class dataCitaToAssignService {
  public dateCall: any;
  public dataCitaToAssign = new Subject<any>();
  public dataFinal = new Subject<any>();

  constructor() {}
}
