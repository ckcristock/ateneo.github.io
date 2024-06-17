import { Component, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { LicenciaConduccionService } from './licencia-conduccion.service';
import { SwalService } from '../../../../informacion-base/services/swal.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatInputModule } from '@angular/material/input';
import { NgClass, UpperCasePipe } from '@angular/common';
import { AutomaticSearchComponent } from '@shared/components/automatic-search/automatic-search.component';
import { ActionActivateComponent } from '@shared/components/standard-components/action-activate/action-activate.component';
import { ActionDeactivateComponent } from '@shared/components/standard-components/action-deactivate/action-deactivate.component';
import { ActionEditComponent } from '@shared/components/standard-components/action-edit/action-edit.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { DropdownActionsComponent } from '@shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { StatusBadgeComponent } from '@shared/components/status-badge/status-badge.component';
import { AddButtonComponent } from '@shared/components/standard-components/add-button/add-button.component';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-licencia-conduccion',
  templateUrl: './licencia-conduccion.component.html',
  styleUrls: ['./licencia-conduccion.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    AddButtonComponent,
    TableComponent,
    NgClass,
    DropdownActionsComponent,
    ActionEditComponent,
    ActionDeactivateComponent,
    ActionActivateComponent,
    AutomaticSearchComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NotDataComponent,
    UpperCasePipe,
    StatusBadgeComponent,
  ],
})
export class LicenciaConduccionComponent implements OnInit {
  @ViewChild('modal') modal: any;
  loading: boolean = false;
  form: UntypedFormGroup;
  licenses: any[] = [];
  license: any = {};
  title: any = '';
  pagination = {
    page: 1,
    pageSize: 5,
    length: 0,
  };
  filtro: any = {
    tipo: '',
  };

  constructor(
    private fb: UntypedFormBuilder,
    private _licencia: LicenciaConduccionService,
    private _swal: SwalService,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getDrivingLicenses();
  }

  openModal() {
    this.modal.show();
  }

  closeResult = '';
  openConfirm(confirm, titulo) {
    this.title = titulo;
    this.modalService
      .open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md', scrollable: true })
      .result.then(
        (result) => {},
        (reason) => {
          this.getDismissReason();
        },
      );
  }
  getDismissReason() {
    this.form.reset();
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.license.id],
      type: ['', Validators.required],
      description: [''],
    });
  }

  getDrivingLicense(license) {
    this.license = { ...license };
    this.form.patchValue({
      id: this.license.id,
      type: this.license.type,
      description: this.license.description,
    });
  }

  getDrivingLicenses() {
    let params = {
      ...this.pagination,
      ...this.filtro,
    };
    this.loading = true;
    this._licencia.getDrivingLicenses(params).subscribe((r: any) => {
      this.licenses = r.data.data;
      this.loading = false;
      this.pagination.length = r.data.total;
    });
  }

  activateOrInactivate(license, state) {
    let data = { id: license.id, state };
    const text = 'La licencia';
    const request = () => {
      this._licencia.save(data).subscribe((res) => {
        this.getDrivingLicenses();
        this._swal.activateOrInactivateSwalResponse(state, text);
      });
    };
    this._swal.activateOrInactivateSwal(state, text, request);
  }

  save() {
    if (this.form.valid) {
      this._licencia.save(this.form.value).subscribe((r: any) => {
        this.modalService.dismissAll();
        this.getDrivingLicenses();
        this.form.reset();
        this._swal.show({
          icon: 'success',
          title: r.data.title,
          text: '',
          showCancel: false,
          timer: 1000,
        });
      });
    } else {
      this._swal.incompleteError();
    }
  }
}
