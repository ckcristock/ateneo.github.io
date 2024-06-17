import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfirmarauditoriaService } from 'src/app/pages/inventario/services/confirmarauditoria.service';
import { AuditoriaspendientesService } from 'src/app/pages/inventario/services/auditoriaspendientes.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
// import { Globales } from '../../shared/globales/globales';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';
import { ModalBasicComponent } from 'src/app/components/modal-basic/modal-basic.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalBasicComponent],
  providers: [AuditoriaspendientesService, ConfirmarauditoriaService],
  selector: 'app-modalconfirmacion',
  templateUrl: './modalconfirmacion.component.html',
  styleUrls: ['./modalconfirmacion.component.scss'],
})
export class ModalconfirmacionComponent implements OnInit {
  @Input() AbrirModalEvent: Observable<any>;
  @ViewChild('ModalConfirmacion') ModalConfirmacion: any;
  public Model: any = {
    Id_Auditoria: '',
    Estado: 'Aceptar',
    Observacion: '',
    Identificacion_Funcionario: this._user.user.id,
  };
  private suscripcion: any;
  public Soportes: any = [];
  public Errores: Array<any> = [];

  constructor(
    private confirmacion: ConfirmarauditoriaService,
    private swal: SwalService,
    private auditoriaspendientes: AuditoriaspendientesService,
    private readonly _user: UserService,
  ) {}

  ngOnInit() {
    this.suscripcion = this.AbrirModalEvent.subscribe((data) => {
      this.Model.Id_Auditoria = data;
      this.Errores = [];
      this.auditoriaspendientes.getTipoSoporte(data).subscribe((data: any) => {
        this.Soportes = data;
        this.Soportes.push(
          {
            Id_Tipo_Soporte: '0',
            Tipo_Soporte: 'Digitaccion de la Dispensacion',
          },
          {
            Id_Tipo_Soporte: '-1',
            Tipo_Soporte: 'Tipo Servicio Incorrecto',
          },
        );
        this.ModalConfirmacion.show();
      });
    });
  }

  GuardarEstado() {
    let data = new FormData();
    let modelo = JSON.stringify(this.Model);
    let errores = JSON.stringify(this.Errores);
    data.append('modelo', modelo);
    data.append('errores', errores);

    this.auditoriaspendientes.saveEstado(data).subscribe((data: any) => {
      this.confirmacion.ActualizarTablas(this.Model.Estado);
      this.ModalConfirmacion.hide();
      this.Errores = [];
      this.swal.ShowMessage(data);
    });
  }
  CerrarModal() {
    this.Model = {
      Id_Auditoria: '',
      Estado: '',
      Observacion: '',
      Identificacion_Funcionario: this._user.user.id,
    };
    this.ModalConfirmacion.hide();
  }
  AgregarErrores(event, pos) {
    let tem = event.target.checked;
    if (tem) {
      this.Errores.push(this.Soportes[pos]);
    } else {
      let pos2 = this.Errores.findIndex(
        (x) => x.Id_Tipo_Soporte === this.Soportes[pos].Id_Tipo_Soporte,
      );
      if (pos2 >= 0) {
        this.Errores.splice(pos2, 1);
      }
    }
    if (this.Errores.length > 0) {
      this.Model.Estado = 'Rechazar';
    } else {
      this.Model.Estado = 'Aceptar';
    }
  }
}
