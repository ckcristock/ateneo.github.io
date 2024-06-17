import { Injectable } from '@angular/core';
import { AbstractControl, UntypedFormControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class ValidatorsService {
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
      const value = String(control.value)?.length;

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

  maxLength(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = String(control.value)?.length;
      return !isNaN(value) && value > min
        ? {
            minLength: {
              min: min,
              actual: control.value,
              msj: ` -El campo debe tenener máximo ${min} caracteres`,
            },
          }
        : null;
    };
  }
  required(control: AbstractControl): ValidationErrors | null {
    return ValidatorsService.isEmptyInputValue(control.value)
      ? { required: { msj: ' -El campo es obligatorio' } }
      : null;
  }

  private static isEmptyInputValue(value) {
    return value == null || value === '' ? true : false;
  }

  checkDates(field1: string, field2: string) {
    return (frm) => {
      const fieldControl1: UntypedFormControl = frm.get(field1);
      const fieldControl2: UntypedFormControl = frm.get(field2);

      const date1 = moment(fieldControl1.value);
      const date2 = moment(fieldControl2.value);

      if (!date1 || !date2) {
        fieldControl2.setErrors(null);
      }

      if (date1 > date2) {
        fieldControl2.setErrors({
          checkDates: {
            msj: `La segunda fecha no debe ser mayor `,
          },
        });
      }
      return null;
    };
  }
}
