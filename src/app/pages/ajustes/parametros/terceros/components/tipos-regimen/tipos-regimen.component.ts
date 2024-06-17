import { Component, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TiposRegimenService } from './tipos-regimen.service';
import { SwalService } from '../../../../informacion-base/services/swal.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AutomaticSearchComponent } from '@shared/components/automatic-search/automatic-search.component';
import { ActionActivateComponent } from '@shared/components/standard-components/action-activate/action-activate.component';
import { ActionDeactivateComponent } from '@shared/components/standard-components/action-deactivate/action-deactivate.component';
import { ActionEditComponent } from '@shared/components/standard-components/action-edit/action-edit.component';
import { AddButtonComponent } from '@shared/components/standard-components/add-button/add-button.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { DropdownActionsComponent } from '@shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { StatusBadgeComponent } from '@shared/components/status-badge/status-badge.component';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-tipos-regimen',
  templateUrl: './tipos-regimen.component.html',
  styleUrls: ['./tipos-regimen.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    AddButtonComponent,
    TableComponent,
    DropdownActionsComponent,
    ActionEditComponent,
    ActionDeactivateComponent,
    ActionActivateComponent,
    AutomaticSearchComponent,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatOptionModule,
    ReactiveFormsModule,
    MatInputModule,
    NotDataComponent,
    StatusBadgeComponent,
  ],
})
export class TiposRegimenComponent implements OnInit {
  constructor(
    private fb: UntypedFormBuilder,
    private _regimeType: TiposRegimenService,
    private _swal: SwalService,
    private modalService: NgbModal,
  ) {}

  form: UntypedFormGroup;
  @ViewChild('modal') modal: any;
  loading: boolean = false;
  regimeTypes: any[] = [];
  regime: any = {};
  title: any = '';
  pagination = {
    page: 1,
    pageSize: 5,
    length: 0,
  };
  filters: any = {
    name: '',
    state: '',
  };

  ngOnInit(): void {
    this.createForm();
    this.getRegimeTypes();
  }

  openModal() {
    this.modal.show();
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  closeResult = '';

  public openConfirm(confirm, titulo) {
    this.title = titulo;
    this.modalService
      .open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'sm', scrollable: true })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        },
      );
  }

  private getDismissReason(reason: any) {
    this.form.reset();
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.regime.id],
      name: ['', Validators.required],
    });
  }

  getRegimeTypes() {
    this.loading = true;
    let params = {
      ...this.pagination,
      ...this.filters,
    };
    this._regimeType.getRegimeType(params).subscribe((r: any) => {
      this.regimeTypes = r.data.data;
      this.pagination.length = r.data.total;
      this.loading = false;
    });
  }

  getRegime(regime) {
    this.regime = { ...regime };
    this.form.patchValue({
      id: this.regime.id,
      name: this.regime.name,
    });
  }

  save() {
    this._regimeType.updateOrCreateRegimeType(this.form.value).subscribe((r: any) => {
      this.modalService.dismissAll();
      this.form.reset();
      this.getRegimeTypes();
      this._swal.show({
        icon: 'success',
        title: r.data,
        text: '',
        timer: 1000,
        showCancel: false,
      });
    });
  }

  activateOrInactivate(regime, state) {
    let data = { id: regime.id, state };
    const text = 'El tipo de regimen';
    const request = () => {
      this._regimeType.updateOrCreateRegimeType(data).subscribe((res) => {
        this.getRegimeTypes();
        this._swal.activateOrInactivateSwalResponse(state, text);
      });
    };
    this._swal.activateOrInactivateSwal(state, text, request);
  }
}
