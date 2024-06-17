import { Injectable } from '@angular/core';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class SwalService {
  public SwalObj: any = {
    type: 'warning',
    title: 'Alerta',
    msg: '',
    html: '',
  };
  public buttonColor = {
    confirm: '#3849CA',
    cancel: '#d33',
  };

  constructor() {}

  public ShowMessage(data: any) {
    this.SetSwalData(data);
  }

  private SetSwalData(data: any) {
    if (typeof data == 'object') {
      if (Array.isArray(data)) {
        let i = 0;
        for (const key in this.SwalObj) {
          this.SwalObj[key] = data[i];
          i++;
        }
      } else {
        this.SwalObj.type = data.codigo;
        this.SwalObj.title = data.titulo;
        this.SwalObj.msg = data.mensaje;
        this.SwalObj.html = data.html;
      }
    }
  }

  customAlert(props: Record<string, any>) {
    return Swal.fire({
      ...props,
      cancelButtonColor: this.buttonColor.cancel,
      confirmButtonColor: this.buttonColor.confirm,
      confirmButtonText: 'Continuar',
      reverseButtons: true,
    });
  }

  show(
    { title, text = '', icon, timer = 0, showCancel = true, confirmButtonColor = null, html = '' },
    preConfirm?,
  ) {
    let swal: any = {
      title,
      text,
      icon,
      timer,
      allowOutsideClick: true,
      allowEscapeKey: true,
      showCancelButton: showCancel,
      confirmButtonColor:
        icon == 'error' ? this.buttonColor.cancel : confirmButtonColor || this.buttonColor.confirm,
      confirmButtonText: showCancel ? '¡Sí, confirmar!' : 'OK',
      cancelButtonColor: this.buttonColor.cancel,
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      html: html,
    };
    if (preConfirm) {
      swal = {
        ...swal,
        preConfirm,
        allowOutsideClick: () => !Swal.isLoading(),
        showLoaderOnConfirm: true,
      };
    }
    return Swal.fire(swal);
  }

  show2({ title, text, icon, timer = 0, showCancel = true }, preConfirm?) {
    let swal: any = {
      title,
      text,
      icon,
      timer,
      allowOutsideClick: true,
      allowEscapeKey: true,
      showCancelButton: showCancel,
      confirmButtonColor: this.buttonColor.confirm,
      confirmButtonText: showCancel ? '¡Sí, confirmar!' : 'OK',
      cancelButtonColor: this.buttonColor.cancel,
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    };
    if (preConfirm) {
      swal = {
        ...swal,
        ...preConfirm,
        allowOutsideClick: () => !Swal.isLoading(),
        showLoaderOnConfirm: true,
      };
    }
    return Swal.fire(swal);
  }

  error(title = 'ERROR', text = 'Ha ocurrido un error. Inténtalo nuevamente.') {
    let swal: any = {
      title,
      text,
      icon: 'error',
      allowOutsideClick: true,
      allowEscapeKey: true,
      showCancelButton: false,
      confirmButtonColor: this.buttonColor.confirm,
      confirmButtonText: 'OK',
      cancelButtonColor: this.buttonColor.cancel,
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    };
    return Swal.fire(swal);
  }

  success(text: string = '', timer = 1000) {
    let swal: any = {
      title: 'Operación exitósa',
      text: text,
      icon: 'success',
      allowOutsideClick: true,
      allowEscapeKey: true,
      showCancelButton: false,
      confirmButtonColor: this.buttonColor.confirm,
      confirmButtonText: 'OK',
      cancelButtonColor: this.buttonColor.cancel,
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      timer,
    };
    return Swal.fire(swal);
  }

  hardError() {
    let swal: any = {
      title: 'Algo no salió bien',
      text: 'Comunícate con el equipo de tecnología.',
      icon: 'error',
      allowOutsideClick: true,
      allowEscapeKey: true,
      showCancelButton: false,
      confirmButtonColor: '#F27474',
      confirmButtonText: 'OK',
      cancelButtonColor: this.buttonColor.cancel,
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    };
    return Swal.fire(swal);
  }

  incompleteError(text?: string) {
    let swal: any = {
      title: 'Campos incompletos',
      html: text ?? 'Revisa todos los campos requeridos y vuelve a intentarlo.',
      icon: 'error',
      allowOutsideClick: true,
      allowEscapeKey: true,
      showCancelButton: false,
      confirmButtonColor: '#d33',
      confirmButtonText: 'OK',
      cancelButtonColor: this.buttonColor.cancel,
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    };
    return Swal.fire(swal);
  }

  confirm(text?: string, preConfirm?) {
    let swal: any = {
      title: '¿Estás seguro(a)?',
      text: text || '',
      icon: 'question',
      showCancelButton: true,
      allowOutsideClick: true,
      allowEscapeKey: true,
      confirmButtonText: '¡Sí, confirmar!',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: this.buttonColor.confirm,
      cancelButtonColor: this.buttonColor.cancel,
      reverseButtons: true,
    };
    if (preConfirm) {
      swal = {
        ...swal,
        ...preConfirm,
        allowOutsideClick: () => !Swal.isLoading(),
        showLoaderOnConfirm: true,
      };
    }
    return Swal.fire(swal);
  }

  async swalLoading(text: string, request: CallableFunction): Promise<void> {
    try {
      await this.confirm(text, {
        preConfirm: () => {
          return new Promise((resolve) => {
            request(resolve);
          });
        },
        showLoaderOnConfirm: true,
      });
    } catch (error) {
      this.hardError();
    }
  }

  async activateOrInactivateSwal(
    status: string,
    textItem: string,
    request: CallableFunction,
  ): Promise<void> {
    let text = '';
    const _status = status.toLowerCase();
    if (_status === 'inactivo' || _status === 'inactiva') {
      text = `${textItem} se anulará`;
    } else if (_status === 'activo' || _status === 'activa') {
      text = `${textItem} se activará`;
    }
    try {
      await this.confirm(text, {
        preConfirm: () => {
          return new Promise((resolve) => {
            request(resolve);
          });
        },
        showLoaderOnConfirm: true,
      });
    } catch (error) {
      this.hardError();
    }
  }

  activateOrInactivateSwalResponse(status: string, text: string) {
    const _status = status.toLowerCase();
    this.show({
      icon: 'success',
      title: 'Operación exitosa',
      showCancel: false,
      text:
        _status === 'inactivo' || _status === 'inactiva'
          ? `${text} ha sido anulado(a) con exito.`
          : `${text} ha sido activado(a) con exito.`,
      timer: 1000,
    });
  }
}
