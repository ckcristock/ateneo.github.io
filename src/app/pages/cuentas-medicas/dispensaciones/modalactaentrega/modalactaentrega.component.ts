import { Observable } from 'rxjs';
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { EntregapendientesnoposService } from 'src/app/pages/inventario/services/entregapendientesnopos.service';
import { DispensacionService } from '../../services/dispensacion.service';

import { CommonModule } from '@angular/common';
import { ModalBasicComponent } from 'src/app/components/modal-basic/modal-basic.component';

@Component({
  standalone: true,
  imports: [CommonModule, ModalBasicComponent],
  providers: [DispensacionService, EntregapendientesnoposService],
  selector: 'app-modalactaentrega',
  templateUrl: './modalactaentrega.component.html',
  styleUrls: ['./modalactaentrega.component.scss'],
})
export class ModalactaentregaComponent implements OnInit, OnChanges {
  ngOnChanges(changes: SimpleChanges): void {}
  @Input() AbrirModalActaEntregaEvent: Observable<any>;
  @Output() Guardar: EventEmitter<any> = new EventEmitter();

  public Model: any = {};
  public Mostar: boolean = false;
  Acta: any = '';
  private suscripcion: any;
  public Tipo_Documentos: Array<any> = [];

  @ViewChild('Modalactaentrega') Modalactaentrega: any;

  constructor(
    private swal: SwalService,
    private entregapendientes: EntregapendientesnoposService,
    private _dispensacionService: DispensacionService,
    private _swalService: SwalService,
  ) {
    this.GetTipoDocumento();
  }

  ngOnInit() {
    this.suscripcion = this.AbrirModalActaEntregaEvent.subscribe((data) => {
      this.Model = data;
      this.Mostar = true;
      this.Modalactaentrega.show();
    });
  }
  GetTipoDocumento() {
    this._dispensacionService.GetTipoDocumento().subscribe((data: any) => {
      this.Tipo_Documentos = data;
    });
  }
  CerrarModal() {
    this.Model = {
      Identificacion_Funcionario: JSON.parse(localStorage.getItem('User'))
        .Identificacion_Funcionario,
      Id_Tipo_Documento: '',
      Nombre: '',
      Id_Reclamante: '',
    };
    this.Acta = '';
    this.Modalactaentrega.hide();
  }
  CargarActaEntrega(event) {
    if (event.target.files.length === 1) {
      var fileSize = event.target.files[0].size / 1000000;
      if (fileSize <= 3) {
        this.Acta = event.target.files[0];
      } else {
        var texto = {
          titulo: 'Error con el documento',
          codigo: 'error',
          mensaje: 'El documento adjunto supera el peso limite maximo de 3MB ',
        };
        this.swal.ShowMessage(texto);
      }
    }
  }
  GuardarActa() {
    if (this.Model.tipo == 'Guardar_Acta') {
      let modelo = JSON.stringify(this.Model);
      let data = new FormData();
      data.append('acta', this.Acta);
      data.append('modelo', modelo);
      this.entregapendientes.saveActaEntrega(data).subscribe((data: any) => {
        this.swal.ShowMessage(data);
        this.Modalactaentrega.hide();
        this.Guardar.emit();
      });
    } else {
      if (this.Model.Id_Dispensacion_Mipres != '0') {
        if (!this.ValidateModelo()) {
          return;
        } else {
          let modelo = JSON.stringify(this.Model);
          let data = new FormData();
          data.append('acta', this.Acta);
          data.append('modelo', modelo);
          data.append('tipo', 'Acta');
          this.entregapendientes.saveEntregaPendientes(data).subscribe((data: any) => {
            this.swal.ShowMessage(data);
            this.Modalactaentrega.hide();
            this.Guardar.emit();
          });
        }
      } else {
        let modelo = JSON.stringify(this.Model);
        let data = new FormData();
        data.append('acta', this.Acta);
        data.append('modelo', modelo);
        data.append('tipo', 'Acta');
        this.entregapendientes.saveEntregaPendientes(data).subscribe((data: any) => {
          this.swal.ShowMessage(data);
          this.Modalactaentrega.hide();
          this.Guardar.emit();
        });
      }
    }
  }
  AsignarCodigo() {
    let index = this.Tipo_Documentos.findIndex(
      (x) => x.Id_Tipo_Documento == this.Model.Id_Tipo_Documento,
    );
    this.Model.Codigo = this.Tipo_Documentos[index].Codigo;
  }

  ValidateModelo() {
    if (this.Model.Id_Tipo_Documento == '') {
      this._swalService.ShowMessage(['warning', 'Alerta', 'Debe colocar el tipo de documento ']);
      return false;
    } else if (this.Model.Nombre == '') {
      this._swalService.ShowMessage(['warning', 'Alerta', 'Debe colocar el nombre de reclamante ']);
      return false;
    } else if (this.Model.Id_Reclamante == '') {
      this._swalService.ShowMessage([
        'warning',
        'Alerta',
        'Debe colocar el numero de identificacion del reclamante ',
      ]);
      return false;
    } else if (this.Acta == '') {
      this._swalService.ShowMessage(['warning', 'Alerta', 'Debe Adjuntar el acta ']);
      return false;
    } else {
      return true;
    }
  }
}
