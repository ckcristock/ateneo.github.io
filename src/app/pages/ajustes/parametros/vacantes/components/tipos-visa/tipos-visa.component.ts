import { Component, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TiposVisaService } from './tipos-visa.service';
import { SwalService } from '../../../../informacion-base/services/swal.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgClass, UpperCasePipe } from '@angular/common';
import { ActionActivateComponent } from '@shared/components/standard-components/action-activate/action-activate.component';
import { ActionDeactivateComponent } from '@shared/components/standard-components/action-deactivate/action-deactivate.component';
import { ActionEditComponent } from '@shared/components/standard-components/action-edit/action-edit.component';
import { AddButtonComponent } from '@shared/components/standard-components/add-button/add-button.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { DropdownActionsComponent } from '@shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { StatusBadgeComponent } from '@shared/components/status-badge/status-badge.component';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-tipos-visa',
  templateUrl: './tipos-visa.component.html',
  styleUrls: ['./tipos-visa.component.scss'],
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
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NotDataComponent,
    UpperCasePipe,
    StatusBadgeComponent,
  ],
})
export class TiposVisaComponent implements OnInit {
  @ViewChild('modal') modal: any;
  loading: boolean = false;
  form: UntypedFormGroup;
  visas: any[] = [];
  visa: any = {};
  title: any = '';
  pagination = {
    page: 1,
    pageSize: 6,
    length: 0,
  };
  constructor(
    private fb: UntypedFormBuilder,
    private _visa: TiposVisaService,
    private _swal: SwalService,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getVisaTypes();
  }

  openModal() {
    this.modal.show();
  }

  public openConfirm(confirm, titulo) {
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
  private getDismissReason() {
    this.form.reset();
  }
  createForm() {
    this.form = this.fb.group({
      id: [this.visa.id],
      name: ['', Validators.required],
      purpose: ['', Validators.required],
    });
  }

  getVisaTypes() {
    this.loading = true;
    this._visa.getVisaTypes(this.pagination).subscribe((r: any) => {
      this.visas = r.data.data;
      this.loading = false;
      this.pagination.length = r.data.total;
    });
  }

  getVisaType(visa) {
    this.visa = { ...visa };
    this.form.patchValue({
      id: this.visa.id,
      name: this.visa.name,
      purpose: this.visa.purpose,
    });
  }

  save() {
    if (this.form.valid) {
      this._visa.save(this.form.value).subscribe((r: any) => {
        this.modalService.dismissAll();
        this.form.reset();
        this.getVisaTypes();
        this._swal.show({
          icon: 'success',
          title: r.data.title,
          text: r.data.text,
          showCancel: false,
          timer: 1000,
        });
      });
    } else {
      this._swal.incompleteError();
    }
  }

  activateOrInactivate(visa, state) {
    let data = { id: visa.id, state };
    const text = 'El tipo de visa';
    const request = () => {
      this._visa.save(data).subscribe((res) => {
        this.getVisaTypes();
        this._swal.activateOrInactivateSwalResponse(state, text);
      });
    };
    this._swal.activateOrInactivateSwal(state, text, request);
  }
}
