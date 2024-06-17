import { Component, OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ModalService } from 'src/app/core/services/modal.service';
import { ValidatorsService } from '../../../../informacion-base/services/reactive-validation/validators.service';
import { TiposDocumentoService } from './tipos-documento.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DropdownActionsComponent } from '@shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { StatusBadgeComponent } from '@shared/components/status-badge/status-badge.component';
import { SwalService } from '../../../../informacion-base/services/swal.service';
import { AddButtonComponent } from '@shared/components/standard-components/add-button/add-button.component';
import { ActionEditComponent } from '@shared/components/standard-components/action-edit/action-edit.component';
import { ActionDeactivateComponent } from '@shared/components/standard-components/action-deactivate/action-deactivate.component';
import { ActionActivateComponent } from '@shared/components/standard-components/action-activate/action-activate.component';
import { AutomaticSearchComponent } from '@shared/components/automatic-search/automatic-search.component';
import { NotDataSaComponent } from 'src/app/components/not-data-sa/not-data-sa.component';

@Component({
  selector: 'app-tipos-documento',
  templateUrl: './tipos-documento.component.html',
  styleUrls: ['./tipos-documento.component.scss'],
  standalone: true,
  imports: [
    NotDataSaComponent,
    CardComponent,
    TableComponent,
    AddButtonComponent,
    DropdownActionsComponent,
    ActionEditComponent,
    ActionDeactivateComponent,
    ActionActivateComponent,
    AutomaticSearchComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    StatusBadgeComponent,
  ],
})
export class TiposDocumentoComponent implements OnInit {
  loading: boolean = false;
  selected: any;
  pagination = {
    page: 1,
    pageSize: 5,
    length: 0,
  };
  filtro: any = {
    name: '',
    code: '',
  };
  documents: any[] = [];
  document: any = {};
  form: UntypedFormGroup;
  constructor(
    private fb: UntypedFormBuilder,
    private _reactiveValid: ValidatorsService,
    private _typesDocumentService: TiposDocumentoService,
    private _modal: ModalService,
    private swalService: SwalService,
  ) {}

  ngOnInit(): void {
    this.getDocumentTypes();
    this.createForm();
  }

  openModal(content) {
    this.form.reset();
    this.selected = 'Nuevo tipo de documento';
    this._modal.open(content);
  }

  close() {
    this._modal.close();
    this.form.reset();
  }

  getData(data, content) {
    this.document = { ...data };
    this.selected = 'Actualizar tipo de documento';
    this._modal.open(content);
    this.form.patchValue({
      id: this.document.id,
      name: this.document.name,
      code: this.document.code,
      dian_code: this.document.dian_code,
    });
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.document.id],
      name: ['', this._reactiveValid.required],
      code: ['', this._reactiveValid.required],
      dian_code: ['', this._reactiveValid.required],
    });
  }

  activateOrInactivate(contract, status) {
    let data = { id: contract.id, status };
    const text = 'El tipo de documento';
    const request = () => {
      this._typesDocumentService.createNewDocument(data).subscribe((res) => {
        this.getDocumentTypes();
        this.swalService.activateOrInactivateSwalResponse(status, text);
      });
    };
    this.swalService.activateOrInactivateSwal(status, text, request);
  }

  getDocumentTypes() {
    let params = {
      ...this.pagination,
      ...this.filtro,
    };
    this.loading = true;
    this._typesDocumentService.getDocuments(params).subscribe((res: any) => {
      this.documents = res.data.data;
      this.pagination.length = res.data.total;
      this.loading = false;
    });
  }

  createNewDocument() {
    const request = (resolve: CallableFunction) => {
      this._modal.close();
      this._typesDocumentService.createNewDocument(this.form.value).subscribe({
        next: (res: any) => {
          this.getDocumentTypes();
          let swal = {
            icon: 'success',
            title: res.data,
            text: 'Se ha agregado a los tipos de documento con éxito.',
            timer: null,
            showCancel: false,
          };
          this.swalService.show(swal);
        },
      });
    };
    this.swalService.swalLoading('Guadarás cambios en el tipo de documento', request);
  }

  get name_invalid() {
    return this.form.get('name').invalid && this.form.get('name').touched;
  }

  get code_invalid() {
    return this.form.get('code').invalid && this.form.get('code').touched;
  }
}
