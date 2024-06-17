import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
} from '@angular/forms';
import { CuentasBancariasService } from './cuentas-bancarias.service';
import { ValidatorsService } from '../../informacion-base/services/reactive-validation/validators.service';
import { consts } from '../../../../core/utils/consts';
import { MatAccordion } from '@angular/material/expansion';
import { ModalService } from 'src/app/core/services/modal.service';
import { SwalService } from '../../informacion-base/services/swal.service';
import { ActivatedRoute } from '@angular/router';
import { StandardModule } from '@shared/components/standard-components/standard.module';
import { AddButtonComponent } from '@shared/components/standard-components/add-button/add-button.component';
import { ActionEditComponent } from '@shared/components/standard-components/action-edit/action-edit.component';
import { ActionDeactivateComponent } from '@shared/components/standard-components/action-deactivate/action-deactivate.component';
import { ActionActivateComponent } from '@shared/components/standard-components/action-activate/action-activate.component';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { StatusBadgeComponent } from '@shared/components/status-badge/status-badge.component';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { AutomaticSearchComponent } from '@shared/components/automatic-search/automatic-search.component';

@Component({
  selector: 'app-cuentas-bancarias',
  templateUrl: './cuentas-bancarias.component.html',
  styleUrls: ['./cuentas-bancarias.component.scss'],
  standalone: true,
  imports: [
    StandardModule,
    AddButtonComponent,
    ActionEditComponent,
    ActionDeactivateComponent,
    ActionActivateComponent,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    TextFieldModule,
    CommonModule,
    StatusBadgeComponent,
    AutomaticSearchComponent,
  ],
})
export class CuentasBancariasComponent implements OnInit {
  @ViewChild('modal') modal: any;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  matPanel = false;
  openClose() {
    if (this.matPanel == false) {
      this.accordion.openAll();
      this.matPanel = true;
    } else {
      this.accordion.closeAll();
      this.matPanel = false;
    }
  }
  loading: boolean = false;
  bankAccounts: any[] = [];
  bankAccount: any = {};
  types = consts.bankType;
  pagination = {
    page: 1,
    pageSize: 10,
    length: 0,
  };
  filtro: any = {
    name: '',
  };
  form: UntypedFormGroup;
  selected: any;
  currentCompany: any;

  constructor(
    private fb: UntypedFormBuilder,
    private _bankAccountService: CuentasBancariasService,
    private _validators: ValidatorsService,
    private _modal: ModalService,
    private _swal: SwalService,
    public rutaActiva: ActivatedRoute,
    readonly urlFiltersService: UrlFiltersService,
  ) {}

  ngOnInit(): void {
    this.getUrlFilters();
    this.currentCompany = this.rutaActiva.snapshot.params.id;
    this.getBankAccounts();
    this.createForm();
  }

  private getUrlFilters(): void {
    this.pagination = this.urlFiltersService.currentPagination;
    this.filtro = this.urlFiltersService.currentFilters;
  }

  openModal() {
    this._modal.open(this.modal);
    this.form.reset();
    this.selected = 'Nueva cuenta bancaria';
  }

  getBankAccount(bankAccount) {
    this.bankAccount = { ...bankAccount };
    this.selected = 'Actualizar cuenta bancaria';
    this.form.patchValue({
      id: this.bankAccount.id,
      type: this.bankAccount.type,
      name: this.bankAccount.name,
      account_number: this.bankAccount.account_number,
      associated_account: this.bankAccount.associated_account,
      balance: this.bankAccount.balance,
      description: this.bankAccount.description,
    });
    this._modal.open(this.modal);
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.bankAccount.id],
      type: ['', this._validators.required],
      name: ['', this._validators.required],
      account_number: ['', this._validators.required],
      associated_account: ['', this._validators.required],
      balance: ['', this._validators.required],
      description: ['', this._validators.required],
    });
  }

  getBankAccounts() {
    let params = {
      ...this.pagination,
      ...this.filtro,
    };
    params ? (params.company_id = parseInt(this.currentCompany)) : '';
    this.loading = true;
    this._bankAccountService.getBankAccounts(params).subscribe((res: any) => {
      this.bankAccounts = res.data.data;
      this.pagination.length = res.data.total;
      this.loading = false;
    });
    this.urlFiltersService.setUrlFilters(params);
  }

  createBankAccount() {
    let params: any = this.form.value;
    params ? (params.company_id = this.currentCompany) : '';
    this._bankAccountService.createBankAccounts(params).subscribe((res: any) => {
      this._modal.close();
      this.getBankAccounts();
      this._swal.show({
        icon: 'success',
        title: 'Correcto',
        text: res.data,
        timer: 1000,
        showCancel: false,
      });
    });
  }

  activateOrInactivate(novelty, status) {
    let data = {
      id: novelty.id,
      status,
    };
    this._swal
      .show({
        icon: 'question',
        title: '¿Estás seguro(a)?',
        showCancel: true,
        text:
          status === 'Inactivo'
            ? '¡La cuenta bancaria se anulará!'
            : '¡La cuenta bancaria se activará!',
      })
      .then((result) => {
        if (result.isConfirmed) {
          this._bankAccountService.createBankAccounts(data).subscribe((res) => {
            this.getBankAccounts();
            this._swal.show({
              icon: 'success',
              title:
                status === 'Inactivo' ? '¡Cuenta bancaria anulada!' : '¡Cuenta bancaria activada!',
              showCancel: false,
              text:
                status === 'Inactivo'
                  ? 'La cuenta Bancaria ha sido anulada con éxito.'
                  : 'La cuenta bancaria ha sido activada con éxito.',
              timer: 1000,
            });
          });
        }
      });
  }
}
