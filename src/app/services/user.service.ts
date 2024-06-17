import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  setGroupFilter$ = new Subject<any>();
  getGroupFilter = this.setGroupFilter$.asObservable();
  constructor() {}

  min(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      return !isNaN(value) && value < min
        ? {
            min: {
              min: min,
              actual: control.value,
              msj: ` -El valor debe ser mayor a ${min - 1} `,
            },
          }
        : null;
    };
  }
  max(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      return !isNaN(value) && value > min
        ? {
            min: {
              min: min,
              actual: control.value,
              msj: ` -El valor debe ser menor a ${min + 1} `,
            },
          }
        : null;
    };
  }
  minLength(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.length;
      return !isNaN(value) && value < min
        ? {
            minLength: {
              min: min,
              actual: control.value,
              msj: ` -El campo debe tenener mínimo ${min} caracteres`,
            },
          }
        : null;
    };
  }

  required(control: AbstractControl): ValidationErrors | null {
    return UserService.isEmptyInputValue(control.value)
      ? { required: { msj: ' -El campo es obligatorio' } }
      : null;
  }

  private static isEmptyInputValue(value) {
    return value == null || value === '' ? true : false;
  }
}

// fetchUsers(): Observable<any> {
//   return of(USERS);
// }
