import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ModalService } from 'src/app/core/services/modal.service';

import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { configEmpresa } from '../../configuracion';
import { ConfiguracionEmpresaService } from '../../configuracion-empresa.service';
import { SwalService } from '../../../../services/swal.service';

export interface Response {
  status: boolean;
  code: number;
  data: any[];
  err: null;
}
export interface Payments {
  id: number;
  payment_frequency: any;
  payment_method: any;
  account_number: any;
  account_type: any;
  bank_id: any;
  bank: BankPayment;
}

interface BankPayment {
  id: number;
  name: string;
}

@Component({
  selector: 'app-datos-pago',
  templateUrl: './datos-pago.component.html',
  styleUrls: ['./datos-pago.component.scss'],
  standalone: true,
  imports: [
    NotDataComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
  ],
})
export class DatosPagoComponent implements OnInit {
  @Output() readonly update = new EventEmitter();

  @Input('data') set changeData(newData) {
    if (newData) {
      this.loading = false;
      this.payments = newData;
      this.createForm();
      this.getPaymentData();
    }
  }

  form: UntypedFormGroup;

  payment_method = configEmpresa.payment_method;

  account_types = configEmpresa.account_type;

  payment_frequencys = configEmpresa.payment_frequency;

  banks: any[] = [];

  payments: Payments;

  loading = true;

  constructor(
    private readonly configuracionEmpresaService: ConfiguracionEmpresaService,
    private readonly fb: UntypedFormBuilder,
    private readonly modal: ModalService,
    private readonly swal: SwalService,
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getBanks();
  }

  updateData(): void {
    this.update.emit();
  }

  openModal(modal: TemplateRef<any>): void {
    this.modal.open(modal);
  }

  createForm(): void {
    this.form = this.fb.group({
      id: [this.payments?.id],
      payment_frequency: ['', Validators.required],
      payment_method: ['', Validators.required],
      account_number: ['', Validators.required],
      account_type: ['', Validators.required],
      bank_id: ['', Validators.required],
    });
  }

  getPaymentData(): void {
    this.form.patchValue({
      id: this.payments.id,
      payment_frequency: this.payments.payment_frequency,
      payment_method: this.payments.payment_method,
      account_number: this.payments.account_number,
      account_type: this.payments.account_type,
      bank_id: this.payments.bank_id,
    });
  }

  getBanks(): any {
    this.configuracionEmpresaService.getBanks().subscribe((res: Response) => {
      this.banks = res.data;
    });
  }

  savePaymentData(): void {
    const request = () => {
      this.configuracionEmpresaService.saveCompanyData(this.form.value).subscribe(() => {
        this.modal.close();
        this.updateData();
        this.getPaymentData();
        this.swal.show({
          icon: 'success',
          title: '¡Actualizado!',
          text: 'Datos actualizados correctamente',
          timer: 1000,
          showCancel: false,
        });
      });
    };
    this.swal.swalLoading('', request);
  }
}
