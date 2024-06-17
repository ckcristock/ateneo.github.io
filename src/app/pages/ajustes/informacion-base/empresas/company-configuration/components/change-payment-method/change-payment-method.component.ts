import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSelectModule } from '@angular/material/select';

import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { ConfiguracionEmpresaService } from '../../configuracion-empresa.service';

@Component({
  selector: 'app-change-payment-method',
  standalone: true,
  imports: [ReactiveFormsModule, MatSelectModule, ModalComponent, NotDataComponent],
  templateUrl: './change-payment-method.component.html',
  styleUrl: './change-payment-method.component.scss',
})
export class ChangePaymentMethodComponent implements OnInit {
  @Input() companyId = 0;

  formChangePay!: FormGroup;

  loading = true;

  constructor(
    private readonly companyConfigurationService: ConfiguracionEmpresaService,
    private readonly formBuilder: FormBuilder,
    private readonly modalService: NgbModal,
    private readonly swalService: SwalService,
  ) {}

  ngOnInit(): void {
    this.formInit();
    this.getPaymentConfiguration();
  }

  private formInit(): void {
    this.formChangePay = this.formBuilder.group({
      calculate_work_disability: [''],
      pay_deductions: [''],
      recurring_payment: [''],
      payment_transport_subsidy: [''],
      affects_transportation_subsidy: [''],
      pay_vacations: [''],
      company_id: [''],
    });
  }

  private getPaymentConfiguration(): void {
    this.companyConfigurationService
      .getPaymentConfiguration({
        company_id: this.companyId,
      })
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          this.formChangePay.patchValue(res?.data);
        },
      });
  }

  changePaymentConfiguration(): void {
    this.formChangePay.get('company_id').setValue(this.companyId);
    this.companyConfigurationService
      .changePaymentConfiguration(this.formChangePay.value)
      .subscribe({
        next: () => {
          this.modalService.dismissAll();
          this.swalService.show({
            icon: 'success',
            title: 'Configuración cambiada',
            text: 'La configuración de pago ha sido cambiada con éxito.',
            showCancel: false,
            timer: 3000,
          });
        },
      });
  }
}
