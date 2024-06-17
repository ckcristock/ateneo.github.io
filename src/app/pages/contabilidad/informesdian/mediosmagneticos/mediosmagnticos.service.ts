import { Injectable } from '@angular/core';
import { SwalService } from '../../../ajustes/informacion-base/services/swal.service';

@Injectable({
  providedIn: 'root',
})
export class MediosmagnticosService {
  constructor(private swalService: SwalService) {}

  validarCampoTypeAHead(campo, event, tipo) {
    // Funcion que validará los campos de typeahead
    if (typeof campo != 'object' && campo != '') {
      let id = event.target.id;
      (document.getElementById(id) as HTMLInputElement).focus();
      let swal = {
        codigo: 'error',
        titulo: 'Incorrecto!',
        mensaje: `El valor ${tipo} no es valido.`,
      };
      this.swalService.ShowMessage(swal);
    }
  }
}
