import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModalService } from 'src/app/core/services/modal.service';
import moment from 'moment';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { UserService } from 'src/app/core/services/user.service';
import { DetalleService } from 'src/app/pages/ajustes/informacion-base/funcionarios/detalle-funcionario/detalle.service';
import { UserDetail } from 'src/app/pages/ajustes/informacion-base/funcionarios/detalle-funcionario/interfaces/detalle.interface';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoadImageComponent } from '@shared/components/load-image/load-image.component';

@Component({
  selector: 'app-modal-preliquidar',
  templateUrl: './modal-preliquidar.component.html',
  styleUrls: ['./modal-preliquidar.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    TitleCasePipe,
    LoadImageComponent,
  ],
})
export class ModalPreliquidarComponent implements OnInit {
  @ViewChild('modalLiquidar') modalLiquidar: any;
  @Input('funcionario') userDetail: Partial<UserDetail> = {};
  @Output('reload') send = new EventEmitter();
  form!: UntypedFormGroup;
  datePipe = new DatePipe('es-CO');
  date = moment().format('YYYY-MM-DD');
  maxDate = moment().format('YYYY-MM-DD');
  responsable: any = {};

  constructor(
    public _modal: ModalService,
    private fb: UntypedFormBuilder,
    private _swal: SwalService,
    private _user: UserService,
    private detalleService: DetalleService,
  ) {
    this.responsable = this._user.user;
  }

  ngOnInit() {}

  openModal() {
    this._modal.open(this.modalLiquidar);
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      date_from: [this.date, Validators.required],
    });
  }

  selectedDate(fecha: any) {
    if (fecha.valor > moment()) {
      this._swal.show({
        icon: 'error',
        title: 'Fecha incorrecta',
        text: 'No puede escoger una fecha posterior a hoy',
        showCancel: false,
        timer: 2000,
      });
    } else {
      this.form.patchValue({
        date_from: this.datePipe.transform(fecha.value, 'yyyy-MM-dd'),
      });
    }
  }

  liquidar(status: any) {
    const dataForm = {
      status,
    };
    const info = {
      id: this.userDetail.id,
      identifier: this.userDetail.identifier,
      full_name: this.userDetail.first_name + ' ' + this.userDetail.first_surname,
      contract_work: this.userDetail.contractultimate_full_information.id,
      liquidated_at: this.form.controls.date_from.value,
      reponsible: {
        person_id: this.responsable.id,
        usuario: this.responsable.usuario,
      },
      status: status,
    };
    const data = {
      state: 'Inactivo',
    };
    const request = () => {
      this.detalleService.setPreliquidadoLog(info).subscribe({
        next: (responseLog: any) => {
          if (responseLog.status) {
            this.detalleService.liquidar(dataForm, this.userDetail.id).subscribe({
              next: (r: any) => {
                if (r.status) {
                  this._swal.show({
                    icon: 'success',
                    title: 'Proceso finalizado',
                    text: responseLog.data.message,
                    showCancel: false,
                    timer: 1000,
                  });
                  this.send.emit();
                  this._modal.close();
                } else {
                  this._swal.error();
                }
              },
            });
            this.detalleService.blockUser(data, this.userDetail.id).subscribe({
              next: (r: any) => {
                if (r.status) {
                  this._swal.show({
                    icon: 'success',
                    title: 'Proceso finalizado',
                    text: 'Hemos bloqueado el acceso al sistema del funcionario',
                    showCancel: false,
                    timer: 1000,
                  });
                }
              },
            });
          } else {
            this._swal.error();
          }
        },
        error: () => {
          this._swal.hardError();
        },
      });
    };
    this._swal.swalLoading(
      `${this.userDetail.first_name} será preliquidado y no tendrá acceso al sistema.`,
      request,
    );
  }
}
