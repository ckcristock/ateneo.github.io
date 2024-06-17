import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class ConfirmarauditoriaService {
  public _subject = new Subject<object>();
  public event = this._subject.asObservable();

  constructor() {}

  public ActualizarTablas(data: any) {
    this._subject.next(data);
  }
}
