import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalService } from 'src/app/core/services/modal.service';
import { functionsUtils } from 'src/app/core/utils/functionsUtils';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { PlanCuentasService } from '../plan-cuentas.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-import-initial-balances',
  templateUrl: './import-initial-balances.component.html',
  styleUrls: ['./import-initial-balances.component.scss'],
  standalone: true,
  imports: [NgIf],
})
export class ImportInitialBalancesComponent implements OnInit {
  @ViewChild('modal') modal;
  @Output('reload') reload = new EventEmitter();
  fileString: any;
  file: any;
  cargado: boolean;
  type: any;
  data: any;

  constructor(
    private _modal: ModalService,
    private _swal: SwalService,
    private _planCuentas: PlanCuentasService,
  ) {}

  ngOnInit(): void {}

  open() {
    this._modal.open(this.modal, 'lg');
    this.fileString = undefined;
    this.file = undefined;
    this.cargado = undefined;
    this.type = undefined;
    this.data = undefined;
  }

  save() {
    if (!this.data) {
      this._swal.show({
        icon: 'error',
        title: 'Error',
        text: 'Carga un archivo',
        showCancel: false,
      });
    } else {
      this.validateImport(this.data);
    }
  }

  onFileSelected(event) {
    if (event.target.files[0]) {
      let file = event.target.files[0];
      const types = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
      ];
      if (!types.includes(file.type)) {
        this._swal.show({
          icon: 'error',
          title: 'Error de archivo',
          showCancel: false,
          text: 'El tipo de archivo no es válido',
        });
        this.cargado = false;
        return null;
      }

      var reader = new FileReader();
      let data: any = {};
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.fileString = (<FileReader>event.target).result;
        const type = { ext: this.fileString };
        data.type = type.ext.match(/[^:/]\w+(?=;|,)/)[0];
      };
      functionsUtils.fileToBase64(file).subscribe((base64) => {
        data.file = base64;
        this.data = data;
        this.cargado = true;
        //this.validateImport(data)
      });
    }
  }

  validateImport(data) {
    this._planCuentas.importInitialBalances(data).subscribe((res: any) => {
      this._swal.show({
        icon: 'success',
        title: 'Archivo cargado con éxito',
        text: '',
        showCancel: false,
        timer: 1000,
      });
      this._modal.close();
      this.reload.emit();
    });
  }
}
