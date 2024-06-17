import { Component, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { ModalService } from 'src/app/core/services/modal.service';
import { functionsUtils } from 'src/app/core/utils/functionsUtils';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { PlanCuentasService } from '../plan-cuentas.service';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-import-puc',
  templateUrl: './import-puc.component.html',
  styleUrls: ['./import-puc.component.scss'],
  standalone: true,
  imports: [FormsModule, NgIf],
})
export class ImportPucComponent implements OnInit {
  @ViewChild('modal') modal;
  @Output('reload') reload = new EventEmitter();
  fileString: any;
  file: any;
  deletePlans: boolean = false;
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
    this.deletePlans = false;
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
    this._planCuentas.validateImport(data, this.deletePlans).subscribe((res: any) => {
      this._swal.show({
        icon: res.data.original.icon,
        title: res.data.original.title,
        text: res.data.original.text,
        showCancel: false,
        timer: res.data.original.timer,
      });
      this._modal.close();
      this.reload.emit();
    });
  }
}
