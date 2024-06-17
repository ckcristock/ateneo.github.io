import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ConfiguracionEmpresaService } from '../../configuracion-empresa.service';

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [ReactiveFormsModule, ModalComponent, MatFormFieldModule, MatInputModule],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.scss',
})
export class ConfigurationComponent implements OnInit {
  @Input() data!: any;

  formMemorandums = new FormGroup({
    company_id: new FormControl(''),
    max_memos_per_employee: new FormControl('', [Validators.required]),
    attention_expiry_days: new FormControl('', [Validators.required]),
    max_item_remision: new FormControl('', [Validators.required]),
  });

  constructor(
    private readonly companyConfigurationService: ConfiguracionEmpresaService,
    private readonly swalService: SwalService,
    private readonly modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.formMemorandums.patchValue(this.data);
  }

  onSaveQuantityMemorandums(): void {
    if (this.data?.id) {
      this.updateQuantityMemorandums();
      return;
    }
    this.saveQuantityMemorandums();
  }

  private async saveQuantityMemorandums(): Promise<void> {
    try {
      await this.swalService.confirm('Se guardará la cantidad ingresada', {
        preConfirm: () => {
          return new Promise((resolve) => {
            this.companyConfigurationService
              .postQuantityMemorandums(this.formMemorandums.value)
              .subscribe({
                next: () => {
                  this.swalService.show({
                    icon: 'success',
                    title: 'Cantidad de memorandos agregados con éxito',
                    showCancel: false,
                    text: '',
                    timer: 3000,
                  });
                  this.modalService.dismissAll('updateCompany');
                  resolve(true);
                },
                error: () => {
                  resolve(false);
                },
              });
          });
        },
        showLoaderOnConfirm: true,
      });
    } catch (error) {
      this.swalService.hardError();
    }
  }

  private async updateQuantityMemorandums(): Promise<void> {
    try {
      await this.swalService.confirm('Se actualizará a la cantidad ingresada', {
        preConfirm: () => {
          return new Promise((resolve) => {
            this.companyConfigurationService
              .putQuantityMemorandums(this.formMemorandums.value, this.data.id)
              .subscribe({
                next: () => {
                  this.swalService.show({
                    icon: 'success',
                    title: 'Cantidad de memorandos actualizados con éxito',
                    showCancel: false,
                    text: '',
                    timer: 3000,
                  });
                  this.modalService.dismissAll('updateCompany');
                  resolve(true);
                },
                error: () => {
                  resolve(false);
                },
              });
          });
        },
        showLoaderOnConfirm: true,
      });
    } catch (error) {
      this.swalService.hardError();
    }
  }
}
