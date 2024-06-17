import Swal from 'sweetalert2';

export async function showConfirm<T>(status: any, model: string) {
  return Swal.fire({
    title: '¿Estas seguro?',
    text: status === 'Inactivo' ? `La ${model} se Inactivará!` : `La ${model} se activará`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    cancelButtonText: 'Cancelar',
    confirmButtonText: status === 'Inactivo' ? 'Si, Inhabilitar' : 'Si, activar',
  });
}

export async function showConfirmCancel<T>(status: any, model: string) {
  const SwalMsje = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success mx-2',
      cancelButton: 'btn btn-danger',
    },
    buttonsStyling: false,
  });

  return SwalMsje.fire({
    title: '¿está seguro?',
    text: 'Se dispone a Cancelar una '.concat(model),
    icon: 'warning',
    input: 'text',
    inputAttributes: {
      maxlength: '50',
      autocapitalize: 'off',
      autocorrect: 'off',
    },
    showCancelButton: true,
    confirmButtonText: 'Si, ¡Cita Cancelar '.concat(model),
    cancelButtonText: 'No, ¡déjeme comprobar!',
    reverseButtons: true,
  });
}

export async function showConfirmCancelWhitoutMessage<T>(status: any, model: string) {
  return Swal.fire({
    title: '¿Estas seguro?',
    text: `Estas a un paso de ${status} esta  ${model} !`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Si, ' + status,
  });
}

export function successMessage<T>(
  status: any = 'Operación exitosa',
  message: string = 'Felicidades, Operacíón realizada correctamente.',
  model: string = '',
) {
  Swal.fire({
    title: status,
    text: message,
    icon: 'success',
    allowOutsideClick: false,
    allowEscapeKey: false,
  });
}

export function errorMessage<T>(status: any = 'Ooops', model: string = '') {
  Swal.fire({
    title: status,
    text: 'Se han registrado errores operación no realizada',
    icon: 'error',
    allowOutsideClick: false,
    allowEscapeKey: false,
  });
}

export function WarningMessage<T>(
  status: any = 'Ooops',
  text: any = 'Verifique los datos',
  model: string = '',
) {
  Swal.fire({
    title: status,
    text: text,
    icon: 'error',
    allowOutsideClick: false,
    allowEscapeKey: false,
  });
}
