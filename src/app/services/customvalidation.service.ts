import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class CustomvalidationService {
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
    return CustomvalidationService.isEmptyInputValue(control.value)
      ? { required: { msj: ' -El campo es obligatorio' } }
      : null;
  }

  private static isEmptyInputValue(value) {
    return value == null || value === '' ? true : false;
  }
}
