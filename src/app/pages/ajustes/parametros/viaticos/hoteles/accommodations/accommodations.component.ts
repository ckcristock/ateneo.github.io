import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import {
  NgbDropdown,
  NgbDropdownToggle,
  NgbDropdownMenu,
  NgbPagination,
} from '@ng-bootstrap/ng-bootstrap';
import { NgClass, DatePipe } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { StandardModule } from '@shared/components/standard-components/standard.module';
import { ActionEditComponent } from '@shared/components/standard-components/action-edit/action-edit.component';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { DropdownActionsComponent } from '@shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { ActionDeactivateComponent } from '@shared/components/standard-components/action-deactivate/action-deactivate.component';
import { ActionActivateComponent } from '@shared/components/standard-components/action-activate/action-activate.component';

@Component({
  selector: 'app-accommodations',
  templateUrl: './accommodations.component.html',
  styleUrls: ['./accommodations.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    NgClass,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbPagination,
    NotDataComponent,
    DatePipe,
    TableComponent,
    DropdownActionsComponent,
    ActionEditComponent,
    ActionDeactivateComponent,
    ActionActivateComponent,
  ],
})
export class AccommodationsComponent implements OnInit {
  @Input('data') values: any;
  @Input('pagination') pagination: any;
  @Input('loading') loading: any;
  @Output() saveEvent = new EventEmitter<any>();
  @Output() paginationEvent = new EventEmitter<any>();
  @Output() anularOActivarEvent = new EventEmitter<any>();

  filtro: any = {
    value: '',
  };
  value: any = {};
  form: UntypedFormGroup;
  title: string = 'Agregar';

  constructor(
    private fb: UntypedFormBuilder,
    private _swal: SwalService,
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.value.id],
      name: [''],
    });
  }
  getValue(value: any) {
    this.title = 'Editar';
    this.value = { ...value };
    this.form.patchValue({
      id: value.id,
      name: value.name,
    });
  }
  getValues() {
    this.paginationEvent.emit();
  }

  save() {
    if (this.form.get('name').value) {
      this.saveEvent.emit(this.form);
    } else {
      this._swal.incompleteError();
    }
  }

  anularOActivar(value: any, action: any) {
    let params = { value, action };
    this.anularOActivarEvent.emit(params);
  }
}
