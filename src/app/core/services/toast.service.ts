import { Injectable, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: any[] = [];

  public _subject = new Subject<any>();
  private ToastObj: any = {
    textos: ['Default title', 'Default message'],
    tipo: 'warning',
    duracion: 0,
  };

  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, ...options });
  }

  remove(toast) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }

  public ShowToast(data: any) {
    this._setToastData(data);
    this._subject.next(this.ToastObj);
  }

  private _setToastData(data: any) {
    this.ToastObj.textos = data.textos;
    this.ToastObj.tipo = data.tipo ? data.tipo : 'default';
    this.ToastObj.duracion = data.duracion ? data.duracion : 3000;
  }
}
