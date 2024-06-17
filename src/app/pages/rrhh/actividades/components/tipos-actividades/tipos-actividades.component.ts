import { Component, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TipoActividadesService } from './tipo-actividades.service';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActionActivateComponent } from '@shared/components/standard-components/action-activate/action-activate.component';
import { ActionDeactivateComponent } from '@shared/components/standard-components/action-deactivate/action-deactivate.component';
import { NgStyle, NgClass, UpperCasePipe } from '@angular/common';
import { ModalService } from '@app/core/services/modal.service';
import { SwalService } from '@app/pages/ajustes/informacion-base/services/swal.service';
import { DropdownActionsComponent } from '@shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { ActionEditComponent } from '@shared/components/standard-components/action-edit/action-edit.component';

@Component({
  selector: 'app-tipos-actividades',
  templateUrl: './tipos-actividades.component.html',
  styleUrls: ['./tipos-actividades.component.scss'],
  standalone: true,
  imports: [
    MatExpansionModule,
    TableComponent,
    NgStyle,
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
  ],
})
export class TiposActividadesComponent implements OnInit {
  form!: UntypedFormGroup;
  title!: string;
  activityTypes: any[] = [];
  activity: any = {};
  loading!: boolean;
  pagination = {
    page: 1,
    pageSize: 10,
    length: 0,
  };

  constructor(
    private fb: UntypedFormBuilder,
    private _tipoAct: TipoActividadesService,
    private _swal: SwalService,
    private modalService: ModalService,
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getActivityTypes();
  }

  openModal(confirm, titulo) {
    this.title = titulo;
    this.modalService.open(confirm);
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.activity.id],
      name: ['', Validators.required],
      color: ['', Validators.required],
    });
  }

  getActivity(activity) {
    this.activity = { ...activity };
    this.form.patchValue({
      id: this.activity.id,
      name: this.activity.name,
      color: this.activity.color,
    });
  }

  async changeStatus(id: number, state: string) {
    const request = () => {
      this._tipoAct.setActivityType({ id, state }).subscribe({
        next: () => {
          this._swal.success(state === 'Cancelado' ? 'Cancelado con exito' : 'Activado con exito');
          this.getActivityTypes();
        },
        error: () => {
          this._swal.hardError();
        },
      });
    };
    this._swal.swalLoading(
      state === 'Cancelado' ? 'Vamos a cancelar el tipo' : 'Vamos a activar el tipo',
      request,
    );
  }

  getActivityTypes() {
    this.loading = true;
    this._tipoAct.getActivityTypes(this.pagination).subscribe((r: any) => {
      this.activityTypes = r.data.data;
      this.loading = false;
      this.pagination.length = r.data.total;
    });
  }

  save() {
    const request = () => {
      this._tipoAct.saveActivityType(this.form.value).subscribe({
        next: (res: any) => {
          this.getActivityTypes();
          this.modalService.close();
          this.form.reset();
          this._swal.success(res.data);
        },
        error: () => {
          this._swal.hardError();
        },
      });
    };
    this._swal.swalLoading('Vamos a guardar el tipo', request);
  }
}
