import { Component, DoCheck, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ModalService } from 'src/app/core/services/modal.service';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { ConfiguracionEmpresaService } from '../../configuracion-empresa.service';
import { configEmpresa } from '../../configuracion';
import { SwalService } from '@basic-services/swal.service';

@Component({
  selector: 'app-datos-pila',
  templateUrl: './datos-pila.component.html',
  styleUrls: ['./datos-pila.component.scss'],
  standalone: true,
  imports: [
    NotDataComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
  ],
})
export class DatosPilaComponent implements OnInit, DoCheck {
  @Output() update = new EventEmitter();
  @Input('data') set changeData(newData) {
    if (newData) {
      this.pilas = newData;
      this.getPilaData();
    }
  }
  form: UntypedFormGroup;
  arls: any = [];
  pilas: any = [];
  pay_operators = configEmpresa.pay_operator;
  loading: boolean = true;
  show: boolean = false;

  loadingModal = false;
  constructor(
    private _configuracionEmpresaService: ConfiguracionEmpresaService,
    private fb: UntypedFormBuilder,
    private _modal: ModalService,
    private _swal: SwalService,
  ) {}
  ngDoCheck(): void {
    if (this.pilas.id) {
      this.loading = false;
    }
  }

  ngOnInit(): void {
    this.getPilaData();
  }

  updateData() {
    this.update.emit();
  }

  openModal(modal) {
    this.getArl();
    this._modal.open(modal);
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.pilas.id],
      paid_operator: ['', Validators.required],
      law_1429: [''],
      law_590: [''],
      law_1607: [''],
      arl_id: ['', Validators.required],
    });
  }

  getArl() {
    this.loadingModal = true;
    this._configuracionEmpresaService.getArl().subscribe((res: any) => {
      this.arls = res.data;
      this.loadingModal = false;
    });
  }

  getPilaData() {
    this.createForm();

    if (this.pilas.id) this.show = true;
    this.form.patchValue({
      id: this.pilas.id,
      paid_operator: this.pilas.paid_operator,
      law_1429: this.pilas.law_1429,
      law_590: this.pilas.law_590,
      law_1607: this.pilas.law_1607,
      arl_id: this.pilas.arl_id,
      // });
    });
  }

  savePilaData() {
    const request = () => {
      this._configuracionEmpresaService.saveCompanyData(this.form.value).subscribe((res: any) => {
        this._modal.close();
        this.updateData();
        this.getPilaData();
        this._swal.show({
          icon: 'success',
          title: '¡Actualizado!',
          text: 'Datos actualizados correctamente',
          timer: 1000,
          showCancel: false,
        });
      });
    };
    this._swal.swalLoading('', request);
  }
}
