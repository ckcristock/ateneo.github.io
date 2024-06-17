import { Component, OnInit } from '@angular/core';
import { TiposContratoService } from './tipos-contrato.service';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ValidatorsService } from '../../../../informacion-base/services/reactive-validation/validators.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AutomaticSearchComponent } from '@shared/components/automatic-search/automatic-search.component';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { StandardModule } from '@shared/components/standard-components/standard.module';
import { ActionEditComponent } from '@shared/components/standard-components/action-edit/action-edit.component';
import { Texteditor2Service } from 'src/app/pages/ajustes/informacion-base/services/texteditor2.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { NotDataSaComponent } from 'src/app/components/not-data-sa/not-data-sa.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@Component({
  selector: 'app-tipos-contrato',
  templateUrl: './tipos-contrato.component.html',
  styleUrls: ['./tipos-contrato.component.scss'],
  standalone: true,
  imports: [
    CKEditorModule,
    NotDataSaComponent,
    StandardModule,
    ActionEditComponent,
    CardComponent,
    TableComponent,
    AutomaticSearchComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class TiposContratoComponent implements OnInit {
  loading: boolean = false;
  selected: any;
  pagination = {
    page: 1,
    pageSize: 6,
    length: 0,
  };
  contracts: any[] = [];
  contrato: any = {};
  filtro: any = {
    name: '',
    description: '',
  };
  form: UntypedFormGroup;
  constructor(
    private _tiposContratoService: TiposContratoService,
    private fb: UntypedFormBuilder,
    private _reactiveValid: ValidatorsService,
    private modalBD: ModalService,
    private swalService: SwalService,
    private _texteditor: Texteditor2Service,
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getContractsType();
  }
  close() {
    this.modalBD.close();
    this.form.reset();
  }

  getData(data, content) {
    this.contrato = { ...data };
    this.selected = 'Actualizar plantilla de contrato ' + this.contrato.name.toLowerCase();
    this.form.patchValue({
      id: this.contrato.id,
      template: this.contrato.template,
    });
    this.modalBD.open(content, 'lg');
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.contrato.id],
      template: ['', this._reactiveValid.required],
    });
  }

  getContractsType() {
    let params = {
      ...this.pagination,
      ...this.filtro,
    };
    this.loading = true;
    this._tiposContratoService.getContractsType(params).subscribe((res: any) => {
      this.loading = false;
      this.contracts = res.data.data;
      this.pagination.length = res.data.total;
    });
  }

  createContractType() {
    const request = (resolve: CallableFunction) => {
      this._tiposContratoService.createNewContract_type(this.form.value).subscribe({
        next: (res: any) => {
          this.form.reset();
          this.getContractsType();
          resolve(true);
          let swal = {
            icon: 'success',
            title: 'Operación exitosa',
            text: res.data,
            timer: 1000,
            showCancel: false,
          };
          this.swalService.show(swal);
          this.modalBD.close();
        },
      });
    };
    this.swalService.swalLoading('Vamos a actualizar el tipo de contrato', request);
  }
}
