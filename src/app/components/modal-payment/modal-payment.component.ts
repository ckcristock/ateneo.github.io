import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { RecaudoServiceService } from 'src/app/core/services/recaudo-service.service';
import Swal from 'sweetalert2';
import { functionsUtils } from '../../../../src/app/core/utils/functionsUtils';
import { FormsModule } from '@angular/forms';
import { ModalBasicComponent } from '../modal-basic/modal-basic.component';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-modal-payment',
  templateUrl: './modal-payment.component.html',
  styleUrls: ['./modal-payment.component.scss'],
  standalone: true,
  imports: [NgIf, ModalBasicComponent, FormsModule, NgFor],
})
export class ModalPaymentComponent implements OnInit {
  @Input('modalData') modalData!: EventEmitter<any>;
  @ViewChild('ModalPayment') ModalPayment: any;
  cuota: number = 0;
  recaudo: any = {
    cuota: 0,
    causal: '',
    observaciones: '',
    appointment_id: '',
    method_pay: 0,
    bank: 0,
  };

  causales: any = [];
  method_pays: any = [];
  banks: any = [];

  event = new Subject<any>();
  subscriptions!: Subscription[];

  @Output() reloadData: EventEmitter<object> = new EventEmitter();

  constructor(private _recaudoServiceService: RecaudoServiceService) {}

  ngOnInit(): void {
    this.modalData.subscribe((result) => {
      this.recaudo.appointment_id = result.citaDetail.id;
      this.recaudo.cuota = result.citaDetail.copago;
      this.cuota = result.citaDetail.copago;
      result.Show ? this.ModalPayment.show() : this.ModalPayment.hide();
      this.getReasonsByFees();
      this.getMethodPays();
      this.getBanks();
    });
  }

  /**
   * getReasonsByFees
   */
  public getReasonsByFees() {
    this._recaudoServiceService.getReasonsByFees().subscribe((resp: any) => {
      this.causales = resp.data;
    });
  }

  /**
   * getMethodPays
   */
  public getMethodPays() {
    this._recaudoServiceService.getMethodPays().subscribe((resp: any) => {
      this.method_pays = resp.data;
      this.recaudo.method_pay = this.method_pays.find((r: any) => r.name == 'Efectivo').value;
    });
  }

  /**
   * getBanks
   */
  public getBanks() {
    this._recaudoServiceService.getBanks().subscribe((resp: any) => {
      this.banks = resp.data;
    });
  }

  isEfectivo() {
    return this.recaudo.method_pay != this.method_pays.find((r: any) => r.name == 'Efectivo');
  }

  realizarRecaudo() {
    const SwalMsje = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success mx-2',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });
    SwalMsje.fire({
      title: '¿está seguro?',
      html:
        'Se dispone a guardar la cuota moderadora: <br><strong>$ ' +
        this.recaudo.cuota +
        '</strong>',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, ¡Recaudar!',
      cancelButtonText: 'No, ¡déjeme comprobar!',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(this.recaudo.observaciones == '', this.recaudo.method_pay == 0);
        if (
          this.recaudo.observaciones == '' ||
          (this.recaudo.method_pay == 0 && this.recaudo.causal == '')
        ) {
          // if (!functionsUtils.validateField(this.recaudo, ['cuota', 'observaciones'])) {
          functionsUtils.SwalMsje('Error', 'Debe completar los campos', 'error');
          return false;
        }

        this._recaudoServiceService.saveFees(this.recaudo).subscribe(
          (resp: any) => {
            functionsUtils.validateCodeCreate(resp);
            this.ModalPayment.hide();
            functionsUtils.SwalMsje(
              'Cuota Recaudada',
              'La cuota/copago fue recaudada correctamente!',
              'success',
            );
            this.reloadData.emit({});
            this.recaudo = {
              cuota: 0,
              causal: '',
              observaciones: '',
              appointment_id: 0,
              bank: 0,
              method_pay: 0,
            };
          },
          (error) => {
            console.error(error.name + ' : ' + error.message);
          },
        );
      }
    });
  }
}
